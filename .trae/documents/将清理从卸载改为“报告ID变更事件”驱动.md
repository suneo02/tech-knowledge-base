## 最佳实践结论

- 生成流程清理应与“域事件”绑定（报告ID变更），而不是组件卸载。理由：
  - 卸载只覆盖页面离开场景；同路由内切换报告ID不一定触发卸载。
  - 用事件驱动的清理可保证状态与网络层一致在“切换报告”时归零，避免幽灵请求与残留状态。
  - Provider 级的网络中止仍保留用于页面卸载；生成控制器侧不做隐式清理，职责更单一。

## 代码改动

### 1) 移除 useFullDocGenerationController 的卸载清理

- 位置：`apps\report-ai\src\store\reportContentStore\hooks\useFullDocGenerationController.ts`
- 删除我们之前新增的卸载 `useEffect`（约 `142` 行附近）：
  - `interruptFullDocumentGeneration` 与 `setHydrationTask({ type:'idle' })` 不再在卸载时触发。
  - 控制器仅负责监听与推进，不承担生命周期清理。

### 2) 在报告ID变更时集中清理（推荐落点：useInitReportContent）

- 位置：`apps\report-ai\src\pages\ReportDetail\hook.tsx`
- 新增引用：`useReportDetailContext`，以便调用聊天层清理；在 Provider 层已经存在。
- 新增逻辑：用 `prevReportIdRef` 比对 `reportId`，当变化且非首次加载时执行：
  - 终止聊天请求：`reportDetailCtx.cancelRequests()`（见步骤3暴露方法）。
  - 清空消息：`reportDetailCtx.setMsgs([])`，防止旧实例消息污染。
  - 中断并复位生成状态：
    - `dispatch(rpDetailActions.interruptFullDocumentGeneration())`
    - `dispatch(rpDetailActions.resetFullDocumentGeneration())`（清空队列与章节操作痕迹）
    - `dispatch(rpDetailActions.setHydrationTask({ type:'idle' }))`
- 此后再触发 `run(report/query)` 拉取新报告数据（现有逻辑已覆盖）。

### 3) 在 ReportDetail Context 暴露“取消请求”接口

- 位置：`apps\report-ai\src\context\ReportDetail.tsx`
- 将 `useRPContentChat` 的 `cancelRequest` 通过 Context 暴露为 `cancelRequests`（或同名方法）。
- 仅作方法暴露，不改变既有 Provider 卸载时的清理逻辑。

## 验证

- 切换 `reportId`：生成状态回到 `idle`，队列重置；聊天流式请求被中止；消息列表清空；随后加载新报告数据并正常工作。
- 离开页面（卸载）：Provider 层的网络中止仍生效；控制器不做隐式清理。

## 取舍说明

- 保留 Provider 级卸载中止（网络层职责明确）。
- 将生成状态与消息清理集中在“报告ID变更事件”上，避免控制器承担生命周期副作用，提升可维护性与可预期性。
