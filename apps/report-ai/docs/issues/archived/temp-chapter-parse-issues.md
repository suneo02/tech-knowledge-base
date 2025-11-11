# 临时章节解析标记问题

## 问题概览

| 字段     | 内容                                                       |
| -------- | ---------------------------------------------------------- |
| 问题     | 临时章节 ID 与持久化 ID 混用同一字段，DOM 与数据结构不一致 |
| 状态     | ✅ 已解决                                                  |
| 优先级   | 🟡 P1                                                      |
| 责任人   | -                                                          |
| 发现时间 | 2025-02-14                                                 |
| 解决时间 | 2025-02-14                                                 |

## 背景与预期

在报告编辑器中，用户新增章节时会先分配临时 ID（如 `new-chapter-123456`），保存后后端返回持久化 ID。数据结构中使用独立的 `tempId` 和 `chapterId` 字段来区分临时章节和持久化章节。

预期行为：

- DOM 结构与数据结构保持一致
- 临时章节使用 `data-temp-chapter-id` 存储临时 ID
- 持久化章节使用 `data-chapter-id` 存储持久化 ID
- 两个字段互斥，不混用

## 问题陈述

### 现象

1. 当前实现将临时 ID 写入 `data-chapter-id` 字段，与持久化 ID 混用
2. 临时章节和持久化章节在 DOM 中无法明确区分
3. `parseDocumentChapterTree` 需要通过额外的 `data-temp-chapter` 标记来识别临时章节
4. 数据结构中有独立的 `tempId` 和 `chapterId` 字段，但 DOM 中没有对应的独立属性

### 根因

**字段混用问题**：

```
数据结构：
  临时章节: { tempId: "new-chapter-123", isTemporary: true, chapterId: undefined }
  持久章节: { chapterId: "789", isTemporary: false, tempId: undefined }

当前 DOM：
  临时章节: data-chapter-id="new-chapter-123" + data-temp-chapter="true"
  持久章节: data-chapter-id="789"

问题：临时 ID 占用了 chapterId 字段，字段语义不清晰
```

**设计不一致**：

- 数据结构中 `tempId` 和 `chapterId` 是独立字段
- DOM 中却将 `tempId` 写入 `data-chapter-id` 属性
- 需要额外的 `data-temp-chapter` 标记来区分，增加复杂度
- 违反了"DOM 与数据结构保持一致"的原则

### 影响

- 字段语义混乱：`data-chapter-id` 既可能是临时 ID，也可能是持久化 ID
- 查询复杂：需要同时检查 `data-chapter-id` 和 `data-temp-chapter` 才能确定章节类型
- 维护困难：ID 替换时需要移动数据（从 `data-chapter-id` 到 `data-chapter-id`）
- 不符合直觉：数据结构和 DOM 结构不一致

## 关键参考

| 文档/代码路径                                                   | 作用               | 备注                                         |
| --------------------------------------------------------------- | ------------------ | -------------------------------------------- |
| `domain/reportEditor/document/parse.ts:95-110`                  | 临时章节识别逻辑   | 当前仅依赖 `data-section-id` 是否存在        |
| `domain/reportEditor/chapterId/ops.ts:60-90`                    | 写入临时 ID 到 DOM | 未写入临时章节标记                           |
| `domain/reportEditor/foundation/constants.ts`                   | DOM 属性常量定义   | 需新增 `TEMP_CHAPTER` 常量                   |
| `domain/chapter/factory.ts:11`                                  | 临时 ID 生成       | 生成格式：`new-chapter-{timestamp}-{serial}` |
| `store/reportContentStore/hooks/useReportContentPersistence.ts` | 保存流程           | 依赖临时章节标记构建 ID 映射                 |

## 解决方案

### 最终方案

**核心思路**：DOM 结构与数据结构保持一致，使用独立的 `data-temp-chapter-id` 属性存储临时 ID

#### 1. 新增 DOM 属性常量

在 `domain/reportEditor/foundation/constants.ts` 中新增：

```typescript
export const RP_DATA_ATTRIBUTES = {
  // ... 现有属性
  CHAPTER_ID: 'data-chapter-id', // 持久化章节 ID
  TEMP_CHAPTER_ID: 'data-temp-chapter-id', // 临时章节 ID（新增）
  TEMP_CHAPTER: 'data-temp-chapter', // 临时章节标记
} as const;

export const RP_DATA_VALUES = {
  // ... 现有值
  TEMP_CHAPTER_TRUE: 'true',
} as const;
```

#### 2. 修改 `ensureSectionIds` 写入逻辑

在 `domain/reportEditor/chapterId/ops.ts` 中，将临时 ID 写入独立字段：

```typescript
// 策略 2：如果标题仍然无 ID，生成新的临时 ID
if (!chapterId) {
  const tempId = generateChapterTempId();
  // 临时章节：写入 data-temp-chapter-id 和标记
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID, tempId);
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER, RP_DATA_VALUES.TEMP_CHAPTER_TRUE);
  assignedCount += 1;
}
```

#### 3. 修改 `parseDocumentChapterTree` 识别逻辑

在 `domain/reportEditor/document/parse.ts` 中，优先读取 `data-temp-chapter-id`：

```typescript
// 2.1 优先读取持久化 ID
const chapterId = heading.getAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID)?.trim() || '';

// 2.2 检查是否为临时章节
const tempId = heading.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID)?.trim() || '';
const isTemporary = !!tempId;

// 2.3 使用 tempId 或 chapterId 作为标识
const effectiveId = tempId || chapterId;
```

