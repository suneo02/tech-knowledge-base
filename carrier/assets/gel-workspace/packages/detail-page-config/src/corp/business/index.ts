import { validateReportDetailNodeOrNodesJson } from '@/validation/validator'
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

export const corpEnterpriseBusiness = validateReportDetailNodeOrNodesJson(enterpriseBusinessJson)
export const corpAppProducts = validateReportDetailNodeOrNodesJson(appProductsJson)
export const corpHotels = validateReportDetailNodeOrNodesJson(hotelsJson)
export const corpCompanyReports = validateReportDetailNodeOrNodesJson(companyReportsJson)
export const corpGovernmentMajorProjects = validateReportDetailNodeOrNodesJson(governmentMajorProjectsJson)
export const corpTenderingAnnouncements = validateReportDetailNodeOrNodesJson(tenderingAnnouncementsJson)
export const corpBiddingAnnouncements = validateReportDetailNodeOrNodesJson(biddingAnnouncementsJson)
export const corpRecruitment = validateReportDetailNodeOrNodesJson(recruitmentJson)
export const corpLandInformation = validateReportDetailNodeOrNodesJson(landInformationJson)
export const corpPrivateEquityFunds = validateReportDetailNodeOrNodesJson(privateEquityFundsJson)
export const corpCustomersAndSuppliers = validateReportDetailNodeOrNodesJson(customersAndSuppliersJson)
export const corpBusinessAssociates = validateReportDetailNodeOrNodesJson(businessAssociatesJson)
export const corpGovernmentSubsidies = validateReportDetailNodeOrNodesJson(governmentSubsidiesJson)
export const corpGovernmentSupport = validateReportDetailNodeOrNodesJson(governmentSupportJson)
