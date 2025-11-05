/**
 * Credit report configuration
 */

import { CorpBasicInfo, CorpBasicNumFront, CorpOtherInfo, ReportPageJson, UserPackageFlags } from 'gel-types'
import {
  corpActualController,
  corpBelongIndustry,
  corpBranchStructure,
  corpChangeInfo,
  corpCompetitor,
  corpCoreTeam,
  corpEquityChangeInformation,
  corpFinalBeneficiary,
  corpGroupSystem,
  corpHoldCompany,
  corpMainPersonnel,
  corpOverseasInvestment,
  corpShareholderAndCapitalContribution,
  corpShareholderChange,
  corpShareholderInfomation,
  corpShareholderPenetration,
  corpShareholderPenetrationGraph,
  corpShareholderReport,
  corpShareholderUnregular,
  corpTaxPayer,
} from './baseInfo'
import {
  corpCancellationRecord,
  corpEquityPledge,
  corpInspectionCheck,
  corpIntellectualPropertyPledge,
  corpLiquidationInfo,
  corpManageAbnormal,
  corpSeriousViolation,
  corpStockPledge,
  corpTaxDebt,
  corpTaxViolation,
  corpViolationPunishment,
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
import { filterReportConfigByUserInfo } from './helper/filterReportConfigByUserInfo'
import { handleHKBaseInfo } from './helper/handleHKBaseInfo'
import {
  corpPatentBranch,
  corpPatentHoldCompany,
  corpPatentOutboundInvestment,
  corpPatentSelf,
  corpSoftwareCopyright,
  corpTrademarkBranch,
  corpTrademarkHoldCompany,
  corpTrademarkOutboundInvest,
  corpTrademarkSelf,
} from './intellectual'
import { corpReportBalanceSheet, corpReportCashFlowStatement, corpReportProfitStatement } from './IpoBusinessData'
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
export const getCorpDetailConfig = (
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
      type: 'section',
      children: [
        bussInfo,
        ...(hkBaseInfo ? [hkBaseInfo] : []),
        corpBelongIndustry,
        corpActualController,
        {
          type: 'section',
          key: 'Shareholder',
          title: '股东信息',
          children: [corpShareholderUnregular, corpShareholderReport, corpShareholderInfomation],
        },
        corpShareholderPenetration,
        corpShareholderPenetrationGraph,
        corpShareholderChange,
        corpBranchStructure,
        corpHoldCompany,
        corpOverseasInvestment,
        corpFinalBeneficiary,
        corpMainPersonnel,
        corpCoreTeam,
        corpGroupSystem,
        corpCompetitor,
        corpChangeInfo,
        {
          type: 'section',
          key: 'EnterprisePublicity',
          title: '企业公示',
          children: [corpShareholderAndCapitalContribution, corpEquityChangeInformation],
        },
        corpTaxPayer,
      ],
    },
    {
      key: 'BussData',
      title: '企业财务情况',
      type: 'section',
      children: [corpReportProfitStatement, corpReportBalanceSheet, corpReportCashFlowStatement],
    },
    {
      type: 'section',
      key: 'FinanceInfo',
      title: '企业融资情况',
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
      children: [
        {
          title: '商标',
          titleIntl: '138799',
          type: 'nodeWithChildren',
          key: 'Trademark',
          children: [corpTrademarkSelf, corpTrademarkHoldCompany, corpTrademarkOutboundInvest, corpTrademarkBranch],
        },
        {
          title: '专利',
          titleIntl: '124585',
          type: 'nodeWithChildren',
          key: 'Patent',
          children: [corpPatentSelf, corpPatentHoldCompany, corpPatentOutboundInvestment, corpPatentBranch],
        },
        corpSoftwareCopyright,
      ],
    },
    {
      type: 'section',
      key: 'Qualification',
      title: '企业资质情况',
      children: [
        corpAdministrativeLicenseCreditChina,
        corpAdministrativeLicenseBureau,
        corpTelecomLicense,
        corpBuildingQualification,
        corpRealEstateDevelopmentQualification,
        corpLogisticsRating,
        corpImportExportCredit,
        corpAExcellentTaxpayer,
      ],
    },
    {
      type: 'section',
      key: 'JudicialRisk',
      title: '企业法律诉讼',
      children: [
        corpJudicialDocument,
        corpCreditDishonest,
        corpEnforcement,
        corpLimitHighConsumption,
        corpEndCase,
        corpFilingInfo,
        corpTrialNotice,
        corpCourtNotice,
        corpDeliveryAnnouncement,
        corpJudicialAuction,
      ],
    },
    {
      type: 'section',
      key: 'BusinessRisk',
      title: '企业经营风险',
      children: [
        corpViolationPunishment,
        corpTaxViolation,
        corpTaxDebt,
        corpManageAbnormal,
        corpSeriousViolation,
        corpAppraisal,
        corpBankruptcyReorganization,
        corpLiquidationInfo,
        corpCancellationRecord,
        corpInspectionCheck,
        corpEquityPledge,
        corpStockPledge,
        corpIntellectualPropertyPledge,
      ],
    },
  ]
  return filterReportConfigByUserInfo(res, userFlags)
}
