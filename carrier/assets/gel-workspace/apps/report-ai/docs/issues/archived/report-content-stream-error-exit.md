# 报告内容流式错误退出问题

## 问题概览

| 项目     | 内容                                           |
| -------- | ---------------------------------------------- |
| 标题     | 报告内容流式请求在错误或卡住时无法正常退出流程 |
| 状态     | ✅ 已解决                                      |
| 优先级   | 🔴 高                                          |
| 责任人   | 已完成                                         |
| 发现时间 | 2025-10-28                                     |
| 解决时间 | 2025-10-28                                     |
| 影响模块 | report-ai/ReportContent                        |
| 关键文件 | xAgentReq.ts:68                                |

## 背景与预期

报告内容聊天功能使用流式请求与 AI 交互，当流式请求发生错误或卡住时，应能正常退出流程并恢复 UI 状态（如 loading 状态、聊天状态等）。基础聊天模块 `useChatBase` 在流式卡住时可以正常退出，但报告内容模块在流式报错时无法正常退出。

## 问题陈述

### 现象

1. **流式报错时无法退出**：当报告内容流式请求发生错误时，聊天状态（`isChating`）未被正确重置，loading 状态未清除
2. **流式卡住时退出异常**：虽然流式卡住时似乎可以退出，但退出流程可能不完整
3. **对比基础模块**：`packages/ai-ui/src/hooks/useChatBase.tsx` 在流式卡住时能正常退出，说明问题出在报告内容模块的实现差异上

### 根因

**核心问题**：`handleError` 中直接调用 `onAgentSuccess` 无法正确更新 UI 状态

通过代码分析和实际测试发现：

1. **状态更新机制问题**（`apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:62-77`）

   - 在 `handleError` 函数中，原本只调用了 `onAgentSuccess(agentMsg)`
   - 这导致错误消息无法正确显示在 UI 上，聊天状态无法正常退出
   - **关键发现**：需要先调用 `onAgentUpdate(agentMsg)` 更新消息状态，再调用 `onAgentSuccess` 完成流程

2. **与 useXAgent 的交互机制**
   - `useXAgent` 的状态更新依赖于 `onAgentUpdate` 来触发 UI 重新渲染
   - 直接调用 `onAgentSuccess` 会跳过中间状态更新，导致错误消息不显示
   - 必须按照 `onAgentUpdate` → `onAgentSuccess` 的顺序调用

### 影响范围

- **用户体验**：流式错误后 UI 卡死，用户无法继续操作
- **功能模块**：报告内容聊天功能（ReportContent）
- **影响页面**：报告详情页的内容生成功能

## 参考资料

| 文件/文档                                                                 | 作用                 | 备注                 |
| ------------------------------------------------------------------------- | -------------------- | -------------------- |
| `packages/ai-ui/src/hooks/useChatBase.tsx:141-157`                        | 基础聊天错误处理参考 | 流式卡住时可正常退出 |
| `apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:62-77`               | 报告内容错误处理逻辑 | 需要增强错误捕获     |
| `apps/report-ai/src/hooks/ReportContent/contentListeners.ts`              | 事件监听器配置       | 需要完善错误事件处理 |
| `apps/report-ai/src/hooks/ReportContent/useReportContentXAgent.ts:73-107` | XAgent 请求入口      | 需要添加错误边界     |
| [错误处理规范](../../../docs/rule/error-handling-rule.md)                 | 前端错误处理标准     | 指导错误处理实现     |

## 解决方案

### 最终方案

**核心修改**：在 `handleError` 中先调用 `onAgentUpdate` 再调用 `onAgentSuccess`

**修改位置**：`apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:68`

**修改内容**：

