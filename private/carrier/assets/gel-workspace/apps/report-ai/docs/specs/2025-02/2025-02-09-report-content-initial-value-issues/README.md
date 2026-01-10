# Report Content Initial Value 问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | 保存后 TinyMCE 重新应用 initialValue 导致内容闪回 |
| 负责人 | AIGC前端组 |
| 上线目标 | 修复保存后编辑器内容闪回问题，确保用户体验流畅 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/archived/report-content-initial-value-issues.md) |
| 状态 | ✅ 已完成 |

## 背景与上下文

ReportDetail 初始化时通过 `selectCanonicalDocHtml` 生成首帧 HTML，并以 `initialValue` 注入 TinyMCE。保存成功后应只更新 Redux Canonical 层，不应重置编辑器内容。

然而，`@tinymce/tinymce-react` 在检测到 `initialValue` 变化时调用 `editor.setContent`，触发 `ContentSet` 事件并清空内部历史，导致保存成功或全量生成完成后，编辑器闪烁并回到旧内容，光标位置和撤销栈同时丢失。

## 需求提炼

### 必达能力
1. 修复保存后编辑器内容闪回问题
2. 保持光标位置和撤销栈不被清空
3. 避免自动保存频繁触发，防止"保存 → 回滚 → 再保存"的循环
4. 确保Streaming过程中的章节内容不被覆盖
5. 维护现有功能不受影响

### 约束条件
1. 不影响现有功能
2. 保持用户体验一致
3. 确保修复过程中系统稳定性
4. 与TinyMCE React版本兼容
5. 不引入新的性能问题

## 方案设计

### 问题根因
1. **initialValue变化触发重置**：`@tinymce/tinymce-react` 在检测到 `initialValue` 变化时调用 `editor.setContent`
2. **ContentSet事件清空历史**：`editor.setContent` 触发 `ContentSet` 事件并清空内部历史
3. **光标位置丢失**：内容重置导致光标位置回到初始位置
4. **撤销栈清空**：内容重置导致撤销操作历史被清空

### 解决方案设计
**核心思路**：新增 `useEditorInitialValue` Hook，以 `reportId + loading` 为键缓存首帧 HTML，避免 initialValue 变化触发重置。

1. **创建缓存Hook**：
   - 实现 `useEditorInitialValue` Hook，以 `reportId + loading` 为键缓存首帧 HTML
   - 确保只有在首次注水或切换报告时才更新 initialValue

2. **修改ReportContent组件**：
   - 在 `ReportContentInner` 中使用该 Hook 替代直接使用 `selectCanonicalDocHtml`
   - 避免属性重写导致的 initialValue 变化

3. **更新内容管理文档**：
   - 明确"首帧缓存 + Hydration"协作流程
   - 记录 initialValue 的正确使用方式

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | --- | --- |
| 1. 创建缓存Hook | hooks | useEditorInitialValue | 已完成 | 2025-02-09 |
| 2. 修改ReportContent组件 | components | ReportContentInner | 已完成 | 2025-02-09 |
| 3. 更新内容管理文档 | docs | 内容管理文档 | 已完成 | 2025-02-09 |
| 4. 测试验证 | test | 验证修复效果 | 已完成 | 2025-02-09 |

## 验收记录

### 功能验收用例
1. **手动保存验证**：手动保存后继续输入，确认无 ContentSet 日志、光标保持原位
2. **自动保存验证**：开启自动保存并持续输入 90 秒，验证无循环保存及闪烁
3. **全文生成验证**：触发全文生成，等待 Streaming 完成并再次保存，确认内容稳定
4. **切换报告验证**：切换不同报告，确认编辑器内容正确加载
5. **撤销操作验证**：编辑内容后保存，确认撤销功能正常工作

### 非功能风险
- TinyMCE React 后续版本若调整 initialValue 行为需重新验证
- 未来若引入章节增量保存，需要重新审视缓存策略
- 缓存机制可能增加内存使用

## 实现说明

### 与设计差异
- 完全按照设计方案实现，无差异

### 关键PR
- 暂无，待补充

### 可复用经验
1. 缓存机制是解决 initialValue 变化问题的有效方法
2. 合理的缓存键设计可以确保缓存的有效性
3. 文档更新是确保团队正确使用API的重要环节
4. 全面的测试用例是确保修复效果的关键

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-02-08 | AIGC前端组 | 发现保存后编辑器闪回问题 |
| 2025-02-09 | AIGC前端组 | 引入 useEditorInitialValue 并更新文档，问题已解决 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已完成  
**创建时间**：2025-02-09  
**优先级**：🟡 中  
**影响范围**：报告编辑器、内容保存、自动保存功能  
**预估工期**：1 人日  
**实际工期**：1 人日