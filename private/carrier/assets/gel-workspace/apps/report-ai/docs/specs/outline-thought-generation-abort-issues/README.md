# Outline 思路生成取消逻辑修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | Outline 思路生成取消逻辑未正确中止 |
| 负责人 | 待指派 |
| 上线目标 | 修复思路生成取消逻辑，确保取消操作立即中止接口请求和后续流程 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/outline-thought-generation-abort-issues.md) |

## 背景与上下文

在 OutlineTreeEditor 的编写思路生成流程中，使用 gel-ui 提供的 ChatRunContext + AbortController 完成接口调用与中止控制。预期：用户触发取消后，应立即中止进行中的接口请求，并终止后续状态更新与流程，不应出现"取消后仍继续完成"的情况。

## 需求提炼

### 必达能力
1. 用户点击取消后立即中止进行中的接口请求
2. 取消操作终止后续状态更新与流程
3. 不出现"取消后仍继续完成"的情况
4. 确保取消后状态一致性，避免STOP与FINISH并存

### 约束条件
1. 遵循 gel-ui 提供的生命周期规范
2. 保持与现有状态管理机制的兼容性
3. 确保取消操作在各种场景下都能正确工作

## 方案设计

### 问题根因
1. **预处理完成后未进行中止检查**：生成流程在预处理完成后未进行中止检查，导致取消发生在 preflight 返回之后仍继续执行完成派发。
   - 位置：`apps/report-ai/src/components/outline/OutlineTreeEditor/hooks/useThoughtGeneration.ts:65-98`

2. **暂停逻辑存在竞态条件**：暂停逻辑仅调用 context.abort 并同步派发 STOP，但未保证并发中的 generateThought 进入中止分支，存在竞态导致 FINISH 仍然派发。
   - 位置：`apps/report-ai/src/components/outline/OutlineTreeEditor/hooks/useThoughtGeneration.ts:131-143`

3. **生命周期未对齐**：未对 gel-ui 推荐的生命周期进行对齐，preflight 完成后未清理 abortController，从而在取消与状态派发之间缺少清晰边界。
   - 参考：`packages/gel-ui/src/service/agentRequest/unified-handler/index.ts:119-126`

### 解决方案设计
1. **增加中止检查**：在 generateThought 中，preflight 返回后立即进行中止检查，发现已取消则抛出标准化错误并走取消分支，不再派发 FINISH。
   - 可直接使用 gel-ui 提供的检查：`packages/gel-ui/src/service/agentRequest/helper/misc.ts:24-30`（checkAbortSignal），或判断 `context.abortController?.signal?.aborted`。

2. **对齐生命周期**：与 gel-ui 生命周期对齐：preflight 完成后执行 `context.clearAbortController()`，避免后续状态被同一 controller 干扰。

3. **改进暂停逻辑**：在暂停逻辑中使用 `context.abortAll('用户取消')`，并确保 generateThought 捕获 CANCELLED 语义，派发 STOP 或 FAIL 的一致态，不再 FINISH。

4. **增加状态守卫**：在派发 FINISH 前增加幂等与状态守卫：仅当章节当前状态仍为"生成中"时才允许 FINISH，避免竞态导致错误状态转换。

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | --- |
| 1. 在generateThought中增加中止检查 | useThoughtGeneration | 添加中止检查逻辑 | 待指派 | TBD |
| 2. 对齐gel-ui生命周期 | useThoughtGeneration | 调用clearAbortController | 待指派 | TBD |
| 3. 改进暂停逻辑 | useThoughtGeneration | 使用abortAll方法 | 待指派 | TBD |
| 4. 增加状态守卫 | useThoughtGeneration | 添加FINISH前置条件 | 待指派 | TBD |
| 5. 测试验证 | 整体流程 | 功能测试 | 待指派 | TBD |

## 验收记录

### 功能验收用例
1. 触发生成，在预处理阶段立即取消，确认接口被中止，中止错误被捕获，最终状态为 STOP/FAIL，不产生 FINISH。
2. 在 preflight 刚返回（reportData 已设置）瞬间取消，确认中止检查生效，不派发 FINISH。
3. 快速重复"生成-取消"多次，确认未出现状态错乱；状态机保持一致。
4. 开启网络慢速模拟，验证轮询接口携带 signal，被取消后不再继续执行后续轮询。
5. 回归 RPOutline 的统一处理器路径，确保行为一致。

### 非功能风险
- 需确保取消操作在各种网络环境下都能正确工作
- 需验证取消操作不会影响其他正常流程

## 实现说明

### 与设计差异
- 暂未实现，待实施后补充

### 关键PR
- 暂无，待实施后补充

### 可复用经验
- 暂无，待实施后补充

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-11-14 | - | 创建Issue，完成现象与根因分析，给出修复建议与验证计划 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：🚧 进行中  
**创建时间**：2025-11-14  
**优先级**：🔴 高  
**影响范围**：Outline思路生成功能  
**预估工期**：1.5 人日