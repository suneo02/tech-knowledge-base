# 章节编号节点被 TinyMCE 过滤问题

> ✅ **已归档** | 解决时间：2025-02-14 | 严重程度：🔴 高

## 问题概览

| 字段     | 内容                                        |
| -------- | ------------------------------------------- |
| 问题     | 章节编号节点在 setContent 时被 TinyMCE 过滤 |
| 状态     | ✅ 已解决                                   |
| 优先级   | 🔴 P0                                       |
| 责任人   | -                                           |
| 发现时间 | 2025-02-14                                  |
| 解决时间 | 2025-02-14                                  |

## 背景与预期

`createTitleHtml` 生成的章节编号节点应该在通过 `editor.setContent()` 注入到 TinyMCE 时正常显示，保存时由 `contentSanitizer` 移除。

## 问题陈述

### 现象

编号节点（`<span data-gel-external="chapter-number">1.2.3 </span>`）在 `setContent` 时被过滤掉，页面中看不到编号。

### 根因

编号节点包含 `data-mce-bogus="1"` 属性，TinyMCE 在 `setContent` 时会自动过滤带此属性的节点。

### 影响

- 所有章节编号无法显示
- 用户无法看到章节层级结构

## 关键参考

| 文档/代码路径                                     | 作用             | 备注                   |
| ------------------------------------------------- | ---------------- | ---------------------- |
| `domain/reportEditor/shared/chapterNumberNode.ts` | 编号节点属性定义 | 移除 data-mce-bogus    |
| `domain/reportEditor/editor/contentSanitizer.ts`  | 内容清洗工具     | 保存时移除外部渲染节点 |

## 解决方案

### 方案要点

1. 移除编号节点的 `data-mce-bogus` 属性（已完成）
2. 保持 `data-gel-external` 属性标记为外部渲染节点（已完成）
3. 保存时由 `contentSanitizer` 移除编号节点（已完成）

### 待办事项

- [x] 移除 data-mce-bogus 属性
- [x] 验证编号正常显示
- [x] 验证保存时正确移除

## 验证与风险

### 验证步骤

1. 调用 createTitleHtml 生成 HTML
2. 通过 setContent 注入编辑器，验证编号显示
3. 调用 getCleanContentForExport，验证编号被移除

### 剩余风险

- 无，修复方案安全可靠

## 更新日志

| 日期       | 事件 | 描述                     |
| ---------- | ---- | ------------------------ |
| 2025-02-14 | 解决 | 移除 data-mce-bogus 属性 |

## 附录

关键教训：

- 不要滥用 TinyMCE 的内部属性（如 data-mce-bogus）
- 外部渲染节点应该在业务层清洗，而不是依赖编辑器自动过滤
- 充分理解工具的行为再使用
