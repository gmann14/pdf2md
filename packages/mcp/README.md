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

## Tool

### convert_pdf

Convert a PDF file to Markdown.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file_path` | string | Yes | Path to the PDF file |
| `max_pages` | number | No | Maximum pages to convert |
| `include_metadata` | boolean | No | Include PDF metadata (default: true) |
| `yaml_front_matter` | boolean | No | Prepend YAML front matter |

**Returns:** Markdown string with headings, tables, code blocks, links, and lists preserved.

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
