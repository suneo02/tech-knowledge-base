# SplTable 模块说明

基于 `@wind/wind-ui-table` 的业务表格模块，提供统一的列构建、数据构建与链接渲染能力。该模块在主表格 `SplTable` 与弹窗表格 `SplTableModal` 中保持一致的渲染逻辑，避免两处行为不一致带来的维护成本。

## 目录结构

```
src/components/ChatRoles/RolesSuperChat/SplTable/
├── components/
│   ├── builders/
│   │   ├── buildColumns.tsx        # 列构建器（支持链接渲染、宽度配置、ellipsis）
│   │   ├── buildDataSource.ts      # 数据构建器（统一单元格解析）
│   │   └── buildLinkRenderer.tsx   # 链接渲染器（点击跳转、hover 变色、下划线）
│   ├── utils/
│   │   └── getIdColumnIndex.ts     # 解析 ID 列索引（用于生成公司详情链接）
│   ├── constants.ts                # 常量（列默认宽度、标题约定）
│   ├── types.ts                    # 公共类型定义
│   └── index.ts                    # 聚合导出入口
└── index.tsx                       # SplTable 组件入口（使用公共构建器）
```

## 公共导出

从聚合入口导出所有能力，便于在其他模块统一引用：

```ts
import {
  buildColumns,
  buildDataSource,
  DEFAULT_COLUMN_WIDTH,
  HeaderItem,
  RowItem,
} from '@/components/ChatRoles/RolesSuperChat/SplTable/components'
```

## 类型与配置

```ts
// 表头项
export type HeaderItem = {
  title: string
  columnId: string | number
  isShow?: boolean
  // 指示当前列的链接应指向哪个 ID 列：
  // - true：使用默认公司编号列
  // - string | number：指定具体 columnId
  // - false | undefined：不启用链接
  linkToIdColumn?: string | number | boolean
}

// 行数据（与 headers 同步按索引取值）
export type RowItem = unknown[]

// 构建列的选项
export type BuildColumnsOptions = {
  enableLinking?: boolean        // 是否启用链接渲染（默认 true）
  defaultWidth?: number          // 默认列宽（默认 150）
  widthMap?: Record<string, number> // 按 columnId 自定义列宽
}

// 表格配置（分页/滚动/斑马纹等，可按需扩展）
export type TableConfig = {
  pagination?: { pageSize?: number; current?: number }
  scroll?: { x?: number | string; y?: number | string }
  striped?: boolean
}

export type SplTableProps = {
  headers: HeaderItem[]
  rows: RowItem[]
  config?: TableConfig
}

// 常量
export const DEFAULT_COLUMN_WIDTH = 150
export const COMPANY_CODE_TITLE = '企业编号'
export const COMPANY_NAME_TITLE = '企业名称'
```

## 构建器说明

- `buildColumns(headers, rows, options?)`
  - 过滤 `isShow === false` 的列
  - 支持 `ellipsis`、默认宽度与 `widthMap` 定制
  - 当 `options.enableLinking !== false` 时，使用统一的链接渲染（见下文）

- `buildDataSource(headers, rows)`
  - 与 `headers` 同步按索引构建 `dataSource`
  - 解析字符串 JSON（包含 `Label` 或 `answer` 字段）并优先返回其中值
  - `null/undefined` 与空值统一使用 `'--'` 占位

- `buildLinkRenderer(header, headers, rows)`
  - 解析当前列应关联的 ID 列：
    - 标题为 `企业名称` 时，自动关联标题为 `企业编号` 的列
    - 若 `header.linkToIdColumn` 为 `string|number`，则按指定 `columnId` 关联
    - 若 `header.linkToIdColumn === true`，则回退到默认公司编号列
    - 无匹配时不渲染链接，返回原文本
  - 链接样式与交互：
    - 单元格文本带下划线、`hover` 时文本颜色变为 `var(--click-6)`
    - 文本超长省略（保留 `title` 以便悬停查看完整内容）
    - 点击后通过 `gel-util/link` 的 `handleJumpTerminalCompatible` 跳转公司详情页

## 在 SplTable 中使用（示例）

```tsx
import Table from '@wind/wind-ui-table'
import {
  buildColumns,
  buildDataSource,
  DEFAULT_COLUMN_WIDTH,
  HeaderItem,
  RowItem,
} from '@/components/ChatRoles/RolesSuperChat/SplTable/components'

type Props = { headers: HeaderItem[]; rows: RowItem[] }

export function SplTable({ headers, rows }: Props) {
  const columns = buildColumns(headers, rows, {
    enableLinking: true,
    defaultWidth: DEFAULT_COLUMN_WIDTH,
    widthMap: { '企业名称': 240 }, // 示例：对指定列设置自定义宽度
  })

  const dataSource = buildDataSource(headers, rows)

  return (
    <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: '100%' }} />
  )
}
```

## 在 SplTableModal 中使用（行为一致）

`SplTableModal` 使用与 `SplTable` 相同的构建器，额外叠加业务脱敏与补齐行数逻辑：

- 当数据长度在 `10 < len < 20` 时，使用空行补齐到 20 行以保持视觉一致性
- 第 11 行（索引 > 9）开始进行文本脱敏：`maskName(text)`，但仍保留统一样式（省略、hover 变色、下划线）

示例（已在 `src/components/SplTable/components/SplTableModal/index.tsx` 中实现）：

```tsx
const columns = useMemo(() => {
  const baseColumns = buildColumns(headers, rows, { enableLinking: true, defaultWidth: DEFAULT_COLUMN_WIDTH })
  return baseColumns.map((col) => ({
    ...col,
    render: (text, record, index) => {
      const display = index !== undefined && index > 9 ? maskName(text as string) : (text as string)
      return col.render ? col.render(display, record, index) : display
    },
  }))
}, [headers, rows])
```

如需在 Modal 中禁用第 11 行之后的跳转，可在上述覆盖 `render` 时直接返回纯文本，绕过 `col.render`。

## 常见拓展与约定

- 自定义列宽：通过 `BuildColumnsOptions.widthMap` 覆盖某些列宽，其他列走 `defaultWidth`
- 关闭链接渲染：`buildColumns(headers, rows, { enableLinking: false })`
- 指定链接目标 ID 列：在 `HeaderItem.linkToIdColumn` 中传入 `columnId`（字符串或数字）
- 自动关联规则：当列标题为 `企业名称` 时，若存在标题为 `企业编号` 的列，则默认关联该列

## 开发与预览

- 启动开发服务：`npm run dev`
- 页面预览：Vite 本地服务启动后，打开终端提示的本地地址进行验证
- 若你仅修改文档无需预览，可忽略此步骤；涉及 UI 行为改动时建议打开预览验证交互（下划线、hover 颜色、文本省略）是否符合预期。

---

本模块旨在通过统一的构建器与类型定义，提高可读性、类型安全与复用性，并确保 `SplTable` 与 `SplTableModal` 在渲染逻辑上保持一致。若需要新增能力（如排序、筛选、可配置分页），建议在 `types.ts` 扩展类型，并在对应 `builders` 中以选项的方式增加，避免散落的临时逻辑。