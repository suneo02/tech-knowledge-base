# CList 组件

目标：提供与 CompanyDirectory 的 DataTable 单元格渲染结果一致的列表视图，但在列表中对 `type: 'drawer'` 不展示展开抽屉的入口图标（仅显示内容/状态）。

## 功能特性

- 内部包裹 `CellRegistryProvider`，复用统一渲染器，保证普通类型（文本/数字/Markdown）与表格一致的内容渲染（含数字的千分位/小数位/百分号）。
- 特殊类型兼容：
  - `company`：使用与表格一致的 `CompanyCell`（名称可跳转）。
  - `drawer`：复刻生成态/生成中/正常展示的状态逻辑，但不展示抽屉入口图标。
- 与表格一致的展开控制：支持 `expandAll`、`denyExpandColumns` 与 `shouldExpandCell(record, column)`。
- 提供 `TableContext`，便于渲染器/插件在需要时读取列表的 `columns` 与 `dataSource`。

## 使用示例

```tsx
import React, { useMemo } from 'react'
import { CList } from '@/components/CList'
import type { BasicColumn } from '@/pages/CompanyDirectory/parts/DataTable/types'
import { ColumnDataTypeEnum } from 'gel-api'

export const Example: React.FC = () => {
  const columns = useMemo<BasicColumn[]>(
    () => [
      { title: '公司', dataIndex: 'company', type: 'company', width: 260 },
      { title: '简介', dataIndex: 'brief', type: 'md' },
      { title: '概览', dataIndex: 'overview', type: 'drawer' },
      { title: '评分', dataIndex: 'score', type: ColumnDataTypeEnum.FLOAT, width: 120 },
    ],
    []
  )

  const dataSource = [
    { company: '示例公司 A', brief: '这里是一段 Markdown 内容', overview: '点击表格会打开抽屉，但列表不展示图标', score: 92.345, briefStatus: 2 },
    { company: '示例公司 B', brief: '第二行的内容', overview: '更多详情见抽屉', score: 70.1, briefStatus: 0 },
  ]

  return (
    <CList
      columns={columns}
      dataSource={dataSource}
      expandAll={false}
      denyExpandColumns={['score']}
      shouldExpandCell={(record, column) => record?.[`${String(column.dataIndex)}Status`] !== 0}
    />
  )
}
```

## Props

- `columns: BasicColumn[]` 列配置（与 DataTable 相同类型）
- `dataSource: BasicRecord[]` 数据源
- `expandAll?: boolean` 是否全局展开（默认 `false`）
- `denyExpandColumns?: string[]` 禁止展开的列（默认 `[]`）
- `shouldExpandCell?: (record, column) => boolean` 按行按列动态控制展开（默认 `true`）
- `rowKey?: string | (record, index) => React.Key` 行唯一键（可选）

## 差异说明（与 DataTable）

- `drawer` 类型：列表中不展示抽屉入口图标，仅保留生成/生成中/内容展示逻辑；表格中通过 `drawerAddon` 提供抽屉行为。
- 其他类型：内容渲染与表格保持一致（依赖 CellRegistry），但列表不涉及表格的列宽/右对齐等布局策略。

## 样式约定

- 组件前缀：`clist`，样式文件 `index.module.less` 使用 `@prefix: clist;`，类名通过 `styles[`${PREFIX}-xxx`]` 引用。
- 颜色与边框遵循项目的 CSS 变量：`var(--font-color-1)`、`var(--font-color-2)`、`var(--border-color-split)`、`var(--surface-color)` 等。

## 注意事项

- 若列提供了自定义 `render`，`CList` 将以统一的 `CellView` 包装进行类型渲染；如需完全自定义，可在列级自行处理并避免与展开策略冲突。
- 如需在列表中为 Markdown/其他类型也接入抽屉行为，可考虑在页面层通过 CellRegistry 注册 `drawerAddon` 并在调用处附加；本组件默认不为 `drawer` 类型启用入口图标。
- 为兼容表格抽屉的“列定位”，列表每行会包含 `data-col-key="${dataIndex}"` 属性，抽屉在打开时可滚动到对应列。