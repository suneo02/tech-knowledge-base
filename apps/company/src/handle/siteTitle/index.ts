import { intl } from 'gel-util/intl'
import { generatePageTitle as generatePageTitleUtil, PageLocation } from 'gel-util/misc'
import { useEffect, useMemo } from 'react'

export const SITE_TITLE_DEFAULT = intl('406815', 'Wind全球企业库')
/**
 * 函数生成标题：替换模板中的占位符
 * @deprecated 使用 gel-util/misc 中的 generatePageTitle 代替
 */
export const generatePageTitle = generatePageTitleUtil

/**
 * function for class component to set the document title dynamically on page load.
 * @param location
 * @param params
 */
export function setPageTitle(location: PageLocation, params?: string[] | string): void {
  const title = generatePageTitle(location, params)
  document.title = title
}

/**
 * Hook to set the document title dynamically on page load.
 * @param location - The current page location enum.
 * @param params - Optional parameters for the title template.
 */
export function usePageTitle(location: PageLocation, params?: string[] | string): void {
  const title = useMemo(() => {
    // Generate the title based on the location and parameters
    return generatePageTitle(location, params)
  }, [location, params])

  useEffect(() => {
    // Set the document title
    document.title = title
  }, [title])
}
