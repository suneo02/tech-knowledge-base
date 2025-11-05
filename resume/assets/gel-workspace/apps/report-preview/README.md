# `report-preview` - 报告浏览器预览应用

## 项目概述

`report-preview` 是一个基于 React 的单页应用（SPA），它是报告生成生态系统中**面向浏览器的高保真预览工具**。

此应用的核心职责是将多个下游包（`report-preview-ui`, `detail-page-config`, `report-util`）组合在一起，在**现代浏览器环境**中渲染一个功能完整的交互式报告预览页面。这为开发人员和产品相关方提供了一个所见即所得（WYSIWYG）的实时环境，用于调试和验收报告的样式、数据和交互功能。

**重要定位**: 此应用**专门用于浏览器预览**，与用于生成 PDF 的 `report-print` 项目是分离的。因此，本项目**无需考虑** `wkhtmltopdf` 的 JavaScript 和 CSS 兼容性问题，可以自由使用现代 Web 技术。

## 核心功能

- **交互式目录**: 左侧提供一个可展开/收起的树状目录，清晰地展示报告的层级结构。
- **内容联动**:
    - 点击左侧目录的任意节点，右侧内容区会平滑滚动到对应的内容模块。
    - 在目录中勾选/取消勾选节点，可以实时控制右侧对应内容模块的显示或隐藏。
- **动态多级标题**: 右侧内容区的标题序号（如 1. / 1.1 / 1.1.1）会根据目录中可见的节点自动重新计算和渲染。
- **配置驱动的动态表格**: 报告中的表格内容和结构由 `detail-page-config` 动态生成，支持复杂的自定义单元格渲染。

## 架构与技术实现

本应用位于整个报告预览流程的顶端，负责组装底层模块并实现业务逻辑。

```mermaid
graph TD
    A[report-preview (本应用)] --> B(report-preview-ui);
    A --> C(report-util);
    B --> C;
    B --> D(detail-page-config);
    C --> D;

    subgraph "应用层 (本应用)"
        A
    end

    subgraph "UI 组件层"
        B
    end

    subgraph "配置与工具层"
        C
        D
    end

    style A fill:#D6EAF8,stroke:#5DADE2,stroke-width:2px
    style B fill:#D5F5E3,stroke:#58D68D,stroke-width:2px
    style C fill:#FDEDEC,stroke:#F1948A,stroke-width:2px
    style D fill:#FCF3CF,stroke:#F4D03F,stroke-width:2px
```

### 技术细节

- **分层设计**:
    - **应用层 (`report-preview`)**: 负责初始化应用、设置路由、管理全局状态（如 Redux 或 Context），并作为容器将所有部分组合在一起。它获取运行时所需的数据（如公司代码、用户信息）并将其传递给 UI 层。
    - **UI 组件层 (`report-preview-ui`)**: 提供一系列独立的、可复用的 React 组件（如 `RPPreviewComp`、`Table`）。这些组件是无状态的或仅包含 UI 自身的状态，它们接收 props 并根据其渲染视图。这种设计将"如何展示"的逻辑与"展示什么"的业务逻辑分离。
    - **配置与工具层 (`detail-page-config`, `report-util`)**: `detail-page-config` 是报告内容的"单一数据源"，它以代码形式定义了报告的完整结构。`report-util` 则提供通用的辅助函数。

- **状态管理与通信**:
    - 应用采用**中心化的状态管理**模式。目录树中节点的可见性/展开状态等被保存在一个共享的 store (或 Context) 中。
    - 当用户在目录组件中操作（如隐藏节点）时，组件会派发一个 action 来更新中心 state。
    - 内容渲染组件订阅这个 state。当 state 发生变化时，内容组件会触发重渲染，根据最新的可见节点列表来更新其显示内容和标题序号。这种单向数据流确保了视图与状态的一致性。

- **表格渲染**:
    - 表格的渲染遵循了"容器组件"与"展示组件"分离的模式。
    - `report-preview-ui` 中包含一个通用的 `Table` 展示组件，它只负责根据传入的 `data` 和 `columns` 配置来渲染 `<table>` 结构。
    - 具体的业务页面（如信用报告预览页）中会有一个容器组件，该组件负责根据 `detail-page-config` 提供的 API 配置去获取数据，然后将数据和表格配置作为 props 传递给通用的 `Table` 组件进行渲染。

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动热更新开发服务
pnpm run dev:serve
```

启动后，访问 `http://localhost:3000` 并带上相应的 URL 参数（如 `?corpCode=xxx`）即可在浏览器中实时预览报告。由于此应用不涉及 `wkhtmltopdf`，所有调试和验收工作均在浏览器中完成。
