## Superlist 接口文档（分组：@cde/ @chat/ @credits/ @excel/）

说明：以下所有接口路径均在 `${WIND_ENT_CHAT_PATH}superlist` 之下展示为相对路径（如 `excel/addSheet`）。通用响应结构详见 `../../doc/通用返回数据文档.md`。

---

## @excel/

来源：`src/wfc/super/domains/sheet/*`、`src/wfc/super/domains/subscription/*`、`src/superlist/excel/*`

### 1. 新增 Sheet

**接口路径**：`excel/addSheet`

**请求参数**：

| 参数名    | 类型   | 必填 | 描述            |
| --------- | ------ | ---- | --------------- |
| sheetName | string | 是   | 新建 Sheet 名称 |
| tableId   | string | 是   | 表格唯一标识    |

**请求示例**：

```json
{ "sheetName": "数据分析", "tableId": "table_12345678" }
```

**响应格式**：[`ApiResponseForSuperlist<AddSheetResponse>`](../../doc/通用返回数据文档.md)

**响应参数**：

| 参数名 | 类型   | 描述                  |
| ------ | ------ | --------------------- |
| data   | number | 新建 Sheet 的 sheetId |

**响应示例**：

```json
{ "ErrorCode": 0, "ErrorMessage": "操作成功", "Data": 12345 }
```

### 2. 删除 Sheet

**接口路径**：`excel/deleteSheet`

**请求参数**：

| 参数名  | 类型   | 必填 | 描述       |
| ------- | ------ | ---- | ---------- |
| sheetId | number | 是   | Sheet 标识 |

**请求示例**：

```json
{ "sheetId": 12345 }
```

**响应格式**：[`ApiResponseForSuperlist<DeleteSheetResponse>`](../../doc/通用返回数据文档.md)

**响应参数**：| msg: string |

**响应示例**：

```json
{ "ErrorCode": 0, "ErrorMessage": "操作成功", "Data": { "msg": "删除成功" } }
```

### 3. 重命名 Sheet

**接口路径**：`excel/updateSheet`

**请求参数**：

| 参数名    | 类型   | 必填 | 描述       |
| --------- | ------ | ---- | ---------- |
| sheetId   | number | 是   | Sheet 标识 |
| sheetName | string | 是   | 新名称     |

**请求示例**：

```json
{ "sheetId": 12345, "sheetName": "线索清单" }
```

**响应格式**：[`ApiResponseForSuperlist<UpdateSheetResponse>`](../../doc/通用返回数据文档.md)

**响应参数**：| msg: string |

### 4. 重命名表格

**接口路径**：`excel/updateTableName`

**请求参数**：

| 参数名    | 类型   | 必填 | 描述       |
| --------- | ------ | ---- | ---------- |
| tableId   | string | 是   | 表格标识   |
| tableName | string | 是   | 新表格名称 |

**请求示例**：

```json
{ "tableId": "table_123", "tableName": "团队名单" }
```

**响应格式**：[`ApiResponseForSuperlist<UpdateTableNameResponse>`](../../doc/通用返回数据文档.md)

**响应参数**：| msg: string |

### 5. 导出 Sheet

**接口路径**：`excel/downloadSheet`

**请求参数**：

| 参数名  | 类型     | 必填 | 描述                                            |
| ------- | -------- | ---- | ----------------------------------------------- | --------- |
| sheetId | number   | 是   | Sheet 标识                                      |
| filters | object[] | 否   | 过滤：`{ columnId, filterType, filterValue }[]` |
| sort    | object   | 否   | 排序：`{ columnId, sortType: 'asc'              | 'desc' }` |

**请求示例**：

```json
{
  "sheetId": 12345,
  "filters": [{ "columnId": "col1", "filterType": 1, "filterValue": "北京" }],
  "sort": { "columnId": "col2", "sortType": "asc" }
}
```

**响应格式**：[`ApiResponseForSuperlist<DownloadSheetResponse>`](../../doc/通用返回数据文档.md)

**响应参数**：| downloadUrl: string | fileName: string |

### 6. 表格信息与结构

1. 获取表格信息 `excel/getTableInfo`

| 参数名         | 类型   | 必填 | 描述     |
| -------------- | ------ | ---- | -------- |
| tableId        | string | 是   | 表格标识 |
| conversationId | string | 是   | 会话标识 |

响应：`ApiResponseForSuperlist<GetTableInfoResponse>`

