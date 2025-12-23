# 多章节顺序 AIGC - 核心实现方案 v1

> 回链：[README.md](./README.md)  
> 状态：✅ 已完成

## 需求概述

用户勾选若干章节后批量生成，保持顺序，失败不中断。

**核心场景**：定向生成部分章节、失败章节重试、支持暂停/恢复

## 技术方案

### 复用策略

| 能力       | 复用来源                                                                                                                 | 说明                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| 队列管理   | @see [useFullDocGeneration.ts:队列结构](../../../src/store/reportContentStore/hooks/useFullDocGeneration.ts#L120-L140)   | 队列结构、索引推进  |
| 单章节生成 | @see [useChapterRegeneration.ts](../../../src/store/reportContentStore/hooks/useChapterRegeneration.ts)                  | 直接调用生成方法    |
| 进度计算   | @see [useFullDocGeneration.ts:进度回调](../../../src/store/reportContentStore/hooks/useFullDocGeneration.ts#L200-L210)   | 复用进度计算        |
| 批量锁定   | @see [generationReducers.ts:startChapterOperation](../../../src/store/reportContentStore/reducers/generationReducers.ts) | 复用批量锁定 action |
| 注水协调   | @see [useRehydrationOrchestrator.ts](../../../src/store/reportContentStore/hooks/useRehydrationOrchestrator.ts)          | 自动触发注水        |

### 核心差异

与全文生成的差异：

| 维度     | 全文生成         | 多章节顺序       |
| -------- | ---------------- | ---------------- |
| 队列来源 | 自动遍历全部叶子 | 用户勾选         |
| 失败策略 | 记录失败列表     | 默认不中断，继续 |
| 暂停恢复 | 不支持           | 支持             |

## 状态设计

### Redux State 扩展

**复用现有的 `GlobalOperationState` 状态机**，新增操作类型：

```typescript
// 在 GlobalOperationKind 中新增
type GlobalOperationKind =
  | 'idle'
  | 'full_generation'
  | 'chapter_regeneration'
  | 'multi_chapter_generation'  // 新增
  | ...

// 新增操作数据类型
interface MultiChapterGenerationOperationData {
  type: 'multi_chapter_generation';
  queue: string[];              // 章节 ID 队列
  currentIndex: number;         // 当前索引
  paused: boolean;              // 是否暂停
  failedChapters: string[];     // 失败章节列表
}
```

**设计优势**：

- 复用全局互斥机制，避免与其他操作冲突
- 与 `full_generation` 结构一致，降低理解成本
- 利用现有的 `activeOperations` 追踪章节状态

**参考**：

- @see [generation.ts:GlobalOperationState](../../../src/types/report/generation.ts#L40-L60) - 状态机设计
- @see [generation.ts:FullGenerationOperationData](../../../src/types/report/generation.ts#L25-L30) - 队列数据结构

### Hook 接口

参考 `useFullDocGeneration` 的接口设计，新增暂停/恢复能力。

## 实施拆解

### 任务 1：Redux 层（2h）

**修改文件**：

- `types/report/generation.ts` - 新增 `multi_chapter_generation` 类型和数据结构
- `reducers/generationReducers.ts` - 新增多章节生成相关 reducers
- `selectors/generation.ts` - 新增多章节进度查询 selectors

**参考实现**：

- @see [generation.ts:FullGenerationOperationData](../../../src/types/report/generation.ts#L25-L30) - 队列数据结构
- @see [generationReducers.ts:startFullDocumentGeneration](../../../src/store/reportContentStore/reducers/generationReducers.ts) - 队列初始化模式
- @see [selectors/generation.ts:selectFullDocumentGenerationProgress](../../../src/store/reportContentStore/selectors/generation.ts) - 进度计算模式

### 任务 2：Hook 实现（4h）

**新增文件**：`hooks/useMultiChapterGeneration.ts`

**参考实现**：

- @see [useFullDocGeneration.ts](../../../src/store/reportContentStore/hooks/useFullDocGeneration.ts) - 队列调度逻辑
- @see [useChapterRegeneration.ts](../../../src/store/reportContentStore/hooks/useChapterRegeneration.ts) - 单章节触发方式

**核心逻辑**：

1. 队列初始化：展开父章节、过滤重复与锁定
2. 顺序调度：监听 `currentIndex`，调用 `useChapterRegeneration`
3. 完成推进：订阅完成事件，更新状态并推进队列
4. 失败处理：记录失败章节，提供重试方法

### 任务 3：UI 集成（3h）

**涉及组件**：章节多选面板

**参考设计**：

- @see [多章节顺序 AIGC 场景](../../RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md#页面蓝图) - UI 布局与交互

**功能点**：

- 章节多选 checkbox
- 批量生成按钮
- 进度条与状态列表
- 暂停/恢复/取消按钮
- 失败章节重试入口

### 任务 4：测试（2h）

**测试范围**：

- Redux reducers 单元测试
- Hook 集成测试
- E2E 流程测试

**参考测试**：

- @see [factory.test.ts](../../../src/store/reportContentStore/__tests__/factory.test.ts) - 测试模式

## 关键设计文档

- @see [多章节顺序 AIGC 场景](../../RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md) - 业务流程与交互设计
- @see [全文生成场景](../../RPDetail/ContentManagement/full-generation-flow.md) - 队列管理基线
- @see [单章节 AIGC 场景](../../RPDetail/ContentManagement/single-chapter-aigc-flow.md) - 单章节生成逻辑
- @see [AIGC 核心流程](../../RPDetail/ContentManagement/aigc-core-flow.md) - 前置校验与异常处理

## 更新记录

| 日期       | 修改人 | 更新内容                                    |
| ---------- | ------ | ------------------------------------------- |
| 2025-11-05 | Kiro   | 精简为引用式文档，复用 GlobalOperationState |
