# ChatMessageCore 预设问句方案设计 v1

> [返回 README](./README.md) | 阶段：方案设计

## 元信息

| 字段     | 内容                                       |
| -------- | ------------------------------------------ |
| 版本     | v1                                         |
| 最近更新 | 2025-10-29                                 |
| 评审状态 | 待评审                                     |
| 相关 PR  | 待补充                                     |
| 需求文档 | [spec-require-v1.md](./spec-require-v1.md) |

## 设计原则

1. **职责分离**：Hook 只负责判定展示逻辑，组件负责数据获取和渲染
2. **简化实现**：去除非必要的缓存、复杂状态管理等功能
3. **降低耦合**：组件内部集成 API 调用，减少对外部状态的依赖

## 架构设计

### 模块划分

| 模块                             | 职责                           | 关键文件                                 |
| -------------------------------- | ------------------------------ | ---------------------------------------- |
| `PresetQuestions` 组件           | 获取问句、渲染列表、处理点击   | `.../components/PresetQuestions/`        |
| `usePresetQuestionsVisible` Hook | 判定预设问句是否展示及位置     | `.../hooks/usePresetQuestionsVisible.ts` |
| ChatMessageCore 集成             | 将 Hook 与组件插入消息渲染链路 | `.../ChatMessageCore.tsx`                |

### 数据流

ChatMessageCore → usePresetQuestionsVisible（判定展示） → PresetQuestions 组件（内部调用 API） → 用户点击 → 组件调用 onSend → 隐藏问句

### 状态管理

**usePresetQuestionsVisible Hook**：

- 输入：`parsedMessages: Message[]`、`isSentMsg: boolean`
- 输出：`shouldShow: boolean`、`position: 'welcome' | 'after-history' | 'hidden'`

**PresetQuestions 组件**：

- Props：`position: string`、`onSend: (message: string) => void`
- 内部状态：`questions: ChatQuestion[]`、`loading: boolean`

## 展示逻辑

### 位置判定规则

| `position`      | 渲染区域       | 触发条件                            |
| --------------- | -------------- | ----------------------------------- |
| `welcome`       | 欢迎消息下方   | `parsedMessages.length === 0`       |
| `after-history` | 最后一条消息后 | 有历史消息 && `isSentMsg === false` |
| `hidden`        | 不渲染         | `isSentMsg === true`                |

### 判定逻辑

- 用户已发送过消息 → 隐藏
- 无历史消息 → 展示在欢迎消息下方
- 有历史消息但用户未发言 → 展示在历史消息后
- 虚拟列表为空（仅欢迎气泡）时通过兜底渲染保证问句展示，不受虚拟滚动项数量影响

## 组件实现

### PresetQuestions 组件职责

1. 组件挂载时调用 `getQuestion` API（`questionsType=1, pageSize=3`）
2. 展示返回的 3 条问句（后端负责随机或排序）
3. 渲染问句列表，`after-history` 位置时添加分割线
4. 点击问句时调用 `onSend` 回调
5. 错误时降级为空状态，不阻塞主流程
6. 兜底支持虚拟列表为空场景，避免欢迎态缺失预设问句

### API 契约

- 请求：`GET /api/chat/question?questionsType=1&pageSize=3`
- 响应：`ChatQuestion[]`（最多 3 条）
- 详见：`packages/gel-api/src/chat/path.ts`

## 交互流程

1. 用户点击预设问句
2. 组件调用 `onSend(question)`
3. ChatMessageCore 设置 `isSentMsg = true`
4. 调用 `handleSendMessage(question)`
5. 隐藏预设问句区域

## 性能优化

- 使用 `React.memo` 包裹组件
- 使用 `useMemo` 缓存 position 计算
- 虚拟滚动兼容：方案 A（抽象为 item 类型）或方案 B（独立渲染）

## 风险与缓解

| 风险         | 影响 | 缓解方案                   |
| ------------ | ---- | -------------------------- |
| 虚拟滚动冲突 | 高   | 抽象为 item 类型或独立渲染 |
| 性能退化     | 中   | 监控指标，不达标则优化     |
| 内容相关性   | 低   | 后续支持按企业属性筛选     |

## 技术选型

- 状态管理：React Hooks
- 数据请求：gel-api（组件内部调用）
- 样式方案：Less Module + BEM
- 工具库：classnames

## 更新记录

| 日期       | 修改人  | 摘要                                        |
| ---------- | ------- | ------------------------------------------- |
| 2025-10-29 | Kiro AI | 使用 pageSize=3 获取问句，移除前端随机逻辑  |
| 2025-10-29 | Kiro AI | 精简文档至 ~90 行，去除冗余代码             |
| 2025-10-29 | Kiro AI | 简化架构：组件内集成 API，Hook 重命名       |
| 2025-10-29 | Kiro AI | 修正判断逻辑：使用 isSentMsg 替代 isChating |
| 2025-10-29 | Codex AI | 补充虚拟滚动为空时的预设问句兜底策略说明   |