2. 获取 Sheet 信息 `excel/getSheetInfo` / 获取列 `excel/getSheetColumns` / 获取所有行 ID `excel/getSheetAllRowIds`

| 参数名  | 类型   | 必填 | 描述       |
| ------- | ------ | ---- | ---------- |
| sheetId | number | 是   | Sheet 标识 |

响应：分别对应 `GetSheetInfoResponse` / `GetSheetColumnsResponse` / `GetSheetAllRowIdsResponse`

3. 获取行详情 `excel/getRowsDetail`

| 参数名 | 类型     | 必填 | 描述       |
| ------ | -------- | ---- | ---------- |
| rowIds | string[] | 是   | 行 ID 列表 |

响应：`ApiResponseForSuperlist<GetRowsDetailResponse>`

### 7. 表格操作（单元格/列/行）

**接口路径**：`excel/operation`

| 参数名      | 类型   | 必填 | 描述                                      |
| ----------- | ------ | ---- | ----------------------------------------- |
| cmd         | string | 是   | 操作命令（如 `update_cell`/`run_column`） |
| payload     | object | 否   | 操作参数（随 cmd 变化）                   |
| operationNo | number | 是   | 操作序号                                  |
| sheetId     | number | 是   | Sheet 标识                                |

响应：`ApiResponseForSuperlist<TableOperationResponse>`

### 8. AI 插入列

1. 获取参数 `excel/getAiInsertColumnParam`

| 参数名   | 类型   | 必填 | 描述   |
| -------- | ------ | ---- | ------ |
| columnId | string | 是   | 列标识 |

响应：`ApiResponseForSuperlist<GetAiInsertColumnParamResponse>`

2. 执行 `excel/aiInsertColumn`

| 参数名           | 类型    | 必填 | 描述                           |
| ---------------- | ------- | ---- | ------------------------------ |
| columnId         | string  | 是   | 列标识                         |
| columnIndex      | number  | 否   | 插入位置                       |
| sheetId          | number  | 是   | Sheet 标识                     |
| prompt           | string  | 是   | 提示词                         |
| aiModel          | number  | 是   | 模型（AiModelEnum）            |
| tool             | object  | 是   | 工具映射（AiToolEnum->object） |
| promptPattern    | string  | 是   | 模板                           |
| enableAutoUpdate | boolean | 是   | 是否自动更新                   |

响应：`ApiResponseForSuperlist<AiInsertColumnResponse>`

### 9. 单元格状态查询

**接口路径**：`excel/getCellsStatus`

| 参数名  | 类型     | 必填 | 描述       |
| ------- | -------- | ---- | ---------- |
| cellIds | string[] | 是   | 单元格 ID  |
| sheetId | number   | 是   | Sheet 标识 |

响应：`ApiResponseForSuperlist<GetCellsStatusResponse>`

### 10. 已选指标查询

**接口路径**：`excel/selectedIndicator`

| 参数名  | 类型   | 必填 | 描述       |
| ------- | ------ | ---- | ---------- |
| sheetId | number | 是   | Sheet 标识 |

响应：`ApiResponseForSuperlist<{ indicatorKeyList: string[] }>`

### 11. 数据写入 Sheet（多来源）

**接口路径**：`excel/addDataToSheet`

依据 `dataType` 不同有多种请求体（指标筛选/AI_CHAT_DPU/CDE_FILTER/CLUE_EXCEL/AI_CHAT_SPL_TABLE）。

最简示例（指标筛选导入）：

```json
{ "tableId": "table_1", "dataType": "INDICATOR_FILTER", "classificationList": [], "pageNo": 1, "pageSize": 10 }
```

响应：`ApiResponseForSuperlist<AddDataToSheetResponse>`

### 12. 智能填充（运行与生成列名）

这些接口来自 `src/superlist/excel`，响应为聊天格式。

1. 执行单元格任务 `excel/runCell`

| 参数名   | 类型   | 必填 | 描述       |
| -------- | ------ | ---- | ---------- |
| rowId    | string | 是   | 行标识     |
| columnId | string | 是   | 列标识     |
| sheetId  | number | 是   | Sheet 标识 |

响应：[`ApiResponseForChat<RunCellResponse>`](../../doc/通用返回数据文档.md)

2. 执行列任务 `excel/runColumn`

| 参数名      | 类型            | 必填 | 描述                  |
| ----------- | --------------- | ---- | --------------------- |
| sheetId     | number          | 是   | Sheet 标识            |
| columnId    | string          | 是   | 列标识                |
| statusToRun | RunColumnStatus | 否   | 0全部/1待处理/2前10行 |

