# Prospect Page Component Documentation

## 1. 目录结构说明

```
src/pages/Prospect/
├── components/          # 页面独有组件
│   ├── ProspectHeader/  # 顶部导航栏（包含返回按钮）
│   ├── TaskCard/        # 单个任务卡片（展示状态、进度、操作按钮）
│   ├── TaskCardsRow/    # 任务卡片横向滚动容器
│   └── TaskLog/         # 任务日志展示区域
├── hooks/               # 自定义 Hooks
│   ├── useTaskOperations.ts # 任务操作逻辑（重试、终止）
│   └── useTaskPolling.ts    # 任务轮询与数据获取逻辑
├── utils/               # 工具函数
│   └── taskUtils.ts     # 任务状态映射与格式化工具
├── services.ts          # API 接口定义
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 常量定义（文案、前缀等）
├── index.tsx            # 页面入口组件
└── index.module.less    # 页面样式文件
```

## 2. 核心功能与逻辑

### 2.1 页面入口 (`index.tsx`)

- **职责**：作为页面容器，负责整体状态管理和布局编排。
- **核心状态**：
  - `activeTaskId`: 当前选中的任务 ID。
  - `operatingTaskId`: 当前正在进行操作（重试/终止）的任务 ID。
  - `operationType`: 当前操作的类型 ('retry' | 'terminate')。
- **主要逻辑**：
  - 使用 `useTaskPolling` 获取任务列表和详情，并自动轮询。
  - 管理 `TaskCardsRow` 和 `TaskLog` 之间的联动（点击卡片切换日志视图）。
  - 处理任务操作的 Loading 态，通过 `operatingTaskId` 区分具体是哪个任务在执行操作，实现**卡片级别的 Loading 效果**，避免全局 Loading 导致所有按钮同时转圈。

### 2.2 任务卡片组件 (`TaskCard` & `TaskCardsRow`)

- **TaskCardsRow**：
  - 负责渲染任务卡片列表。
  - **自动滚动**：当 `activeTaskId` 变化时，会自动将对应的卡片滚动到视图中间。
  - **透传 Props**：将操作 Loading 状态透传给具体的 `TaskCard`。
- **TaskCard**：
  - **状态展示**：根据 `task.status` 展示不同的样式（进行中、成功、失败/终止）。
  - **按钮交互**：
    - **终止 (Terminate)**：仅在 `PENDING` 或 `RUNNING` 状态显示。点击触发 `onTerminate`。
    - **重试 (Retry)**：仅在 `FAILED` 或 `TERMINATED` 状态显示。点击触发 `onRetry`。
    - **查看详情 (View Details)**：仅在 `SUCCESS` 状态显示。点击跳转至企业名录页。
  - **Loading 实现**：
    - 接收 `retryLoading` 和 `terminateLoading` 属性。
    - 仅当父组件传入的 `operatingTaskId` 与当前卡片 ID 一致且操作类型匹配时，对应的按钮才会显示 Loading 状态。

### 2.3 任务日志组件 (`TaskLog`)

- **职责**：展示当前选中任务的详细日志和进度条。
- **自动滚动**：当日志数组 (`logs`) 更新时，自动滚动到底部以显示最新消息。
- **状态反馈**：根据任务状态显示不同颜色的进度条（成功为绿色，失败/终止为红色，进行中为蓝色）。

### 2.4 Hooks 封装

- **`useTaskOperations`**：
  - 封装了 `retry` (重试) 和 `terminate` (终止) 的 API 调用。
  - 使用 `ahooks` 的 `useRequest`，并导出 `runAsync` 方法以便在 UI 层使用 `await` 处理异步流程。
  - 统一处理埋点逻辑 (`handleBuriedAction`)。
- **`useTaskPolling`**：
  - 负责调用 `splAgentTaskDetail` 接口。
  - 实现了轮询逻辑 (`pollingInterval: 5000`)。
  - 智能取消轮询：当所有任务都处于终态（成功/失败/终止）时，自动停止轮询以节省资源。

## 3. 交互细节与设计验证

### 3.1 按钮功能与 Loading 状态

| 按钮         | 出现时机 (Status)  | 点击行为                 | Loading 表现                                         | 验证结果        |
| :----------- | :----------------- | :----------------------- | :--------------------------------------------------- | :-------------- |
| **终止**     | PENDING, RUNNING   | 调用 `terminateRunAsync` | 仅**当前卡片**的“终止”按钮转圈，下方内容区显示骨架屏 | ✅ 符合当前设计 |
| **重试**     | FAILED, TERMINATED | 调用 `retryRunAsync`     | 仅**当前卡片**的“重试”按钮转圈，下方内容区显示骨架屏 | ✅ 符合当前设计 |
| **查看详情** | SUCCESS            | 跳转路由                 | 无 Loading，直接跳转                                 | ✅ 符合当前设计 |

### 3.2 内容区域 Loading 策略

为了提升用户体验，内容区域（日志/详情部分）的 Loading 策略如下：

1. **全局加载/切换任务时**：显示骨架屏 (`isLoadingTask` 为 true)。
2. **执行操作（重试/终止）期间**：显示骨架屏 (`operatingTaskId` 存在)。
   - _设计考量_：防止用户在操作执行期间看到旧的日志数据或进行误操作，同时提供明确的“正在处理”反馈。

## 4. 维护指南

- **新增任务状态**：需同步修改 `types.ts` 中的枚举、`taskUtils.ts` 中的映射逻辑以及 `TaskCard` 中的渲染判断。
- **修改轮询策略**：在 `useTaskPolling.ts` 中调整 `pollingInterval` 或 `pollingErrorRetryCount`。
- **埋点更新**：在 `useTaskOperations.ts` 中的 `handleBuriedAction` 函数中统一处理。
