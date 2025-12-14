# Report Content Initial Value 问题

> ✅ **已归档** | 解决时间：2025-02-09 | 严重程度：🟡 中

## 问题概览

| 字段     | 内容                                              |
| -------- | ------------------------------------------------- |
| 问题     | 保存后 TinyMCE 重新应用 initialValue 导致内容闪回 |
| 状态     | ✅ 已解决                                         |
| 优先级   | 🟡 P1                                             |
| 责任人   | -                                                 |
| 发现时间 | 2025-02-08                                        |
| 解决时间 | 2025-02-09                                        |

## 背景与预期

ReportDetail 初始化时通过 `selectCanonicalDocHtml` 生成首帧 HTML，并以 `initialValue` 注入 TinyMCE。保存成功后应只更新 Redux Canonical 层，不应重置编辑器内容。

## 问题陈述

### 现象

保存成功或全量生成完成后，编辑器闪烁并回到旧内容，光标位置和撤销栈同时丢失。

### 根因

`@tinymce/tinymce-react` 在检测到 `initialValue` 变化时调用 `editor.setContent`，触发 `ContentSet` 事件并清空内部历史。

### 影响

- 自动保存频繁触发，出现"保存 → 回滚 → 再保存"的循环
- Streaming 过程中的章节内容被覆盖
- 用户无法撤销到刚才的输入

## 关键参考

| 文档/代码路径                                               | 作用           | 备注             |
| ----------------------------------------------------------- | -------------- | ---------------- |
| `pages/ReportDetail/ReportContent/useEditorInitialValue.ts` | 首帧缓存 Hook  | 核心修复         |
| `pages/ReportDetail/ReportContent/index.tsx`                | 页面侧使用     | 避免属性重写     |
| `store/hooks/useReportContentPersistence.ts`                | 保存成功后写回 | Canonical 层更新 |

## 解决方案

### 方案要点

1. 新增 `useEditorInitialValue` Hook，以 `reportId + loading` 为键缓存首帧 HTML（已完成）
2. 在 `ReportContentInner` 中使用该 Hook（已完成）
3. 更新内容管理文档，明确"首帧缓存 + Hydration"协作流程（已完成）

### 备选方案

完全移除 initialValue，改由 Hydration 首次注水 - 放弃理由：首屏会出现空白闪烁

### 待办事项

- [x] 实现 useEditorInitialValue Hook
- [x] 更新 ReportContent 组件
- [x] 更新内容管理文档
- [ ] 升级 TinyMCE React 前执行回归测试

## 验证与风险

### 验证步骤

1. 手动保存后继续输入，确认无 ContentSet 日志、光标保持原位
2. 开启自动保存并持续输入 90 秒，验证无循环保存及闪烁
3. 触发全文生成，等待 Streaming 完成并再次保存，确认内容稳定

### 剩余风险

- TinyMCE React 后续版本若调整 initialValue 行为需重新验证
- 未来若引入章节增量保存，需要重新审视缓存策略

## 更新日志

| 日期       | 事件 | 描述                                  |
| ---------- | ---- | ------------------------------------- |
| 2025-02-08 | 发现 | 发现保存后编辑器闪回问题              |
| 2025-02-09 | 解决 | 引入 useEditorInitialValue 并更新文档 |

## 附录

核心实现：以 reportId + loading 为键缓存首帧 HTML，仅在首次注水或切换报告时下发 initialValue
