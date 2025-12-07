# Report Print & Preview PDF 生成应用 | 2024.05 - 2024.09

**角色**：核心开发
**项目背景**：
针对企业征信报告的 PDF 导出需求，开发的高性能服务端渲染应用。支持 30+ 种不同企业类型的报告模板（如 CO/FCP 等），需在无头浏览器环境（Headless Browser）下精确还原复杂的 Web 报表样式，并解决 wkhtmltopdf 对现代 CSS/JS 特性的兼容性问题。
**核心技术栈**：React 18, Webpack 5, Vite, wkhtmltopdf, jQuery (Legacy Support)

## 1. 全景架构 (The Big Picture)

### 1.1 业务背景

一句话解释：**为企业征信报告提供“所见即所得”的 PDF 导出服务，确保打印版与网页版像素级一致。**

### 1.2 架构视图

```mermaid
graph TD
    subgraph Input [输入源]
        Config[JSON Config]
        API[Data API]
    end

    subgraph Core [双模渲染引擎]
        subgraph Preview [Preview Mode (Vite)]
            React[React 18 Components]
            Canvas[Canvas Preview]
        end

        subgraph Print [Print Mode (Webpack)]
            Legacy[ES5/Polyfills]
            Alg[Pagination Algorithm]
            DOM[DOM Manipulation]
        end
    end

    subgraph Output [输出端]
        Headless[wkhtmltopdf / QT WebKit]
        PDF[PDF File]
    end

    Input --> Preview
    Input --> Print
    Preview -- User Interaction --> User[用户配置]
    Print -- Render HTML --> Headless
    Headless -- Snapshot --> PDF
```

### 1.3 技术选型决策表 (ADR)

| 决策点       | 选择                        | 对比                   | 理由/证据                                                                                                                                           |
| :----------- | :-------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **渲染引擎** | **wkhtmltopdf**             | Puppeteer / Playwright | 虽然 Puppeteer 支持现代 Chrome，但 wkhtmltopdf 生成的 PDF 文件体积小 80%，且对矢量字体的处理更符合打印出版标准。                                    |
| **构建工具** | **双构建 (Vite + Webpack)** | 单一构建               | 开发预览需要 Vite 的 HMR 秒级响应；打印端运行在老旧 QT WebKit 上，必须用 Webpack + Babel 强转 ES5，Vite 的 `legacy` 插件无法完美覆盖所有 Polyfill。 |
| **分页策略** | **前端计算分页**            | 后端分页 / CSS 分页    | CSS `break-inside` 在复杂表格截断时经常失效且无法重复表头；后端分页无法感知渲染后的真实字体高度；前端 DOM 计算是唯一精确解。                        |

## 2. 核心功能实现 (Core Features & Implementation)

### Feature 1：三层分页算法体系 (Three-Layer Pagination)

- **目标**：解决长表格跨页截断、表头丢失、行内文本溢出等打印痛点。
- **实现逻辑**：
  - **物理层 (Page Level)**：`PDFPage` 类管理 A4 纸张的物理尺寸、页眉页脚留白及水印注入。
  - **逻辑层 (Row Level)**：`TableHandler` 负责计算表格行高，识别自然分页点，并在新页自动重绘表头（Thead Repetition）。
  - **微观层 (Cell Level)**：`CellSplitter` 实现 DOM 级内容的深度分割。
- **流程图**：
  ```mermaid
  graph TD
      Row[待处理行] --> Check{高度溢出?}
      Check -- No --> Append[添加到当前页]
      Check -- Yes --> IsFirst{是当前页首行?}
      IsFirst -- No --> NewPage[创建新页 & 重绘表头] --> Row
      IsFirst -- Yes --> Split[调用 CellSplitter 微观分割]
      Split --> Fit[适配部分 -> 当前页]
      Split --> Remain[剩余部分 -> 下一页]
  ```

### Feature 2：差异化双引擎架构

- **目标**：既要开发爽（现代技术栈），又要打印稳（兼容老旧内核）。
- **实现逻辑**：
  - **Report-Preview**：使用 Vite + React 18，提供流畅的参数配置和实时 Canvas 预览。
  - **Report-Print**：使用 Webpack 5 + Babel，注入大量 Polyfill（如 `Promise`, `Object.assign`），甚至降级使用 jQuery 操作 DOM，确保在 wkhtmltopdf 的 QT 浏览器中不报错。