#### 4. 修改 `applySectionIdMap` 替换逻辑

在 `domain/reportEditor/chapterId/ops.ts` 中，从临时字段移动到持久化字段：

```typescript
elements.forEach((element) => {
  // 获取临时 ID
  const tempId = element.getAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID);
  if (!tempId) return;

  // 查找映射
  const chapterId = idMap[tempId];
  if (!chapterId) return;

  // 移动 ID：从临时字段到持久化字段
  element.setAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID, chapterId);
  element.removeAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID);
  element.removeAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER);

  replacedCount += 1;
});
```

### 方案优势

- **语义清晰**：`data-chapter-id` 只存储持久化 ID，`data-temp-chapter-id` 只存储临时 ID
- **结构一致**：DOM 属性与数据结构字段一一对应
- **查询简单**：通过属性名即可判断章节类型，无需额外标记
- **维护友好**：ID 替换是字段间的移动，逻辑更直观
- **向后兼容**：可以通过检查两个属性来兼容旧数据

### 对比分析

| 维度             | 当前方案（混用字段）                     | 新方案（独立字段）                         |
| ---------------- | ---------------------------------------- | ------------------------------------------ |
| DOM 属性         | `data-chapter-id`（混用）                | `data-chapter-id` + `data-temp-chapter-id` |
| 临时章节识别     | 需要 `data-temp-chapter="true"` 辅助判断 | 直接检查 `data-temp-chapter-id` 是否存在   |
| ID 替换操作      | 同一字段内替换值                         | 从临时字段移动到持久化字段                 |
| 语义清晰度       | 低（需要额外标记）                       | 高（字段名即语义）                         |
| 与数据结构一致性 | 不一致                                   | 一致                                       |
| 查询复杂度       | 高（需要检查两个属性）                   | 低（检查一个属性）                         |

### 备选方案（已放弃）

**方案 A：继续使用当前的混用方案 + 标记**

- 优点：改动最小，已经实现
- 缺点：语义不清晰，与数据结构不一致，维护困难
- 放弃理由：不符合"DOM 与数据结构保持一致"的设计原则

**方案 B：仅在保存时创建临时 ID**

- 优点：减少编辑过程中的 ID 管理复杂度
- 缺点：保存时需要修改 DOM（Draft 数据源），可能触发不必要的重渲染
- 放弃理由：违反"DOM 是唯一数据源"的设计原则

## 验证与风险

### 验证步骤

1. 创建新章节，检查 DOM 中是否同时存在 `data-section-id` 和 `data-temp-chapter="true"`
2. 触发 `parseDocumentChapterTree`，验证返回的章节包含 `isTemporary: true` 和 `tempId`
3. 保存报告，验证后端返回 ID 映射后，DOM 中的 `data-temp-chapter` 被正确移除
4. 验证保存后的章节能够正常定位、编号更新、内容同步

### 剩余风险

- **性能影响**：每次 `ensureSectionIds` 都会写入额外属性，但影响可忽略（属性操作成本低）
- **迁移成本**：现有文档中的临时章节没有标记，需要兼容逻辑（已在方案中处理）
- **测试覆盖**：需要补充单元测试和集成测试，确保标记的完整生命周期

### 监控建议

- 在 `parseDocumentChapterTree` 中添加日志，记录临时章节识别情况
- 在保存流程中验证 ID 映射的完整性（所有 tempId 都有对应的 chapterId）

## 更新日志

| 日期       | 事件     | 描述                                                                              |
| ---------- | -------- | --------------------------------------------------------------------------------- |
| 2025-02-14 | 发现     | 发现临时章节解析标记缺失问题                                                      |
| 2025-02-14 | 分析     | 完成问题分析，确定解决方案                                                        |
| 2025-02-14 | 实现     | 实现方案 A：添加 data-temp-chapter 标记                                           |
| 2025-02-14 | 重新分析 | 发现字段混用问题，重新设计方案 B：使用独立的 data-temp-chapter-id 字段            |
| 2025-02-14 | 解决     | 实现方案 B，使用独立字段存储临时 ID，确保 DOM 与数据结构一致                      |
| 2025-02-14 | 修复     | 修复 ChapterSegment 和 DocumentChapterNode 类型，确保与 RPChapterSavePayload 一致 |

## 附录

### 相关代码片段

**当前 `ensureSectionIds` 写入逻辑**（`ops.ts:130-135`）：

```typescript
// 问题：将临时 ID 写入 data-chapter-id，与持久化 ID 混用
if (!chapterId) {
  chapterId = generateChapterTempId();
  heading.setAttribute(RP_DATA_ATTRIBUTES.CHAPTER_ID, chapterId); // 混用
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER, RP_DATA_VALUES.TEMP_CHAPTER_TRUE);
  assignedCount += 1;
}
```

**期望的写入逻辑**：

```typescript
// 改进：将临时 ID 写入独立字段
if (!chapterId) {
  const tempId = generateChapterTempId();
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER_ID, tempId); // 独立字段
  heading.setAttribute(RP_DATA_ATTRIBUTES.TEMP_CHAPTER, RP_DATA_VALUES.TEMP_CHAPTER_TRUE);
  assignedCount += 1;
}
```

### 相关文档

- [章节 ID 管理 README](../../src/domain/reportEditor/chapterId/README.md)
- [DOM 元素 ID 维护问题](./dom-section-id-maintenance-issues.md)
- [章节保存流程设计](../shared/chapter-save-flow.md)（如存在）

---

> 📖 本文档遵循 [Issue 文档编写规范](../../../docs/rule/issue-doc-rule.md)
