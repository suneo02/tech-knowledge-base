# 知识库开发与部署指南

本文档作为本知识库的开发、构建与部署的权威指南。内容涵盖本地开发环境搭建、静态网站构建与 Cloudflare Pages 自动化部署流程。

## 1. 本地开发环境 (Local Development)

本项目使用 **MkDocs** 和 **Material for MkDocs** 构建。推荐使用 [uv](https://github.com/astral-sh/uv) 进行 Python 依赖管理，以获得更快的安装与运行速度。

### 1.1 准备环境

确保已经安装 Python 3.11+ 与 uv。

```bash
# 检查版本
python3 --version
uv --version

# 同步依赖 (根据 pyproject.toml / uv.lock)
uv sync
```

### 1.2 本地预览

启动本地开发服务器，实时预览修改效果：

```bash
uv run mkdocs serve
```
访问 `http://127.0.0.1:8000` 即可查看。

### 1.3 构建静态文件

生成用于生产环境的静态文件：

```bash
uv run mkdocs build --strict
```
构建产物会输出到 `site/` 目录。`--strict` 参数确保在遇到断链或其他警告时构建失败，保证文档质量。

---

## 2. Cloudflare Pages 部署方案

本项目通过 GitHub Actions + Cloudflare Pages 实现全自动化部署。

### 2.1 方案亮点

- **自动化构建与部署**：Push 到 main 分支自动触发。
- **全球加速**：利用 Cloudflare 边缘网络。
- **现代化特性**：支持 MkDocs 的高级搜索与 UI 特性。

### 2.2 Cloudflare Pages 配置

1. **创建项目**：在 Cloudflare Pages 控制台连接 Git 仓库。
2. **构建设置 (Build settings)**：
   - Build command: `uv sync && uv run mkdocs build`
   - Build output directory: `site`
   - Environment variables: `PYTHON_VERSION=3.11`
3. **GitHub Secrets 配置**：
   在仓库 Settings 中添加：
   - `CLOUDFLARE_API_TOKEN`: 具备 Pages 编辑权限的 Token。
   - `CLOUDFLARE_ACCOUNT_ID`: 账户 ID。
   - `CLOUDFLARE_PAGES_PROJECT`: 项目名称 (默认 `hidetoshi-program-knowledge-database`)。

### 2.3 GitHub Actions 工作流

`.github/workflows/main.yml` 定义了 CI/CD 流程：
1. Checkout 代码。
2. 安装 uv 与 Python。
3. 执行 `mkdocs build --strict`。
4. 推送到 Cloudflare Pages。

### 2.4 Wrangler 配置

`wrangler.toml` 用于标识项目：
```toml
name = "hidetoshi-program-knowledge-database"
compatibility_date = "2024-05-01"
pages_build_output_dir = "site"
```

---

## 3. 仓库边界

本仓库只维护公开或可分享的技术知识内容与站点工程。

- 发布内容目录：`library/`
- 构建与部署配置：`mkdocs.yml`、`overrides/`、`wrangler.toml`
- 私有职业与学习资料：`../career-vault`

如果需要维护私有职业资料或工作项目归档，请转到 `../career-vault`，对应说明见 `../career-vault/meta/development.md`。
