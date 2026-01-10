# AIGC 消息进度接入

> 📖 本文档遵循 [Spec 文档编写规范](../../../../../docs/rule/doc-spec-rule.md)

## 任务概览

| 字段         | 内容                                                |
| ------------ | --------------------------------------------------- |
| 任务名称     | 接入 AIGC 消息进度功能                              |
| 状态         | 📝 待开始                                           |
| 优先级       | 🟡 P1                                               |
| 负责人       | -                                                   |
| 创建时间     | 2025-11-12                                          |
| 预期交付时间 | 2025-11-19                                          |
| 关联 Issue   | -                                                   |
| 关联需求     | 在 RPOutline 聊天中展示 AIGC 生成进度，提升用户体验 |

## 文档索引

| 文档                                 | 阶段     | 状态 | 说明                 |
| ------------------------------------ | -------- | ---- | -------------------- |
| [需求与设计](./spec-core-v1.md)      | 需求设计 | 📝   | 背景、需求、方案设计 |
| [实施计划](./spec-implementation.md) | 实施拆解 | 📝   | 子任务拆解、时间规划 |
| [验收记录](./spec-verification.md)   | 验收测试 | 📝   | 功能验收用例与结果   |

## 快速导航

- **核心目标**：参考 `subQuestion` role 实现，新增 `progress` role 用于展示 AIGC 生成进度
- **涉及模块**：
  - 类型定义：`packages/gel-api/src/chat/types/base.ts`
  - 消息解析：`packages/gel-ui/src/utils/ai-chat/messageParser/index.tsx`
  - RPOutline 解析：`apps/report-ai/src/components/ChatRPOutline/parsers/messageParser.tsx`
  - 流程处理：`packages/gel-ui/src/service/agentRequest/processes/`
  - Hook 集成：`apps/report-ai/src/hooks/RPOutline/`
- **预期效果**：用户在等待 AIGC 生成时能看到实时进度反馈

## 待办事项

- [ ] 定义 `progress` role 类型和消息结构
- [ ] 在 `processQuestionDecomposition` 中监听进度事件
- [ ] 实现进度消息解析器
- [ ] 创建进度展示组件
- [ ] 集成到 RPOutline 聊天流程
- [ ] 添加单元测试

## 更新日志

| 日期       | 修改人 | 更新内容                     |
| ---------- | ------ | ---------------------------- |
| 2025-11-12 | -      | 初始创建，定义任务范围与结构 |

## 相关文档

- [Spec 文档编写规范](../../../../../docs/rule/doc-spec-rule.md)
- [React 组件规范](../../../../../docs/rule/code-react-component-rule.md)
- [TypeScript 编码规范](../../../../../docs/rule/code-typescript-style-rule.md)
- [API 请求规范](../../../../../docs/rule/code-api-client-rule.md)

