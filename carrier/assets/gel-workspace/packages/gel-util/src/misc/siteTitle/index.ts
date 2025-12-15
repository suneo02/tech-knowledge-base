import { TIntl } from '@/types/intl'
import { PageLocation, getPageTitleMap, getSiteDefaultTitle } from './config'

// 函数生成标题：替换模板中的占位符
export function generatePageTitle(t: TIntl, location: PageLocation, params?: string[] | string): string {
  try {
    let paramParsed: string[] = []
    if (Array.isArray(params)) {
      paramParsed = params
    } else if (typeof params === 'string') {
      paramParsed = [params]
    }

    const defaultTitle = getSiteDefaultTitle(t)
    const templateFunc = getPageTitleMap[location]
    const template = templateFunc ? templateFunc(t) : defaultTitle

    // 检测参数是否足够匹配所有占位符
    const placeholderCount = (template.match(/{([^}]+)}/g) || []).length

    if (paramParsed.length < placeholderCount || paramParsed.some((param) => !param)) {
      return defaultTitle // 参数不足时返回默认值
    }

    // 使用正则匹配所有的占位符，按顺序替换为传入的参数
    let paramIndex = 0
    return template.replace(/{([^}]+)}/g, () => paramParsed[paramIndex++] || '')
  } catch (e) {
    console.error('~ page title generate error', e, location, params)
    return getSiteDefaultTitle(t)
  }
}
