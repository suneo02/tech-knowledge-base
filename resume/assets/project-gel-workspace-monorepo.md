# GEL Workspace Monorepo 工程化建设 | 2024.01 - 至今

**角色**：项目经理 & 架构师

**项目背景**：
负责大型企业级前端应用集群的工程化重构，项目包含 8 个独立业务应用（Company, Report-AI, Report-Print 等）与 11 个共享功能包。面临多应用间依赖版本不一致、重复造轮子现象严重、以及 CI/CD 流水线构建缓慢（单次全量构建耗时 >40min）的痛点。

**核心技术栈**：
- **架构**: Monorepo (Turborepo 2.5 + pnpm Workspace)
- **构建**: Vite 5.x + Webpack 5 + Rollup
- **规范**: ESLint + Prettier + Commitlint + Husky
- **工具**: Node.js Scripts (Custom CLI) + GitHub Actions

## 🏗️ Monorepo 架构设计与落地

### 1. 三层依赖分级体系
重构原有散乱的代码结构，设计清晰的依赖分层架构，杜绝循环依赖：
- **基础层 (Foundation)**：`gel-types` (全局类型定义), `gel-util` (环境/格式化/存储工具), `gel-api` (Axios 封装与请求拦截)。
- **业务层 (Domain)**：`gel-ui` (Wind UI 组件库), `indicator` (指标计算引擎), `detail-page-config` (动态详情页配置), `cde` (核心业务逻辑)。
- **应用层 (Application)**：`apps/company` (企业详情), `apps/report-ai` (智能报告), `apps/report-print` (打印服务) 等 8 个业务入口。

### 2. 高效构建工作流
- **Turborepo 智能构建**：配置 `turbo.json` 管道，定义 `build`, `test`, `lint` 的任务拓扑。利用 Content-Addressable Storage (CAS) 缓存机制，实现跨分支、跨机器的构建缓存共享。
- **并行化策略**：在 `local-ci.js` 中实现自定义并行构建逻辑，支持 `--continue-on-error` 模式与自动重试机制（失败重试 3 次），确保本地预构建的稳定性。
- **依赖治理**：利用 pnpm 的硬链接（Hard Link）机制管理 `node_modules`，大幅减少磁盘占用；通过 `workspace:*` 协议统一内部包版本，确保所有应用使用同一版本的核心库。

## 🛠️ 工程化工具链开发

### 3. 统一命令行工具 (CLI)
开发 `scripts/run-app.js` 交互式脚本，抹平不同应用的启动差异：
- **命令标准化**：统一 `pnpm app dev <app-name>`、`pnpm app build --all` 等指令入口，无需记忆复杂的 Webpack/Vite 参数。
- **环境注入**：集成 `dotenv` 与 `cross-env`，在启动时动态注入 `.env.dev` / `.env.prod` 环境变量，支持多环境（Local/Staging/Prod）无缝切换。
- **交互式选择**：集成 `prompts` 库实现 CLI 交互菜单，支持多选应用进行批量启动或构建。

### 4. 配置驱动 UI 架构
在 `packages/detail-page-config` 中实现基于 JSON 的动态页面渲染引擎：
- **元数据驱动**：通过 `singapore.json`, `TW.json` 等配置文件定义表格列、字段映射及渲染类型（`renderType: currency/date/custom`）。
- **动态加载**：应用层根据 API 返回的国家/地区代码，动态加载对应的配置策略，实现无需改动代码即可支持新国家的数据展示。

## 📊 技术成果
- **构建效率**：通过 Turborepo 缓存与并行构建，全量 CI 构建时间显著缩短，本地增量构建实现秒级响应。
- **研发效能**：共享包机制消除了重复代码，新业务功能（如新增一个国家的数据展示）仅需编写 JSON 配置即可上线，开发周期大幅缩短。
- **代码质量**：统一的 ESLint/Prettier 规范与 `gel-types` 类型约束，使得跨团队协作的代码风格高度一致，运行时类型错误显著减少。

