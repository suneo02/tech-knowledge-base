# Project Overview

This directory contains a personal knowledge base built with MkDocs and the Material for MkDocs theme. It serves as a comprehensive repository of information on various technical topics, including programming languages, database systems, networking, and front-end development. The content is written in Markdown and organized into a hierarchical structure.

## Building and Running

To work with this project, you need Python and `pip` installed.

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the local development server:**
    ```bash
    mkdocs serve
    ```
    The site will be available at `http://127.0.0.1:8000` and will automatically reload upon changes.

3.  **Build the static site:**
    ```bash
    mkdocs build --strict
    ```
    This command builds the static site into the `site/` directory. The `--strict` flag ensures that the build will fail on any warnings, such as broken links.

## Development Conventions

The project follows a set of conventions to ensure consistency and maintainability.

*   **File and Directory Naming:** All files and directories should use `kebab-case` (e.g., `my-topic.md`).
*   **Directory Structure:** The knowledge base is organized by domain (e.g., `front-end`, `database-systems`). Each domain has its own directory containing relevant topics.
*   **Entry Point:** Each directory should have a `README.md` file that serves as an index for that section.
*   **Linking:** Use relative paths for internal links.

### Writing Guidelines

Detailed writing guidelines are available in `docs/meta/writing-guidelines.md`. These guidelines are important for maintaining the quality and consistency of the knowledge base. Key principles include:

*   **Content-First:** Focus on writing comprehensive content for a single topic before splitting it into multiple files.
*   **Readability:** Use clear headings, lists, and other Markdown features to structure content for easy reading.
*   **Maintainability:** Use consistent naming conventions and relative paths to make the content easy to update.
*   **Progressive Disclosure:** Present information in a logical order, starting with a high-level overview and then diving into details.

## Key Files

*   `mkdocs.yml`: The main configuration file for the MkDocs site. It defines the site's structure, theme, and plugins.
*   `requirements.txt`: Lists the Python dependencies required to build and serve the site.
*   `docs/`: This directory contains all the Markdown content for the knowledge base.
    *   `docs/README.md`: The main entry point and overview of the entire knowledge base.
*   `overrides/`: This directory contains customizations for the MkDocs theme, such as extra CSS and JavaScript.
