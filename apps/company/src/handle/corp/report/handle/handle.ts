import { myWfcAjax } from '@/api/companyApi.ts'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { request } from '@/api/request.ts'
import {
  RelatedPartyReportRule,
  RelatedPartyReportRuleCode,
} from '@/components/company/intro/report/RelatedPartyReport'
import { checkVIPReportExport, sampleReportCorpDefault } from '@/handle/corp/report/handle/misc.ts'
import { getCompanyReportDownPage } from '@/handle/link'
import { wftCommon } from '@/utils/utils.tsx'
import { CompanyReportConfig, ECorpReport } from '../config'

export const downloadCompanyReport = (type: ECorpReport, ifOnlySVIP: boolean = false, companyCode: string) => {
  try {
    if (!checkVIPReportExport(Boolean(ifOnlySVIP))) {
      return
    }
    if (type === ECorpReport.CorpCreditRP) {
      // 数据出境整改中用到的埋点
      pointBuriedByModule(922610400002, {
        companyID: companyCode,
      })
    }
    const reportCfg = CompanyReportConfig[type]
    if (reportCfg.downModuleId) {
      pointBuriedByModule(reportCfg.downModuleId)
    }

    let cmd = CompanyReportConfig[type].pdfCmd
    let params
    switch (type) {
      case ECorpReport.EquityPenetrationTwelveLayer: {
        cmd = `${cmd}/${companyCode}`
        break
      }
      case ECorpReport.InnovationCapabilityRP: {
        cmd = `${cmd}/${companyCode}`
        break
      }
    }
    myWfcAjax(cmd, params).then((res) => {
      if (Number(res.ErrorCode) !== 0) {
        return
      }
      window.open(getCompanyReportDownPage())
    })
  } catch (e) {
    console.error(e)
  }
}
/**
 * 相比 downloadSample 编码风格更加内聚
 * @param type
 */
export const downloadCompanySampleReport = async (type: ECorpReport) => {
  try {
    const reportCfg = CompanyReportConfig[type]
    if (reportCfg.sampleBuryId) {
      pointBuriedByModule(reportCfg.sampleBuryId)
    }
    let res = null
    if (reportCfg.demoFileId) {
      res = await request('download/createtask/demoFile', {
        params: {
          type: 'stockTrackExcelDemo',
        },
        id: reportCfg.demoFileId.toString(),
      })
    } else {
      let cmd = reportCfg.pdfCmd
      let params
      switch (type) {
        case ECorpReport.RelatedPartyRP: {
          params = {
            entityId: wftCommon.formatCompanyCode(sampleReportCorpDefault.id),
            refresh: RelatedPartyReportRuleCode[RelatedPartyReportRule.CorpAccount],
            entityName: sampleReportCorpDefault.name,
            url: `http://host/Wind.WFC.Enterprise.Web/PC.Front/Company/CompanyRP.html?companycode=${sampleReportCorpDefault.id}&from=openBu3&lang=cn&ver=20201023`,
          }
          break
        }
        case ECorpReport.EquityPenetrationTwelveLayer: {
          cmd = `${cmd}/${sampleReportCorpDefault.id}`
          break
        }
        case ECorpReport.InnovationCapabilityRP: {
          cmd = `${cmd}/${sampleReportCorpDefault.id}`
          break
        }
      }

      res = await myWfcAjax(cmd, params)
    }
    if (Number(res.ErrorCode) !== 0) {
      return
    }
    window.open(getCompanyReportDownPage())
  } catch (e) {
    console.error(e)
  }
}
