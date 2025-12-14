export { bidType2EnStage, bidType2Stage } from './bid'
export { generatePageTitle } from './siteTitle'
export { DEFAULT_SITE_TITLE_WEB_CN, type PageLocation } from './siteTitle/config'
export {
  detectChinese,
  detectEnglish,
  getDetectorByLocale,
  translateDataWithApi,
  type TranslateResult,
  type TranslateServiceOptions,
} from './translate'

/**
 * 通用的复制文本方法
 * @param text 要复制的文本
 * @param options 配置项
 */
export const copyText = (text: string) => {
  return new Promise((resolve, reject) => {
    // 创建临时 textarea
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)

    try {
      // 选择文本并复制
      textarea.select()
      document.execCommand('copy')
      resolve(true)
    } catch {
      reject(false)
    } finally {
      // 清理临时元素
      document.body.removeChild(textarea)
    }
  })
}
