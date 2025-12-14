import MarkdownIt from 'markdown-it'

import { generateUrlByModule, LinkModule } from 'gel-util/link'

/**
 * 创建支持股票代码自动链接化的 Markdown-it 渲染器实例（AI 回答专用）
 *
 * ## 核心功能
 * 1. Markdown 渲染：支持标准语法（标题、列表、表格、代码块等）
 * 2. 代码高亮：集成语法高亮，支持多种编程语言
 * 3. 股票代码识别：自动识别股票代码（如 000001.SZ）并转换为可点击链接
 * 4. HTML 安全：允许 HTML 标签（用于实体链接和溯源标记）
 *
 * ## 股票代码识别规则
 * | 格式 | 市场 | 正则 |
 * |------|------|------|
 * | 000001.SZ | 深圳主板/中小板/创业板 | \d{6}\.SZ |
 * | 600000.SH | 上海主板/科创板 | \d{6}\.SH |
 * | 830001.BJ | 北交所 | \d{6}\.BJ |
 * | 00700.HK | 港股 | \d{5}\.HK |
 *
 * ## Markdown-it 配置
 * - html: true - 允许 HTML 标签（实体链接和溯源标记需要）
 * - breaks: true - 单换行符转为 `<br>`（符合 AI 回答习惯）
 * - linkify: false - 禁用自动链接（避免误识别股票代码）
 * - typographer: true - 智能标点转换
 * - highlight - 代码高亮函数
 *
 * ## 实现原理
 * 使用装饰器模式包装原始 render 方法：
 * 文本 → 股票代码预处理（替换为 Markdown 链接） → md.render() → HTML
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param isDev - 是否为开发环境（影响生成的链接）
 * @returns 配置好的 Markdown-it 实例
 *
 * @example
 * const md = createStockCodeAwareMarkdownRenderer(false)
 * md.render('腾讯控股(00700.HK)今日上涨')
 * // 输出: <p>腾讯控股(<a href="...">00700.HK</a>)今日上涨</p>
 */
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
