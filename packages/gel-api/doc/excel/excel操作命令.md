# Excel 操作命令详细文档

> 说明：所有接口响应均使用通用响应格式进行包装，详见[通用返回数据文档](../通用返回数据文档.md#一基础响应结构-apiresponseforsuperlist)

本文档详细说明了 `excel/operation` 接口中 `OperationCommand` 的各种命令及其对应的 payload 参数。

## 操作命令类型 (OperationCommand)

`OperationCommand` 是一个字符串类型，可以是以下值之一：

| 命令值        | 描述           |
| ------------- | -------------- |
| update_cell   | 更新单元格     |
| run_cell      | 执行单元格任务 |
| update_column | 更新列         |
| move_column   | 移动列         |
| add_column    | 添加列         |
| delete_column | 删除列         |
| rename_column | 重命名列       |
| run_column    | 执行列任务     |
| filter_column | 筛选列         |
| sort_column   | 排序列         |
| hide_column   | 隐藏列         |
| delete_row    | 删除行         |
| add_row       | 添加行         |
| run_row       | 执行行任务     |
| undo          | 撤销操作       |
| redo          | 重做操作       |

## 通用响应格式

所有表格操作命令均使用以下通用响应格式：

**响应格式**：[`ApiResponseForChat<TableOperationResponse>`](../通用返回数据文档.md#三、聊天响应结构-apiresponseforchat)

**TableOperationResponse 结构**：

| 参数名   | 类型     | 描述               |
| -------- | -------- | ------------------ |
| code     | number   | 状态码，0 表示成功 |
| msg      | string   | 操作结果描述信息   |
| result   | any      | 操作返回的结果数据 |
| rowId    | string   | 相关的行 ID        |
| columnId | string   | 相关的列 ID        |
| rowIds   | string[] | 相关的行 ID 数组   |

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "操作执行成功",
    "columnId": "column_001"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

## 操作参数 (payload)

每种命令类型对应不同的 payload 参数结构，以下是详细说明：

### 1. 更新单元格 (update_cell)

**payload 类型**：`UpdateCellParams`

**参数说明**：

| 参数名   | 类型   | 必填 | 描述         |
| -------- | ------ | ---- | ------------ |
| rowId    | string | 是   | 行 ID        |
| columnId | string | 是   | 列 ID        |
| value    | any    | 是   | 单元格的新值 |

**请求示例**：

```json
{
  "cmd": "update_cell",
  "payload": {
    "rowId": "row_12345",
    "columnId": "column_67890",
    "value": "新的单元格值"
  },
  "operationNo": 1,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "单元格更新成功",
    "rowId": "row_12345",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 2. 执行单元格任务 (run_cell)

**payload 类型**：`RunCellParams`

**参数说明**：

| 参数名   | 类型   | 必填 | 描述             |
| -------- | ------ | ---- | ---------------- |
| rowId    | string | 是   | 行 ID            |
| columnId | string | 是   | 列 ID            |
| sheetId  | string | 是   | Sheet 的唯一标识 |

**请求示例**：

```json
{
  "cmd": "run_cell",
  "payload": {
    "rowId": "row_12345",
    "columnId": "column_67890",
    "sheetId": "sheet_12345678"
  },
  "operationNo": 2,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "单元格任务已提交",
    "rowId": "row_12345",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 3. 更新列 (update_column)

**payload 类型**：`UpdateColumnParams`

**参数说明**：

| 参数名         | 类型    | 必填 | 描述       |
| -------------- | ------- | ---- | ---------- |
| columnId       | string  | 是   | 列 ID      |
| newColumnIndex | number  | 否   | 新的列索引 |
| isDelete       | boolean | 否   | 是否删除   |
| newColumnName  | string  | 否   | 新的列名称 |

**请求示例**：

```json
{
  "cmd": "update_column",
  "payload": {
    "columnId": "column_67890",
    "newColumnIndex": 3,
    "newColumnName": "更新后的列名"
  },
  "operationNo": 3,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列更新成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 4. 移动列 (move_column)

**payload 类型**：`MoveColumnParams`

**参数说明**：

| 参数名         | 类型   | 必填 | 描述       |
| -------------- | ------ | ---- | ---------- |
| columnId       | string | 是   | 列 ID      |
| newColumnIndex | number | 是   | 新的列索引 |

**请求示例**：

```json
{
  "cmd": "move_column",
  "payload": {
    "columnId": "column_67890",
    "newColumnIndex": 5
  },
  "operationNo": 4,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列移动成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 5. 添加列 (add_column)

**payload 类型**：`AddColumnParams`

**参数说明**：

| 参数名      | 类型   | 必填 | 描述                  |
| ----------- | ------ | ---- | --------------------- |
| columnName  | string | 是   | 列名称                |
| columnId    | string | 否   | 列 ID，不填则自动生成 |
| columnIndex | number | 否   | 列索引位置            |

**请求示例**：

```json
{
  "cmd": "add_column",
  "payload": {
    "columnName": "新列",
    "columnIndex": 2
  },
  "operationNo": 5,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列添加成功",
    "columnId": "column_new123"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 6. 删除列 (delete_column)

**payload 类型**：`DeleteColumnParams`

**参数说明**：

| 参数名   | 类型   | 必填 | 描述          |
| -------- | ------ | ---- | ------------- |
| columnId | string | 是   | 要删除的列 ID |

**请求示例**：

```json
{
  "cmd": "delete_column",
  "payload": {
    "columnId": "column_67890"
  },
  "operationNo": 6,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列删除成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 7. 重命名列 (rename_column)

**payload 类型**：`RenameColumnParams`

**参数说明**：

| 参数名        | 类型   | 必填 | 描述       |
| ------------- | ------ | ---- | ---------- |
| columnId      | string | 是   | 列 ID      |
| newColumnName | string | 是   | 新的列名称 |

**请求示例**：

```json
{
  "cmd": "rename_column",
  "payload": {
    "columnId": "column_67890",
    "newColumnName": "重命名后的列"
  },
  "operationNo": 7,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列重命名成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 8. 执行列任务 (run_column)

**payload 类型**：`RunColumnParams`

**参数说明**：

| 参数名   | 类型   | 必填 | 描述  |
| -------- | ------ | ---- | ----- |
| columnId | string | 是   | 列 ID |

**请求示例**：

```json
{
  "cmd": "run_column",
  "payload": {
    "columnId": "column_67890"
  },
  "operationNo": 8,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列任务已提交",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 9. 筛选列 (filter_column)

**payload 类型**：`FilterColumnParams`

**参数说明**：

| 参数名          | 类型   | 必填 | 描述     |
| --------------- | ------ | ---- | -------- |
| columnId        | string | 是   | 列 ID    |
| filterCondition | any    | 是   | 筛选条件 |

**请求示例**：

```json
{
  "cmd": "filter_column",
  "payload": {
    "columnId": "column_67890",
    "filterCondition": {
      "value": "筛选值",
      "operator": "contains"
    }
  },
  "operationNo": 9,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列筛选成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 10. 排序列 (sort_column)

**payload 类型**：`SortColumnParams`

**参数说明**：

| 参数名   | 类型            | 必填 | 描述                              |
| -------- | --------------- | ---- | --------------------------------- |
| tableId  | string          | 是   | 表格 ID                           |
| columnId | string          | 是   | 列 ID                             |
| sortType | 'asc' 或 'desc' | 是   | 排序类型，'asc' 升序，'desc' 降序 |

**请求示例**：

```json
{
  "cmd": "sort_column",
  "payload": {
    "tableId": "table_12345",
    "columnId": "column_67890",
    "sortType": "desc"
  },
  "operationNo": 10,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列排序成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 11. 隐藏列 (hide_column)

**payload 类型**：`HideColumnParams`

**参数说明**：

| 参数名   | 类型    | 必填 | 描述                                    |
| -------- | ------- | ---- | --------------------------------------- |
| columnId | string  | 是   | 列 ID                                   |
| isHidden | boolean | 是   | 是否隐藏，true 表示隐藏，false 表示显示 |

**请求示例**：

```json
{
  "cmd": "hide_column",
  "payload": {
    "columnId": "column_67890",
    "isHidden": true
  },
  "operationNo": 11,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "列隐藏状态更新成功",
    "columnId": "column_67890"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 12. 删除行 (delete_row)

**payload 类型**：`DeleteRowParams`

**参数说明**：

| 参数名 | 类型   | 必填 | 描述          |
| ------ | ------ | ---- | ------------- |
| rowId  | string | 是   | 要删除的行 ID |

**请求示例**：

```json
{
  "cmd": "delete_row",
  "payload": {
    "rowId": "row_12345"
  },
  "operationNo": 12,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "行删除成功",
    "rowId": "row_12345"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 13. 添加行 (add_row)

**payload 类型**：`AddRowParams`

**参数说明**：

| 参数名   | 类型   | 必填 | 描述                  |
| -------- | ------ | ---- | --------------------- |
| rowId    | string | 否   | 行 ID，不填则自动生成 |
| rowIndex | number | 否   | 行索引位置            |

**请求示例**：

```json
{
  "cmd": "add_row",
  "payload": {
    "rowIndex": 3
  },
  "operationNo": 13,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "行添加成功",
    "rowId": "row_new456"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 14. 执行行任务 (run_row)

**payload 类型**：`RunRowParams`

**参数说明**：

| 参数名 | 类型   | 必填 | 描述  |
| ------ | ------ | ---- | ----- |
| rowId  | string | 是   | 行 ID |

**请求示例**：

```json
{
  "cmd": "run_row",
  "payload": {
    "rowId": "row_12345"
  },
  "operationNo": 14,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "行任务已提交",
    "rowId": "row_12345"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 15. 撤销操作 (undo)

**payload 类型**：不需要额外的 payload

**请求示例**：

```json
{
  "cmd": "undo",
  "operationNo": 15,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "操作已撤销"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```

### 16. 重做操作 (redo)

**payload 类型**：不需要额外的 payload

**请求示例**：

```json
{
  "cmd": "redo",
  "operationNo": 16,
  "sheetId": "sheet_12345678"
}
```

**响应示例**：

```json
{
  "result": {
    "code": 0,
    "msg": "操作已重做"
  },
  "message": "操作成功",
  "status": "success",
  "ErrorCode": 0
}
```
