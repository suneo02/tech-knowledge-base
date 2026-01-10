# AIGC 消息进度接入 - 实施计划

> 📖 回链：[任务概览](./README.md) | 遵循 [Spec 文档编写规范](../../../../../docs/rule/doc-spec-rule.md)

## 任务拆解

| ID  | 任务                  | 负责人 | 工时 | 依赖   | 状态 |
| --- | --------------------- | ------ | ---- | ------ | ---- |
| T1  | 定义类型和接口        | Kiro   | 2h   | -      | ✅   |
| T2  | 实现进度事件监听      | Kiro   | 2h   | T1     | ✅   |
| T3  | 实现消息解析器        | Kiro   | 2h   | T1     | ✅   |
| T4  | 创建进度展示组件      | Kiro   | 3h   | T3     | ✅   |
| T5  | 集成到 RPOutline 流程 | Kiro   | 2h   | T2, T3 | ✅   |
| T6  | 添加单元测试          | -      | 2h   | T1-T5  | 📝   |
| T7  | 代码审查与优化        | -      | 1h   | T6     | 📝   |

**预计总工时**：14h | **预计完成**：2025-11-15

## 任务详情

### T1: 定义类型和接口 ✅

**涉及文件**：

- `packages/gel-ui/src/types/ai-chat-perf/agentMessages.ts`
- `apps/report-ai/src/types/chat/RPOutline.ts`

**实施内容**：

- 为 `AgentAIMessage` 添加 `progress` 字段
- 在 RPOutline 模块定义 `RPOutlineProgressMessage` 类型
- 添加到 `RPOutlineMsgParsed` 联合类型

**验收**：✅ 类型定义完整，TypeScript 编译通过

---

### T2: 实现进度事件监听 ✅

**涉及文件**：

- `packages/gel-ui/src/service/agentRequest/processes/processQuestionDecomposition.ts`
- `packages/gel-ui/src/service/agentRequest/types.ts`
- `packages/gel-ui/src/service/agentRequest/events.ts`

**实施内容**：

- 在 `processResponse` 中提取 `reportProgress` 并发出 `progress:received` 事件
- 扩展 `RuntimeState` 添加 `reportProgress` 字段
- 在事件映射中添加 `progress:received` 事件类型

**验收**：✅ 事件正确发出，不影响现有逻辑

---

### T3: 实现消息解析器

**涉及文件**：

- `packages/gel-ui/src/utils/ai-chat/messageParser/index.tsx`
- `apps/report-ai/src/components/ChatRPOutline/parsers/messageParser.tsx`

**实施步骤**：

1. 创建 `createProgressMessage` 解析函数（参考 `createSubQuestionMessage`）
2. 在 RPOutline 解析器中集成，添加到 messageList
3. 只在 `pending` 状态展示进度

**验收标准**：

- [ ] 解析器返回正确的 `RPOutlineProgressMessage`
- [ ] 只在有进度且状态为 pending 时返回
- [ ] 不影响其他消息解析

---

### T4: 创建进度展示组件

**涉及文件**：

- `packages/gel-ui/src/components/ProgressMessage/index.tsx`（新建）
- `packages/gel-ui/src/components/ProgressMessage/index.module.less`（新建）

**实施步骤**：

1. 使用 Ant Design Progress 组件展示进度条
2. 显示步骤名称和百分比
3. 样式与现有消息保持一致

**验收标准**：

- [ ] 正确展示进度信息
- [ ] 样式一致，支持响应式

---

### T5: 集成到 RPOutline 流程

**涉及文件**：

- `apps/report-ai/src/hooks/RPOutline/xAgentReq.ts`

**实施步骤**：

1. 监听 `progress:received` 事件
2. 创建 `createAgentMsgAIProgress` 辅助函数
3. 调用 `onAgentUpdate` 更新消息

**验收标准**：

- [ ] 进度消息正确渲染到界面
- [ ] 不影响子问题展示

---

### T6: 添加单元测试

**测试覆盖**：

- `createProgressMessage` 解析器（正常、缺失、非 pending）
- `processQuestionDecomposition` 进度事件
- 边界情况（0%、100%、负数、超过 100%）

**验收标准**：

- [ ] 测试覆盖率 > 80%
- [ ] 所有测试通过

---

### T7: 代码审查与优化

**检查项**：

- [ ] 类型定义完整，代码符合规范
- [ ] 无 ESLint 警告，无性能问题
- [ ] 文档完整

---

## 实施记录

### T1 ✅ (2025-11-12)

- 新旧类型系统添加 `progress` 字段
- 在 RPOutline 模块定义 `RPOutlineProgressMessage`
- 修正：从通用类型移至 RPOutline 模块

### T2 ✅ (2025-11-12)

- 在 `processResponse` 中发出 `progress:received` 事件
- 扩展 `RuntimeState` 和事件类型
- TypeScript 编译通过

### T3 ✅ (2025-11-12)

- 创建 `createProgressMessage` 解析函数
- 在 RPOutline 解析器中集成进度消息
- 只在 `pending` 状态且有进度信息时返回
- TypeScript 编译通过，无诊断错误

### T4 ✅ (2025-11-12)

- 创建 `ProgressRoleMessage` 组件，使用 Wind UI Progress
- 创建 `reportProgressRole` 角色配置
- 在 RPOutline roles 中注册 progress role
- 更新类型定义，添加 progress 到 `RolesTypeReportOutline`
- TypeScript 编译通过

### T5 ✅ (2025-11-12)

- 创建 `createAgentMsgAIProgress` 辅助函数
- 在 `xAgentReq.ts` 中监听 `progress:received` 事件
- 调用 `onAgentUpdate` 更新进度消息
- 导出函数到 gel-ui 公共 API
- TypeScript 编译通过

---

## 更新记录

| 日期       | 修改人 | 更新内容          |
| ---------- | ------ | ----------------- |
| 2025-11-12 | Kiro   | 完成 T5 任务      |
| 2025-11-12 | Kiro   | 完成 T4 任务      |
| 2025-11-12 | Kiro   | 完成 T3 任务      |
| 2025-11-12 | Kiro   | 精简文档至 150 行 |
| 2025-11-12 | Kiro   | 完成 T1、T2 任务  |
| 2025-11-12 | -      | 初始创建          |

## 相关文档

- [任务概览](./README.md)
- [需求与设计](./spec-core-v1.md)
- [验收记录](./spec-verification.md)

