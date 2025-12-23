# DOM 元素 ID 维护问题

## 问题概览

| 字段     | 内容                                                   |
| -------- | ------------------------------------------------------ |
| 问题     | 章节 DOM 元素 data-section-id 属性维护机制存在多个问题 |
| 状态     | ✅ 已解决                                              |
| 优先级   | 🔴 P0                                                  |
| 责任人   | -                                                      |
| 发现时间 | 2025-02-14                                             |
| 解决时间 | 2025-02-14                                             |

## 背景与预期

章节在编辑器中以 `<section data-section-id="xxx">` 形式存在，`data-section-id` 属性用于关联业务章节 ID，是编号更新、章节定位、内容同步等功能的核心依据。

## 问题陈述

### 现象

新增章节的临时 ID 未写入 DOM、保存后正式 ID 未同步到 DOM、同步时机不明确、临时 ID 生命周期管理缺失、查找函数无容错机制。

### 根因

临时 ID 生成后未注入 DOM、解析器只读取不修改 DOM、idMap 处理逻辑缺失、缺少明确的数据流设计、查找逻辑过于严格。

### 影响

- 所有新增章节无法通过 findSectionElement 定位
- 章节编号更新失败
- 保存后新增章节仍无法定位和更新编号

## 关键参考

| 文档/代码路径                                        | 作用                   | 备注                 |
| ---------------------------------------------------- | ---------------------- | -------------------- |
| `domain/reportEditor/split/chapterSegments.ts`       | 章节解析与临时 ID 生成 | 生成临时 ID          |
| `domain/reportEditor/domOperations/domFinders.ts`    | DOM 元素查找           | 依赖 data-section-id |
| `domain/reportEditor/domOperations/sectionIdSync.ts` | ID 同步工具            | 新实现               |
| `store/reducers/draftTreeReducers.ts`                | Draft 状态管理         | 需处理 idMap         |

## 解决方案

### 方案要点

1. `ensureSectionIds` 自动补齐标题节点的 data-section-id（已完成）
2. 保存成功后调用 `ReportEditorRef.applyIdMap` 替换临时 ID（已完成）
3. MutationObserver 驱动的 `ChapterNumberCoordinator` 负责同步时机（已完成）
4. `SectionIdMaintainer` 专注维护 DOM ID（已完成）

### 待办事项

- [x] 实现 ensureSectionIds
- [x] 实现 applyIdMap
- [x] 实现 SectionIdMaintainer
- [x] 修复死循环问题

## 验证与风险

### 验证步骤

1. 创建新章节，验证 data-section-id 立即写入
2. 保存报告，验证临时 ID 替换为正式 ID
3. 使用 findSectionElement 查找章节，验证能正确定位

### 剩余风险

- 临时 ID 唯一性需要更可靠的生成算法
- 需要函数式重构降低复杂度

## 更新日志

| 日期       | 事件 | 描述                                  |
| ---------- | ---- | ------------------------------------- |
| 2025-02-14 | 解决 | 实现 SectionIdMaintainer 解决所有问题 |
| 2025-02-14 | 发现 | 发现死循环问题并修复                  |

## 附录

后续建议：函数式重构，用单一 Hook 替代两个 Class
详见：[sync-loop-analysis.md](./archived/sync-loop-analysis.md)
