# 流式生成触发 Content Change 和自动保存问题

## 问题概览

| 字段         | 内容                                                     |
| ------------ | -------------------------------------------------------- |
| 问题         | 流式生成结束时触发 content change 事件，导致频繁自动保存 |
| 状态         | ✅ 已解决                                                |
| 优先级       | 🟡 P1                                                    |
| 责任人       | -                                                        |
| 发现时间     | 2025-10-22                                               |
| 预期解决时间 | 2025-10-27                                               |

## 背景与预期

流式生成章节内容时，内容会实时更新到编辑器。生成结束后执行 `chapter-rehydrate` 注水任务，应该不触发 content change 事件和自动保存。

## 问题陈述

### 现象

流式生成结束时，`chapter-rehydrate` 任务更新章节内容，触发 DOM 同步，进而触发编辑器 `change` 事件，导致频繁自动保存。

### 根因

`updateChapterContent` 调用 `requestDomSync()` 触发 DOM 同步，DOM 同步修改节点后触发编辑器 `change` 事件，`onContentChange` 回调更新 `documentDraft.lastSyncAt`，触发自动保存逻辑。

### 影响

- 性能浪费：流式生成期间频繁触发保存请求
- 服务器压力：大量无意义的保存请求
- 状态混乱：无法区分用户编辑和程序注水
- 用户体验：保存状态频繁变化

## 关键参考

| 文档/代码路径                                                                 | 作用         | 备注                                   |
| ----------------------------------------------------------------------------- | ------------ | -------------------------------------- |
| `domain/reportEditor/editor/editorFacade.ts`                                  | 静默执行入口 | 新增 `undoManager.ignore` 封装         |
| `components/ReportEditor/hooks/useReportEditorRef.ts`                         | 注水更新     | `setFullContent` / `updateChapterContent` / `updateStreamingSection` 静默写入 |
| `components/ReportEditor/hooks/useEditorDomSync.ts`                           | DOM 同步     | 支持 `silent` 选项，确保同步过程静默   |
| `store/reportContentStore/hooks/rehydration/useHydrationExecutor.ts`          | 任务执行     | 调用 `updateChapterContent` 完成注水   |
| `components/ReportEditor/config/editorConfig.ts`                              | 自动保存触发 | 用户输入仍通过 `onContentChange` 触发  |

## 解决方案

### 方案要点

1. 在 EditorFacade 中新增 `undoManager.ignore` 封装，将注水操作置于静默事务。
2. `setFullContent` / `updateChapterContent` / `updateStreamingSection` 统一进入静默事务执行写入，并通过 `requestDomSync({ silent: true })` 触发静默 DOM 同步。
3. `useEditorDomSync` 支持 `silent` 模式，静默补齐章节 ID、序号，避免触发 `change` 事件和自动保存。

### 备选方案

延迟 DOM 同步到注水完成后统一执行 - 放弃理由：可能导致编辑器状态不一致

### 待办事项

- [x] EditorFacade 新增静默执行 `ignore` 方法
- [x] 注水阶段通过 `editor.ignore` + `requestDomSync({ silent: true })` 执行（覆盖 `setFullContent` / `updateChapterContent` / `updateStreamingSection`）
- [x] DOM 同步 hook 支持 `silent` 模式
- [x] 验证流式生成期间不触发保存
- [x] 验证用户编辑仍正常触发保存

## 验证与风险

### 验证步骤

1. 触发全文生成，观察保存状态不应频繁变化
2. 流式生成期间手动编辑，验证仍能正常保存
3. 检查网络请求，确认无多余保存请求

### 剩余风险

- 标记管理不当可能导致保存功能失效
- 需要确保所有注水路径都正确设置标记

## 更新日志

| 日期       | 事件 | 描述                               |
| ---------- | ---- | ---------------------------------- |
| 2025-10-22 | 创建 | 初始创建，识别流式生成触发保存问题 |
| 2025-10-27 | 修复 | 注水阶段进入 undo ignore + 静默 DOM 同步 |
| 2025-10-27 | 关闭 | 验证完成，标记 issue resolved           |

## 附录

调用链路：

```
流式生成完成 → chapter-rehydrate 任务 → `editor.ignore(updateChapterContent)`
→ `requestDomSync({ silent: true })` → useEditorDomSync 静默同步
→ DOM 更新（不触发 change）→ 用户编辑仍通过 onContentChange 触发保存
```

关键节点：

- `EditorFacade.ignore`: 注水期间静默处理 DOM 操作
- `useReportEditorRef`: 在静默事务中更新章节并触发静默 DOM 同步
- `useEditorDomSync`: 静默补齐章节 ID/序号
- `useEditorDraftSync`: 用户输入仍通过该 Hook 同步草稿与自动保存
