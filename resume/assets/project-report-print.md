# Report Print & Preview PDF 生成应用 | 2024.05 - 2024.09

**角色**：核心开发

**项目背景**：
针对企业征信报告的 PDF 导出需求，开发的高性能服务端渲染应用。支持 30+ 种不同企业类型的报告模板（如 CO/FCP 等），需在无头浏览器环境（Headless Browser）下精确还原复杂的 Web 报表样式，并解决 wkhtmltopdf 对现代 CSS/JS 特性的兼容性问题。

**核心技术栈**：
- **渲染引擎**: wkhtmltopdf + Headless Chrome
- **前端框架**: React 18 (Preview) + jQuery/ES5 (Print Legacy)
- **构建工具**: Vite (Preview) + Webpack 5 (Print) + Babel
- **算法**: DOM-based Pagination + Cell Splitting

## 🏗️ 双模渲染架构设计

### 1. 差异化双引擎策略
[📄](resume/assets/gel-workspace/apps/report-print/docs/core-architecture.md)
采用"预览-打印"分离架构，平衡交互体验与打印精度：
- **Preview 端 (report-preview)**：基于 Vite + React 构建，复用 `gel-ui` 组件库，提供毫秒级的 Canvas 预览与参数配置交互。
- **Print 端 (report-print)**：基于 Webpack + Babel 构建，专为 wkhtmltopdf 优化。通过 `RPPrintRenderer` 统一调度，针对性解决 QT WebKit 内核对 Flexbox/Grid 的支持缺陷。

### 2. 三层分页算法体系
[📄](resume/assets/gel-workspace/apps/report-print/docs/pdf-pagination-architecture.md)
为解决长表格跨页截断与表头丢失问题，设计了精细的分页控制系统：
- **物理层 (Page Level)**：`PDFPage` 类管理 A4 纸张的物理尺寸、页眉页脚留白及水印注入。
- **逻辑层 (Section Level)**：`TableHandler` 负责计算表格行高，识别自然分页点，并在新页自动重绘表头（Thead Repetition）。
- **微观层 (Cell Level)**：`CellSplitter` 实现 DOM 级内容的深度分割。当单行文本高度超过页余量时，递归遍历 DOM 树，寻找最佳文本断点，确保 HTML 标签（如 `<b>`, `<span>`）在跨页时闭合完整，避免样式逃逸。

## ⚙️ 关键技术攻坚

### 3. wkhtmltopdf 深度兼容
[📄](resume/assets/gel-workspace/apps/report-print/docs/core-rendering-flow.md)
- **ES5 降级构建**：配置 Webpack 与 `@babel/preset-env`，强制转译所有 ES6+ 语法（箭头函数、解构等）为 ES5，并注入 `core-js` Polyfill，确保在老旧 WebKit 内核中运行无报错。
- **异步渲染同步**：利用 `window.status` 与 `--javascript-delay` 参数配合，开发 `isRenderingComplete` 信号机制，确保所有图表（ECharts）与动态图片加载完毕后再触发 PDF 截屏。
- **CSS 像素对齐**：禁用 `--disable-smart-shrinking` 智能缩放，通过 DPI 精确计算 CSS 像素与打印毫米数的换算比例，实现 "所见即所得" 的打印效果。

### 4. 配置驱动的工厂模式
- **元数据驱动**：通过 `TableSectionsGenerator` 解析嵌套的 JSON 报告配置，自动实例化对应的 `HorizontalTable`, `VerticalTable`, `CrossTable` 组件。
- **动态数据绑定**：设计 `TableProps` 泛型接口，统一处理 API 数据映射、国际化字段（i18n）替换及空值回退逻辑。

## 📊 技术成果
- **分页精度**：`CellSplitter` 算法成功解决了复杂富文本（Rich Text）的跨页截断问题，实现了表格行内内容的像素级无损分割。
- **系统稳定性**：通过 `scripts/export.cjs` 封装的错误重试与进程守护机制，有效规避了 wkhtmltopdf 偶发的内存泄漏导致的进程崩溃。
- **开发效能**：基于 JSON 配置的渲染工厂模式，使得新增一种企业报告类型仅需维护一份配置文件，无需编写重复的渲染逻辑。
