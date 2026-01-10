# 全文生成重复请求问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | 全文生成对同一章节发起重复AIGC请求，导致接口放大调用和章节锁超时 |
| 负责人 | AIGC前端组 |
| 上线目标 | 拆分监听与操作，避免重复请求，确保章节只触发一次生成 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/archived/full-doc-generation-duplicate-requests.md) |
| 状态 | ✅ 已完成 |

## 背景与上下文

全文生成流程由`useFullDocGeneration`串行推进，依赖`latestRequestedOperations`控制章节级幂等。预期同一章节在`requested=true`之前只触发一次`ChatPresetQuestion.GENERATE_FULL_TEXT`调用，避免重复写锁和额度浪费。

然而，`ReportContentInner`与`RPRightPanel`都在挂载阶段调用`useFullDocGeneration`，导致其中的`useEffect`被注册两次。React在同一commit中依次执行两个effect，它们共享相同的`latestRequestedOperations`快照，在`ChapterHookGenUtils.shouldSendRequest`判定之前都还未被`markChapterOperationRequested`标记，于是同时触发`sendGenerationRequest`，后端收到重复请求。

## 需求提炼

### 必达能力
1. 拆分监听与操作，避免重复监听
2. 确保同一章节只触发一次生成请求
3. 避免章节锁超时和额度翻倍消耗
4. 为多章节/文本改写建立统一的模式
5. 集中状态管理，避免多实例维护各自副本

### 约束条件
1. 不影响现有功能
2. 保持用户体验一致
3. 确保修复过程中系统稳定性
4. 与现有状态管理机制兼容

## 方案设计

### 问题根因
1. **重复监听**：多个组件挂载相同的Hook，导致副作用监听被注册多次
2. **共享快照**：多个effect共享相同的`latestRequestedOperations`快照
3. **状态分散**：本地状态（如`requestedRef`）在多个实例中互不感知
4. **架构耦合**：「触发动作+副作用监听」耦合在同一个Hook中

### 解决方案设计
**核心思路**：拆分监听与操作，集中控制器Hook，统一状态管理。

1. **拆分监听与操作**：
   - 抽出新的`useFullDocGenerationController`放入`ReportContentStoreProvider`内部
   - 仅挂载一次监听`isFullGenOp`、`latestRequestedOperations`与流式完成逻辑
   - 原有`useFullDocGeneration`改为纯操作Hook，仅暴露`startGeneration`

2. **复用基类**：
   - 为多章节/文本改写建立统一的`useChapterOperationController`（负责监听+请求+完成推进）
   - 创建`useChapterOperationActions`（负责触发）
   - 三类AIGC Hook共用同一模式，避免再次出现监听复制

3. **状态清理**：
   - `setMessages([])`、`requestedRef`等本地状态迁移到controller层
   - 通过Redux或共享context维护，防止多实例维护各自副本

4. **监控与文档**：
   - 在`rpContentSlice`的`latestRequestedOperations`上补充dev-only warn
   - 在文档中标注"监听Hook仅能注册一次"

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | --- | --- |
| 1. 创建控制器Hook | hooks | useFullDocGenerationController | 已完成 | 2025-01-17 |
| 2. 创建控制器组件 | controllers | GenerationControllers | 已完成 | 2025-01-17 |
| 3. 修改原Hook | hooks | 移除副作用逻辑 | 已完成 | 2025-01-17 |
| 4. 修改Provider | provider | 挂载GenerationControllers | 已完成 | 2025-01-17 |
| 5. 更新导出 | hooks/index | 导出新的控制器Hook | 已完成 | 2025-01-17 |
| 6. 测试验证 | 测试 | 验证重复请求问题解决 | 已完成 | 2025-01-17 |

## 验收记录

### 功能验收用例
1. **全文生成验证**：点击"全文生成"，观察请求数量与章节列表一致，无重复correlationId
2. **关联章节重新生成验证**：通过RightPanel触发，确认只出现一条批量请求
3. **多实例测试**：模拟同时渲染两个调用`useMultiChapterGenerationActions`的组件，断言只有一个controller被注册
4. **文本改写验证**：从不同位置触发`startRewrite`，确认只生成一个`correlationId`
5. **状态共享验证**：确认`requestedRef`在controller层全局共享

### 非功能风险
- 新的controller Hook若挂载顺序错误会造成监听缺失
- Text rewrite的本地ref迁移到全局后，需要补充单测覆盖
- 现有调用方需要更新导入路径，需要一次性替换

## 实现说明

### 与设计差异
- 完全按照设计方案实现，无差异

### 关键PR
- 暂无，待补充

### 可复用经验
1. 拆分监听与操作是避免重复监听的有效方法
2. 集中状态管理可以避免多实例维护各自副本
3. 统一的控制器模式可以避免类似问题再次出现
4. 开发环境下的警告机制可以帮助早期发现问题

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-01-17 | AIGC前端组 | 记录重复请求问题并确定拆分监听/操作的解决方案 |
| 2025-01-17 | AIGC前端组 | 完成控制器Hook拆分，修改Provider挂载逻辑，问题已解决 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已完成  
**创建时间**：2025-01-17  
**优先级**：🔴 高  
**影响范围**：全文生成、多章节生成、文本改写功能  
**预估工期**：2 人日  
**实际工期**：2 人日