响应：[`ApiResponseForChat<RunColumnResponse>`](../../doc/通用返回数据文档.md)

3. 生成列名 `intelligentFill/generateColumnName`

| 参数名     | 类型   | 必填 | 描述       |
| ---------- | ------ | ---- | ---------- |
| promptText | string | 是   | 提示文本   |
| sheetId    | number | 是   | Sheet 标识 |
| columnId   | string | 是   | 列标识     |

响应：[`ApiResponseForChat<GenerateColumnNameResponse>`](../../doc/通用返回数据文档.md)

### 13. 积分评估

1. 列智能填充积分试算 `excel/customerPointCountByAIColumn`

| 参数名  | 类型   | 必填 | 描述  |
| ------- | ------ | ---- | ----- |
| aiModel | number | 是   | 模型  |
| sheetId | number | 是   | Sheet |
| tool    | object | 是   | 工具  |

响应：`ApiResponseForSuperlist<CustomerPointCountByAiColumnResponse>`

2. 指标筛选积分试算 `excel/customerPointCountByColumnIndicator`

| 参数名             | 类型     | 必填 | 描述     |
| ------------------ | -------- | ---- | -------- |
| sheetId            | number   | 是   | Sheet    |
| tableId            | string   | 是   | 表格     |
| classificationList | object[] | 是   | 指标集合 |

响应：`ApiResponseForSuperlist<CustomerPointCountByColumnIndicatorResponse>`

### 14. 订阅相关（位于 @excel/ 名下）

1. 获取订阅列表 `excel/getSubSuperListCriterion`

| 参数名  | 类型    | 必填 | 描述         |
| ------- | ------- | ---- | ------------ |
| tableId | string  | 是   | 表格标识     |
| dynamic | boolean | 否   | 是否动态模式 |

响应：`ApiResponseForSuperlist<GetSubscriptionListResponse>`

2. 更新订阅设置 `excel/updateSubSuperListCriterion`

| 参数名  | 类型    | 必填 | 描述     |
| ------- | ------- | ---- | -------- |
| tableId | string  | 是   | 表格标识 |
| subPush | boolean | 是   | 是否订阅 |
| mail    | string  | 是   | 邮箱     |

响应：`ApiResponseForSuperlist<UpdateSubscriptionResponse>`

3. 获取 CDE 新增公司数 `excel/getCdeNewCompany`

| 参数名  | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| tableId | string | 是   | 表格标识 |

响应：`ApiResponseForSuperlist<GetCDENewCompanyResponse>`

4. 禁用新增公司通知 `excel/disableCdeNewCompanyNotice`

| 参数名  | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| tableId | string | 是   | 表格标识 |

响应：`ApiResponseForSuperlist<DisableCDENewCompanyNoticeResponse>`

---

## @chat/

来源：`src/superlist/chat/*`

### 1. 会话列表

**接口路径**：`conversation/conversationList`

| 参数名   | 类型   | 必填 | 描述     |
| -------- | ------ | ---- | -------- |
| pageNo   | number | 是   | 页码     |
| pageSize | number | 是   | 每页大小 |

**请求示例**：

```json
{ "pageNo": 1, "pageSize": 10 }
```

**响应格式**：[`ApiResponseForSuperlistWithPage<SuperChatHistoryItem>`](../../doc/通用返回数据文档.md)

**响应示例**：

```json
{ "ErrorCode": 0, "ErrorMessage": "OK", "Data": { "list": [], "page": { "pageNo": 1, "pageSize": 10, "total": 0 } } }
```

### 2. 会话详情

**接口路径**：`conversation/conversationDetail`

| 参数名         | 类型   | 必填 | 描述   |
| -------------- | ------ | ---- | ------ |
| conversationId | string | 是   | 会话ID |

响应：`ApiResponseForSuperlist<{ data: { chatId: string; tableId: string } }>`

### 3. 新增会话

**接口路径**：`conversation/addConversation`

请求体：`SuperListAddConversationPayload`（EMPTY_TABLE/CLUE_EXCEL/CDE_FILTER/AI_CHAT/PRESET_QUESTION）

响应：`ApiResponseForSuperlist<{ data: SuperListAddConversationResponse }>`

### 4. 删除会话

**接口路径**：`conversation/delConversation`

