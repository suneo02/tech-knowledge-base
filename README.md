# Hidetoshi Program Knowledge Database

This is a personal knowledge base for programming, networking, databases, and other related topics. It is built using MkDocs and the Material for MkDocs theme.

## 📚 文档编写规范

本项目遵循统一的文档编写规范，确保文档的一致性、可读性和可维护性。详细规范请参考：[文档编写规范](docs/meta/writing-guidelines.md)

### 核心原则：
- **内容优先**：避免过度拆分，保持主题完整性（单文档可达 1000 行）
- **可读性**：清晰的层级结构，使用目录导航，合理的视觉分组
- **可维护性**：统一的 kebab-case 命名，相对路径链接，定期检查更新
- **渐进式**：从概述到细节，先核心后进阶

### 主要规范要点：
- **文件命名**：使用 kebab-case（短横线分隔），例如 `react-hooks.md`
- **文档组织**：相关内容保持在同一文档，避免过度拆分影响阅读连贯性
- **内容格式**：标准 Markdown 语法，代码块指定语言，使用图表辅助说明
- **质量保证**：发布前检查清单，定期维护和更新机制

## View the Knowledge Base

The knowledge base is automatically deployed to Cloudflare Pages. After the first successful deployment, you can access it at your assigned Pages domain, for example:

`https://hidetoshi-program-knowledge-database.pages.dev`

## Development

To run the knowledge base locally, you will need to have Python and pip installed. Then, you can install the required dependencies:

```bash
pip install mkdocs mkdocs-material
```

Once the dependencies are installed, you can start the local development server:

```bash
mkdocs serve
```

This will start a local server at `http://127.0.0.1:8000` that will automatically reload when you make changes to the documentation.

## Deployment

Deployment is handled automatically by a GitHub Actions workflow that builds the site and publishes it to Cloudflare Pages whenever changes are pushed to the `main` branch (or the workflow is manually triggered).

Before the workflow can publish successfully, configure the following repository secrets in **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` – a token with the `Cloudflare Pages - Edit` permission.
- `CLOUDFLARE_ACCOUNT_ID` – your Cloudflare account ID.
- `CLOUDFLARE_PAGES_PROJECT` – the Cloudflare Pages project name (defaults to `hidetoshi-program-knowledge-database`).

The workflow installs dependencies, runs `mkdocs build --strict`, and uploads the generated `site/` directory to Cloudflare Pages. Documentation warnings will cause the build to fail, keeping broken links from slipping into production.
