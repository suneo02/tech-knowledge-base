# 外部组件统一渲染机制现状与规划 v1

> ↩️ 回链：[任务总览](./README.md) ｜ 阶段：现状分析 + 规划 ｜ 作者：Codex ｜ 更新：2025-11-04

## 1. 背景
- TinyMCE 内嵌的 ReportEditor 需要在编辑器 iframe 外挂载多个 React 组件，用于加载反馈、AIGC 操作入口与文本改写预览，详见 `apps/report-ai/docs/RPDetail/RPEditor/external-component-rendering.md`。
- 外部组件需与编辑器 DOM 保持同步（挂载、定位、滚动、销毁），但当前实现分散在多个 Hook 中，缺少统一生命周期管理。
- `apps/report-ai/src/components/ReportEditor/hooks/useTextRewritePreview/hook.tsx` 展示了「实例容器 + 渲染器 + 清理」的较优模式，为后续抽象提供参考。

## 2. 现状与能力地图
| 组件 | 主要逻辑 | 挂载策略 | 定位 & 跟随 | 清理方式 | 备注 |
| ---- | -------- | -------- | ------------ | -------- | ---- |
| 加载占位符 `useLoadingPlaceholders.tsx` | 查询 `[data-chapter-loading="true"]` 容器，复用 React Root | 编辑器内部 `section` 子节点内联 | 靠章节 DOM 结构静态定位，未处理滚动同步 | 每次渲染后手动调用 `cleanupOrphanLoadingPlaceholders` | Hook 内直接操作 EditorFacade，无全局管理 |
| AIGC 按钮 `useAIGCButton.tsx` | 根据章节 hover 状态动态创建按钮实例 | `document.body` 下全局容器 + 每章节实例容器 | 使用 `calculateAIGCButtonPositionForChapter`，需依赖 iframe 偏移 | 鼠标离开后移除实例，但全局容器在卸载时才销毁 | 与章节 Hover Hook 紧耦合，定位逻辑分散在 utils |
| 章节 Hover `useChapterHoverWithInit.tsx` | elementFromPoint 侦测 + hover 锁定 | 无 React，直接监听 iframe 文档事件 | 计算标题位置，暴露给按钮定位 | 通过 raf/timer 复位状态 | 管理事件挂载与清理，但未对其他外部组件复用 |
| 文本改写预览 `useTextRewritePreview/` | 建立预览实例、节流渲染、用户决策回调 | `document.body` 容器，通过 `createPreviewContainer` 管理 | `calculatePreviewPosition.ts` 处理滚动、边界与降级 | `cleanupPreviewContainer` + effect 清理 | 具备完备生命周期，可作为统一方案蓝本 |

## 3. 遗留问题
1. **生命周期分散**：各 Hook 内分别维护挂载、渲染、清理，缺少统一入口，`useExternalComponentRenderer.tsx` 仅协调两个 Hook，无法覆盖文本改写及后续新增组件。
2. **定位逻辑重复**：按钮与预览均实现 iframe 偏移、边界处理，`utils/positionCalculator.ts` 未被充分复用。
3. **滚动与可见性缺口**：加载占位依赖静态 DOM，缺少滚动监听；按钮依赖 hover 时机，若编辑器滚动后按钮易错位。
4. **容器管理不统一**：全局容器 id、React Root 生命周期、z-index 管理不一致，缺少集中清理（例如按钮离开后保留空容器）。
5. **扩展成本高**：新增外部组件需要重新实现容器、定位、清理逻辑，无法快速复用现有能力。

## 4. 优化方向概览
- **统一能力诉求清单**：容器管理、定位策略、触发检测、滚动同步、清理机制是所有外部组件的共性需求。
- **优先级建议**：先从复用 `useTextRewritePreview` 的容器 + 定位模型切入，再扩展到加载占位和章节按钮。
- **后续动作**：详细的实施规划、任务拆解与验证策略已迁移至 [spec-implementation-plan-v1.md](./spec-implementation-plan-v1.md)。

## 更新记录
| 日期       | 修改人 | 说明                   |
| ---------- | ------ | ---------------------- |
| 2025-11-04 | Codex  | 首版现状分析文档提交 |
| 2025-11-04 | Codex  | 拆分方案规划至独立文档 |
