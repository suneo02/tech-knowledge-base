import { usedInClient } from '@/env'
import { generateUrlByModule, getRimeOrganizationUrl, LinkModule } from '@/link'
import { TerminalCommandPage } from '@/link/terminal'
import { CorpTag, CorpTagType } from 'gel-api'
import { getRiskTagCfg } from './risk'

/**
 * CDE 类型的标签 type 英文枚举 到中文的映射
 * @param tag
 * @returns
 */
const CDE_TYPE_MAP: Partial<Record<CorpTagType, string>> = {
  COMPANY_SCALE: '企业规模',
  OWNERSHIP: '企业所有制性质',
  LIFE_CYCLE: '生命周期',
  PRODUCT_WORD: '产品',
}

export type CorpTagUrlObj = {
  url: string
  openMethod?: // web 普通链接
  | 'web'
    // 终端命令
    | 'terminal'
    // 风险标签 只有在企业详情才会用 menu 跳转
    | 'risk'
}

export const getCorpTagUrl = (tag: CorpTag, options?: { isDev?: boolean }): CorpTagUrlObj | undefined => {
  const { isDev = false } = options || {}
  switch (tag.type) {
    case 'STOCK': {
      // 不在终端中，不跳转
      if (tag.id && !usedInClient()) {
        return
      }
      return {
        url: `!${TerminalCommandPage}[Minute,${tag.id}]`,
        openMethod: 'terminal',
      }
    }
    case 'INVESTMENT_INSTITUTION': {
      if (!tag.id) {
        return
      }
      const url = getRimeOrganizationUrl({ id: tag.id })
      if (!url) {
        return
      }
      return {
        url,
        openMethod: 'web',
      }
    }
    case 'GROUP_SYSTEM': {
      if (!tag.id) {
        return
      }
      const url = generateUrlByModule({ module: LinkModule.GROUP, params: { id: tag.id }, isDev })
      if (!url) {
        return
      }
      return {
        url,
        openMethod: 'web',
      }
    }
    case 'COMPANY_SCALE':
    case 'OWNERSHIP':
    case 'LIFE_CYCLE':
    case 'PRODUCT_WORD': {
      const typeCn = CDE_TYPE_MAP[tag.type]
      if (!typeCn) {
        return
      }
      const url = generateUrlByModule({
        module: LinkModule.CDE_SEARCH,
        params: { type: typeCn, val: tag.name },
        isDev,
      })
      if (!url) {
        return
      }
      return {
        url,
        openMethod: 'web',
      }
    }
    case 'SPECIAL_LIST':
    case 'LIST': {
      const url = generateUrlByModule({
        module: LinkModule.FEATURED_COMPANY,
        params: { id: tag.id },
        isDev,
      })
      if (!url) {
        return
      }
      return {
        url,
        openMethod: 'web',
      }
    }
    case 'OPERATOR': {
      if (!tag.id) {
        return
      }
      const url = generateUrlByModule({
        module: LinkModule.COMPANY_DETAIL,
        params: { companycode: tag.id },
        isDev,
      })
      if (!url) {
        return
      }
      return {
        url,
        openMethod: 'terminal',
      }
    }
    case 'RISK': {
      // 此处无需词条，因此 使用 mock 的 intl 方法
      const allRiskTag = getRiskTagCfg((_id, name) => name)
      const riskTag = allRiskTag[tag.id]
      if (!riskTag || !riskTag.jumpType) {
        return
      }
      return {
        url: riskTag.jumpType,
        openMethod: 'risk',
      }
    }
  }
}

export const handleJumpCorpTag = (
  urlObj: CorpTagUrlObj | undefined,
  cb: {
    onJumpTerminalCompatible: (url: string) => void
    onJumpRisk?: (url: string) => void
  }
) => {
  if (!urlObj) {
    return
  }
  // 终端中，跳转终端命令
  if (urlObj.openMethod === 'terminal' && usedInClient()) {
    cb.onJumpTerminalCompatible(urlObj.url)
  } else if (urlObj.openMethod === 'risk') {
    cb.onJumpRisk?.(urlObj.url)
  } else {
    window.open(urlObj.url)
  }
}

export const getCorpTagClickHandler = (
  tag: CorpTag,
  options: {
    onJumpTerminalCompatible: (url: string) => void
    onJumpRisk?: (url: string) => void
    isDev?: boolean
  }
) => {
  const { isDev = false } = options || {}
  const urlObj = getCorpTagUrl(tag, { isDev })
  if (!urlObj) {
    return
  }
  // 终端中，不跳转
  if (urlObj.openMethod === 'terminal' && !usedInClient()) {
    return
  }
  // 风控标签，检查是否需要跳转
  if (urlObj.openMethod === 'risk' && !options.onJumpRisk) {
    return
  }
  if (!urlObj.url) {
    return
  }
  // 其他标签，直接跳转
  return (_corpTag: CorpTag, _e: React.MouseEvent<HTMLDivElement>) => {
    handleJumpCorpTag(urlObj, options)
  }
}
