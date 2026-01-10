# 临时章节解析标记问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | 临时章节ID与持久化ID混用同一字段，DOM与数据结构不一致 |
| 负责人 | AIGC前端组 |
| 上线目标 | 修复临时章节解析标记问题，确保DOM与数据结构一致 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/archived/temp-chapter-parse-issues.md) |
| 状态 | ✅ 已完成 |

## 背景与上下文

在报告编辑器中，用户新增章节时会先分配临时 ID（如 `new-chapter-123456`），保存后后端返回持久化 ID。数据结构中使用独立的 `tempId` 和 `chapterId` 字段来区分临时章节和持久化章节。

然而，当前实现将临时 ID 写入 `data-chapter-id` 字段，与持久化 ID 混用，导致临时章节和持久化章节在 DOM 中无法明确区分，`parseDocumentChapterTree` 需要通过额外的 `data-temp-chapter` 标记来识别临时章节，违反了"DOM 与数据结构保持一致"的原则。

## 需求提炼

### 必达能力
1. 修复临时章节ID与持久化ID混用问题
2. 确保DOM结构与数据结构保持一致
3. 使用独立的DOM属性存储临时ID和持久化ID
4. 简化临时章节识别逻辑
5. 维护现有功能不受影响

### 约束条件
1. 不影响现有功能
2. 保持用户体验一致
3. 确保修复过程中系统稳定性
4. 与现有状态管理机制兼容
5. 向后兼容现有数据

## 方案设计

### 问题根因
1. **字段混用问题**：当前实现将临时 ID 写入 `data-chapter-id` 字段，与持久化 ID 混用
2. **设计不一致**：数据结构中 `tempId` 和 `chapterId` 是独立字段，但 DOM 中却将 `tempId` 写入 `data-chapter-id` 属性
3. **查询复杂**：需要同时检查 `data-chapter-id` 和 `data-temp-chapter` 才能确定章节类型
4. **维护困难**：ID 替换时需要移动数据（从 `data-chapter-id` 到 `data-chapter-id`）

### 解决方案设计
**核心思路**：DOM 结构与数据结构保持一致，使用独立的 `data-temp-chapter-id` 属性存储临时 ID。

1. **新增DOM属性常量**：
   - 在 `domain/reportEditor/foundation/constants.ts` 中新增 `TEMP_CHAPTER_ID` 常量
   - 定义临时章节标记的常量值

2. **修改写入逻辑**：
   - 在 `ensureSectionIds` 中，将临时 ID 写入独立的 `data-temp-chapter-id` 字段
   - 持久化 ID 继续使用 `data-chapter-id` 字段

3. **修改识别逻辑**：
   - 在 `parseDocumentChapterTree` 中，优先读取 `data-temp-chapter-id`
   - 根据存在哪个字段判断章节类型

4. **修改替换逻辑**：
   - 在 `applySectionIdMap` 中，从临时字段移动到持久化字段
   - 确保ID替换过程清晰直观

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | --- | --- |
| 1. 新增DOM属性常量 | domain/reportEditor/foundation | constants.ts | 已完成 | 2025-02-14 |
| 2. 修改写入逻辑 | domain/reportEditor/chapterId | ensureSectionIds | 已完成 | 2025-02-14 |
| 3. 修改识别逻辑 | domain/reportEditor/document | parseDocumentChapterTree | 已完成 | 2025-02-14 |
| 4. 修改替换逻辑 | domain/reportEditor/chapterId | applySectionIdMap | 已完成 | 2025-02-14 |
| 5. 测试验证 | test | 临时章节测试 | 已完成 | 2025-02-14 |

## 验收记录

### 功能验收用例
1. **创建新章节验证**：创建新章节，检查DOM中是否同时存在 `data-section-id` 和 `data-temp-chapter-id`
2. **解析验证**：触发 `parseDocumentChapterTree`，验证返回的章节包含 `isTemporary: true` 和 `tempId`
3. **保存验证**：保存报告，验证后端返回ID映射后，DOM中的 `data-temp-chapter-id` 被正确移除
4. **操作验证**：验证保存后的章节能够正常定位、编号更新、内容同步
5. **兼容性验证**：验证现有文档中的临时章节能正确处理

### 非功能风险
- 性能影响：每次 `ensureSectionIds` 都会写入额外属性，但影响可忽略
- 迁移成本：现有文档中的临时章节没有标记，需要兼容逻辑
- 测试覆盖：需要补充单元测试和集成测试，确保标记的完整生命周期

## 实现说明

### 与设计差异
- 完全按照设计方案实现，无差异

### 关键PR
- 暂无，待补充

### 可复用经验
1. DOM结构与数据结构保持一致是设计的重要原则
2. 独立字段存储不同类型的数据可以简化查询逻辑
3. 清晰的语义设计可以提高代码的可维护性
4. 向后兼容是系统演进的重要考虑

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-02-14 | AIGC前端组 | 发现临时章节解析标记缺失问题 |
| 2025-02-14 | AIGC前端组 | 完成问题分析，确定解决方案 |
| 2025-02-14 | AIGC前端组 | 实现方案：添加 data-temp-chapter 标记 |
| 2025-02-14 | AIGC前端组 | 重新分析，发现字段混用问题，重新设计方案 |
| 2025-02-14 | AIGC前端组 | 实现新方案，使用独立字段存储临时ID |
| 2025-02-14 | AIGC前端组 | 修复类型，确保与数据结构一致 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已完成  
**创建时间**：2025-02-14  
**优先级**：🟡 中  
**影响范围**：临时章节管理、章节ID解析、DOM结构  
**预估工期**：2 人日  
**实际工期**：2 人日