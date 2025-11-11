/**
 * OutlineStore Context - 大纲编辑器状态管理
 *
 * @description 提供大纲编辑器的状态管理 Context，包含数据、操作方法等
 * 使用 Context + useReducer 模式管理复杂状态
 */

import { ReportOutlineData } from 'gel-api';
import React, { createContext, useContext, useReducer } from 'react';
import { createInitialState } from './initialState';
import { outlineReducer } from './reducers';
import { EditorState, OutlineEditorAction } from './types';

/**
 * 大纲编辑器状态 Context
 */
const OutlineStateContext = createContext<EditorState | null>(null);

/**
 * 大纲编辑器 Dispatch Context
 */
const OutlineDispatchContext = createContext<React.Dispatch<OutlineEditorAction> | null>(null);

/**
 * OutlineStore Provider Props
 */
export interface OutlineStoreProviderProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 初始数据 */
  initialData?: ReportOutlineData;
}

/**
 * OutlineStore Provider 组件
 *
 * @description 提供大纲编辑器状态管理的双 Context Provider
 * 分离 state 和 dispatch，避免不必要的重渲染
 */
export const OutlineStoreProvider: React.FC<OutlineStoreProviderProps> = ({ children, initialData }) => {
  const [state, dispatch] = useReducer(outlineReducer, createInitialState(initialData));

  return (
    <OutlineStateContext.Provider value={state}>
      <OutlineDispatchContext.Provider value={dispatch}>{children}</OutlineDispatchContext.Provider>
    </OutlineStateContext.Provider>
  );
};

/**
 * 使用大纲编辑器状态的 Hook
 *
 * @description 获取大纲编辑器的状态，只在状态变化时重渲染
 * 必须在 OutlineStoreProvider 内部使用
 *
 * @returns 大纲编辑器的状态
 * @throws 如果在 OutlineStoreProvider 外部使用会抛出错误
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const state = useOutlineState()
 *
 *   return (
 *     <div>
 *       <h1>{state.data.outlineName}</h1>
 *       {state.isSyncing && <div>正在同步...</div>}
 *       {state.error && <div className="error">{state.error}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export const useOutlineState = (): EditorState => {
  const state = useContext(OutlineStateContext);

  if (!state) {
    throw new Error('useOutlineState must be used within OutlineStoreProvider');
  }

  return state;
};

/**
 * 使用大纲编辑器 Dispatch 的 Hook
 *
 * @description 获取 dispatch 函数，用于触发大纲编辑操作
 * 必须在 OutlineStoreProvider 内部使用
 *
 * @returns dispatch 函数
 * @throws 如果在 OutlineStoreProvider 外部使用会抛出错误
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const dispatch = useOutlineDispatch()
 *
 *   const handleRename = () => {
 *     dispatch({
 *       type: OutlineAction.RENAME_CHAPTER_TITLE,
 *       payload: {
 *         chapterPath: [0],
 *         newTitle: 'New Title',
 *         previousTitle: 'Old Title'
 *       }
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleRename}>
 *       Rename Chapter
 *     </button>
 *   )
 * }
 * ```
 */
export const useOutlineDispatch = (): React.Dispatch<OutlineEditorAction> => {
  const dispatch = useContext(OutlineDispatchContext);

  if (!dispatch) {
    throw new Error('useOutlineDispatch must be used within OutlineStoreProvider');
  }

  return dispatch;
};

/**
 * 使用大纲编辑器完整 Context 的 Hook（兼容性）
 *
 * @description 同时获取状态和 dispatch，保持向后兼容
 * 注意：使用此 Hook 的组件会在状态变化时重渲染
 *
 * @returns 包含状态和 dispatch 的对象
 * @deprecated 推荐使用 useOutlineState 和 useOutlineDispatch 分别获取
 */
export const useOutlineStoreContext = () => {
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();

  return { state, dispatch };
};

/**
 * 导出类型
 */
export { OutlineAction } from './types';
export type { EditorState, OutlineEditorAction } from './types';