```typescript
const handleError = (error: CreateHandleError) => {
  const { errorCode } = error;
  dependencies.setIsChating(false);

  const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
  const agentMsg: RPContentAgentMsgAI = {
    ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
    status: 'finish',
    questionStatus: errorCode,
    chapterId: input.chapterId,
  };

  // ✅ 关键修改：先调用 onAgentUpdate 更新状态
  onAgentUpdate(agentMsg);
  // 再调用 onAgentSuccess 完成流程
  // @ts-expect-error 兼容 useXAgent 回调签名
  onAgentSuccess(agentMsg);

  processChatSave(context, {
    questionStatus: errorCode,
  });
};
```

**解决原理**：

1. `onAgentUpdate` 会触发 `useXAgent` 的状态更新，将错误消息添加到消息列表
2. `onAgentSuccess` 标记请求完成，触发最终的状态清理
3. 两者配合确保错误消息正确显示，且流程能正常退出

**负责人**：已完成  
**完成时间**：2025-10-28

## 验证结果

### 已验证场景

1. ✅ 流式请求网络错误 - UI 状态正确恢复，错误消息正常显示
2. ✅ 流式请求超时 - 取消逻辑正常工作，聊天状态正确重置
3. ✅ 流式请求中断（手动取消）- 清理逻辑完整，无状态残留
4. ✅ 流式卡住场景 - 可以正常退出流程

### 验证结论

修改后的错误处理机制工作正常，流式错误和卡住场景均能正确退出流程。

### 监控建议

- 持续监控生产环境中的流式错误率
- 关注 `isChating` 状态异常（长时间未重置）的情况
- 收集用户反馈，确认无新的卡死场景

## 更新日志

| 日期       | 事件     | 描述                                                                   |
| ---------- | -------- | ---------------------------------------------------------------------- |
| 2025-10-28 | 问题发现 | 用户报告流式错误时无法退出，创建 Issue 文档                            |
| 2025-10-28 | 问题解决 | 在 xAgentReq.ts:68 添加 onAgentUpdate 调用，确保错误消息正确更新和显示 |
| 2025-10-28 | 验证完成 | 测试流式错误、超时、卡住等场景，确认问题已解决                         |

## 附录

### 修改前后对比

#### 修改前（错误）

```typescript
// apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:62-77
const handleError = (error: CreateHandleError) => {
  const { errorCode } = error;
  dependencies.setIsChating(false);

  const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
  const agentMsg: RPContentAgentMsgAI = {
    ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
    status: 'finish',
    questionStatus: errorCode,
    chapterId: input.chapterId,
  };
  // ❌ 直接调用 onAgentSuccess，导致状态更新失败
  // @ts-expect-error 兼容 useXAgent 回调签名
  onAgentSuccess(agentMsg);

  processChatSave(context, {
    questionStatus: errorCode,
  });
};
```

#### 修改后（正确）

```typescript
// apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:62-77
const handleError = (error: CreateHandleError) => {
  const { errorCode } = error;
  dependencies.setIsChating(false);

  const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
  const agentMsg: RPContentAgentMsgAI = {
    ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
    status: 'finish',
    questionStatus: errorCode,
    chapterId: input.chapterId,
  };
  // ✅ 先调用 onAgentUpdate 更新状态
  onAgentUpdate(agentMsg);
  // 再调用 onAgentSuccess 完成流程
  // @ts-expect-error 兼容 useXAgent 回调签名
  onAgentSuccess(agentMsg);

  processChatSave(context, {
    questionStatus: errorCode,
  });
};
```

### 关键知识点

**useXAgent 的状态更新机制**：

- `onAgentUpdate`：用于更新消息状态，触发 UI 重新渲染，可多次调用
- `onAgentSuccess`：用于标记请求完成，通常只调用一次
- 在错误处理中，必须先调用 `onAgentUpdate` 确保错误消息被添加到消息列表，再调用 `onAgentSuccess` 完成流程

**相关文件**：

- `apps/report-ai/src/hooks/ReportContent/xAgentReq.ts:68` - FIXED: [report-content-stream-error-exit] 添加 onAgentUpdate 调用
