/**
 * 判断是否在终端中使用
 * @returns
 */
export const usedInClient = () => {
  // @ts-expect-error
  if (window.external && window.external.ClientFunc) {
    return true
  }
  return false
}
