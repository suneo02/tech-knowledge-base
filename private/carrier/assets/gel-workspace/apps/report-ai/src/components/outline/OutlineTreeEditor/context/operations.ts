/**
 * OutlineTreeEditor 业务操作上下文导出
 *
 * @description 单独导出操作相关的 Provider 与 Hook，避免与 Store 上下文相互依赖
 */

export { OutlineOperationsProvider, useOutlineOperationsContext } from './OutlineOperationsContext';
export type { OutlineOperationsProviderProps } from './OutlineOperationsContext';
