export const BAIFEN_COMP_API_PATH = '/bankcomp/api'

export enum BaifenCompApiCode {
  Success = 200,
  DuplicateSubmit = 'BFQYAPI01006',
}

export interface BaifenCompApiResponse<T = undefined> {
  resultCode: BaifenCompApiCode
  resultData?: T
}

export interface BaifenCompApiPath {
  'marketing/trial/apply': {
    response: BaifenCompApiResponse
  }
}
