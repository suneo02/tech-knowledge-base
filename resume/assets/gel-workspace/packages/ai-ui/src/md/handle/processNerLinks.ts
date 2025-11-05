import { usedInClient } from 'gel-util/env'
import { generateUrlByModule, LinkModule } from 'gel-util/link'

/**
 * 处理文本中的自定义链接，将[小米科技有限责任公司](ner:company:1047934153)的股权穿透报告 转换为[小米科技有限责任公司](https://gel.wind.com.cn/web/Company/Company.html?companycode=1047934153&from=openBu3#/)的股权穿透报告
 * @param text 要处理的文本内容
 * @returns 处理后的文本，匹配到的实体会被转换为 Markdown 链接格式
 */

export const processNerLinks = (text: string, isDev: boolean): string => {
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
