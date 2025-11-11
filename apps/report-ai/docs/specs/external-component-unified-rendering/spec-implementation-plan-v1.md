# 外部组件统一渲染机制实施计划 v1

> ↩️ 回链：[任务总览](./README.md) ｜ 阶段：实施计划 ｜ 作者：Codex ｜ 更新：2025-11-04

## 1. 目标状态
- 建立统一的「外部浮层渲染服务」，覆盖容器创建、定位计算、滚动同步与销毁，显式对应 AIGC 按钮、加载占位符、文本改写预览等场景。
- `useExternalComponentRenderer.tsx` 提升为注册式调度中心，可按需挂载多种外部组件，降低新增场景的接入成本。
- 复用 `useTextRewritePreview` 现有的容器与渲染模型，使各组件共享一致的生命周期与异常兜底策略。
- 保持当前交互体验不回归：章节 hover 逻辑、按钮可点击性、流式内容更新节奏照常运行。

## 2. 架构原则
| 原则 | 说明 | 落地举措 |
| ---- | ---- | -------- |
| 单一入口 | 所有外部浮层统一在一个管理器下注册与调度 | 引入 `useExternalFloatingLayerManager`（命名暂定），对外暴露 register/render/cleanup 接口 |
| 声明式配置 | 将组件行为抽象为配置对象，降低重复代码 | 定义 `ExternalFloatingComponent` 协议，包含 `trigger`, `mountStrategy`, `render`, `onBeforeUnmount` |
| 容器池化 | 统一 React Root 生命周期与容器复用策略 | 从 `useTextRewritePreview` 拆出 `floatingContainerManager`，支持多实例缓存与清理 |
| 定位复用 | 所有定位逻辑基于同一工具实现 | 扩展 `apps/report-ai/src/components/ReportEditor/hooks/utils/positionCalculator.ts`，封装章节锚点、选区锚点、降级策略 |
| 渐进式落地 | 分阶段迁移，确保任一组件可独立回滚 | 为每次迁移增加 Feature Flag 或配置开关，文档记录回滚路径 |

## 3. 能力模块拆分
| 模块 | 功能描述 | 预期职责 | 参考文件 |
| ---- | -------- | -------- | -------- |
| Trigger Adapter | 监听触发条件（章节 hover、loading 标记、选区变更） | 输出标准化的 context（anchor rect、章节 id 等） | `useChapterHoverWithInit.tsx`, `useLoadingPlaceholders.tsx` |
| Container Manager | 管理全局容器、实例容器及 React Root | 提供 `getOrCreateInstance` / `destroyInstance` / `destroyAll` | `useTextRewritePreview/utils/previewContainerManager.ts` |
| Position Service | 负责坐标计算、滚动同步、边界处理 | 针对不同锚点返回浮层定位信息，支持 body 降级 | `utils/positionCalculator.ts`, `useTextRewritePreview/utils/calculatePreviewPosition.ts` |
| Rendering Adapter | 接入具体组件的 React render 逻辑 | 在 manager 调度下执行渲染与清理，暴露挂载句柄 | `useAIGCButton.tsx`, `useLoadingPlaceholders.tsx` |
| Scheduler | 统一 raf/microtask 调度策略 | 避免 DOM 流式更新竞争，提供节流与批处理能力 | `useExternalComponentRenderer.tsx` |

## 4. 子任务拆解
| 序号 | 子任务 | 负责人 | 完成条件 | 关联目录 |
| ---- | ------ | ------ | -------- | -------- |
| P1-1 | 梳理现有 Hook 的公共逻辑，补充单测基线 | TBD | 列出共享能力清单，新增覆盖现状的 Hook 级单测 | `apps/report-ai/src/components/ReportEditor/hooks/` |
| P1-2 | 拆分并泛化 `previewContainerManager`，实现浮层容器池 | TBD | 新增公共模块，AIGC 按钮迁移至新容器接口 | `.../hooks/useTextRewritePreview/utils/` |
| P1-3 | 扩展 `positionCalculator.ts` 支持章节 & 选区锚点 | TBD | 新增统一方法 + 单测，按钮与预览共用定位函数 | `.../hooks/utils/positionCalculator.ts` |
| P1-4 | 重构 `useExternalComponentRenderer` 为注册式调度器 | TBD | 提供 register API，加载占位 & 按钮接入，保留旧接口兼容 | `.../hooks/useExternalComponentRenderer.tsx` |
| P1-5 | 迁移 `useLoadingPlaceholders` 到新机制 | TBD | 使用统一容器与调度，验证 loading 清理正常 | `.../hooks/useLoadingPlaceholders.tsx` |
| P1-6 | Storybook + Vitest 场景验证及性能基线 | TBD | Storybook 覆盖典型交互，Vitest 覆盖容器/定位/调度 | `apps/report-ai/src/components/ReportEditor` |

## 5. 验证策略
- **单元测试**：针对容器池、定位服务、调度器新增 Vitest；重点验证多实例复用、清理、滚动同步。
- **Storybook 回归**：新增「External Floating Layers」场景，覆盖章节 hover、滚动、改写流程。
- **集成验证**：在 ReportEditor E2E 流程中回归 AIGC 按钮点击、文本改写确认、loading 停止等关键路径。
- **性能观测**：在开发模式输出 manager 统计（实例数、raf 执行耗时），上线后结合现有埋点监控异常率。

## 6. 风险与应对
| 风险 | 描述 | 应对策略 |
| ---- | ---- | -------- |
| 样式层级冲突 | 统一容器后 z-index、定位上下文可能变化 | 为新容器添加前缀 class，并提供开关允许快速回滚 |
| 时序竞态 | 编辑器未 ready 或 DOM 流式更新导致渲染失败 | 保留 Promise + raf 双延迟策略，并在日志中记录跳过原因 |
| 迁移回归 | 分阶段迁移过程中旧逻辑与新逻辑交错 | 每次迁移组件时编写对比用例，确保行为与旧实现一致 |
| 性能波动 | 统一调度可能引入额外 raf 调用 | 在调度器中加入批处理与节流，监控性能指标 |

## 更新记录
| 日期       | 修改人 | 说明                     |
| ---------- | ------ | ------------------------ |
| 2025-11-04 | Codex  | 创建实施计划 v1 文档初稿 |
