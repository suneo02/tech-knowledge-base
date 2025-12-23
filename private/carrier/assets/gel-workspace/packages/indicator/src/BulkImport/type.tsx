import { TRequestToSuperlistSpacfic } from 'gel-api'

export interface IndicatorBulkImportApi {
  searchCompanies: TRequestToSuperlistSpacfic<'company/search'>
  matchCompanies: TRequestToSuperlistSpacfic<'company/match'>
}
