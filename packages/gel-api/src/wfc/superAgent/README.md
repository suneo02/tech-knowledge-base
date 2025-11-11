## 超级名单Agent接口文档

### 新的目录结构（对齐 `@/super` 风格）

```
src/wfc/superAgent/
├── base/                 # 基础类型与API映射（Agent领域通用定义）
│   ├── types.ts          # 类型定义（请求/响应/公共结构）
│   ├── api.ts            # API 路径与类型映射
│   └── index.ts          # 基础模块导出
├── README.md             # 当前文档
└── index.ts              # 聚合导出（预留：可聚合更多领域）
```

---

## 1. 接口生成规范

### 1.1 请求规范

- **请求方式**：统一使用POST方法
- **Content-Type**：application/json
- **编码格式**：UTF-8
- **请求参数**：统一使用JSON格式，放在请求体中

### 1.2 响应规范

- **响应格式**：统一JSON格式
- **编码格式**：UTF-8
- **时间格式**：yyyy-MM-dd HH:mm:ss

### 1.3 标准响应结构

```json
{
  "Data": {},
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {
    "CurrentPage": 1,
    "PageSize": 20,
    "Records": 100,
    "TotalPage": 5
  },
  "State": 0
}
```

### 1.4 任务状态定义

| 状态码 | 说明   |
| ------ | ------ |
| 1      | 排队   |
| 2      | 进行中 |
| 3      | 成功   |
| 4      | 失败   |
| 5      | 终止   |

### 1.5 接口生成要求

1. 所有接口都按照上述响应结构生成
2. 分页接口必须包含完整的Page字段
3. 非分页接口Page字段为空对象{}
4. 业务数据放在Data字段中
5. 错误处理遵循团队内部约定
6. 时间字段统一使用yyyy-MM-dd HH:mm:ss格式

---

## 2. 接口列表

### 2.1 任务列表查询接口

#### 接口信息

- **接口名称**：获取任务列表
- **请求方式**：POST
- **接口路径**：`/Enterprise/gel/operation/get/splAgentTaskList`
- **Content-Type**：application/json

#### 请求参数

```json
{
  "status": 1,
  "pageNum": 1,
  "pageSize": 20
}
```

#### 请求参数说明

| 参数名   | 类型    | 必填 | 说明                                                         | 示例 |
| -------- | ------- | ---- | ------------------------------------------------------------ | ---- |
| status   | Integer | 否   | 状态筛选：1-排队 2-进行中 3-成功 4-失败 5-终止，不传查询全部 | 1    |
| pageNum  | Integer | 是   | 页码，从1开始                                                | 1    |
| pageSize | Integer | 是   | 页大小，最大100                                              | 20   |

#### 请求示例

```http
POST /Enterprise/gel/operation/get/splAgentTaskList
Content-Type: application/json

{
  "pageNum": 1,
  "pageSize": 20
}
```

#### 响应参数

| 参数名       | 类型    | 说明           |
| ------------ | ------- | -------------- |
| Data         | Object  | 业务数据       |
| ErrorCode    | String  | 错误码：0-成功 |
| ErrorMessage | String  | 错误消息       |
| Page         | Object  | 分页信息       |
| State        | Integer | 状态码         |

#### Data字段结构

| 参数名 | 类型  | 说明     |
| ------ | ----- | -------- |
| tasks  | Array | 任务列表 |

#### tasks数组元素结构

| 参数名     | 类型    | 说明                                |
| ---------- | ------- | ----------------------------------- |
| taskId     | Long    | 任务ID                              |
| taskName   | String  | 任务名称                            |
| areaCode   | String  | 区域代码                            |
| status     | Integer | 状态码                              |
| createTime | String  | 创建时间，格式：yyyy-MM-dd HH:mm:ss |

#### 响应示例

```json
{
  "Data": {
    "tasks": [
      {
        "taskId": 123,
        "taskName": "客户挖掘任务",
        "areaCode": "03010101",
        "status": 2,
        "createTime": "2025-01-15 10:30:00"
      },
      {
        "taskId": 124,
        "taskName": "潜在客户分析",
        "areaCode": "03010101",
        "status": 1,
        "createTime": "2025-01-15 10:35:00"
      }
    ]
  },
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {
    "CurrentPage": 1,
    "PageSize": 20,
    "Records": 2,
    "TotalPage": 1
  },
  "State": 0
}
```

---

### 2.2 任务提交接口

#### 接口信息

- **接口名称**：提交挖掘任务
- **请求方式**：POST
- **接口路径**：`/Enterprise/gel/operation/add/splAgentTaskSubmit`
- **Content-Type**：application/json

#### 请求参数

```json
{
  "companyCode": "1047934153",
  "areaCodes": ["03010101"],
  "productDesc": "智能家居产品"
}
```

#### 请求参数说明

| 参数名      | 类型   | 必填 | 说明                   | 示例           |
| ----------- | ------ | ---- | ---------------------- | -------------- |
| companyCode | String | 是   | 公司代码               | "1047934153"   |
| areaCodes   | Array  | 是   | 区域代码列表，最多10个 | ["03010101"]   |
| productDesc | String | 否   | 产品描述，最多1万字    | "智能家居产品" |

#### 响应参数

| 参数名       | 类型    | 说明     |
| ------------ | ------- | -------- |
| Data         | Object  | 业务数据 |
| ErrorCode    | String  | 错误码   |
| ErrorMessage | String  | 错误消息 |
| Page         | Object  | 空对象{} |
| State        | Integer | 状态码   |

