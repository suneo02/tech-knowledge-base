/**
 * Credit report configuration
 */

import { CorpBasicInfo, CorpBasicNumFront, CorpOtherInfo, ReportPageJson, UserPackageFlags } from 'gel-types'
import {
  corpBelongIndustry,
  corpChangeInfo,
  corpEquityChangeInformation,
  corpShareholderAndCapitalContribution,
  corpShareholderUnregular,
  corpTaxPayer,
} from './baseInfo'
import {
  corpCancellationRecord,
  corpEquityPledge,
  corpInspectionCheck,
  corpIntellectualPropertyPledge,
  corpLiquidationInfo,
  corpSeriousViolation,
  corpStockPledge,
  corpTaxDebt,
  corpTaxViolation,
  corpWarrantyInformation,
} from './businessRisk'
import { getCorpInfoConfigByInfo } from './bussInfo'
import {
  corpABSInfo,
  corpBondIssue,
  corpChattelFinancing,
  corpChattelMortgageMortgagee,
  corpChattelMortgageMortgager,
  corpDebtRating,
  corpInfoAwaitListing,
  corpSharedStock,
} from './finance'
import { filterReportConfigByCorpType } from './helper/filterReportConfigByCorpType'
import { filterReportConfigByUserInfo } from './helper/filterReportConfigByUserInfo'
import { getShareholderInfoByCorpArea } from './helper/getShareholderInfoByCorpArea'
import { getShareholderReportByBasicNum } from './helper/getShareholderReportByBasicNum'
import { handleHKBaseInfo } from './helper/handleHKBaseInfo'
import { corpPatentSelf, corpSoftwareCopyright, corpTrademarkSelf } from './intellectual'

import { filterReportConfigByBasicNum } from './helper/filterReportConfigByBasicNum'
import {
  corpAdministrativeLicenseBureau,
  corpAdministrativeLicenseCreditChina,
  corpAExcellentTaxpayer,
  corpBuildingQualification,
  corpImportExportCredit,
  corpLogisticsRating,
  corpRealEstateDevelopmentQualification,
  corpTelecomLicense,
} from './qualification'
import {
  corpAppraisal,
  corpBankruptcyReorganization,
  corpCourtNotice,
  corpCreditDishonest,
  corpDeliveryAnnouncement,
  corpEndCase,
  corpEnforcement,
  corpFilingInfo,
  corpJudicialAuction,
  corpJudicialDocument,
  corpLimitHighConsumption,
  corpTrialNotice,
} from './risk'

// Default configuration
export const getCreditEvaluationRPConfig = (
  baseInfo: CorpBasicInfo | undefined,
  basicNum?: Partial<CorpBasicNumFront>,
  otherInfo?: CorpOtherInfo,
  userFlags?: UserPackageFlags
): ReportPageJson => {
  const bussInfo = getCorpInfoConfigByInfo(baseInfo)

  const hkBaseInfo = handleHKBaseInfo(basicNum, otherInfo)
  const res: ReportPageJson = [
    {
      key: 'CompanyInfo',
      title: '企业基本情况',
      titleIntl: '451094',
      type: 'section',
      children: [
        bussInfo,
        ...(hkBaseInfo ? [hkBaseInfo] : []),
        corpBelongIndustry,
        {
          type: 'section',
          key: 'Shareholder',
          title: '股东信息',
          titleIntl: '138506',
          children: [
            corpShareholderUnregular,
            getShareholderReportByBasicNum(basicNum),
            getShareholderInfoByCorpArea(baseInfo?.areaCode),
          ],
        },
        corpChangeInfo,
        {
          type: 'section',
          key: 'EnterprisePublicity',
          title: '企业公示',
          titleIntl: '222474',
          children: [corpShareholderAndCapitalContribution, corpEquityChangeInformation],
        },
        corpTaxPayer,
      ],
    },
    {
      key: 'BussDataAigc',
      title: '企业财务情况分析',
      type: 'rawHtml',
      // 占位 api ，实际不会使用，用于占位，来发送接口
      api: 'placeholderApi',
      apiType: 'baifen',
      commentSuffix: '该章节基于报告使用人自主上传的资料结合AI大数据生成，仅供参考，请注意核实数据和信息的正确性。',
    },
    {
      type: 'section',
      key: 'FinanceInfo',
      title: '企业融资情况',
      titleIntl: '451115',
      children: [
        corpSharedStock,
        corpInfoAwaitListing,
        corpDebtRating,
        corpBondIssue,
        corpABSInfo,
        corpChattelFinancing,
        corpChattelMortgageMortgager,
        corpChattelMortgageMortgagee,
      ],
    },
    {
      type: 'section',
      key: 'IntellectualProperty',
      title: '企业知识产权',
      titleIntl: '451095',
      children: [
        {
          ...corpTrademarkSelf,
          title: '商标',
          titleIntl: '138799',
        },
        {
          ...corpPatentSelf,
          title: '专利',
          titleIntl: '124585',
        },
        corpSoftwareCopyright,
      ],
    },
    {
      type: 'section',
      key: 'Qualification',
      title: '企业资质情况',
      titleIntl: '451116',
      children: [
        corpAdministrativeLicenseCreditChina,
        corpAdministrativeLicenseBureau,
        corpTelecomLicense,
        corpBuildingQualification,
        corpRealEstateDevelopmentQualification,
        corpImportExportCredit,
        corpLogisticsRating,
        corpAExcellentTaxpayer,
      ],
    },

    {
      type: 'section',
      key: 'JudicialRisk',
      title: '企业法律诉讼',
      titleIntl: '451117',
      children: [
        corpJudicialDocument,
        corpFilingInfo,
        corpTrialNotice,
        corpDeliveryAnnouncement,
        corpCourtNotice,
        corpEnforcement,
        corpCreditDishonest,
        corpEndCase,
        corpLimitHighConsumption,
        corpJudicialAuction,
        corpBankruptcyReorganization,
        corpAppraisal,
      ],
    },
    {
      type: 'section',
      key: 'BusinessRisk',
      title: '企业经营风险',
      titleIntl: '451096',
      children: [
        corpInspectionCheck,
        corpTaxDebt,
        corpTaxViolation,
        corpSeriousViolation,
        corpWarrantyInformation,
        corpStockPledge,
        corpEquityPledge,
        corpIntellectualPropertyPledge,
        corpLiquidationInfo,
        corpCancellationRecord,
      ],
    },
  ]

  const filteredConfitByUserInfo = filterReportConfigByUserInfo(res, userFlags)
  const filteredConfitByCorpType = filterReportConfigByCorpType(filteredConfitByUserInfo, baseInfo?.configType)
  const filteredConfitByBasicNum = filterReportConfigByBasicNum(filteredConfitByCorpType, basicNum)
  return filteredConfitByBasicNum
}
