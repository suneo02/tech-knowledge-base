import MarkdownIt from 'markdown-it'

import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { highlightCode } from './highlight'

export const createMDIT = (isDev: boolean) => {
  // 配置 markdown-it
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
    highlight: (str, lang) => highlightCode(str, lang),
  })

  // 禁止将股票代码识别为链接
  // 禁用常见的股票代码后缀作为顶级域名
  // md.linkify.tlds('BJ', false) // 禁用.BJ作为顶级域名
  // md.linkify.tlds('SH', false) // 禁用.SH作为顶级域名
  // md.linkify.tlds('SZ', false) // 禁用.SZ作为顶级域名
  // md.linkify.tlds('HK', false) // 禁用.HK作为顶级域名

  // 创建一个自定义的渲染函数来处理股票代码
  const originalRender = md.render.bind(md)
  md.render = function (src: string, ...args) {
    // 使用正则表达式匹配股票代码
    const stockCodeRegex = /\b(\d{5,6}\.(SH|SZ|BJ|HK))\b/g

    // 替换股票代码为链接
    const modifiedSrc = src.replace(stockCodeRegex, (match) => {
      try {
        const url = generateUrlByModule({
          module: LinkModule.WINDCODE_2_F9,
          params: {
            windcode: match,
          },
          isDev,
        })
        // 确保URL是有效的
        if (url && typeof url === 'string') {
          return `[${match}](${url})`
        }
      } catch (error) {
        console.error('生成URL时出错:', error)
      }
      // 如果生成URL失败，保持原始文本
      return match
    })

    // 使用原始渲染函数处理修改后的文本
    return originalRender(modifiedSrc, ...args)
  }
  return md
}
