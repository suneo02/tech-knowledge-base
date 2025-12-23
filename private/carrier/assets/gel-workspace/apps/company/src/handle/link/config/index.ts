import { LinksModule } from '@/handle/link/module/linksModule.ts'
import { CHART_HASH } from '@/components/company/intro/charts'

export * from './constant.ts'

export const GelHashMap: Partial<Record<LinksModule, string>> = {
  [LinksModule.BID]: 'biddingDetail',
  [LinksModule.STANDARD_DETAIL]: 'standardInfoDetail',
  [LinksModule.PATENT]: 'patentDetail',
  // FIXME 待完善 hash map
  [LinksModule.GROUP]: 'newGroup',
  [LinksModule.CHARACTER]: 'character',
  [LinksModule.FEATURED]: 'feturedcompany',
  [LinksModule.FEATURED_LIST]: 'feturedlist',
  [LinksModule.JOB]: 'jobDetail',
  [LinksModule.PRODUCT]: 'productDetail',
  [LinksModule.SPECIAL_CORP]: 'specialAppList',
  [LinksModule.ANNUAL_REPORT]: 'annualReportDetail',
  [LinksModule.CompanyNew]: 'newCompany',
  [LinksModule.REPORT_HOME]: 'report',
  [LinksModule.QUALIFICATION_HOME]: 'qualifications',
  [LinksModule.QUALIFICATION_DETAIL]: 'qualificationsDetail',
  [LinksModule.COMPANY_DYNAMIC]: 'SingleCompanyDynamic',
  [LinksModule.COMPANY_DYNAMIC_ALL]: 'companyDynamic',
  [LinksModule.DATA_BROWSER]: 'findCustomer',
  [LinksModule.KG]: CHART_HASH,
  [LinksModule.SCENARIO_APPLICATION]: 'relatedlinks',
  [LinksModule.HOME]: 'searchHome',
  [LinksModule.HOMEAI]: 'homeai',
  [LinksModule.CompanyDetailAI]: 'companyDetailAIRight',
  [LinksModule.IC_LAYOUT]: 'icLayout',
  [LinksModule.GRAPH_AI]: 'aigraph',
}
