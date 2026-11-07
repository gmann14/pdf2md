#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve, sep } from "node:path";
import { convert } from "../converter.js";
import { validatePageRange } from "../pages.js";
import type { ConversionResult, ConvertOptions } from "../types.js";

/** Exit codes: every file converted, some converted with warnings, or a failure. */
const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;
const EXIT_PARTIAL = 2;

const USAGE = [
  "Usage: pdf2md [options] <file.pdf | directory | -> [more files...]",
  "",
  "Converts PDFs to Markdown. With one input, prints to stdout unless --out is",
  "given. '-' reads the PDF from stdin. With several inputs or a directory",
  "(its *.pdf files), writes one .md (or .json) file per PDF into --out <dir>.",
  "",
  "Options:",
  "  --pages <range>               Pages to convert: 1-5,9 or -3 (the last 3 pages)",
  "  -o, --out <file|dir>          Write to a file, or into a directory",
  "  --output markdown|json        Write Markdown (default) or the JSON conversion result",
  "  --chunk-by page|heading|token Split JSON output into chunks (implies --output json)",
  "  --max-tokens <count>          Approximate token budget for --chunk-by token",
  "  --yaml                        Prepend PDF metadata as YAML front matter",
  "  --no-metadata                 Leave PDF metadata out of the JSON result",
  "  --max-size <size>             Fail on larger files: bytes, or e.g. 15MB, 500KB (default: no limit)",
  "  -q, --quiet                   Do not print warnings to stderr (errors still print)",
  "  -v, --version                 Print the version",
  "  -h, --help                    Show this help",
  "",
  "Exit codes: 0 success, 2 partial (converted with warnings), 1 failure.",
].join("\n");

interface CliConfig {
  inputs: string[];
  out?: string;
  quiet: boolean;
  options: ConvertOptions;
}

/** Thrown for bad arguments; main() prints it with the usage text. */
class UsageError extends Error {}

function parseSize(value: string): number {
  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i.exec(value.trim());
  if (!match) throw new UsageError(`--max-size must be a size such as 15MB, 500KB or 1048576, not "${value}"`);
  const units: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  const bytes = Number(match[1]) * units[(match[2] ?? "b").toLowerCase()];
  if (!Number.isFinite(bytes) || bytes <= 0) throw new UsageError("--max-size must be greater than 0");
  return Math.floor(bytes);
}

function parseArgs(argv: string[]): CliConfig | "help" | "version" {
  const config: CliConfig = { inputs: [], quiet: false, options: { includeMetadata: true } };
  const value = (i: number, flag: string): string => {
    const next = argv[i + 1];
    if (next === undefined) throw new UsageError(`${flag} needs a value`);
    return next;
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "-h":
      case "--help":
        return "help";
      case "-v":
      case "--version":
        return "version";
      case "--pages": {
        const range = value(i++, arg);
        try {
          validatePageRange(range);
        } catch (err) {
          throw new UsageError(err instanceof Error ? err.message : "Invalid page range");
        }
        config.options.pages = range;
        break;
      }
      case "-o":
      case "--out":
        config.out = value(i++, arg);
        break;
      case "--output": {
        const format = value(i++, arg);
        if (format !== "markdown" && format !== "json") {
          throw new UsageError("--output must be either 'markdown' or 'json'");
        }
        config.options.outputFormat = format;
        break;
      }
      case "--chunk-by": {
        const chunkBy = value(i++, arg);
        if (chunkBy !== "page" && chunkBy !== "heading" && chunkBy !== "token") {
          throw new UsageError("--chunk-by must be one of: page, heading, token");
        }
        config.options.chunkBy = chunkBy;
        break;
      }
      case "--max-tokens": {
        const tokens = Number(value(i++, arg));
        if (!Number.isInteger(tokens) || tokens <= 0) {
          throw new UsageError("--max-tokens must be a positive integer");
        }
        config.options.maxTokensPerChunk = tokens;
        break;
      }
      case "--yaml":
        config.options.yamlFrontMatter = true;
        break;
      case "--no-metadata":
        config.options.includeMetadata = false;
        break;
      case "--max-size":
        config.options.maxFileSizeBytes = parseSize(value(i++, arg));
        break;
      case "-q":
      case "--quiet":
        config.quiet = true;
        break;
      default:
        if (arg !== "-" && arg.startsWith("-")) throw new UsageError(`Unknown option: ${arg}`);
        config.inputs.push(arg);
    }
  }

  if (config.inputs.length === 0) throw new UsageError("Missing PDF file path");
  if (config.inputs.includes("-") && config.inputs.length > 1) {
    throw new UsageError("'-' (stdin) cannot be combined with other inputs");
  }
  if (config.options.yamlFrontMatter && config.options.includeMetadata === false) {
    throw new UsageError("--yaml needs the metadata; drop --no-metadata");
  }
  if (config.options.chunkBy) config.options.outputFormat = "json";
  return config;
}

