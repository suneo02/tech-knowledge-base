import { validateReportDetailNodeOrNodesJson, validateReportDetailTableJson } from '@/validation/validator'
import corpActualControllerJson from './ActualController.json' assert { type: 'json' }
import corpAnnualReportJson from './AnnualReport.json' assert { type: 'json' }
import corpBelongIndustryJson from './BelongIndustry.json' assert { type: 'json' }
import corpBranchStructureJson from './BranchStructure.json' assert { type: 'json' }
import corpChangeInfoJson from './ChangeInfo.json' assert { type: 'json' }
import corpCompetitorJson from './Competitor.json' assert { type: 'json' }
import corpCoreTeamJson from './CoreTeam.json' assert { type: 'json' }
import corpFinalBeneficiaryJson from './FinalBeneficiary.json' assert { type: 'json' }
import corpGroupSystemJson from './GroupSystem.json' assert { type: 'json' }
import corpHeaderQuarterJson from './HeaderQuarter.json' assert { type: 'json' }
import corpHKCorpInfoJson from './HKCorpInfo.json' assert { type: 'json' }
import corpHoldCompanyJson from './HoldCompany.json' assert { type: 'json' }
import corpMainPersonnelJson from './MainPersonnel.json' assert { type: 'json' }
import corpOverseasInvestmentJson from './OverseasInvestment.json' assert { type: 'json' }
import corpEquityChangeInformationJson from './shareholder/EquityChangeInformation.json' assert { type: 'json' }
import corpShareholderBigJson from './shareholder/ShareholderBig.json' assert { type: 'json' }
import corpShareholderAndCapitalContributionJson from './shareholder/ShareholderAndCapitalContribution.json' assert { type: 'json' }
import corpShareholderInfomationJson from './shareholder/ShareholderInfomation.json' assert { type: 'json' }
import corpShareholderReportJson from './shareholder/ShareholderReport.json' assert { type: 'json' }
import corpShareholderUnregularJson from './shareholder/ShareholderUnregular.json' assert { type: 'json' }
import corpShareholderChangeJson from './ShareholderChange.json' assert { type: 'json' }
import corpShareholderPenetrationJson from './ShareholderPenetration.json' assert { type: 'json' }
import corpShareholderPenetrationGraphJson from './ShareholderPenetrationGraph.json' assert { type: 'json' }
import corpTaxPayerJson from './TaxPayer.json' assert { type: 'json' }

export const corpChangeInfo = validateReportDetailNodeOrNodesJson(corpChangeInfoJson)

export const corpAnnualReport = validateReportDetailNodeOrNodesJson(corpAnnualReportJson)

export const corpActualController = validateReportDetailNodeOrNodesJson(corpActualControllerJson)

export const corpBranchStructure = validateReportDetailNodeOrNodesJson(corpBranchStructureJson)

export const corpBelongIndustry = validateReportDetailNodeOrNodesJson(corpBelongIndustryJson)

export const corpCompetitor = validateReportDetailNodeOrNodesJson(corpCompetitorJson)

export const corpCoreTeam = validateReportDetailNodeOrNodesJson(corpCoreTeamJson)

export const corpFinalBeneficiary = validateReportDetailNodeOrNodesJson(corpFinalBeneficiaryJson)

export const corpGroupSystem = validateReportDetailNodeOrNodesJson(corpGroupSystemJson)

export const corpHoldCompany = validateReportDetailNodeOrNodesJson(corpHoldCompanyJson)

export const corpShareholderUnregular = validateReportDetailNodeOrNodesJson(corpShareholderUnregularJson)

export const corpShareholderReport = validateReportDetailNodeOrNodesJson(corpShareholderReportJson)

export const corpShareholderAndCapitalContribution = validateReportDetailNodeOrNodesJson(
  corpShareholderAndCapitalContributionJson
)

export const corpShareholderBig = validateReportDetailTableJson(corpShareholderBigJson)

export const corpShareholderInfomation = validateReportDetailNodeOrNodesJson(corpShareholderInfomationJson)

export const corpShareholderChange = validateReportDetailNodeOrNodesJson(corpShareholderChangeJson)

export const corpShareholderPenetration = validateReportDetailNodeOrNodesJson(corpShareholderPenetrationJson)

export const corpShareholderPenetrationGraph = validateReportDetailNodeOrNodesJson(corpShareholderPenetrationGraphJson)

export const corpTaxPayer = validateReportDetailNodeOrNodesJson(corpTaxPayerJson)

export const corpHKCorpInfo = validateReportDetailNodeOrNodesJson(corpHKCorpInfoJson)

export const corpHeaderQuarter = validateReportDetailNodeOrNodesJson(corpHeaderQuarterJson)

export const corpMainPersonnel = validateReportDetailNodeOrNodesJson(corpMainPersonnelJson)

export const corpOverseasInvestment = validateReportDetailNodeOrNodesJson(corpOverseasInvestmentJson)

export const corpEquityChangeInformation = validateReportDetailNodeOrNodesJson(corpEquityChangeInformationJson)
