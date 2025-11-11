import { validateReportDetailNodeOrNodesJson } from '@/validation'
import businessLicenseInvalidDeclarationJson from './BusinessLicenseInvalidDeclaration.json' assert { type: 'json' }
import historyBusinessInfoJson from './HistoryBusinessInfo.json' assert { type: 'json' }
import historyEquityPledgeJson from './HistoryEquityPledge.json' assert { type: 'json' }
import historyLandMortgageJson from './HistoryLandMortgage.json' assert { type: 'json' }
import historyLegalRepresentativeJson from './HistoryLegalRepresentative.json' assert { type: 'json' }
import historyOverseasInvestmentJson from './HistoryOverseasInvestment.json' assert { type: 'json' }
import historyShareholderJson from './HistoryShareholder.json' assert { type: 'json' }
import historyWebsiteRegistrationJson from './HistoryWebsiteRegistration.json' assert { type: 'json' }
import multiCertificateJson from './MultiCertificate.json' assert { type: 'json' }

export const corpHistoryBusinessInfo = validateReportDetailNodeOrNodesJson(historyBusinessInfoJson)
export const corpHistoryShareholder = validateReportDetailNodeOrNodesJson(historyShareholderJson)
export const corpHistoryLegalRepresentative = validateReportDetailNodeOrNodesJson(historyLegalRepresentativeJson)
export const corpHistoryOverseasInvestment = validateReportDetailNodeOrNodesJson(historyOverseasInvestmentJson)
export const corpHistoryWebsiteRegistration = validateReportDetailNodeOrNodesJson(historyWebsiteRegistrationJson)
export const corpHistoryLandMortgage = validateReportDetailNodeOrNodesJson(historyLandMortgageJson)
export const corpMultiCertificate = validateReportDetailNodeOrNodesJson(multiCertificateJson)
export const corpBusinessLicenseInvalidDeclaration = validateReportDetailNodeOrNodesJson(
  businessLicenseInvalidDeclarationJson
)
export const corpHistoryEquityPledge = validateReportDetailNodeOrNodesJson(historyEquityPledgeJson)
