import { ApiRequestPage } from '@/types/request'

export interface getIntellectualAggsParams {
  cmd: 'getintellectual'
}

export interface getIntellectualAggsPayload extends ApiRequestPage {
  type: 'trademark_sum_corp'
  companyType: 0
  companycode: string
}
