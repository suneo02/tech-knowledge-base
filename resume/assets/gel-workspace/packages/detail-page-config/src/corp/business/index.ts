import { validateReportDetailNodeJson } from '@/validation/validator'
import appProductsJson from './AppProducts.json' assert { type: 'json' }
import biddingAnnouncementsJson from './BiddingAnnouncements.json' assert { type: 'json' }
import businessAssociatesJson from './BusinessAssociates.json' assert { type: 'json' }
import companyReportsJson from './CompanyReports.json' assert { type: 'json' }
import customersAndSuppliersJson from './CustomersAndSuppliers.json' assert { type: 'json' }
import enterpriseBusinessJson from './EnterpriseBusiness.json' assert { type: 'json' }
import governmentMajorProjectsJson from './GovernmentMajorProjects.json' assert { type: 'json' }
import governmentSubsidiesJson from './GovernmentSubsidies.json' assert { type: 'json' }
import governmentSupportJson from './GovernmentSupport.json' assert { type: 'json' }
import hotelsJson from './Hotels.json' assert { type: 'json' }
import landInformationJson from './LandInformation.json' assert { type: 'json' }
import privateEquityFundsJson from './PrivateEquityFunds.json' assert { type: 'json' }
import recruitmentJson from './Recruitment.json' assert { type: 'json' }
import tenderingAnnouncementsJson from './TenderingAnnouncements.json' assert { type: 'json' }

export const corpEnterpriseBusiness = validateReportDetailNodeJson(enterpriseBusinessJson)
export const corpAppProducts = validateReportDetailNodeJson(appProductsJson)
export const corpHotels = validateReportDetailNodeJson(hotelsJson)
export const corpCompanyReports = validateReportDetailNodeJson(companyReportsJson)
export const corpGovernmentMajorProjects = validateReportDetailNodeJson(governmentMajorProjectsJson)
export const corpTenderingAnnouncements = validateReportDetailNodeJson(tenderingAnnouncementsJson)
export const corpBiddingAnnouncements = validateReportDetailNodeJson(biddingAnnouncementsJson)
export const corpRecruitment = validateReportDetailNodeJson(recruitmentJson)
export const corpLandInformation = validateReportDetailNodeJson(landInformationJson)
export const corpPrivateEquityFunds = validateReportDetailNodeJson(privateEquityFundsJson)
export const corpCustomersAndSuppliers = validateReportDetailNodeJson(customersAndSuppliersJson)
export const corpBusinessAssociates = validateReportDetailNodeJson(businessAssociatesJson)
export const corpGovernmentSubsidies = validateReportDetailNodeJson(governmentSubsidiesJson)
export const corpGovernmentSupport = validateReportDetailNodeJson(governmentSupportJson)
