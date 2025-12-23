# mergeColumns 工具函数设计文档

## 概述

`mergeColumns` 是一个用于合并表格列配置的工具函数，主要用于在 MultiTable 组件中处理来自不同数据源（如 CDE 和 AI）的列配置。该函数能够智能地合并新旧列配置，保持特定列的顺序，并处理列的冻结等特性。

## 详细功能说明

`mergeColumns` 函数的主要功能包括：

1. **特殊列处理**：优先处理 `cde-name` 和 `ai-name` 列，确保它们始终位于表格的最左侧。
2. **列冻结**：自动设置冻结列数量，确保特定列（如 `cde-name` 和 `ai-name`）始终可见。
3. **新列添加**：将新增的列添加到表格中，放置在已有列的左侧。
4. **列属性更新**：当新列与现有列有相同字段名时，根据来源（如 CDE）更新列的属性。
5. **保持列顺序**：保持剩余列的原始顺序，确保用户的自定义排序不会丢失。

函数的处理流程如下：

1. 首先从新列和当前列中提取 `cde-name` 和 `ai-name` 列，确保它们在最左边。
2. 设置冻结列数量，使这些重要列始终可见。
3. 处理新增的列，将它们添加到结果数组中。
4. 更新现有列的属性（如果需要）。
5. 添加剩余的当前列，保持原始顺序。

## 参数说明

| 参数名         | 类型                                | 描述                                       |
| -------------- | ----------------------------------- | ------------------------------------------ |
| newColumns     | ExtendedColumnDefine[]              | 新的列配置数组，通常来自数据源如 CDE 或 AI |
| currentColumns | ExtendedColumnDefine[]              | 当前表格中的列配置数组                     |
| tableRef       | React.RefObject<ListTableAPI & any> | 表格实例的引用，用于设置冻结列等操作       |

## 返回值说明

函数返回一个 `ExtendedColumnDefine[]` 类型的数组，包含合并后的列配置。

## 使用示例

```typescript
import { mergeColumns } from './utils/mergeColumns'
import { ExtendedColumnDefine } from './utils/mergeColumns'

// 在组件中使用
const handleEnterpriseDataBrowserOk = (data: { columns: ExtendedColumnDefine[]; data: Record<string, unknown>[] }) => {
  const currentColumns = (listTableRef.current?.getAllColumnHeaderCells()?.[0] || []) as ExtendedColumnDefine[]
  const mergedColumns = mergeColumns(data.columns, currentColumns, listTableRef)

  // 更新列和数据
  listTableRef.current?.updateColumns(mergedColumns as any)
  listTableRef.current?.addRecords(data.data)
}
```

## 注意事项

1. 函数依赖于列的 `field` 属性来识别列，确保每个列都有唯一的 `field` 值。
2. 函数会修改表格的冻结列设置，如果不需要此功能，可以不传入 `tableRef` 参数。
3. 当处理大量列时，函数的性能可能会受到影响，建议在必要时进行性能优化。
