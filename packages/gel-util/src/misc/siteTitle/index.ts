import { PageLocation, PageTitleMap, SITE_TITLE_DEFAULT } from './config'

// 函数生成标题：替换模板中的占位符
export function generatePageTitle(location: PageLocation, params?: string[] | string): string {
  try {
    let paramParsed: string[] = []
    if (Array.isArray(params)) {
      paramParsed = params
    } else if (typeof params === 'string') {
      paramParsed = [params]
    }

    const template = PageTitleMap[location] || SITE_TITLE_DEFAULT
    // 检测参数是否足够匹配所有占位符
    const placeholderCount = (template.match(/{([^}]+)}/g) || []).length

    if (paramParsed.length < placeholderCount || paramParsed.some((param) => !param)) {
      return SITE_TITLE_DEFAULT // 参数不足时返回默认值
    }

    // 使用正则匹配所有的占位符，按顺序替换为传入的参数
    let paramIndex = 0
    return template.replace(/{([^}]+)}/g, () => paramParsed[paramIndex++] || '')
  } catch (e) {
    console.error('~ page title generate error', e, location, params)
    return SITE_TITLE_DEFAULT
  }
}
