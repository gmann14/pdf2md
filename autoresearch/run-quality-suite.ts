import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import {
  DATASET_KEYS,
  REPORT_PATHS,
  compareSnapshots,
  formatAcceptance,
  loadSnapshotFromReports,
  type QualitySnapshot,
} from "./compare-results";

const execFile = promisify(execFileCallback);

const QUALITY_COMMANDS = [
  ["npx", "tsx", "--require", "./test-corpus/node-polyfills.cjs", "test-corpus/evaluate.ts"],
  ["npx", "tsx", "--require", "./test-corpus/node-polyfills.cjs", "test-corpus/evaluate-blind.ts"],
  ["npx", "tsx", "--require", "./test-corpus/node-polyfills.cjs", "test-corpus/evaluate-blind-2.ts"],
  ["npx", "tsx", "--require", "./test-corpus/node-polyfills.cjs", "test-corpus/evaluate-blind-3.ts"],
] as const;

interface CliOptions {
  rootDir: string;
  skipRun: boolean;
  updateBaseline: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    rootDir: process.cwd(),
    skipRun: false,
    updateBaseline: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--root") {
      options.rootDir = argv[++i] ?? options.rootDir;
    } else if (arg === "--skip-run") {
      options.skipRun = true;
    } else if (arg === "--update-baseline") {
      options.updateBaseline = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function runCommand(command: readonly string[], rootDir: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      cwd: rootDir,
      stdio: "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command.join(" ")} exited with ${code}`));
      }
    });
  });
}

async function gitValue(rootDir: string, args: string[], fallback: string): Promise<string> {
  try {
    const { stdout } = await execFile("git", args, { cwd: rootDir });
    return stdout.trim() || fallback;
  } catch {
    return fallback;
  }
}

async function diffSummary(rootDir: string): Promise<string> {
  const summary = await gitValue(rootDir, ["status", "--short"], "");
  return summary.length > 0 ? summary : "clean worktree";
}

function renderSummary(snapshot: QualitySnapshot, acceptance: string): string {
  const lines = [
    "# Autoresearch Latest Summary",
    "",
    `Generated: ${snapshot.timestamp}`,
    `Git: ${snapshot.gitSha} (${snapshot.branch})`,
    `Combined score: ${snapshot.combined.toFixed(3)}/10`,
    "",
    "## Dataset Scores",
    "",
    "| Dataset | Average | Documents |",
    "| ------- | ------: | --------: |",
  ];

  for (const key of DATASET_KEYS) {
    const metrics = snapshot.datasets[key];
    lines.push(`| ${key} | ${metrics.average.toFixed(1)}/10 | ${Object.keys(metrics.documentScores).length} |`);
  }

  lines.push("", "## Acceptance", "", "```text", acceptance, "```", "", "## Source Reports", "");
  for (const key of DATASET_KEYS) {
    lines.push(`- ${key}: \`${REPORT_PATHS[key]}\``);
  }
  lines.push("");

  return lines.join("\n");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.skipRun) {
    for (const command of QUALITY_COMMANDS) {
      await runCommand(command, options.rootDir);
    }
  }

  const snapshot = await loadSnapshotFromReports(options.rootDir, {
    timestamp: new Date().toISOString(),
    gitSha: await gitValue(options.rootDir, ["rev-parse", "HEAD"], "unknown"),
    branch: await gitValue(options.rootDir, ["branch", "--show-current"], "unknown"),
    diffSummary: await diffSummary(options.rootDir),
  });

  await mkdir(`${options.rootDir}/autoresearch`, { recursive: true });
  await writeFile(`${options.rootDir}/autoresearch/latest-summary.json`, `${JSON.stringify(snapshot, null, 2)}\n`);

  let acceptance = "Baseline updated; no acceptance comparison was run.";
  if (options.updateBaseline) {
    await writeFile(`${options.rootDir}/autoresearch/baseline.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
  } else {
    const baseline = JSON.parse(await readFile(`${options.rootDir}/autoresearch/baseline.json`, "utf-8")) as QualitySnapshot;
    acceptance = formatAcceptance(compareSnapshots(snapshot, baseline));
  }

  await writeFile(`${options.rootDir}/autoresearch/latest-summary.md`, renderSummary(snapshot, acceptance));
  console.log(acceptance);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