| 参数名         | 类型   | 必填 | 描述   |
| -------------- | ------ | ---- | ------ |
| conversationId | string | 是   | 会话ID |

响应：`ApiResponseForSuperlist`

### 5. 重命名会话

**接口路径**：`conversation/renameConversation`

| 参数名           | 类型   | 必填 | 描述     |
| ---------------- | ------ | ---- | -------- |
| conversationId   | string | 是   | 会话ID   |
| conversationName | string | 是   | 新会话名 |

响应：`ApiResponseForSuperlist`

### 6. AI 生成会话名

**接口路径**：`chat/aiRenameConversation`

| 参数名         | 类型   | 必填 | 描述   |
| -------------- | ------ | ---- | ------ |
| conversationId | string | 是   | 会话ID |

响应：`ApiResponseForSuperlist<AiRenameConversationResponse>`

## @credits/

来源：`src/superlist/credits/*`

### 1. 积分变更记录列表

**接口路径**：`points/getPointsChangeList`

| 参数名     | 类型             | 必填 | 描述     |
| ---------- | ---------------- | ---- | -------- |
| pageNo     | number           | 是   | 页码     |
| pageSize   | number           | 是   | 每页大小 |
| changeType | PointsChangeType | 否   | 变更类型 |

响应：[`ApiResponseForChat<GetPointsChangeListResponse>`](../../doc/通用返回数据文档.md)

### 2. 用户剩余积分

**接口路径**：`points/getUserPointsInfo`

请求参数：`{}`

响应：[`ApiResponseForChat<GetUserPointsInfoResponse>`](../../doc/通用返回数据文档.md)

---

## @cde/

来源：`src/superlist/cde/*`

### 1. 结果预览（首页）

**接口路径**：`company/getcrossfilter2`

| 参数名 | 类型                   | 必填 | 描述     |
| ------ | ---------------------- | ---- | -------- |
| -      | getCDEFilterResPayload | 是   | CDE 条件 |

响应：`ApiResponseForSuperlistWithPage<CDEFilterResItem>`

### 2. CDE 数据入表

**接口路径**：`cde/addCDEToTable`

| 参数名         | 类型                   | 必填 | 描述                   |
| -------------- | ---------------------- | ---- | ---------------------- |
| conversationId | string                 | 是   | 会话标识               |
| tableId        | string                 | 是   | 表格标识               |
| sheetId        | string                 | 否   | 目标 Sheet，默认第一个 |
| ...CDE 条件    | getCDEFilterResPayload | 是   | CDE 条件               |

响应：`ApiResponseForSuperlist`

### 3. 更新企业数量

**接口路径**：`cde/getUpdateEnterpriseCount`

| 参数名  | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| tableId | string | 是   | 表格标识 |

响应：`ApiResponseForSuperlist<{ count: number }>`

### 4. 监控组清单

**接口路径**：`cde/getMonitorList`

| 参数名  | 类型   | 必填 | 描述     |
| ------- | ------ | ---- | -------- |
| tableId | string | 是   | 表格标识 |

响应：`ApiResponseForSuperlist<{ list: SuperListCdeMonitor[]; count: number }>`

### 5. 监控数据预览

**接口路径**：`cde/monitorPreview`

| 参数名    | 类型   | 必填 | 描述   |
| --------- | ------ | ---- | ------ |
| monitorId | string | 是   | 监控ID |

响应：`ApiResponseForSuperlist<{ list: SuperListCdeMonitor[] }>`

### 6. 更改推送邮箱

**接口路径**：`cde/updatePushEmail`

| 参数名 | 类型   | 必填 | 描述 |
| ------ | ------ | ---- | ---- |
| email  | string | 是   | 邮箱 |

响应：`ApiResponseForSuperlist`

### 7. 修改监控详情

**接口路径**：`cde/updateMonitorDetail`

| 参数名 | 类型                                        | 必填 | 描述                     |
| ------ | ------------------------------------------- | ---- | ------------------------ |
| -      | `Omit<CDESubscribeItem, 'superQueryLogic'>` | 是   | 无法修改 superQueryLogic |

响应：`ApiResponseForSuperlist`

### 8. 批量开关推送

**接口路径**：`cde/updateMonitorAll`

| 参数名  | 类型    | 必填 | 描述     |
| ------- | ------- | ---- | -------- |
| tableId | string  | 是   | 表格标识 |
| subPush | boolean | 是   | 是否开启 |

响应：`ApiResponseForSuperlist`
