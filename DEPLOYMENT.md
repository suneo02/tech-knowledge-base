# 知识库 Cloudflare Pages 部署方案

本文档指导你如何使用 **MkDocs** 和 **Material for MkDocs** 将知识库构建为静态网站，并通过 **Cloudflare Pages** 自动化部署。

## 方案亮点

- **自动化构建与部署**：GitHub Actions + Cloudflare Pages，全流程无人工干预。
- **全球加速**：Cloudflare CDN 自动为站点提供边缘加速与缓存。
- **现代化特性**：Material for MkDocs 提供搜索、暗色模式、标签页等特性。

---

## 部署步骤

### 第 1 步：准备本地环境

确保已经安装 Python 与 uv。

```bash
python3 --version
uv --version
uv sync
```

### 第 2 步：本地预览与构建

本地开发：

```bash
uv run mkdocs serve
```

生成静态文件：

```bash
uv run mkdocs build --strict
```

构建产物会输出到 `site/` 目录，这也是 Cloudflare Pages 将要发布的内容。

### 第 3 步：Cloudflare Pages 配置

1. 在 Cloudflare 控制台创建一个 **Pages** 项目，并连接到当前 Git 仓库。
2. 在项目的 **Build settings** 页面设置：
   - Build command: `uv sync && uv run mkdocs build`
   - Build output directory: `site`
   - Environment variables: `PYTHON_VERSION=3.11`
3. 在仓库 `Settings → Secrets and variables → Actions` 中新增以下密钥：
   - `CLOUDFLARE_API_TOKEN`：拥有 `Cloudflare Pages - Edit` 权限的 API Token。
   - `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID。
   - `CLOUDFLARE_PAGES_PROJECT`：Cloudflare Pages 项目名（默认使用 `hidetoshi-program-knowledge-database`）。

### 第 4 步：GitHub Actions 自动部署

项目根目录包含 `.github/workflows/main.yml`，其核心流程如下：

1. 检出仓库代码。
2. 安装 Python 3.11 和 uv 并安装依赖。
3. 执行 `uv run mkdocs build --strict` 生成 `site/`，若存在断链或未定义锚点会直接失败，便于及时修复。
4. 调用 `cloudflare/pages-action@v1` 将产物推送到 Cloudflare Pages。

成功推送到 `main` 分支后，工作流会自动触发。如果需要，你也可以通过 GitHub Actions 页面手动运行该流程。

### 第 5 步：wrangler 配置

根目录的 `wrangler.toml` 供本地或 CI 构建工具识别 Cloudflare Pages 项目：

```toml
name = "hidetoshi-program-knowledge-database"
compatibility_date = "2024-05-01"

pages_build_output_dir = "site"

[build]
command = "uv sync && uv run mkdocs build"

[env.development]
pages_build_output_dir = "site"
```

本地执行 `npx wrangler pages dev` 可使用 Cloudflare 提供的本地开发预览。

---

## 常见问题

- **部署失败**：确认 GitHub 仓库中 Secrets 是否正确配置，API Token 是否拥有 `Cloudflare Pages - Edit` 权限。
- **构建失败**：在本地执行 `uv run mkdocs build --strict` 检查文档格式是否存在错误。
- **域名绑定**：在 Cloudflare Pages 控制台中添加自定义域名，并完成 DNS 解析验证。

配置完成后，站点将通过 `https://<project>.pages.dev` 域名自动发布，并享受 Cloudflare 的全局加速能力。
