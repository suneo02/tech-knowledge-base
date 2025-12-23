# 架构设计

## 技术架构

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

## 分层设计

### 应用层 (`report-preview`)
- **职责**: 负责初始化应用、设置路由、管理全局状态（如 Redux 或 Context），并作为容器将所有部分组合在一起
- **功能**: 获取运行时所需的数据（如公司代码、用户信息）并将其传递给 UI 层

### UI 组件层 (`report-preview-ui`)
- **职责**: 提供一系列独立的、可复用的 React 组件（如 `RPPreviewComp`、`Table`）
- **特性**: 组件是无状态的或仅包含 UI 自身的状态，接收 props 并根据其渲染视图
- **设计原则**: 将"如何展示"的逻辑与"展示什么"的业务逻辑分离

### 配置与工具层
- **`detail-page-config`**: 报告内容的"单一数据源"，以代码形式定义了报告的完整结构
- **`report-util`**: 提供通用的辅助函数

## 状态管理与通信

### 中心化状态管理
- 应用采用**中心化的状态管理**模式
- 目录树中节点的可见性/展开状态等被保存在一个共享的 store (或 Context) 中

### 数据流
1. 用户在目录组件中操作（如隐藏节点）
2. 组件派发 action 来更新中心 state
3. 内容渲染组件订阅这个 state
4. 当 state 发生变化时，内容组件触发重渲染，根据最新的可见节点列表来更新其显示内容和标题序号
5. 这种单向数据流确保了视图与状态的一致性

## 表格渲染架构

表格的渲染遵循了"容器组件"与"展示组件"分离的模式：

### 展示组件
- **位置**: `report-preview-ui` 中的通用 `Table` 组件
- **职责**: 只负责根据传入的 `data` 和 `columns` 配置来渲染 `<table>` 结构

### 容器组件
- **位置**: 具体业务页面（如信用报告预览页）
- **职责**:
    - 根据 `detail-page-config` 提供的 API 配置去获取数据
    - 将数据和表格配置作为 props 传递给通用的 `Table` 组件进行渲染