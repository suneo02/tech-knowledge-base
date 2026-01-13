# Hidetoshi Tech Knowledge Base

A structured personal tech knowledge base covering programming, networking, databases, front-end development, and related technologies. Built with MkDocs + Material theme, deployed to Cloudflare Pages.

## 📚 Writing Guidelines

本项目使用统一的文档规范以确保一致性、可读性和可维护性。详情见：[AGENTS.md](AGENTS.md)。面试题规范参考 `interview-question-library` skill。

### 核心原则
- 内容优先：避免过度拆分，保持主题完整性（必要时单文档可达 1000 行）
- 可读性：清晰层级、目录导航、合理视觉分组
- 可维护性：统一 kebab-case 命名、相对路径链接、定期更新
- 渐进式：从概述到细节，先核心后进阶

### 规范要点
- 文件命名：kebab-case，例如 `react-hooks.md`
- 文档组织：相关内容尽量保持在同一文档内，避免碎片化
- 内容格式：标准 Markdown，代码块标注语言，必要时使用图表
- 质量保证：发布前检查清单，定期巡检 broken links/过时内容

## 🔎 View the Knowledge Base

Cloudflare Pages 自动部署，首版成功后可通过分配的 Pages 域名访问，例如：

`https://hidetoshi-tech-knowledge-base.pages.dev`

如果你使用自定义域名，请在 Cloudflare 中完成 CNAME 关联。

## 🧭 Setup & Deployment

为保持 README 聚焦内容本身，开发、构建与部署细节已迁移至独立文档：
- 参见部署与本地开发指南：docs/meta/deployment.md

## 🧭 Repository Layout

- `docs/`：知识文档主体内容
- `mkdocs.yml`：站点与导航配置
- `overrides/`：Material 主题模板覆盖
- `site/`：构建产物（CI/CD 生成）
- `.github/workflows/`：CI 配置（若存在）

## 📝 Contribution (个人协作约定)

- 新增或重构内容前先规划文档结构与导航位置
- 每次提交说明变更动机与影响范围，避免仅“更新文档”
- 对大规模调整采用分支与 PR 审阅流程
