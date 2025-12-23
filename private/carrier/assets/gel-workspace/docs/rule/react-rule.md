# React 开发规范

## 快速准则
- 容器组件处理业务与数据，请保持 ≤200 行；展示组件只接 props，不持有状态。
- 异步统一通过 `ahooks/useRequest`，返回 `{ data, loading, error, ...actions }`。
- 类名使用 `classnames` 搭配 Less Module；状态样式走 BEM。
- 优先使用内置 Hook + 自定义 Hook；避免未 memo 的匿名函数传递。
- 组件/Hook 导出写 JSDoc 并 `@see` 设计或交互文档。

## 状态决策
- **局部状态**：`useState` + `useMemo`/`useCallback` 保持纯净。
- **共享状态**：Context + `useReducer`；Provider 内集中封装类型与动作。
- **全局单例**：仅当跨应用共享或存在复杂中间件需求时使用 Redux。
- **派生数据**：用 `useMemo` 或选择器 Hook，避免重复计算。

## 组件拆分与性能
- 超出 8 个 props 或包含异步/副作用时，拆出自定义 Hook 或子组件。
- 在列表、重渲染组件上应用 `React.memo`；函数依赖明确写入数组。
- 路由级组件使用 `lazy` + `Suspense`，并提供 loading fallback。
- 事件处理/副作用内使用 `withErrorHandling` 或 `onError` 统一兜底。

## 检查清单
- [ ] 组件职责单一，展示层无副作用。
- [ ] Hook 命名以 `use` 开头，返回对象语义明确。
- [ ] `useRequest` 配置了 `ready`/`refreshDeps`/`onError` 等关键选项。
- [ ] 类名仅来自模块样式与 `classnames`，状态通过 BEM 后缀。
- [ ] 文档/STORY 对应 `@see` 已更新。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [TypeScript 开发规范](./typescript-rule.md)
- [样式开发规范](./style-rule.md)
- [错误处理规范](./error-handling-rule.md)
