import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { ReportDetailNodeOrNodesJson } from 'gel-types'
import corpAdministrativeLicenseBureauJson from './AdministrativeLicenseBureau.json' assert { type: 'json' }
import corpAdministrativeLicenseJson from './AdministrativeLicenseCreditChina.json' assert { type: 'json' }
import corpAExcellentTaxpayerJson from './AExcellentTaxpayer.json' assert { type: 'json' }
import corpBuildingQualificationJson from './BuildingQualification.json' assert { type: 'json' }
import corpCertificationJson from './Certification.json' assert { type: 'json' }
import corpCommercialFranchiseJson from './CommercialFranchise.json' assert { type: 'json' }
import corpCosmeticsProductionLicenseJson from './CosmeticsProductionLicense.json' assert { type: 'json' }
import corpCreditRecordJson from './CreditRecord.json' assert { type: 'json' }
import corpDirectoryListJson from './DirectoryList.json' assert { type: 'json' }
import corpFinancialLicenseJson from './FinancialLicense.json' assert { type: 'json' }
import corpFinancialRecordJson from './FinancialRecord.json' assert { type: 'json' }
import corpGameApprovalJson from './GameApproval.json' assert { type: 'json' }
import corpImportExportCreditJson from './ImportExportCredit.json' assert { type: 'json' }
import corpLogisticsRatingJson from './LogisticsRating.json' assert { type: 'json' }
import corpRankedCompanyListJson from './RankedCompanyList.json' assert { type: 'json' }
import corpRealEstateDevelopmentQualificationJson from './RealEstateDevelopmentQualification.json' assert { type: 'json' }
import corpTelecomLicenseJson from './TelecomLicense.json' assert { type: 'json' }

export const corpAExcellentTaxpayer: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpAExcellentTaxpayerJson)

export const corpBuildingQualification: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpBuildingQualificationJson)

export const corpImportExportCredit: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpImportExportCreditJson)

export const corpLogisticsRating: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpLogisticsRatingJson)

export const corpRealEstateDevelopmentQualification: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpRealEstateDevelopmentQualificationJson
)

export const corpTelecomLicense: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpTelecomLicenseJson)

export const corpAdministrativeLicenseBureau: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpAdministrativeLicenseBureauJson
)

export const corpAdministrativeLicenseCreditChina: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpAdministrativeLicenseJson)

export const corpCreditRecord: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpCreditRecordJson)

export const corpFinancialRecord: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpFinancialRecordJson)

export const corpCommercialFranchise: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpCommercialFranchiseJson)

export const corpFinancialLicense: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpFinancialLicenseJson)

export const corpGameApproval: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpGameApprovalJson)

export const corpCertification: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpCertificationJson)

export const corpCosmeticsProductionLicense: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(
  corpCosmeticsProductionLicenseJson
)

export const corpDirectoryList: ReportDetailNodeOrNodesJson = validateReportDetailNodeOrNodesJson(corpDirectoryListJson)

export const corpRankedCompanyList: ReportDetailNodeOrNodesJson =
  validateReportDetailNodeOrNodesJson(corpRankedCompanyListJson)
