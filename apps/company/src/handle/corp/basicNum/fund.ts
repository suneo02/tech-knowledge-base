import { isNil } from 'lodash'
import { ICorpBasicNumFront } from './type.ts'

export const getIfFundCorpByBasicNum = (basicNum: Partial<ICorpBasicNumFront>) => {
  if (isNil(basicNum) || isNil(basicNum.fund_type)) {
    return ''
  }
  return String(basicNum.fund_type) !== '0'
}

export const getIfPublicFundCorpByBasicNum = (basicNum: Partial<ICorpBasicNumFront>) => {
  if (isNil(basicNum) || isNil(basicNum.fund_type)) {
    return ''
  }
  return String(basicNum.fund_type) === '1'
}

export const getIfPrivateFundCorpByBasicNum = (basicNum: Partial<ICorpBasicNumFront>) => {
  if (isNil(basicNum) || isNil(basicNum.fund_type)) {
    return ''
  }
  return String(basicNum.fund_type) === '2'
}
