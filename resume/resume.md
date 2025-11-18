# 张文浩
**cms120@outlook.com** | 18812737732

---

## 概况

- 工作年限：1 年+ | 前端/工程化 | React 18 + TypeScript + Vite/Webpack + Redux Toolkit + Ant Design
- 优势：AI 报告/对话体验、长文档性能优化、Monorepo 工程化与 CI/CD
- 代表项目：Report-AI 报告生成、Report Print PDF 生成、GEL Workspace Monorepo、Company 企业信息平台

---

## 工作经历

### GEL Workspace（企业数据 & AI 报告）| 前端工程师  
**2023.10 - 至今**

- 前端应用群（8 个应用 + 11 个包，28 万+行代码）核心成员，主导 AI 报告生成/打印、AI 对话组件、工程化建设
- 交付 Report-AI（5.1 万行）、Report Print（8.4 千行）等核心项目，覆盖 500+ 份/天报告生成、1000+ 份/天 PDF 导出

---

## 项目经验

### Report-AI 报告生成应用 | 项目负责人 & 核心开发（51,314 行）  
**2024.03 - 2024.10 | React + TypeScript + TinyMCE + SSE**

- 背景：金融/咨询行业 AI 报告生成，日均 500+ 份，单份 10-50 页
- 数据一致性：三层状态（Canonical/Draft/UI）+ 文档哈希增量保存<10 ms；Hydration 注水 + Single-Flight 串行保存 + ETag/txId 冲突守卫
- 交互体验：外部组件渲染/滚动跟随（加载占位、AIGC 按钮、改写浮层），文本改写悬浮预览 100 ms 节流，选区中断恢复
- 成果：50+ 页编辑流畅度 +70%；保存成功率 99.5%；10 页生成 2-3 分钟，支持 100+ 并发用户

### Report Print & Preview PDF 生成应用 | 核心开发（8,460 行）  
**2024.05 - 2024.09 | React + Vite/Webpack + wkhtmltopdf**

- 背景：30+ 企业类型 × 中英双语 ×3 环境，日均 1000+ 份 PDF，单份 20-100 页
- 技术：Webpack/Vite ES5 输出兼容 wkhtmltopdf；三层分页（页面/表格/单元格）+ HTML 感知分割；JSON 配置驱动 180 组合批量导出
- 成果：PDF 格式错误率 15%→<1%；批量导出效率 10 倍提升；新增企业类型从 2 天降至 2 小时

### GEL Workspace Monorepo 工程化 | 项目经理 & 架构师  
**2024.01 - 至今 | Turborepo + pnpm + Vite/Webpack + GitHub Actions**

- 方案：搭建 Turborepo + pnpm，三层共享包（types/util/api → ui/indicator/cde → 8 应用），统一命令与环境配置
- 效率：Turborepo 缓存命中 70-90%，单应用构建 5-8 分钟→1-2 分钟；pnpm 硬链接使安装提速 2-3 倍、体积降 60-80%
- 质量与协作：TypeScript 严格模式 + 16 项规范 + local-ci 并行测试/构建；GitHub Actions 部署成功率 99%，新人上手 3-5 天

### Company 全球企业信息平台 | 核心开发（约 3 万行）  
**2023.10 - 2024.06 | React + TypeScript + Redux + Ant Design + Cytoscape.js**

- 背景：覆盖 200+ 国家/地区企业数据，日均 10 万+ 查询
- 页面架构：响应式企业详情页 + 动态菜单/数据联动；懒加载与滚动监听将首屏渲染 4.5s→1.8s，首屏 DOM 8000+→2000+
- 数据展示：react-window 虚拟表格支撑 10 万+ 行；Cytoscape 图谱 1000+ 节点 60fps，支持路径查询/导出
- AI 对话：SSE 流式响应首字节 <2s，流式延迟 <500 ms，支持 1000+ 消息/会话

---

## 教育背景

**天津大学**，智能与计算学部软件工程（本科）  
2020.09 - 2024.06

---

## 专业技能

- **前端**：React 18/Hook、TypeScript 5、Redux Toolkit、Vite/Webpack、Ant Design、TinyMCE、react-window、Cytoscape.js
- **工程化**：Turborepo + pnpm Monorepo、CI/CD（GitHub Actions、本地 CI 脚本）、ESLint/Prettier、Storybook、Vitest/Testing Library
- **AI 集成**：SSE 流式、AbortController 中断恢复、文本改写/流式渲染交互、PDF 生成/导出链路
- **其他**：Node.js/Express 基础、JSON 配置化、性能监控（Sentry）、基础数据结构与算法

---

## 语言能力

- 英语：CET-6（532）
- 中文：母语