#### Data字段结构

| 参数名  | 类型   | 说明             |
| ------- | ------ | ---------------- |
| groupId | String | 分组ID           |
| taskIds | Array  | 创建的任务ID列表 |

#### 响应示例

```json
{
  "Data": {
    "groupId": "GRP20250115001",
    "taskIds": [123, 124]
  },
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {},
  "State": 0
}
```

---

### 2.3 任务详情查询接口

#### 接口信息

- **接口名称**：获取任务详情
- **请求方式**：POST
- **接口路径**：`/Enterprise/gel/operation/get/splAgentTaskDetail`
- **Content-Type**：application/json

#### 请求参数

```json
{
  "taskId": 123
}
```

#### 请求参数说明

| 参数名 | 类型 | 必填 | 说明   | 示例 |
| ------ | ---- | ---- | ------ | ---- |
| taskId | Long | 是   | 任务ID | 123  |

#### 响应参数

| 参数名       | 类型    | 说明     |
| ------------ | ------- | -------- |
| Data         | Object  | 业务数据 |
| ErrorCode    | String  | 错误码   |
| ErrorMessage | String  | 错误消息 |
| Page         | Object  | 空对象{} |
| State        | Integer | 状态码   |

#### Data字段结构

| 参数名      | 类型   | 说明         |
| ----------- | ------ | ------------ |
| currentTask | Object | 当前任务详情 |
| groupTasks  | Array  | 分组任务列表 |

#### currentTask结构

| 参数名        | 类型    | 说明       |
| ------------- | ------- | ---------- |
| taskId        | Long    | 任务ID     |
| taskName      | String  | 任务名称   |
| areaCode      | String  | 区域代码   |
| status        | Integer | 状态码     |
| progress      | Integer | 进度百分比 |
| customerCount | Integer | 客户数量   |
| logs          | Array   | 日志列表   |
| createTime    | String  | 创建时间   |

#### logs数组元素结构

| 参数名  | 类型   | 说明     |
| ------- | ------ | -------- |
| time    | String | 日志时间 |
| content | String | 日志内容 |

#### groupTasks数组元素结构

| 参数名        | 类型    | 说明       |
| ------------- | ------- | ---------- |
| taskId        | Long    | 任务ID     |
| taskName      | String  | 任务名称   |
| areaCode      | String  | 区域代码   |
| status        | Integer | 状态码     |
| progress      | Integer | 进度百分比 |
| customerCount | Integer | 客户数量   |

#### 响应示例

```json
{
  "Data": {
    "currentTask": {
      "taskId": 123,
      "taskName": "客户挖掘任务",
      "areaCode": "03010101",
      "status": 2,
      "progress": 60,
      "customerCount": 0,
      "logs": [
        {
          "time": "2025-01-15 10:30:00",
          "content": "任务开始执行"
        },
        {
          "time": "2025-01-15 10:35:00",
          "content": "本企业信息获取完成"
        }
      ],
      "createTime": "2025-01-15 10:30:00"
    },
    "groupTasks": [
      {
        "taskId": 123,
        "taskName": "客户挖掘任务",
        "areaCode": "03010101",
        "status": 2,
        "progress": 60,
        "customerCount": 0
      },
      {
        "taskId": 124,
        "taskName": "潜在客户分析",
        "areaCode": "03010101",
        "status": 1,
        "progress": 0,
        "customerCount": 0
      }
    ]
  },
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {},
  "State": 0
}
```

---

### 2.4 任务终止接口

#### 接口信息

- **接口名称**：终止任务
- **请求方式**：POST
- **接口路径**：`/Enterprise/gel/operation/update/splAgentTaskTerminate`
- **Content-Type**：application/json

#### 请求参数

```json
{
  "taskId": 123
}
```

#### 请求参数说明

| 参数名 | 类型 | 必填 | 说明   | 示例 |
| ------ | ---- | ---- | ------ | ---- |
| taskId | Long | 是   | 任务ID | 123  |

#### 响应参数

| 参数名       | 类型    | 说明     |
| ------------ | ------- | -------- |
| Data         | Object  | 空对象{} |
| ErrorCode    | String  | 错误码   |
| ErrorMessage | String  | 错误消息 |
| Page         | Object  | 空对象{} |
| State        | Integer | 状态码   |

#### 响应示例

```json
{
  "Data": {},
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {},
  "State": 0
}
```

---

### 2.5 任务重试接口

#### 接口信息

- **接口名称**：重试任务
- **请求方式**：POST
- **接口路径**：`/Enterprise/gel/operation/update/splAgentTaskRetry`
- **Content-Type**：application/json

#### 请求参数

```json
{
  "taskId": 123
}
```

#### 请求参数说明

| 参数名 | 类型 | 必填 | 说明   | 示例 |
| ------ | ---- | ---- | ------ | ---- |
| taskId | Long | 是   | 任务ID | 123  |

#### 响应参数

| 参数名       | 类型    | 说明     |
| ------------ | ------- | -------- |
| Data         | Object  | 空对象{} |
| ErrorCode    | String  | 错误码   |
| ErrorMessage | String  | 错误消息 |
| Page         | Object  | 空对象{} |
| State        | Integer | 状态码   |

#### 响应示例

```json
{
  "Data": {},
  "ErrorCode": "0",
  "ErrorMessage": "",
  "Page": {},
  "State": 0
}
```

