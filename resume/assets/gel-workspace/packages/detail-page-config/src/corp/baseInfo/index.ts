import { validateReportDetailNodeJson, validateReportDetailTableJson } from '@/validation/validator'
import corpActualControllerJson from './ActualController.json' assert { type: 'json' }
import corpAnnualReportJson from './AnnualReport.json' assert { type: 'json' }
import corpBelongIndustryJson from './BelongIndustry.json' assert { type: 'json' }
import corpBranchStructureJson from './BranchStructure.json' assert { type: 'json' }
import corpChangeInfoJson from './ChangeInfo.json' assert { type: 'json' }
import corpCompetitorJson from './Competitor.json' assert { type: 'json' }
import corpCoreTeamJson from './CoreTeam.json' assert { type: 'json' }
import corpFinalBeneficiaryJson from './FinalBeneficiary.json' assert { type: 'json' }
import corpGroupSystemJson from './GroupSystem.json' assert { type: 'json' }
import corpHKCorpInfoJson from './HKCorpInfo.json' assert { type: 'json' }
import corpHoldCompanyJson from './HoldCompany.json' assert { type: 'json' }
import corpHeaderQuarterJson from './HeaderQuarter.json' assert { type: 'json' }
import corpMainPersonnelJson from './MainPersonnel.json' assert { type: 'json' }
import corpOverseasInvestmentJson from './OverseasInvestment.json' assert { type: 'json' }
import corpEquityChangeInformationJson from './shareholder/EquityChangeInformation.json' assert { type: 'json' }
import corpShareholderBigJson from './shareholder/shareholdeBig.json' assert { type: 'json' }
import corpShareholderAndCapitalContributionJson from './shareholder/ShareholderAndCapitalContribution.json' assert { type: 'json' }
import corpShareholderInfomationJson from './shareholder/shareholderInfomation.json' assert { type: 'json' }
import corpShareholderReportJson from './shareholder/ShareholderReport.json' assert { type: 'json' }
import corpShareholderUnregularJson from './shareholder/ShareholderUnregular.json' assert { type: 'json' }
import corpShareholderChangeJson from './ShareholderChange.json' assert { type: 'json' }
import corpShareholderPenetrationJson from './ShareholderPenetration.json' assert { type: 'json' }
import corpShareholderPenetrationGraphJson from './ShareholderPenetrationGraph.json' assert { type: 'json' }
import corpTaxPayerJson from './TaxPayer.json' assert { type: 'json' }

export const corpChangeInfo = validateReportDetailNodeJson(corpChangeInfoJson)

export const corpAnnualReport = validateReportDetailNodeJson(corpAnnualReportJson)

export const corpActualController = validateReportDetailNodeJson(corpActualControllerJson)

export const corpBranchStructure = validateReportDetailNodeJson(corpBranchStructureJson)

export const corpBelongIndustry = validateReportDetailNodeJson(corpBelongIndustryJson)

export const corpCompetitor = validateReportDetailNodeJson(corpCompetitorJson)

export const corpCoreTeam = validateReportDetailNodeJson(corpCoreTeamJson)

export const corpFinalBeneficiary = validateReportDetailNodeJson(corpFinalBeneficiaryJson)

export const corpGroupSystem = validateReportDetailNodeJson(corpGroupSystemJson)

export const corpHoldCompany = validateReportDetailNodeJson(corpHoldCompanyJson)

export const corpShareholderUnregular = validateReportDetailNodeJson(corpShareholderUnregularJson)

export const corpShareholderReport = validateReportDetailNodeJson(corpShareholderReportJson)

export const corpShareholderAndCapitalContribution = validateReportDetailNodeJson(
  corpShareholderAndCapitalContributionJson
)

export const corpShareholderBig = validateReportDetailTableJson(corpShareholderBigJson)

export const corpShareholderInfomation = validateReportDetailNodeJson(corpShareholderInfomationJson)

export const corpShareholderChange = validateReportDetailNodeJson(corpShareholderChangeJson)

export const corpShareholderPenetration = validateReportDetailNodeJson(corpShareholderPenetrationJson)

export const corpShareholderPenetrationGraph = validateReportDetailNodeJson(corpShareholderPenetrationGraphJson)

export const corpTaxPayer = validateReportDetailNodeJson(corpTaxPayerJson)

export const corpHKCorpInfo = validateReportDetailNodeJson(corpHKCorpInfoJson)

export const corpHeaderQuarter = validateReportDetailNodeJson(corpHeaderQuarterJson)

export const corpMainPersonnel = validateReportDetailNodeJson(corpMainPersonnelJson)

export const corpOverseasInvestment = validateReportDetailNodeJson(corpOverseasInvestmentJson)

export const corpEquityChangeInformation = validateReportDetailNodeJson(corpEquityChangeInformationJson)
