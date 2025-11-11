## CompanyDirectory 页面说明

企业名录 / 客户库页面，支持左侧快速列表与筛选、右侧多 Tab（表格 / 看板 / 地图）切换，用于客户洞察、线索筛选与导出等业务场景。

---

## 目录结构

```text
CompanyDirectory/
├─ index.tsx                 # 页面入口：组织左侧与右侧布局
├─ index.module.less         # 页面样式（CSS Modules）
└─ parts/
   ├─ LeftPanel/             # 左侧面板：快速列表/自定义列表、模式切换、折叠
   │  ├─ index.tsx
   │  └─ index.module.less
   ├─ RightPanel/            # 右侧主区域：标题区、操作区与内容 Tab
   │  ├─ hooks/
   │  │  ├─ useCompanyDirectoryData.ts  # 通过 ahooks 获取数据
   │  │  └─ useCompanyFilters.ts         # 搜索、包含/排除关键字过滤
   │  ├─ parts/
   │  │  ├─ TableTab/        # 表格视图：额外条件 + 搜索工具栏 + 数据表
   │  │  │  └─ index.tsx
   │  │  ├─ DashboardBoard/  # 看板视图：图表/卡片占位（示例配置）
   │  │  │  ├─ index.tsx
   │  │  │  └─ index.module.less
   │  │  └─ QuickTabs/       # 右侧顶部快捷 Tab（图标 + Tooltip）
   │  │     ├─ index.tsx
   │  │     └─ index.module.less
   │  ├─ index.tsx
   │  └─ index.module.less
   ├─ DataTable/             # 表格封装（基于 gel-ui SmartTable）
   │  ├─ index.tsx
   │  └─ index.module.less
   ├─ ExtraConditions/       # 额外条件组件：包含/排除关键字的条件设置
   │  ├─ index.tsx
   │  └─ index.module.less
   ├─ QuickList/             # 左侧简易快速列表
   │  ├─ index.tsx
   │  └─ index.module.less
   └─ SearchToolbar/         # 搜索工具栏：搜索框 + 导出/新增列/AI 生成列按钮
      ├─ index.tsx
      └─ index.module.less
```

---

## 组件职责与数据流

- **页面入口（`index.tsx`）**：

  - 使用 `useSearchParams` 读取并维护 `selected`，以便刷新后保持选中项。
  - 将 `selectedId` 下发给 `LeftPanel` 与 `RightPanel`。

- **左侧面板（`parts/LeftPanel`）**：

  - 内置“简易/全量”两种模式；简易模式使用 `QuickList` 渲染 500 条本地模拟数据。
  - 通过 `onSelect` 通知页面入口更新 `selectedId`，同时同步到 URL 查询参数。

- **右侧区域（`parts/RightPanel`）**：
  - 顶部包含返回首页、页面标题、订阅/历史/导出等操作。
  - 内容区包含 3 个 Tab：
    - `TableTab`：
      - 通过 `useCompanyDirectoryData` 异步获取数据与 `getCompanyDirectoryColumns` 获取列。
      - `useCompanyFilters` 负责搜索、包含/排除关键字过滤，输出 `filteredData`。
      - 视图由 `ExtraConditions`（额外条件）+ `SearchToolbar`（搜索与操作）+ `DataTable`（表格）组成。
    - `DashboardBoard`：示例化的看板，支持按主题变量着色，后续可接入真实图表库。
    - `MapTab`：地图功能占位（后续可扩展）。

---

## 技术栈与规范要点

- 使用 `wind-ui` 组件与 `@wind/icons` 图标；样式使用 `.module.less` 并通过 CSS Modules 引入。
- 异步请求与依赖管理使用 `ahooks`（如 `useRequest`、`useSize`）。
- 文案须遵循 i18n 规范（STRINGS + `t`）；颜色与主题仅用 CSS 变量。
- 若新增 Tab/筛选项，优先复用已有组件与 Hook，保持交互与视觉一致。

---

## 开发建议

- 新增字段或筛选：在 `useCompanyFilters` 内扩展规则，并在 `ExtraConditions` 中暴露配置。
- 接入真实数据：替换 `getCompanyDirectoryData/getCompanyDirectoryColumns` 的数据来源，并处理加载态与空态。
- 看板增强：在 `DashboardBoard` 中接入真实图表库（如 ECharts/Wind Chart Builder），并引入可配置化。

