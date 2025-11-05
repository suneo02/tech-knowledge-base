import { validateReportDetailNodeJson } from '@/validation'
import { ReportDetailNodeJson } from 'gel-types'
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

export const corpAExcellentTaxpayer: ReportDetailNodeJson = validateReportDetailNodeJson(corpAExcellentTaxpayerJson)

export const corpBuildingQualification: ReportDetailNodeJson =
  validateReportDetailNodeJson(corpBuildingQualificationJson)

export const corpImportExportCredit: ReportDetailNodeJson = validateReportDetailNodeJson(corpImportExportCreditJson)

export const corpLogisticsRating: ReportDetailNodeJson = validateReportDetailNodeJson(corpLogisticsRatingJson)

export const corpRealEstateDevelopmentQualification: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpRealEstateDevelopmentQualificationJson
)

export const corpTelecomLicense: ReportDetailNodeJson = validateReportDetailNodeJson(corpTelecomLicenseJson)

export const corpAdministrativeLicenseBureau: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpAdministrativeLicenseBureauJson
)

export const corpAdministrativeLicenseCreditChina: ReportDetailNodeJson =
  validateReportDetailNodeJson(corpAdministrativeLicenseJson)

export const corpCreditRecord: ReportDetailNodeJson = validateReportDetailNodeJson(corpCreditRecordJson)

export const corpFinancialRecord: ReportDetailNodeJson = validateReportDetailNodeJson(corpFinancialRecordJson)

export const corpCommercialFranchise: ReportDetailNodeJson = validateReportDetailNodeJson(corpCommercialFranchiseJson)

export const corpFinancialLicense: ReportDetailNodeJson = validateReportDetailNodeJson(corpFinancialLicenseJson)

export const corpGameApproval: ReportDetailNodeJson = validateReportDetailNodeJson(corpGameApprovalJson)

export const corpCertification: ReportDetailNodeJson = validateReportDetailNodeJson(corpCertificationJson)

export const corpCosmeticsProductionLicense: ReportDetailNodeJson = validateReportDetailNodeJson(
  corpCosmeticsProductionLicenseJson
)

export const corpDirectoryList: ReportDetailNodeJson = validateReportDetailNodeJson(corpDirectoryListJson)

export const corpRankedCompanyList: ReportDetailNodeJson = validateReportDetailNodeJson(corpRankedCompanyListJson)
