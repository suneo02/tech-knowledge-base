import { message } from 'antd'
import { wftCommon } from '../../../../../utils/utils'
import { myWfcAjax } from '../../../../../views/Chart/CompanyChart'

import { getCompanyReportDownPage } from '@/handle/link'
import intl from '../../../../../utils/intl'
import { pointBuriedByModule } from '../../../../../api/pointBuried/bury'
import { CompanyReportConfig, ECorpReport } from '../../../../../handle/corp/report/config'

export const RelatedPartyReportRule = {
  CorpAccount: 'CoryAccount', // 企业会计准则
  Shanghai: 'Shanghai', // 上交所规则
  Shenzhen: 'Shenzhen', // 深交所规则
  Bank: 'bank', //
}

export const RelatedPartyReportRuleCode = {
  [RelatedPartyReportRule.CorpAccount]: 4,
  [RelatedPartyReportRule.Shanghai]: 2,
  [RelatedPartyReportRule.Shenzhen]: 3,
  [RelatedPartyReportRule.Bank]: 5,
}

export const RelatedPartyReportRuleTitle = {
  [RelatedPartyReportRule.CorpAccount]: intl('358256', '企业会计准则'),
  [RelatedPartyReportRule.Shanghai]: intl('358257', '上交所规则'),
  [RelatedPartyReportRule.Shenzhen]: intl('358236', '深交所规则'),
  [RelatedPartyReportRule.Bank]: intl('358258', '银保监规则'),
}

/**
 *
 * @param {*} companyCode
 * @param {*} companyName
 * @param {RelatedPartyReportRuleCode} exchangeRule
 */
export const downloadRelatedPartyReport = (companyCode, companyName, exchangeRule) => {
  pointBuriedByModule(CompanyReportConfig[ECorpReport.RelatedPartyRP].downModuleId)
  myWfcAjax(
    'createiporelationdoc',
    { entityId: wftCommon.formatCompanyCode(companyCode), refresh: exchangeRule, entityName: companyName },
    function (data) {
      if (data.ErrorCode != '0') {
        return
      }
      message.info('正在为您导出...')
      setTimeout(function () {
        window.open(getCompanyReportDownPage())
      }, 800)
    }
  )
}

/**
 * 获取公司是否是银行
 */
export const getIfCorpFinancial = async (companyCode) => {
  return new Promise((resolve, reject) => {
    myWfcAjax(
      'getcorpbasicinfo',
      { restfulApi: '/detail/company/getcorpbasicname/' + companyCode },
      function (res) {
        if (!(res.ErrorCode == '0' && res.Data)) {
          return
        }
        if (res.Data.is_financial == '1') {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      function (err) {
        reject(err)
      }
    )
  })
}
