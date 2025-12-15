# Document 模块

文档级 HTML 解析、渲染与编辑器操作，负责完整报告内容的结构化处理。

## 目录结构

```
document/
├── index.ts          # 模块导出
├── parse.ts          # HTML → 章节树解析（含临时章节识别）
├── parse.test.ts     # 解析逻辑单元测试
├── render.ts         # 章节树 → HTML 渲染（含报告标题）
├── ops.ts            # 编辑器内容设置操作
└── README.md         # 本文档
```

## 核心文件

| 文件        | 职责                                                         | 关键导出                                  |
| ----------- | ------------------------------------------------------------ | ----------------------------------------- |
| `parse.ts`  | 解析 TinyMCE 导出的完整 HTML，生成章节树（自动识别新增章节） | `parseDocumentChapterTree`                |
| `render.ts` | 将章节数据渲染为完整 HTML（含报告标题）                      | `renderFullDocument`、`renderReportTitle` |
| `ops.ts`    | 编辑器内容全量替换（注水操作）                               | `setEditorContent`                        |

## 依赖关系

```
document/
├── 依赖 → chapter/parse（章节级内容解析）
├── 依赖 → chapter/factory（临时 ID 生成）
├── 依赖 → foundation（HTML 数据属性常量）
├── 依赖 → editor/editorFacade（编辑器实例）
└── 被依赖 ← reportContentStore（报告内容状态管理）
```

## 相关文档

- [数据与状态管理](../../../docs/RPDetail/ContentManagement/data-layer-guide.md) - 编辑器注水策略与内容同步
- [章节保存流程](../../../docs/shared/chapter-save-flow.md) - 临时章节 ID 映射与保存逻辑
- [Chapter 模块](../../chapter/README.md) - 章节级数据结构与工厂函数
- [Editor 模块](../editor/README.md) - 编辑器实例封装与操作接口
