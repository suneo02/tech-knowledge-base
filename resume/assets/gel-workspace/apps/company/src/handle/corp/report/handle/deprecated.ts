import { myWfcAjax } from '@/api/companyApi'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { CompanyReportConfig, ECorpReport } from '@/handle/corp/report/config'
import { getCompanyReportDownPage } from '@/handle/link'

import { pointBuriedGel } from '@/api/configApi'
import { checkVIPReportExport, sampleReportCorpDefault } from '@/handle/corp/report/handle/misc.ts'

/**
 * @deprecated
 * @param type
 */
export const downloadSample = (type) => {
  const lang = window.en_access_config ? 'en' : 'cn'
  let ajaxType = 'exp_' + type
  let entityName = sampleReportCorpDefault.name
  let entityId = sampleReportCorpDefault.id
  let downUrl =
    'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
    entityId +
    '&from=openBu3&lang=cn&ver=20201023'

  let reportType: ECorpReport
  switch (type) {
    case 'share':
      reportType = ECorpReport.EquityPenetrationSixLayer
      break
    case 'corp':
      reportType = ECorpReport.CorpCreditRP
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
        entityId +
        `&from=openBu3&lang=${lang}`
      break
    case 'stock':
      reportType = ECorpReport.EquityPenetrationAnalysisRP
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
        entityId +
        '&from=openBu3&lang=cn&sssss=1230'
      break
    case 'INVESTMENT_PENETRATION':
      reportType = ECorpReport.InvestmentPenetrationRP
      ajaxType = 'investtrack'
      break

    /**
     * 好像没有执行到这
     */
    case 'guide':
      reportType = ECorpReport.CorpKYCRP
      entityId = '1063106510'
      entityName = '万科企业股份有限公司'
      break

    default:
      return
  }
  const pdfCmd = CompanyReportConfig[reportType].pdfCmd
  const params =
    pdfCmd === CompanyReportConfig[ECorpReport.CorpKYCRP].pdfCmd
      ? {
          companycode: entityId,
          companyname: entityName,
          type: ajaxType,
        }
      : {
          ...(downUrl ? { url: downUrl } : {}),
          email: '',
          entityName: entityName,
          entityId: entityId,
          type: ajaxType,
        }
  const reportCfg = reportType != null ? CompanyReportConfig[reportType] : null
  if (reportCfg && reportCfg.sampleBuryId != null) {
    pointBuriedByModule(reportCfg.sampleBuryId)
  }

  myWfcAjax(pdfCmd, params).then((res) => {
    if (res.ErrorCode == '0') {
      window.open(getCompanyReportDownPage())
    }
  })
}
/**
 * @deprecated
 * @param id
 * @param onlySVIP
 * @param companycode
 * @param company
 * @param reportTier // 该参数不能删 ！！！ 否则有个报告导出有问题
 */
export const downloadReport: (
  id: string,
  onlySVIP: string | undefined,
  companycode: string,
  company: any,
  reportTier?: string
) => void = (id, onlySVIP, companycode, company, reportTier) => {
  if (!checkVIPReportExport(Boolean(onlySVIP))) {
    return
  }

  let downType = 'corp'

  const lang = window.en_access_config ? 'en' : 'cn'
  const entityName = window.en_access_config ? company.baseInfo?.eng_name : company.baseInfo?.corp_name
  const entityId = companycode
  let downUrl =
    'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
    companycode +
    '&from=openBu3&lang=cn&ver=20201023'
  let selVal = '' // 该参数不能删 ！！！ 否则有个报告导出有问题

  let reportType: ECorpReport
  switch (id) {
    case 'share':
      reportType = ECorpReport.EquityPenetrationSixLayer
      selVal = reportTier
      downType = 'stocktrack'
      downUrl = ''
      pointBuriedGel('922602100653', '股东深度穿透报告', 'reportEx')
      break
    case 'creditReport':
      reportType = ECorpReport.CorpCreditRP
      downType = 'corp'
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=' +
        companycode +
        `&from=openBu3&lang=${lang}`

      pointBuriedGel('922602100653', '企业信用报告', 'reportEx')
      // 数据出境整改中用到的埋点
      pointBuriedByModule(922610400002, {
        companyID: companycode,
      })
      break
    case 'stockReport':
      reportType = ECorpReport.EquityPenetrationAnalysisRP
      downType = 'share'
      downUrl =
        'http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/GQCTRP.html?companycode=' +
        companycode +
        '&from=openBu3&lang=cn&sssss=1230'
      break
    // 这个 case 疑似废弃
    case 'userPortraitReport':
      reportType = ECorpReport.CorpKYCRP
      pointBuriedGel('922602100653', '企业KYC报告', 'reportEx')
      break
    default:
      return
  }
  const pdfCmd = CompanyReportConfig[reportType].pdfCmd

  let params: {
    companycode?: string
    companyname?: string
    entityName?: string
    entityId?: string
    url?: string
    depth?: string
    type?: string
    lang?: string
  } =
    pdfCmd === 'createmarketguidetask'
      ? {
          companycode: entityId,
          companyname: entityName,
        }
      : {
          url: downUrl,
          entityName: entityName,
          entityId: entityId,
        }
  if (id == 'creditReport') {
    params = {
      url: downUrl,
      entityName: entityName,
      entityId: entityId,
      lang,
    }
  }
  if (pdfCmd == 'createtrackdoctask') {
    params.depth = selVal
  }
  if (downType == 'stocktrack') {
    params.type = downType
  }
  const reportCfg = reportType != null ? CompanyReportConfig[reportType] : null
  if (reportCfg && reportCfg.downModuleId != null) {
    pointBuriedByModule(reportCfg.downModuleId)
  }
  myWfcAjax(pdfCmd, params).then((res) => {
    if (Number(res.ErrorCode) !== 0) {
      return
    }
    window.open(getCompanyReportDownPage())
  })
}
