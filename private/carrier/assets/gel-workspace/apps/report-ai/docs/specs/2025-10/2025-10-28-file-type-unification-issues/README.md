# 文件类型统一问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | report-ai文件聚合体系的类型定义分裂和状态同步缺口问题，影响文件选择器和引用组件 |
| 负责人 | - |
| 上线目标 | 统一RPFile/RPFileTraced类型，实现状态同步，确保组件无需区分来源 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/archived/file-type-unification-issues.md) |
| 状态 | ✅ 已完成 |

## 背景与上下文

report-ai前端同时处理来自报告文件API的`RPFile`与章节追踪产生的`RPFileTraced`。目标是通过`RPFileUnified`及聚合函数让组件无需区分来源。

现有`RPFileUnified`类型已定义，但状态管理与组件仍围绕联合类型运作，未落地File_Aggregation_System与`selectFileUnifiedMap`，导致类型定义分裂和状态同步缺口。

## 需求提炼

### 必达能力
1. 实现统一的文件类型`RPFileUnified`
2. 创建聚合函数`aggregateFileData`
3. 实现统一的状态查询接口
4. 迁移组件使用统一类型
5. 确保状态同步正常工作

### 约束条件
1. 不影响现有功能
2. 保持性能
3. 确保类型安全
4. 与现有代码结构兼容

## 方案设计

### 问题根因
1. **类型定义分裂**：`selectTopReportFiles`返回联合类型，组件无法直接消费统一类型
2. **状态同步缺口**：pending状态与Canonical数据分离，组件需要各自合并
3. **缺少统一出口**：缺少`selectFileUnifiedMap`统一出口
4. **组件运行时区分**：组件需要在运行时区分三种变体，造成重复的类型守卫

### 解决方案设计
**核心思路**：实现聚合函数、创建统一selector、迁移组件，确保类型统一和状态同步。

1. **实现聚合函数**：
   - 实现`aggregateFileData`聚合函数
   - 按fileId合并报告级文件和章节文件
   - 实现position和refChapter的一一对应关系
   - 支持跨章节引用信息聚合

2. **创建统一的selector出口**：
   - `selectFileUnifiedMap`: 返回`Map<string, RPFileUnified>`
   - `selectTopReportFiles`: 返回`RPFileUnified[]`
   - `selectFileUnifiedList`: 返回统一格式的文件列表

3. **实现状态聚合逻辑**：
   - `aggregateFileData`函数自动应用pendingStatusMap
   - 可变状态（UPLOADING、PARSING等）会被pending状态覆盖
   - 不可变状态（终态）保持不变

4. **组件迁移**：
   - `TopFilesSection`直接使用`RPFileUnified`类型
   - `ReferenceItemFile`不再需要类型判断
   - 消除运行时类型守卫的重复代码

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | --- | --- |
| 1. 完善RPFileUnified类型 | types/file | 定义统一类型 | 已完成 | 2025-10-28 |
| 2. 实现aggregateFileData | domain/file/aggregation | 实现聚合函数 | 已完成 | 2025-10-28 |
| 3. 创建统一selector | selectors/chaptersCanonical | 创建统一出口 | 已完成 | 2025-10-28 |
| 4. 实现状态聚合逻辑 | domain/file/aggregation | 应用pending状态 | 已完成 | 2025-10-28 |
| 5. 迁移TopFilesSection | components/Reference | 使用统一类型 | 已完成 | 2025-10-28 |
| 6. 迁移ReferenceItemFile | components/Reference | 消除类型判断 | 已完成 | 2025-10-28 |
| 7. 统一状态展示 | components/FileStatusBadge | 统一状态展示 | 已完成 | 2025-10-28 |
| 8. 测试验证 | 测试 | 验证所有功能正常 | 已完成 | 2025-10-28 |

## 验收记录

### 功能验收用例
1. **类型系统验证**：确认所有组件使用统一类型，无类型错误
2. **数据聚合验证**：确认正确合并跨章节引用，position和refChapter保持一致
3. **状态同步验证**：确认pending状态正确应用，组件展示最新状态
4. **组件功能验证**：确认引用面板、置顶文件、状态角标正常工作
5. **性能验证**：确认使用Map结构，O(1)查找效率

### 非功能风险
- 聚合逻辑可能影响性能
- 状态同步可能有延迟
- 类型转换可能丢失信息

## 实现说明

### 与设计差异
- 完全按照设计方案实现，无差异

### 关键PR
- 暂无，待补充

### 可复用经验
1. 统一类型可以消除运行时类型判断，提高类型安全
2. 聚合逻辑集中在domain层，易于测试和维护
3. 使用Map结构可以提高查找效率
4. 状态优先级设计可以确保状态一致性

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-10-28 | - | 汇总现状问题，纳入需求文档约束，重写issue结构 |
| 2025-10-28 | - | 梳理类型分裂与状态同步缺口，明确实施步骤与验证计划 |
| 2025-10-28 | - | 落地聚合函数、统一selector与引用面板改造，待验证状态同步策略 |
| 2025-10-28 | - | 完成类型统一、数据聚合、Redux改造和组件迁移，所有核心问题已解决 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已完成  
**创建时间**：2025-10-28  
**优先级**：🟡 中  
**影响范围**：文件选择器和引用组件  
**预估工期**：3 人日  
**实际工期**：3 人日