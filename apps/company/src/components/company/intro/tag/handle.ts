import {
  getRimeOrganizationUrl,
  getUrlByLinkModule,
  handleJumpTerminalCompatibleAndCheckPermission,
  LinksModule,
} from '@/handle/link'
import { wftCommon } from '@/utils/utils.tsx'
import { TagsModule } from 'gel-ui'

export const getCompanyTagModule = (type, content, id) => {
  let tagModule = TagsModule.COMPANY
  switch (type) {
    case '投资机构': {
      if (content && id) {
        tagModule = TagsModule.COMPANY
        break
      }
      break
    }
    case '股票': {
      if (content && content.split('|')[1]) {
        tagModule = TagsModule.STOCK
        break
      }
      break
    }
    case '集团系': {
      if (content && id) {
        tagModule = TagsModule.GROUP
        break
      }
      break
    }
    case '名录标签': {
      if (content && id) {
        tagModule = TagsModule.RANK_DICT
        break
      }
      break
    }
    case '特殊名录': {
      if (content && id) {
        tagModule = TagsModule.RANK_DICT
        break
      }
      break
    }
    default: {
      if (type && content) {
        tagModule = TagsModule.FEATURE_COMPANY
        break
      }
      break
    }
  }
  return tagModule
}
/**
 * 解析 company tag
 * @param {string} item
 * @returns CompanyTagConfig
 */
export const getInfoFromCompanyTag = (item) => {
  try {
    const tmpArr = item.split('_')
    const type = tmpArr[0]
    const content = tmpArr[1]
    const id = tmpArr[2] ? tmpArr[2] : ''
    return {
      type,
      content,
      id,
    }
  } catch (e) {
    return {}
  }
}

/**
 * Generate URL based on tag type and parameters
 * @param {*} type
 * @param {*} val
 * @param {*} id
 * @returns {{ url: string, openMethod?: 'self' | 'new' | 'terminal' }}
 */
export const generateTagUrl = (type, val, id) => {
  const is_terminal = wftCommon.usedInClient()

  switch (type) {
    case '股票':
      if (is_terminal) {
        return {
          url: '!Page[Minute,' + val.split('|')[1] + ']',
          openMethod: 'terminal',
        }
      }
      return { url: '' }
    case '集团系':
      return {
        url: getUrlByLinkModule(LinksModule.GROUP, { id }),
        openMethod: 'new',
      }
    case '企业规模':
    case '生命周期':
    case '企业性质': // @deprecated 企业性质已全部改为企业所有制性质
    case '企业所有制性质':
    case '产品':
      return {
        url: 'index.html#/findCustomer?type=' + type + '&val=' + val,
        openMethod: 'self',
      }
    case '名录标签':
    case '特殊名录':
      if (id) {
        return {
          url: 'index.html#feturedcompany?id=' + id,
          openMethod: 'self',
        }
      }
      return { url: '' }
    case '投资机构':
      return {
        url: getRimeOrganizationUrl({ id }),
        openMethod: 'new',
      }
    case '运营实体':
      return {
        url: getUrlByLinkModule(LinksModule.COMPANY, { id }),
        openMethod: 'terminal',
      }
    default:
      return { url: '' }
  }
}

/**
 * Handle tag click jump logic
 * @param {*} type
 * @param {*} val
 * @param {*} id
 */
export const corpDetailTagJump = (type, val, id) => {
  try {
    const { url, openMethod } = generateTagUrl(type, val, id)
    if (!url) return

    switch (openMethod) {
      case 'new':
        window.open(url)
        break
      case 'terminal':
        handleJumpTerminalCompatibleAndCheckPermission(url)
        break
      case 'self':
      default:
        wftCommon.jumpJqueryPage(url)
        break
    }
  } catch (e) {
    console.error(e)
  }
}
