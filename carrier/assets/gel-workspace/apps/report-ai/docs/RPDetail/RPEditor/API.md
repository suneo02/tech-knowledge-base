# API 概览（设计向）

> 说明：本文用于对齐 RPEditor 当前使用的基础接口约定，字段含义以 `packages/gel-api` 中的定义为准。后续若接口能力扩展，请同步更新。

## 契约基础

- 所有接口均返回 `ApiResponseForChat<T>`，核心业务数据位于 `result` 字段，`message` 为最终提示文案，`ErrorCode` 仅在业务错误时使用。
- 保存链路不做基线哈希或版本号校验，默认“最新写入生效”；若前端需要冲突保护，可在上层自行串行化或追加比对。
- 服务端负责分配章节正式 ID。新增节点需在请求中显式标记 `isNew=true`，并携带一个临时 `chapterId`（通常为负数或自定义前缀）；保存成功后，响应中的 `idMap` 给出“临时 → 正式”映射。
- 响应约定：
  - 成功：HTTP `200`，`ErrorCode` 为空或 `0`；
  - 业务失败：HTTP `200`，结合 `ErrorCode` + `message` 描述原因；
  - 系统异常：HTTP `500` 及以上。

## 核心数据结构

沿用 `packages/gel-api/src/chat/report/index.ts` 与 `.../types/report` 中的定义：

```ts
export interface ReportDetailChapterInfo {
  id: string;
  name: string;
  chapters: RPDetailChapter[];
}

export type RPDetailChapter = {
  chapterId: number;
  title: string;
  writingThought: string;
  keywords?: string[];
  content?: string; // HTML 或 Markdown，取决于 contentType
  contentType?: 'md' | 'html';
  refTable?: DPUItem[];
  refSuggest?: RAGItem[];
  file?: RPFileTraced[];
  children?: RPDetailChapter[];
};

export type ReportDetailChapterSave = RPDetailChapter & {
  isNew?: boolean; // 仅保存请求使用，true 表示需后端生成正式 ID
};
```

> 保存接口直接接收完整章节树（`ReportDetailChapterSave[]`）；根节点为章节数组，`children` 描述层级关系。已有章节 `chapterId` 使用服务端下发的正式 ID；新增章节设置 `isNew=true`，并使用临时 `chapterId` 便于回写。

## 核心接口

### `GET /api/report/query` (`report/query`)

- **请求参数**：`reportId`（在请求头或 query 中传递，沿用现有实现）。
- **响应**：`result` 为 `ReportDetailChapterInfo`，包含报告元信息及章节树。生成中的章节、附属资源等均透传在 `RPDetailChapter` 内。

### `POST /api/reportChapter/batchUpdateChapterTree` (`reportChapter/batchUpdateChapterTree`)

- **请求体**：
  ```json
  {
    "reportId": "string",
    "chapters": [
      {
        "chapterId": 1,
        "title": "绪论",
        "writingThought": "...",
        "content": "<p>...</p>"
      },
      {
        "chapterId": -1001,
        "title": "新增章节",
        "writingThought": "...",
        "content": "<p>draft</p>",
        "isNew": true
      }
    ]
  }
  ```
- **说明**：
  - `chapters` 为完整树，保存时整体覆盖；
  - 新增节点必须标记 `isNew=true`，并使用在当前会话内唯一的临时 `chapterId`（建议为负数或 `tmp-*` 前缀字符串）；
  - 其余字段（标题、内容、引用等）按需透传，服务端直接落库。
- **响应**：
  ```json
  {
    "result": {
      "idMap": {
        "-1001": 102
      }
    },
    "message": "保存成功"
  }
  ```
  - `idMap` 仅在存在新增章节时返回；键为提交时的临时 `chapterId`，值为服务端生成的正式 ID。
  - 前端需在收到 `idMap` 后，更新本地大纲树、编辑器状态及任何依赖章节 ID 的缓存，并移除对应节点的 `isNew` 标记。

## 其他接口（简要）

- `POST /api/report/template/save` (`report/template/save`)
  - **请求体**：`{ reportId: string; templateName: string }`
  - **说明**：按现有实现直接落库报告快照，无附加状态机；响应 `result` 为空，成功与否取决于 `ErrorCode`。
- `POST /api/report/createReportFile` (`report/createReportFile`)
  - **请求体**：`{ reportId: string; html: string }`
  - **说明**：使用给定 HTML 导出文档，返回 `result = { id: string; createDate: string }` 供后续下载。

> 导出、模板保存目前保持轻量实现，若未来引入异步任务或参数扩展，可在新增文档中补充细节。

## 使用提示

- 保存前请确保树结构顺序正确、层级闭合，避免服务端覆盖后造成拓扑错误。
- 新增章节需同时满足“临时 ID 唯一”与 `isNew=true`，以便后端生成正式 ID 并通过 `idMap` 反馈前端。
- 错误展示统一读取 `message`；如需区分提示类型，可在 `ErrorCode` 上约定类别。
