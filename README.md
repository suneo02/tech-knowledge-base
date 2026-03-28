# Hidetoshi Tech Knowledge Base

公开技术知识库与 MkDocs 站点工程仓库，聚焦编程语言、前端、计算机基础与技术资源整理。

## Writing Guidelines

本项目使用统一的文档规范以确保一致性、可读性和可维护性。详情见 [AGENTS.md](AGENTS.md)。

### 核心原则
- 内容优先：避免过度拆分，保持主题完整性
- 可读性：清晰层级、目录导航、合理视觉分组
- 可维护性：统一 kebab-case 命名、相对路径链接、定期更新
- 渐进式：从概述到细节，先核心后进阶

## View the Knowledge Base

Cloudflare Pages 自动部署，首版成功后可通过分配的 Pages 域名访问，例如：

`https://hidetoshi-tech-knowledge-base.pages.dev`

## Setup & Deployment

开发、构建与部署细节见 [meta/development.md](meta/development.md)。

## Repository Layout

- `library/`：站点内容主体目录
- `mkdocs.yml`：站点配置
- `overrides/`：Material 主题模板覆盖
- `meta/`：知识库维护文档
- `site/`：本地构建产物

## Repository Boundaries

- 私有职业资料、简历、语言学习和移民材料已迁移到 `../career-vault`
- agent 技能、workflow 与实验保留在 `../suneo-toolkit`