async function readVersion(): Promise<string> {
  // dist/bin/pdf2md.js -> package.json
  const pkg: unknown = JSON.parse(await readFile(new URL("../../package.json", import.meta.url), "utf8"));
  const version = typeof pkg === "object" && pkg !== null ? (pkg as { version?: unknown }).version : undefined;
  return typeof version === "string" ? version : "unknown";
}

async function readStdin(): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return new Uint8Array(Buffer.concat(chunks));
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/** Expand directory inputs to their *.pdf files (not recursive), sorted. */
async function expandInputs(inputs: string[]): Promise<{ files: string[]; batch: boolean }> {
  const files: string[] = [];
  let sawDirectory = false;
  for (const input of inputs) {
    if (input !== "-" && (await isDirectory(input))) {
      sawDirectory = true;
      const entries = await readdir(input);
      files.push(
        ...entries
          .filter((name) => extname(name).toLowerCase() === ".pdf")
          .sort()
          .map((name) => join(input, name)),
      );
    } else {
      files.push(input);
    }
  }
  return { files, batch: sawDirectory || inputs.length > 1 };
}

function render(result: ConversionResult, options: ConvertOptions): string {
  return options.outputFormat === "json" ? JSON.stringify(result, null, 2) + "\n" : result.markdown;
}

function report(result: ConversionResult, quiet: boolean, label: string): void {
  for (const msg of result.messages) {
    if (quiet && msg.severity !== "error") continue;
    console.error(`${label}[${msg.severity}] ${msg.message}`);
  }
}

function exitCodeFor(result: ConversionResult): number {
  if (result.status === "failed") return EXIT_FAILURE;
  return result.status === "partial" ? EXIT_PARTIAL : EXIT_SUCCESS;
}

async function writeOutput(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
}

/** One output file name per input in a directory, without collisions. */
function outputName(file: string, ext: string, used: Set<string>): string {
  const stem = basename(file, extname(file)) || "document";
  let name = `${stem}${ext}`;
  for (let n = 2; used.has(name); n++) name = `${stem}-${n}${ext}`;
  used.add(name);
  return name;
}

async function convertOne(
  file: string,
  config: CliConfig,
): Promise<{ result: ConversionResult } | { error: string }> {
  let bytes: Uint8Array;
  try {
    bytes = file === "-" ? await readStdin() : new Uint8Array(await readFile(resolve(file)));
  } catch (err) {
    return { error: `Error reading ${file === "-" ? "stdin" : file}: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
  return { result: await convert(bytes, config.options) };
}

async function run(config: CliConfig): Promise<number> {
  const { files, batch } = await expandInputs(config.inputs);
  const ext = config.options.outputFormat === "json" ? ".json" : ".md";

  if (!batch) {
    const file = files[0];
    const converted = await convertOne(file, config);
    if ("error" in converted) {
      console.error(converted.error);
      return EXIT_FAILURE;
    }
    const { result } = converted;
    report(result, config.quiet, "");
    if (result.status === "failed") return EXIT_FAILURE;
    const text = render(result, config.options);
    if (config.out === undefined) {
      process.stdout.write(text);
    } else {
      const intoDir = config.out.endsWith("/") || config.out.endsWith(sep) || (await isDirectory(config.out));
      const target = intoDir ? join(config.out, outputName(file === "-" ? "stdin" : file, ext, new Set())) : config.out;
      await writeOutput(target, text);
    }
    return exitCodeFor(result);
  }

  if (config.out === undefined) {
    console.error("Several inputs need --out <dir> for the converted files.");
    return EXIT_FAILURE;
  }
  if (files.length === 0) {
    console.error("No PDF files found.");
    return EXIT_FAILURE;
  }

  let exitCode = EXIT_SUCCESS;
  const used = new Set<string>();
  for (const file of files) {
    const converted = await convertOne(file, config);
    if ("error" in converted) {
      console.error(converted.error);
      exitCode = EXIT_FAILURE;
      continue;
    }
    const { result } = converted;
    report(result, config.quiet, `${file}: `);
    const code = exitCodeFor(result);
    if (code === EXIT_FAILURE) exitCode = EXIT_FAILURE;
    else if (code === EXIT_PARTIAL && exitCode === EXIT_SUCCESS) exitCode = EXIT_PARTIAL;
    if (result.status === "failed") continue;
    const target = join(config.out, outputName(file, ext, used));
    await writeOutput(target, render(result, config.options));
    if (!config.quiet) console.error(`${file} -> ${target}`);
  }
  return exitCode;
}

async function main(): Promise<void> {
  let parsed: CliConfig | "help" | "version";
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Invalid arguments");
    console.error(USAGE);
    process.exitCode = EXIT_FAILURE;
    return;
  }

  if (parsed === "help") {
    console.log(USAGE);
    return;
  }
  if (parsed === "version") {
    console.log(await readVersion());
    return;
  }

  try {
    process.exitCode = await run(parsed);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exitCode = EXIT_FAILURE;
  }
}

void main();
