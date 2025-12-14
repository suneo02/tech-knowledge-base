# 文本 AI 重写变更保存触发问题

## 问题简述

文本 AI 重写功能在用户确认应用改写结果后，未正确触发编辑器的变更事件和自动保存。

## 核心问题

1. **变更事件未触发**：替换内容后 TinyMCE 的 `change` 事件未触发
2. **脏状态未更新**：编辑器 `hasDirty` 状态保持为 `false`
3. **自动保存失效**：导致用户修改的内容无法自动保存

## 相关文件

### 实现文件
- `apps/report-ai/src/hooks/useTextRewrite.ts` - 文本改写 Hook（主要修复位置）
- `apps/report-ai/src/pages/RPDetail/RPEditor/` - 编辑器模块

### 相关文档
- [文本 AI 重写流程实现](../archived/text-ai-rewrite-implementation/README.md) - 原始实现
- [详细问题分析](./spec-require-v1.md)

## 修复方向

在内容替换时使用 TinyMCE 的事务 API 确保事件正确触发：

```typescript
editor.undoManager.transact(() => {
  editor.selection.setContent(rewrittenContent);
});
```

## 更新记录

| 日期       | 修改人 | 更新内容 |
| ---------- | ------ | -------- |
| 2025-11-04 | Codex  | 创建问题简述 |