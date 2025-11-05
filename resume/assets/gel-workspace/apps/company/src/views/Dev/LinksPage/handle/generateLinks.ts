/**
 * 生成链接大全到 console
 *
 * 链接目录参照 src/views/Dev/LinksPage/data/index.ts
 */

import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { isDev } from '@/utils/env'
import { getLinksDataList } from '../data'

interface GeneratedLink {
  title: string
  module: LinksModule
  url: string
  options?: any
}

export const generateLinks = (): GeneratedLink[] => {
  const linksData = getLinksDataList()
  const links: GeneratedLink[] = []

  // 处理详情页链接
  linksData.forEach(({ module, title, ...options }) => {
    const url = getUrlByLinkModule(module, options)
    if (url) {
      links.push({
        title,
        module,
        url,
      })
    }
  })

  return links
}

// 使用示例：
export const printLinks = () => {
  const links = generateLinks()
  console.log('Generated Links:', links)
}

// 在开发环境中调用

if (isDev) {
  printLinks()
}
