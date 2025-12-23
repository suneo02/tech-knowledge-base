## DataTable 子模块文档

### 模块概览

CompanyDirectory 的 DataTable 子模块提供一个可配置、可扩展的表格视图方案，统一了以下能力：

- 列渲染管线（统一展开/收起策略、数字类格式化、公司/Markdown 专用单元格）
- 行内省略与抽屉全文查看（含上一条/下一条导航）
- 全局/按列/按单元格的展开控制
- 主题与国际化规范落地（仅使用 CSS 变量；文案集中管理）

### 目录与职责（重构后）

- `index.tsx`：表格容器组件 DataTable。负责主题适配、纵向滚动与分页管理、列加工注入、`TableContext` 提供。
- `buildColumns.tsx`：列加工器。将原始列描述转化为可展示列，统一处理展开/收起、Markdown/数字/公司类型渲染、索引列注入、单元格抽屉等。
- `handleCell/`：单元格实现分层目录（每个组件独立文件夹，含 `index.tsx` 与 `index.module.less`）。
  - `DrawerCell/`：通用“抽屉型”单元格，支持生成态/全文/抽屉聚合/行间导航。
  - `MarkdownCell/`：Markdown 专用单元格，可独立使用。
  - `CompanyCell/`：公司单元格，名称外链与标签展示。
- `context.ts`：`TableContext` 上下文，向单元格提供列与数据源，支撑抽屉态的跨列聚合与行间导航。
- `common.ts`：工具与常量。`DEFAULT_ELLIPSIS_WIDTH`、临时 `t`、`formatNumberByType`。
- `index.module.less`：仅保留表格级样式；单元格相关样式已迁移至各自目录。

### 数据流与依赖关系

1. 页面传入 `columns` 与 `dataSource` 给 `DataTable`。
2. `DataTable` 调用 `buildColumns` 统一加工列；并通过 `TableContext` 向单元格提供原始 `columns` 和 `dataSource`。
3. 经加工后的列根据 `type` 或数据类型选择具体渲染：
   - `type: 'company'` → 使用 `CompanyCell`
   - `type: 'md'` 或 `type: 'drawer'` → 使用 `DrawerCell`
   - 数字类（`ColumnDataTypeEnum.FLOAT/INTEGER/PERCENT`）→ 右对齐 + 统一格式化
   - 其他类型 → 依据 `expandAll` 与 `shouldExpandCell` 应用省略或全文展示
4. `DrawerCell` 通过 `TableContext` 获取全量列与数据源，在抽屉中聚合展示当前行所有列，并支持上一条/下一条跳转。

### 关键类型（简要）

```ts
export interface BasicRecord {
  [key: string]: unknown
}

export interface BasicColumn {
  title?: React.ReactNode
  dataIndex?: string
  ellipsis?: boolean
  render?: (value: unknown, record: BasicRecord, index?: number) => React.ReactNode
  disableExpand?: boolean
  width?: number
  type?: string | import('gel-api').ColumnDataTypeEnum
  [key: string]: unknown
}
```

### 组件说明

#### DataTable（`index.tsx`）

- props：
  - `columns: BasicColumn[]` 原始列配置
  - `dataSource: BasicRecord[]` 数据源
  - `loading?: boolean`
  - `height?: number` 表格可视区域高度；结合容器尺寸动态启用 Y 滚动
  - `expandAll?: boolean` 是否全局展开
  - `denyExpandColumns?: string[]` 禁止展开的列名集合
  - `shouldExpandCell?: (record, column) => boolean` 按行按列动态控制展开
- 行为：
  - 自动计算是否启用纵向滚动（`useSize` + `useDebounceEffect`）
  - 以 `ConfigProvider` 注入主题 token（颜色使用 `var(--*)`）
  - 将原始 `columns`、`dataSource` 放入 `TableContext`
  - 将分页信息传入 `buildColumns`（用于序号列计算）

#### 列加工器（`buildColumns.tsx`）

- 能力：
  - 统一本地化文案管理（`STRINGS` + `t`）
  - 类型识别：
    - `type: 'company'` → `CompanyCell`
    - `type: 'md'` → `DrawerCell`（MD 预览 + 抽屉）
    - `type: 'drawer'` → `DrawerCell`
    - 数字类（`FLOAT/INTEGER/PERCENT`）→ 右对齐 + 统一格式化
  - 展开/收起策略：
    - 收起：`ellipsis: true` + 统一列宽兜底 `DEFAULT_ELLIPSIS_WIDTH`
    - 展开：多行展示；Markdown/抽屉列展示全文+抽屉按钮
    - 支持 `denyExpandColumns` 与 `shouldExpandCell` 细粒度控制
  - 索引列自动注入（可关闭或自定义 `getRowNumber`）

#### 抽屉单元格（`handleCell/DrawerCell`）

- 行为：
  - `columnType === 'md'` → Markdown 渲染为 HTML（依赖 `@/utils/md` 渲染器）
  - 数字类 → `formatNumberByType`（千分位/小数位/百分号）
  - 展开态：正文 + 右上角抽屉按钮；收起态：单行省略 + 右侧按钮，MD 列支持气泡预览
  - 生成状态机：0=待生成，1=生成中，2=正常展示；优先读取 `record[{dataIndex}Status]`
  - 抽屉内聚合展示“当前行的所有列”，并提供上一条/下一条导航

