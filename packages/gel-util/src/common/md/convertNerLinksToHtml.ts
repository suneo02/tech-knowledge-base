import { usedInClient } from '@/env'
import { LinkModule } from '@/link/config'
import { generateUrlByModule } from '@/link/handle'

/**
 * 将 NER（命名实体识别）Markdown 链接转换为实际可访问的 HTML 链接
 *
 * 该函数将形如 `[实体名称](ner:类型:编码)` 的 Markdown 链接转换为
 * 真实的 HTML `<a>` 标签，指向对应的公司详情页。
 *
 * 处理逻辑：
 * 1. 使用正则匹配所有 NER 链接格式
 * 2. 提取实体名称、类型和编码
 * 3. 根据编码生成公司详情页 URL
 * 4. 根据运行环境（客户端/浏览器）设置 target 属性
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {string} text - 包含 NER Markdown 链接的文本
 * @param {boolean} isDev - 是否为开发环境，影响生成的 URL
 * @returns {string} 处理后的文本，NER 链接已转换为 HTML <a> 标签
 *
 * @example
 * // 场景：将 NER 链接转换为 HTML
 * const text = '[小米科技有限责任公司](ner:company:1047934153)的股权穿透报告'
 * const result = convertNerLinksToHtml(text, false)
 * // 返回: '<a href="https://gel.wind.com.cn/web/Company/Company.html?companycode=1047934153&from=openBu3#/" target="_blank" data-companycode="1047934153">小米科技有限责任公司</a>的股权穿透报告'
 *
 * @example
 * // 场景：客户端环境使用 _self target
 * const text = '[华为技术有限公司](ner:company:123456)简介'
 * // 在客户端环境中调用
 * const result = convertNerLinksToHtml(text, false)
 * // 返回的 a 标签 target 属性为 "_self"（避免在客户端打开冗余空白页）
 */
export const convertNerLinksToHtml = (text: string, isDev: boolean): string => {
  const regex = /\[([^\]]+)\]\(ner:([^:]+):([^)]+)\)/g

  return text.replace(regex, (_match, entityName, _entityType, entityCode) => {
    const url = generateUrlByModule({
      module: LinkModule.COMPANY_DETAIL,
      params: { companycode: entityCode },
      isDev,
    })
    const target = usedInClient() ? '_self' : '_blank' // 在终端中要用_self，不然会打开冗余空白页面
    return `<a href="${url}" target=${target} data-companycode="${entityCode}">${entityName}</a>`
  })
}