- **复杂度**：需维护两套入口文件，并抽取公共组件库（`gel-ui`）以确保样式一致性。

## 3. 核心难点攻坚 (Deep Dive Case Study)

### 案例 A：富文本单元格的跨页截断 (The Cell Splitting Problem)

- **现象 (Symptoms)**：
  - 当一个单元格包含大量文本（超过一页高度）时，简单的 `CSS` 截断会导致文字被拦腰切断。
  - 若单元格内包含 HTML 标签（如 `<b>重点</b>`），粗暴截断字符串会导致标签未闭合，下一页样式错乱。
- **排查 (Investigation)**：
  - 传统的基于字符数截断（`text.slice(0, n)`）无法感知渲染宽度和 HTML 结构。
  - 必须在 DOM 层面进行“试探性渲染”。
- **方案 (Solution)**：
  - **V1 (Fail)**：纯文本估算。将 HTML 转为纯文本，按行高估算截断点。导致富文本格式丢失，且高度预测不准。
  - **V2 (Success)**：**迭代式 DOM 适配算法 (Iterative DOM Fitting)**。
    1.  将单元格内容解析为 `HtmlUnit` 队列（标签节点或文本节点）。
    2.  逐个将 Unit 追加到临时容器中。
    3.  实时检测 `container.scrollHeight > pageHeight`。
    4.  一旦溢出，回退最后一个 Unit，并对该 Unit 进行更细粒度的文本分割。
    5.  自动补全截断处的闭合标签（`Close Tags`）。
- **代码**：
  ```typescript
  // 伪代码：基于 DOM 的试探性分割
  function splitForSingleLineFit(units: HtmlUnit[], maxHeight: number) {
    let currentHtml = "";
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const testHtml = currentHtml + unit.html;

      // 渲染并测量
      if (measureHeight(testHtml) > maxHeight) {
        // 溢出！进入微观分割
        return splitTextUnit(unit, maxHeight - measureHeight(currentHtml));
      }
      currentHtml = testHtml;
    }
  }
  ```

### 案例 B：wkhtmltopdf 进程僵死与内存泄漏

- **现象**：在批量导出 1000 份报告时，任务进行到第 200 份左右，Node.js 进程无响应，服务器内存耗尽。
- **排查**：wkhtmltopdf 自身存在内存泄漏 bug，且对某些特定 CSS（如 `flex: 1`）处理极慢，可能导致死锁。
- **方案**：
  - **进程守护**：使用 `child_process.spawn` 启动 wkhtmltopdf，并设置超时时间（如 30s）。
  - **错误重试**：捕获 `EPIPE` 或超时错误，自动重试 3 次。
  - **样式降级**：在打印端禁用 Flexbox，回退到 `float` 或 `table` 布局。

## 4. 事故与反思 (Post-Mortem)

- **Timeline**：
  - 15:00 上线新版报告，包含 ECharts 动态图表。
  - 15:10 客服反馈 PDF 中图表区域空白。
  - 15:30 排查发现 wkhtmltopdf 截图时 JS 尚未执行完毕。
- **Root Cause**：wkhtmltopdf 默认在 `window.onload` 后立即截图，而 React/ECharts 的渲染是异步的。
- **Action Item**：
  - 引入信号机制：在页面中定义 `window.status`。
  - 当所有图表渲染完成（监听 `finished` 事件）后，将 `window.status` 置为 `'ready'`。
  - 启动参数添加 `--window-status ready`，强制等待信号。

## 5. 知识库 (Wiki / Snippets)

- **wkhtmltopdf 像素对齐参数**：
  禁止智能缩放，确保 CSS 像素与打印毫米数严格对应。
  ```bash
  wkhtmltopdf \
    --disable-smart-shrinking \
    --dpi 96 \
    --margin-top 0 \
    --margin-bottom 0 \
    --page-size A4
  ```
- **DOM 解析器 (Unit Parser)**：
  将 HTML 字符串解析为可操作的 Unit 数组。
  ```typescript
  function getCellHtmlUnits(html: string): HtmlUnit[] {
    const div = document.createElement("div");
    div.innerHTML = html;
    return Array.from(div.childNodes).map((node) => ({
      type: node.nodeType === 3 ? "text" : "tag",
      content:
        node.nodeType === 3 ? node.nodeValue : (node as Element).outerHTML,
    }));
  }
  ```
