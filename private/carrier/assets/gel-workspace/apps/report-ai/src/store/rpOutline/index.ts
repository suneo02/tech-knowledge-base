/**
 * RPOutline Redux 模块统一导出
 */

// 导出 reducer
export { rpOutlineReducer } from './slice';

// 导出 actions
export { rpOutlineActions } from './slice';

// 导出 selectors
export { selectRPOutlineState } from './selectors/base';

export { selectFileById, selectFileCount, selectFiles } from './selectors/files';

// 导出类型
export type { RPOutlineState } from './types';
