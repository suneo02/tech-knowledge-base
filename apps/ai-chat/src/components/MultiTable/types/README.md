# MultiTable 类型系统设计文档

## 概述

本文档描述了 MultiTable 组件的类型系统设计，旨在提供清晰、易懂、易用的类型定义，使开发者能够更好地理解和使用 MultiTable 组件。

## 类型文件结构

类型系统分为以下几个主要文件：

1. `operationTypes.ts` - 定义表格操作相关的类型
2. `menuTypes.ts` - 定义菜单相关的类型
3. `actionTypes.ts` - 定义状态管理 Action 相关的类型
4. `typeMapping.ts` - 定义类型之间的映射关系
5. `index.ts` - 统一导出所有类型

## 主要类型说明

### 操作类型 (operationTypes.ts)

- `TableOperationType` - 表格操作类型枚举，定义所有可能的表格操作类型
- `SyncStatus` - 同步状态枚举，定义操作的同步状态
- `BaseOperation` - 基础操作接口，所有操作类型的基础接口
- 各种具体操作接口，如 `CellEditOperation`、`ColumnMoveOperation` 等
- `OperationLog` - 操作日志记录接口
- `TableOperation` - 所有操作类型的联合类型

### 菜单类型 (menuTypes.ts)

- `ColumnMenuKey` - 列菜单项键值枚举，定义表格列头菜单的各种操作类型
- `CellMenuKey` - 单元格菜单项键值枚举，定义表格单元格菜单的各种操作类型
- `MenuListItem` - 菜单项接口，定义菜单项的结构
- `MenuHandlers` - 菜单处理器类型，定义菜单项点击后的处理函数类型

### Action 类型 (actionTypes.ts)

- `TableOperationActionType` - 表格操作状态 Action 类型枚举
- `TableOperationAction` - 表格操作状态 Action 接口，用于定义 dispatch 函数的参数类型

### 类型映射 (typeMapping.ts)

- `MenuToOperationTypeMap` - 菜单操作到表格操作的映射，将菜单操作类型映射到对应的表格操作类型
- `OperationTypeDescriptionMap` - 操作类型描述映射，为每种操作类型提供人类可读的描述

## 使用示例

### 导入类型

```typescript
import { TableOperationType, TableOperation, ColumnMenuKey, MenuHandlers, TableOperationActionType } from './types'
```

### 使用操作类型

```typescript
const handleOperation = (operation: TableOperation) => {
  if (operation.type === TableOperationType.CELL_EDIT) {
    // 处理单元格编辑操作
    const { columnId, rowId, oldValue, newValue } = operation
    // ...
  }
}
```

### 使用菜单类型

```typescript
const menuHandlers: MenuHandlers = {
  [ColumnMenuKey.COLUMN_RENAME]: (props) => {
    // 处理列重命名
  },
  [ColumnMenuKey.COLUMN_DELETE]: (props) => {
    // 处理列删除
  },
}
```

### 使用 Action 类型

```typescript
const dispatch = (action: TableOperationAction) => {
  // 处理 action
}

dispatch({
  type: TableOperationActionType.RECORD_OPERATION,
  payload: {
    // 操作数据
  },
})
```

## 类型映射使用

```typescript
import { MenuToOperationTypeMap, OperationTypeDescriptionMap } from './types'

// 将菜单操作转换为表格操作
const operationType = MenuToOperationTypeMap[ColumnMenuKey.COLUMN_RENAME]

// 获取操作类型的描述
const description = OperationTypeDescriptionMap[TableOperationType.CELL_EDIT]
```
