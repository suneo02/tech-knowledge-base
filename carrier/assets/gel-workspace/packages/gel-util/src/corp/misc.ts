/**
 * 将 item 添加到 data 的 children 中
 * @param data
 * @param item
 */
export function makeTree<T extends { children?: T[] }>(data: T, item: T) {
  data.children = data.children || []
  data.children.push(item)
}
