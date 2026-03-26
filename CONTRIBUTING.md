# Contributing to pdf2md

Thanks for your interest in contributing to pdf2md! This guide covers how to get set up and submit changes.

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gmann14/pdf2md.git
   cd pdf2md
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   ```

4. **Run tests:**

   ```bash
   pnpm test
   ```

## Project Structure

- `apps/web/` — Next.js web app (the converter website)
- `packages/core/` — `@pdf2md/core` npm package (conversion engine + CLI)
- `docs/` — Product spec and launch plan
- `research/` — Competitor analysis and tech research

## Making Changes

### Before You Start

- Check [GitHub Issues](https://github.com/gmann14/pdf2md/issues) for existing discussions
- For larger changes, open an issue first to discuss the approach

### Code Quality

All changes must pass these checks:

```bash
pnpm typecheck     # TypeScript strict mode
pnpm lint          # ESLint
pnpm test          # Vitest
pnpm build         # Full production build
```

### Pull Request Process

1. Fork the repository and create a branch from `main`
2. Make your changes with clear, focused commits
3. Add tests for new functionality
4. Ensure all checks pass (`pnpm typecheck && pnpm lint && pnpm test && pnpm build`)
5. Open a pull request with a clear description of what changed and why

### Commit Messages

Use conventional commit format:

```
type(scope): description

# Examples:
feat(core): add support for nested list detection
fix(web): handle empty PDF metadata gracefully
docs: update API reference in README
```

## Conversion Pipeline

The core conversion pipeline is in `packages/core/src/converter.ts`. If you're improving conversion quality, here's the flow:

1. Parse PDF via PDF.js Web Worker
2. Extract text items with position/font metadata
3. Extract link annotations per page
4. Detect and strip repeated headers/footers
5. Build font size histogram for heading detection (H1–H6)
6. Group text into blocks by vertical proximity
7. Classify blocks: heading, list-item, or paragraph
8. Match link annotations to text by bounding box overlap
9. Apply bold/italic from font name heuristics
10. Assemble Markdown output

## Testing

- Unit tests live alongside source files or in `__tests__/` directories
- Test with diverse PDFs: simple reports, academic papers, resumes, invoices, code docs
- When adding a feature (e.g., table detection), add test PDFs before the code

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
