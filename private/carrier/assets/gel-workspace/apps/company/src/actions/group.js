/**
 * for redux
 * Created by Calvin
 *
 *  @format
 */

/** just for scroll */
export const setUpdateSelected = (access) => ({
  type: 'SET_UPDATE_SELECTED',
  payload: access,
})

/** 展开的树节点 */
export const setExpandedKeys = (node) => ({
  type: 'SET_EXPANDED_KEYS',
  payload: node,
})

/** 选中的树节点 */
export const setSelectedNode = (node) => ({
  type: 'SET_SELECTED_NODE',
  payload: node,
})