#### Markdown 单元格（`handleCell/MarkdownCell`）

- 可独立使用；支持：
  - 展开态：全文直出 + 抽屉按钮
  - 收起态：单行省略 + “查看”气泡 + 抽屉按钮
  - `rawHtml`：直接输出已渲染好的 HTML 字符串

#### 公司单元格（`handleCell/CompanyCell`）

- 展示公司名称（外链检索）、标签，并提供抽屉查看；文案通过父层 `labels` 传入。

#### 表格上下文（`context.ts`）

- `TableContext` 提供 `{ columns, dataSource }`，用于 `DrawerCell` 等在抽屉内聚合渲染。

#### 工具与常量（`common.ts`）

- `DEFAULT_ELLIPSIS_WIDTH`：收起态默认列宽兜底
- `t`：临时 i18n，返回 fallback（如有全局 i18n，请替换为统一导入）
- `formatNumberByType`：按 `ColumnDataTypeEnum` 统一格式化数字

#### 样式约定（统一 PREFIX/@prefix）

- 每个组件在 `index.tsx` 顶部声明 `const PREFIX = '...-<component>'`；对应样式文件声明 `@prefix: ...-<component>;`。
- 组件内 className 使用 `styles[`${PREFIX}-xxx`]`；样式内使用 `.@{prefix}-xxx`，保证强一致性与定位效率。
- `DataTable` 自己的表格级前缀：`const PREFIX = 'company-directory-data-table'`；样式 `@prefix: company-directory-data-table;`。
- 颜色全部使用 CSS 变量（禁止硬编码）；例如 `var(--icon-color)`、`var(--item-hover)`。

### 列类型行为矩阵（简要）

- 文本（默认）
  - 收起：单行省略，列宽兜底 `DEFAULT_ELLIPSIS_WIDTH`
  - 展开：多行全文
- `type: 'md'`
  - 收起：单行省略 + 气泡预览
  - 展开：全文 + 右上角抽屉按钮
- `type: 'drawer'`
  - 使用 `DrawerCell` 的抽屉行为
- `type: 'company'`
  - 使用 `CompanyCell`
- 数字类（`INTEGER/FLOAT/PERCENT`）
  - 右对齐 + 统一格式化

### 展开/收起与禁用策略

- 全局展开：`expandAll`（DataTable 层）
- 按列禁用：`denyExpandColumns: string[]`
- 按行按列动态控制：`shouldExpandCell(record, column) => boolean`
- 生成状态控制：优先读取 `record[{dataIndex}Status]`；否则按是否有值判定（无值视为“待生成”）

### 主题与国际化约束

- 颜色：严格使用 CSS 变量（禁止硬编码色值），包括 `ConfigProvider` token。
- 文案：遵循 i18n 指南，集中在 `STRINGS + t`；`DrawerCell/CompanyCell/MarkdownCell` 的文案通过 `labels` 或 `t` 传入。

### 最小使用示例

```tsx
import React, { useMemo } from 'react'
import { DataTable } from './index'
import type { BasicColumn } from './types'
import { ColumnDataTypeEnum } from 'gel-api'

const t = (key: string, fallback: string) => fallback

const STRINGS = {
  COL_COMPANY: t('col.company', '公司'),
  COL_BRIEF: t('col.brief', '简介'),
  COL_SCORE: t('col.score', '评分'),
} as const

export const Example: React.FC = () => {
  const columns = useMemo<BasicColumn[]>(
    () => [
      { title: STRINGS.COL_COMPANY, dataIndex: 'company', type: 'company', width: 260 },
      { title: STRINGS.COL_BRIEF, dataIndex: 'brief', type: 'md' },
      { title: STRINGS.COL_SCORE, dataIndex: 'score', type: ColumnDataTypeEnum.FLOAT, width: 120 },
    ],
    []
  )

  const dataSource = [
    { company: '示例公司 A', brief: '这里是一段 Markdown 内容', score: 92.345, briefStatus: 2 },
    { company: '示例公司 B', brief: '第二行的内容', score: 70.1, briefStatus: 0 },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={dataSource}
      height={520}
      expandAll={false}
      denyExpandColumns={['score']}
      shouldExpandCell={(record, column) => record?.[`${String(column.dataIndex)}Status`] !== 0}
    />
  )
}
```

### 扩展建议

- 接入全局 i18n：将 `common.ts` 的 `t` 替换为统一导入；在 `buildColumns` 的 `STRINGS` 内新增语义 key。
- 扩展列类型：在 `buildColumns` 内增加新 `type` 的分支，或通过列的 `render` 自定义，再与展开策略兼容。
- 加强 Markdown 安全：`DrawerCell/MarkdownCell` 使用 `dangerouslySetInnerHTML` 输出 HTML，请确保渲染器有严格的白名单与转义策略。
- 索引列：如需跨页累计或偏移，可自定义 `indexColumn.getRowNumber`。

### 注意事项

- 纵向滚动开关有 500ms 防抖，尺寸临界时滚动条出现/消失可能略有延迟。
- 若列提供了自定义 `render`，在多数场景下仍会被 `buildColumns` 包裹，注意输出是否符合展开/省略预期。
- 抽屉中的跨列聚合展示基于 `TableContext` 的原始 `columns` 与 `dataSource`，若页面做了二次裁剪，请保证传入一致。
