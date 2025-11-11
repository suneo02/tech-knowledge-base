# Report Print & Preview PDF 生成应用 | 2024.05 - 2024.09

**角色**：核心开发（8,460 行代码）

**项目背景**：企业 PDF 报告生成应用，支持 30+企业类型、中英双语、多环境批量导出。日均生成 1000+份 PDF，单份 20-100 页。

## 技术挑战

- **复杂分页**：表格跨页时保持 HTML 结构完整，避免内容截断
- **工具兼容**：wkhtmltopdf 仅支持 ES5，Vite/Webpack 默认输出 ES6+
- **批量处理**：30 企业 ×2 语言 ×3 环境=180 种组合的并行导出
- **配置管理**：基于 JSON 配置的报告定制

## 🏗️ 核心设计

### 双引擎实现

- **report-print**：基于 wkhtmltopdf 的 PDF 生成，7,823 行代码
- **report-preview**：基于 Vite + React 的预览界面，637 行代码
- **技术互补**：print 专注 PDF 质量，preview 提供用户体验

### 三层分页设计

- **物理层**：PDFPage 类管理页面、页眉页脚
- **逻辑层**：TableHandler 类处理表格行、常规分页
- **微观层**：CellSplitter 类分割单元格、保持 HTML 结构

## ⚙️ wkhtmltopdf 兼容性

[📄](resume/assets/gel-workspace/apps/report-print/docs/core-architecture.md)

### Webpack ES5 配置

- **Babel 配置**：配置 @babel/preset-env targets IE11，禁用箭头函数、const/let、解构赋值
- **降级策略**：通过 Babel 转译 ES6+代码为 ES5
- **代码分割**：配置 Webpack splitChunks，控制 chunk 大小 20KB-100KB
- **依赖管理**：动态生成 vendor 包，避免第三方依赖污染

### wkhtmltopdf 配置

- **调试**：使用 `--debug-javascript` 参数输出 JS 错误日志
- **性能**：配置 `--javascript-delay 1000` 等待动态内容渲染
- **精度**：使用 `--disable-smart-shrinking` 保持 CSS 像素精度

## 📋 配置化生成

[📄](resume/assets/gel-workspace/apps/report-print/docs/core-rendering-flow.md)

### 配置驱动

- **配置处理**：开发 TableSectionsGenerator 类，解析嵌套 JSON 配置
- **数据绑定**：根据配置自动调用 API 获取数据
- **多语言**：集成 i18n，支持中英文切换
- **模块化**：根据配置动态生成表格、图表、文本模块

### 企业预设

- **企业类型**：支持 CO、FCP、FPC 等 30+企业类型
- **环境配置**：配置 local/test/prod 环境
- **JSON 配置**：基于 JSON 配置定制报告

## 📐 PDF 分页算法

[📄](resume/assets/gel-workspace/apps/report-print/docs/pdf-pagination-architecture.md)

### 分页决策

[📄](resume/assets/gel-workspace/apps/report-print/docs/pdf-pagination-process.md)

- **溢出检测**：动态添加内容，监测页面高度是否超过限制
- **状态判断**：区分空白页溢出和常规溢出
- **递归处理**：支持多级分页

### HTML 感知分割

[📄](resume/assets/gel-workspace/apps/report-print/docs/dom-based-row-algorithm-implementation.md)

- **DOM 分析**：将复杂 HTML 分解为最小单元(文本节点、标签)
- **迭代适配**：逐个添加 HTML 单元并测试溢出，找到分割点
- **结构保护**：确保 HTML 标签完整，避免格式错乱
- **精细分割**：保持 HTML 结构的分割

### 极端行处理

[📄](resume/assets/gel-workspace/apps/report-print/docs/dom-based-row-problem-goals.md)

- **递归分割**：处理单行超过整页的情况
- **表头重复**：在新页重复表头
- **错误恢复**：多层降级处理

### 算法复杂度

- **分页**：O(n×m) n=行数，m=每行复杂度
- **单元格分割**：O(h×log(k)) h=HTML 单元数，k=分割精度
- **溢出检测**：实时 DOM 高度监测<10ms

## 🚀 批量处理

[📄](resume/assets/gel-workspace/apps/report-print/docs/development.md)

### 并行导出

- **多维并行**：企业 × 语言 × 环境并行处理
- **任务调度**：使用队列管理任务，按优先级调度
- **错误隔离**：单个任务失败不影响其他任务

### 多环境配置

- **环境适配**：配置 local/test/main 环境变量
- **动态配置**：运行时切换环境和参数
- **会话管理**：动态获取和验证 sessionid

### 错误处理

- **日志记录**：记录每个任务的执行日志
- **状态报告**：生成成功/失败统计
- **重试处理**：支持失败任务重试
- **进度监控**：实时显示"已完成 50/180"

## 🎯 技术亮点

### 1. wkhtmltopdf 兼容

- **兼容性**：通过 Babel 配置实现 Vite/Webpack 与 wkhtmltopdf 兼容
- **ES5 降级**：配置 @babel/preset-env targets IE11
- **调试工具**：使用 `--debug-javascript` 追踪错误

### 2. HTML 感知分页

- **结构保持**：保持 HTML 标签完整的分页算法
- **精确分割**：支持复杂表格的跨页分割
- **格式保持**：解决传统 PDF 工具格式丢失问题

### 3. 配置化生成

- **JSON 配置**：基于 JSON 配置生成页面
- **企业支持**：支持 30+企业类型预设
- **开发效率**：新增企业类型从 2 天降至 2 小时

### 4. 批量处理

- **多维并行**：企业 × 语言 × 环境并行处理
- **任务调度**：队列管理和错误隔离
- **大规模导出**：支持 180 种组合批量导出

## 📊 量化成果

### 技术突破

- **兼容性**：通过 Babel 配置实现 Vite/Webpack 与 wkhtmltopdf 兼容
- **分页精度**：HTML 感知分页算法使复杂表格跨页格式保持率 100%
- **配置化**：JSON 配置使新增企业类型开发时间从 2 天降至 2 小时

### 性能指标

- **生成速度**：单份 20 页报告<30 秒，批量导出 180 份<15 分钟
- **批量处理**：支持 30 企业 ×2 语言 ×3 环境并行导出，失败率<5%
- **分页算法**：O(n×m)复杂度，溢出检测<10ms

### 业务价值

- **导出效率**：批量导出使效率提升 10 倍
- **质量保证**：HTML 结构保持使 PDF 格式错误率从 15%降至<1%
- **维护成本**：配置化使开发和维护成本降低 80%
