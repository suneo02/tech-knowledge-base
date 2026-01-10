# ChatMessageCore 预设问句实施拆解 v1

> [返回 README](./README.md) | 阶段：实施拆解

## 元信息

| 字段     | 内容                                                 |
| -------- | ---------------------------------------------------- |
| 版本     | v1                                                   |
| 最近更新 | 2025-10-29                                           |
| 负责人   | 待分配                                               |
| 设计文档 | [spec-design-v1.md](./spec-design-v1.md)             |
| 验证文档 | [spec-verification-v1.md](./spec-verification-v1.md) |

## 里程碑概览

| 阶段        | 目标                 | 涉及任务           | 状态 | 预计完成 |
| ----------- | -------------------- | ------------------ | ---- | -------- |
| 阶段 1 基础 | 接口与组件雏形       | Task 1.1, 1.2      | ✅   | 已完成   |
| 阶段 2 核心 | Hook 与展示逻辑完善  | Task 2.1, 2.2      | 🟡   | 待确认   |
| 阶段 3 测试 | 样式、性能、测试齐备 | Task 3.1, 3.2, 3.3 | ⏳   | 待确认   |
| 阶段 4 文档 | 文档与注释对齐       | Task 4.1           | ⏳   | 待确认   |

## 任务拆解

### 阶段 1：基础准备 ✅

**Task 1.1 接口对接与类型定义** ✅

- 负责人：Kiro AI | 工作量：0.5d | 完成时间：2025-10-29
- 说明：复用 `gel-api` 的 `ChatQuestion` 类型
- 交付物：
  - ✅ 类型定义完整（从 `gel-api` 导入 `ChatQuestion`）
  - ✅ API 契约明确（`getQuestion` 接口，`questionsType=1`）

**Task 1.2 PresetQuestions 组件搭建** ✅

- 负责人：Kiro AI | 工作量：1.5d | 完成时间：2025-10-29
- 说明：完成组件结构、样式骨架、API 集成
- 交付物：
  - ✅ 组件基础渲染（`PresetQuestions` 组件）
  - ✅ 内部集成 getQuestion API（组件内部调用，使用 `pageSize=3`）
  - ✅ 展示逻辑（直接展示返回的 3 条问句）
  - ✅ 错误降级（API 失败时降级为空状态，不阻塞主流程）
  - ✅ Props 设计（`position` 和 `onSend`）
  - ✅ 样式实现（Less Module + BEM）
  - ✅ Icon 支持（参考 PlaceholderBase 实现）
  - ✅ 组件文档（README.md）

**Task 1.3 usePresetQuestionsVisible Hook 实现** ✅

- 负责人：Kiro AI | 工作量：0.5d | 完成时间：2025-10-29
- 说明：实现展示位置判定逻辑，使用 `isSentMsg` 状态控制
- 交付物：
  - ✅ Hook 完整实现（`usePresetQuestionsVisible`）
  - ✅ 展示逻辑判定（基于 `parsedMessages` 和 `isSentMsg`）
  - ✅ 使用 `useMemo` 优化性能
  - ✅ Hook 文档（README.md）

**Task 1.4 ChatMessageCore 集成** ✅

- 负责人：Kiro AI | 工作量：0.5d | 完成时间：2025-10-29
- 说明：将 Hook 和组件集成到 ChatMessageCore
- 交付物：
  - ✅ 添加 `isSentMsg` 状态管理
  - ✅ 使用 Hook 判定展示
  - ✅ 插入组件到虚拟滚动列表
  - ✅ 处理 `onSend` 回调，设置 `isSentMsg`
  - ✅ 更新相关注释和文档

---

### 阶段 2：核心功能 🟡

**Task 2.1 usePresetQuestionsVisible Hook 实现** ⏳

- 负责人：待分配 | 工作量：0.5d | 优先级：P0
- 要点：实现展示位置判定逻辑、使用 useMemo 优化、编写单元测试（≥ 80%）
- 交付物：Hook 完整实现、单元测试用例

**Task 2.2 ChatMessageCore 集成** ⏳

- 负责人：待分配 | 工作量：0.5d | 优先级：P0
- 要点：使用 Hook 判定展示、插入组件、处理 onSend 回调设置 isSentMsg、兼容虚拟滚动、兜底处理虚拟列表为空时的预设问句展示
- 交付物：集成代码、Storybook 示例

---

### 阶段 3：测试优化 ⏳

**Task 3.1 组件集成与边界处理** ⏳

- 负责人：待分配 | 工作量：0.5d | 优先级：P0
- 要点：完善 props、错误降级、组件卸载清理
- 性能目标：首屏渲染 < 2s、点击响应 < 200ms

**Task 3.2 样式与交互优化** ⏳

- 负责人：待分配 | 工作量：0.5d | 优先级：P1
- 要点：统一 Less 变量、响应式布局、深浅色主题适配

**Task 3.3 测试验证** ⏳

- 负责人：待分配 | 工作量：1d | 优先级：P0
- 要点：详见 [spec-verification-v1.md](./spec-verification-v1.md)
- 交付物：Vitest 测试用例、覆盖率报告、手动回归记录

---

### 阶段 4：文档收尾 ⏳

**Task 4.1 文档与注释同步** ⏳

- 负责人：待分配 | 工作量：0.5d | 优先级：P1
- 要点：更新 COMPONENT.md、补充代码注释、更新 README 与监控指标

## 验收标准

详细测试策略见 [spec-verification-v1.md](./spec-verification-v1.md)

### 功能验收

- [ ] 场景 1-3 展示逻辑正确
- [ ] 点击发送流程完整
- [ ] 错误降级不阻塞主流程
- [ ] isSentMsg 状态管理正确

### 性能验收

- [ ] 接口响应 < 200ms
- [ ] 点击响应 < 200ms
- [ ] 滚动帧率 ≥ 60fps

### 代码质量

- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 组件测试覆盖率 ≥ 70%
- [ ] 无 P0/P1 级别 Bug

## 风险与预案

| 风险           | 影响 | 缓解方案                   |
| -------------- | ---- | -------------------------- |
| 虚拟滚动冲突   | 高   | 抽象为 item 类型或独立渲染 |
| 性能退化       | 中   | 监控指标，不达标则优化     |
| 内容相关性不足 | 低   | 后续支持按企业属性筛选     |
| 接口稳定性问题 | 中   | 错误降级，不阻塞主流程     |

## 交付物清单

- 代码：`PresetQuestions` 组件及样式、`usePresetQuestionsVisible` Hook、ChatMessageCore 集成代码
- 测试：Vitest 单元测试、组件集成测试、手动回归 checklist
- 文档：COMPONENT.md 更新、代码注释完善、Spec 文档归档

## 更新记录

| 日期       | 修改人  | 摘要                                 |
| ---------- | ------- | ------------------------------------ |
| 2025-10-29 | Kiro AI | 精简文档至 ~100 行，优化任务描述格式 |
| 2025-10-29 | Kiro AI | 简化实现方案：组件内集成 API         |
| 2025-10-29 | Kiro AI | 优化任务拆解结构                     |
| 2025-10-29 | Codex AI | 补充虚拟列表兜底渲染任务说明         |
