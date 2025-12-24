# Agent Context: Project Overview

This directory contains a personal knowledge base built with **MkDocs** and the **Material for MkDocs** theme. It serves as a comprehensive repository of technical knowledge, organized hierarchically by domain.

## Critical References

*   **Development & Deployment**: See **`meta/development.md`** for authoritative instructions on:
    *   Setting up the local environment (using `uv`).
    *   Running the dev server (`uv run mkdocs serve`).
    *   Building for production (`uv run mkdocs build --strict`).
    *   Deploying to Cloudflare Pages.
    *   Managing Git Subtrees.
*   **Writing Guidelines**: See **`meta/writing-guidelines.md`** for content structure and writing standards.

## Development Conventions

*   **File Naming**: All files and directories must use `kebab-case` (e.g., `my-topic.md`).
*   **Structure**: Domain-based directories (e.g., `front-end/`, `database-systems/`).
*   **Entry Points**: Each directory should have a `README.md` serving as the index.
*   **Linking**: Use **relative paths** for all internal links to ensure portability.

## Key Files

*   `mkdocs.yml`: Main site configuration (theme, plugins, nav).
*   `pyproject.toml`: Project dependencies (managed by `uv`).
*   `docs/`: Root directory for all Markdown content.
    *   `docs/README.md`: The homepage/entry point.
*   `meta/`: Project documentation and guidelines.
*   `.github/workflows/main.yml`: CI/CD configuration for Cloudflare Pages.
