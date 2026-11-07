# @pdf2md/mcp

MCP server for converting PDF files to Markdown. Works with Claude Code, Cursor, Windsurf, and any MCP-compatible AI agent.

## Installation

### Claude Code

```bash
claude mcp add pdf2md -- npx -y @pdf2md/mcp
```

### Cursor / Windsurf / Other MCP Clients

Add to your MCP config (`.mcp.json`, `~/.claude.json`, or equivalent):

```json
{
  "mcpServers": {
    "pdf2md": {
      "command": "npx",
      "args": ["-y", "@pdf2md/mcp"]
    }
  }
}
```

## Tools

Both tools are read-only. Each takes the PDF as `file_path` or `data_base64`
(exactly one).

### convert_pdf

Convert a PDF to Markdown.

| Name | Type | Description |
|------|------|-------------|
| `file_path` | string | Path to the PDF file |
| `data_base64` | string | The PDF bytes as base64, instead of `file_path` |
| `pages` | string or number[] | `"1-5,9"`, `"-3"` (the last 3 pages) or `[1, 4]`; default all |
| `format` | `markdown` \| `json` \| `chunks` | Markdown text (default), or structured content: per-page Markdown with metadata and stats, or RAG chunks |
| `chunk_by` | `page` \| `heading` \| `token` | How to split for `format: "chunks"` (default `heading`) |
| `max_chars` | number | Most Markdown characters to return (default 100,000) |
| `max_pages` | number | Convert at most this many of the selected pages |
| `include_metadata` | boolean | Metadata in `json`/`chunks` output (default true) |
| `yaml_front_matter` | boolean | Prepend YAML front matter (`markdown` format) |

When the output would pass `max_chars`, it is cut at a page boundary and the
result says which pages to ask for next: `next_pages` in `json`/`chunks`
structured content, or a closing comment in Markdown
(`Call again with pages: "6-12" for the rest.`).

### pdf_info

Page count, metadata (title, author, producer, PDF version, tagged,
encrypted) and which pages have a text layer (`pagesWithText`,
`pagesWithoutText` as page ranges), without converting. Use it to plan reads.

There is no file size limit; large PDFs are best read in page slices.

## Features

- Multi-column layout detection
- Table detection and markdown formatting
- Code block detection (monospace fonts + syntax patterns)
- Heading detection (font size, bold, section numbers, ALL CAPS)
- Link extraction from PDF annotations
- Header/footer stripping
- YAML front matter from PDF metadata
- 9.2/10 average quality across 28 real-world PDFs

## Privacy

Files are processed locally. Nothing is uploaded anywhere.

## License

MIT
