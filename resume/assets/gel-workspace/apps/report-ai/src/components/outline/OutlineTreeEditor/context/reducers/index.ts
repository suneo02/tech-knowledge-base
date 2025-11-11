/**
 * 大纲编辑器主 Reducer
 *
 * @description 组合所有子 reducer，处理完整的状态更新逻辑
 */

import { EditorState, OutlineEditorAction } from '../types';
import { handleNavigationActions } from './navigationReducer';
import { handleOutlineActions } from './outlineReducer';
import { handleThoughtGenerationActions } from './thoughtGenerationReducer';

/**
 * 大纲编辑器主 Reducer
 *
 * @description 处理所有大纲编辑操作，更新编辑器状态
 * 使用组合模式，将不同功能的 reducer 分离
 */
export const outlineReducer = (state: EditorState, action: OutlineEditorAction): EditorState => {
  // 尝试使用大纲数据相关的 reducer 处理
  const outlineResult = handleOutlineActions(state, action);
  if (outlineResult !== null) {
    return outlineResult;
  }

  // 尝试使用导航相关的 reducer 处理
  const navigationResult = handleNavigationActions(state, action);
  if (navigationResult !== null) {
    return navigationResult;
  }

  // 尝试使用编写思路生成相关的 reducer 处理
  const thoughtGenerationResult = handleThoughtGenerationActions(state, action);
  if (thoughtGenerationResult !== null) {
    return thoughtGenerationResult;
  }

  // 如果所有 reducer 都不处理，返回原状态
  return state;
};

// 重新导出子 reducer，便于测试和调试
export { handleNavigationActions } from './navigationReducer';
export { handleOutlineActions } from './outlineReducer';
export { handleThoughtGenerationActions } from './thoughtGenerationReducer';
