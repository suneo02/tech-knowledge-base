import { generateUrlByModule, LinkModule } from 'gel-util/link'
import MarkdownIt from 'markdown-it'

export const createStockCodeAwareMarkdownRenderer = (isDev: boolean): MarkdownIt => {
  // 创建 Markdown-it 实例并配置
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
  })

  // 保存原始 render 方法（装饰器模式）
  const originalRender = md.render.bind(md)

  // 重写 render 方法，添加股票代码预处理
  md.render = function (src: string, ...args) {
    // 股票代码正则：\b(\d{5,6}\.(SH|SZ|BJ|HK))\b
    // - 5-6位数字 + 市场代码
    // - 词边界确保完整匹配
    const stockCodeRegex = /\b(\d{5,6}\.(SH|SZ|BJ|HK))\b/g

    // 替换股票代码为 Markdown 链接
    const modifiedSrc = src.replace(stockCodeRegex, (match) => {
      try {
        const url = generateUrlByModule({
          module: LinkModule.WINDCODE_2_F9,
          params: { windcode: match },
          isDev,
        })

        if (url && typeof url === 'string') {
          return `[${match}](${url})`
        }
      } catch (error) {
        console.error('生成股票代码链接时出错:', error)
      }

      // 降级策略：URL 生成失败时保持原始文本
      return match
    })

    // 使用原始 render 方法渲染处理后的文本
    return originalRender(modifiedSrc, ...args)
  }

  return md
}
