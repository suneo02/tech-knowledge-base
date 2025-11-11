import { needsBrowserCompat } from './detector'
export { needsBrowserCompat } from './detector'

/**
 * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
 * 将 gap 属性替换为 margin
 */
export const getGapCompatTransformer = (): Transformer => {
  const isLegacyBrowser = needsBrowserCompat()

  return {
    // @ts-expect-error 1111
    visit: (cssObj) => {
      // 如果不是旧版浏览器，直接返回原对象
      if (!isLegacyBrowser) {
        return cssObj
      }

      // 创建一个新对象，避免修改原对象
      const newCssObj = { ...cssObj }

      // 处理 gap 属性不兼容问题
      if (newCssObj.gap !== undefined || newCssObj.rowGap !== undefined || newCssObj.columnGap !== undefined) {
        const gapValue = newCssObj.gap || newCssObj.rowGap || newCssObj.columnGap
        delete newCssObj.gap
        delete newCssObj.rowGap
        delete newCssObj.columnGap

        // 根据 flex 方向添加替代样式
        if (newCssObj.flexDirection === 'column' || newCssObj.columnGap) {
          newCssObj['& > *:not(:last-child)'] = {
            marginBottom: gapValue,
          }
        } else {
          newCssObj['& > *:not(:last-child)'] = {
            marginRight: gapValue,
          }
        }
      }

      return newCssObj
    },
  }
}
