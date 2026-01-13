# Agent Context: Project Overview

This directory contains a personal knowledge base built with **MkDocs** and the **Material for MkDocs** theme. It serves as a comprehensive repository of technical knowledge, organized hierarchically by domain.

## Critical References

*   **Development & Deployment**: See **`meta/development.md`** for authoritative instructions on:
    *   Setting up the local environment (using `uv`).
    *   Running the dev server (`uv run mkdocs serve`).
    *   Building for production (`uv run mkdocs build --strict`).
    *   Deploying to Cloudflare Pages.
    *   Managing Git Subtrees.
*   **Writing Guidelines**: See the "Writing Guidelines (General)" section in this file. Interview question rules live in the `interview-question-library` skill.

## Development Conventions

*   **File Naming**: All files and directories must use `kebab-case` (e.g., `my-topic.md`).
*   **Structure**: Domain-based directories (e.g., `front-end/`, `database-systems/`).
*   **Entry Points**: Each directory should have a `README.md` serving as the index.
*   **Linking**: Use **relative paths** for all internal links to ensure portability.

## Writing Guidelines (General)

### Core Principles
- **Content first**: Keep a topic in a single file; only split when a document exceeds ~1000 lines and has multiple independent subtopics.
- **Readability**: Use a single H1, clear heading hierarchy, and concise lists or tables.
- **Maintainability**: Use kebab-case names, relative links, and local assets; review and update periodically.
- **Progressive disclosure**: Start with an overview, then detail, then practice and further reading.

### File and Directory Rules
- Use kebab-case for folders, Markdown files, and images (e.g., `runtime-overview.md`).
- Use `README.md` or `index.md` as entry points for directories.
- Store images and attachments in a sibling `assets/` directory and reference them with relative paths.

### Content Structure Template
```markdown
# Title
> One-line overview

## Overview
- Background / scenario
- Key value

## Core Content
### Section 1
Explanation + code/diagram (optional)

### Section 2
...

## Practice and Best Practices
- Recommendation 1
- Recommendation 2

## FAQ / Further Reading
- [Related link](relative-path.md)
```

### Writing Notes
- Prefer Mermaid diagrams when a flow or architecture matters.
- Label all code blocks with language and keep examples focused.
- Explain terminology on first use and avoid acronym stacking.
- Use relative links for all internal references.

### Pre-publish Checklist
- [ ] Names follow kebab-case and index files are updated.
- [ ] Single H1, correct heading order, and code blocks labeled.
- [ ] Internal links and asset paths are relative and valid.
- [ ] Key conclusions are highlighted; no redundant or conflicting content.

## Key Files

*   `mkdocs.yml`: Main site configuration (theme, plugins, nav).
*   `pyproject.toml`: Project dependencies (managed by `uv`).
*   `docs/`: Root directory for all Markdown content.
    *   `docs/README.md`: The homepage/entry point.
*   `meta/`: Project documentation and guidelines.
*   `.github/workflows/main.yml`: CI/CD configuration for Cloudflare Pages.
