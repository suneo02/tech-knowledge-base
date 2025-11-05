import { japanRowConfig } from '@/handle/corpModuleCfgSpecial/japanRowConfig.tsx'
import { thaRowConfig } from '@/handle/corpModuleCfgSpecial/thaRowConfig.tsx'
import { ICorpTableCfg } from '@/components/company/type'
import { vieRowConfig } from '@/handle/corpModuleCfgSpecial/vieRowConfig.tsx'
import { englandRowConfig } from '@/handle/corpModuleCfgSpecial/englandRowConfig.tsx'
import { indRowConfig } from '@/handle/corpModuleCfgSpecial/indRowConfig.tsx'
import intl from '@/utils/intl'
import { TCorpDetailSubModule } from '@/handle/corp/detail/module/type.ts'

import { TCorpArea } from '@/handle/corp/corpArea.ts'

export const makeCorpTableByCorpArea = (corpArea: TCorpArea, table: ICorpTableCfg, moduleKey: TCorpDetailSubModule) => {
  if (corpArea) {
    // 所有海外国家，股东信息hint不展示
    if (/showShareholder/.test(moduleKey)) {
      table.hint = null
    }
  }

  /**
   * 1 日本、卢森堡，自定义 变更历史
   * 2 泰国，自定义 股东信息-工商登记
   * 3 越南，自定义 分支机构、所属行业
   * 4 英国、新西兰，自定义 主要人员、股东-工商登记、历史主要人员
   */
  switch (corpArea) {
    case 'japan':
    case 'lux': {
      /**
       * @deprecated
       */
      if (/showHistoryChange/.test(moduleKey)) {
        // 变更历史
        table.dataComment =
          intl('342096', '数据来源') + (corpArea === 'lux' ? '：卢森堡商业登记处（LBR）' : '：日本国税厅')
        Object.assign(table, japanRowConfig['showHistoryChange'])
      }
      break
    }
    case 'tha': {
      if (/showMainMemberInfo|showShareholder/.test(moduleKey)) {
        // 主要人员、股东信息
        table.downDocType = ''
        table.dataComment = intl('342096', '数据来源') + '：泰国DBD政府数据库'
      }

      if (/showShareholder/.test(moduleKey)) {
        // 是股东信息
        if (!('children' in thaRowConfig['showShareholder'])) {
          // 配置错误
          console.error(
            '🚀 ~ makeTable ~ thaRowConfig["showShareholder"].children[0]',
            '配置错误',
            thaRowConfig['showShareholder']
          )
        } else {
          const cfgNew = thaRowConfig['showShareholder'].children[0]
          if (table.enumKey && table.enumKey === cfgNew.enumKey) {
            // 泰国 工商登记
            Object.assign(table, cfgNew)
          } else {
            // 海外上市公司 公告披露，不展示dataComment
            table.dataComment = null
          }
        }
      }
      break
    }
    case 'vie': {
      if (/showCompanyBranchInfo|showVietnamIndustry/.test(moduleKey)) {
        table.downDocType = ''
        table.dataComment = intl('342096', '数据来源') + '：越南商业登记管理局'
      }
      if (/showCompanyBranchInfo/.test(moduleKey)) {
        table.comment = 'Ngành nghề kinh doanh'
        Object.assign(table, vieRowConfig['showCompanyBranchInfo'])
      } else {
        table.comment = 'Mã số thuế chi nhánh'
      }
      break
    }
    case 'england':
    case 'nzl': {
      if (/showMainMemberInfo|showShareholder|historylegalperson/.test(moduleKey)) {
        // 主要人员、股东信息等
        table.downDocType = ''
        table.dataComment =
          intl('342096', '数据来源') + (corpArea === 'nzl' ? '：新西兰商业编号(NZBN)' : '：英国公司注册处（GOV.UK）')
      }
      if (/showShareholder/.test(moduleKey)) {
        // type check
        if (!('children' in englandRowConfig['showShareholder'])) {
          // 配置错误
          console.error(
            '🚀 ~ makeTable ~ englandRowConfig["showShareholder"].children[0]',
            '配置错误',
            englandRowConfig['showShareholder']
          )
        } else {
          const cfgShareholderNew = englandRowConfig['showShareholder'].children[0]
          if (table.enumKey && table.enumKey === cfgShareholderNew.enumKey) {
            // 英国 工商登记
            Object.assign(table, cfgShareholderNew)
          } else {
            // 海外上市公司 公告披露，不展示dataComment
            table.dataComment = null
          }
        }
      }

      if (/showMainMemberInfo/.test(moduleKey)) {
        if (!('children' in englandRowConfig['showMainMemberInfo'])) {
          // 配置错误
          console.error(
            '🚀 ~ makeTable ~ englandRowConfig["showMainMemberInfo"].children',
            '配置错误',
            englandRowConfig['showMainMemberInfo']
          )
        } else {
          // 英国企业，主要人员，单独处理
          const cfgMainMemberNew = englandRowConfig['showMainMemberInfo'].children.find((child) => {
            return child.enumKey === table.enumKey && child.enumKey
          })
          if (cfgMainMemberNew) {
            Object.assign(table, cfgMainMemberNew)
          }
        }
      }
      if (/historylegalperson/.test(moduleKey)) {
        // 英国公司 模块名称变更
        Object.assign(table, englandRowConfig['historylegalperson'])
        table.title = window.en_access_config ? 'Historical ' + intl('138503', ' 主要人员 ') : '历史主要人员'
      }
      break
    }
    case 'india': {
      if (/showMainMemberInfo|showShareholder|historylegalperson/.test(moduleKey)) {
        // 主要人员、股东信息
        table.downDocType = ''
        table.dataComment = intl('342096', '数据来源') + '：印度公司事务部'
      }
      // type check
      if (!('children' in indRowConfig['showShareholder'])) {
        // 配置错误
        console.error(
          '🚀 ~ makeTable ~ indRowConfig["showShareholder"].children[0]',
          '配置错误',
          indRowConfig['showShareholder']
        )
      } else {
        if (/showShareholder/.test(moduleKey)) {
          const cfgShareholderNew = indRowConfig['showShareholder'].children[0]
          if (table.enumKey && table.enumKey === cfgShareholderNew.enumKey) {
            Object.assign(table, cfgShareholderNew)
          }
        }
      }
      break
    }
    case 'canada': {
      if (/showMainMemberInfo|showShareholder|historylegalperson|historycompany/.test(moduleKey)) {
        // 主要人员、股东信息
        table.downDocType = ''
        table.dataComment = intl('342096', '数据来源') + '：加拿大政府网站'
      }
      if (/historycompany/.test(moduleKey)) {
        // 变更历史
        Object.assign(table, { title: window.en_access_config ? 'History Changes' : '变更历史' })
      }
      break
    }
    default:
      // 以下模块仅上述地区展示，大陆等地区直接null
      if (moduleKey === 'showHistoryChange') {
        return false
      }
      break
  }
}
