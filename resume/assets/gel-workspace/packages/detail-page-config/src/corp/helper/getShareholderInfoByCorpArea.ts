import { CorpBasicInfo } from 'gel-types'
import { corpShareholderInfomation } from '../baseInfo'
import {
  corpShareholderInfomationEngland,
  corpShareholderInfomationIndian,
  corpShareholderInfomationThailand,
} from '../corpModuleCfgSpecial'

/**
 * 根据企业地区获取 股东工商信息
 *
 * 1 日本、卢森堡，自定义 变更历史
 * 2 泰国，自定义 股东信息-工商登记
 * 3 越南，自定义 分支机构、所属行业
 * 4 英国、新西兰，自定义 主要人员、股东-工商登记、历史主要人员
 */

export const getShareholderInfoByCorpArea = (corpArea: CorpBasicInfo['areaCode'] | undefined) => {
  switch (corpArea) {
    case '180201': // England
    case '180602': // New Zealand  两个国家 使用同一个配置
      return corpShareholderInfomationEngland
    case '180111': // India
      return corpShareholderInfomationIndian
    case '180120': // Thailand
      return corpShareholderInfomationThailand
    default:
      return corpShareholderInfomation
  }
}
