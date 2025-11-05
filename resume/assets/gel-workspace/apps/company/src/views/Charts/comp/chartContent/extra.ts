import { GRAPH_MENU_TYPE } from '../constants'

// 根据菜单类型生成额外参数
export const makeExtraParams = (type) => {
  switch (type) {
    case GRAPH_MENU_TYPE.BENEFICIARY_OWNER:
      return {
        beneficiaryType: '1', // 受益人类型: 1 受益所有人 2受益自然人 3受益机构
      }
    case GRAPH_MENU_TYPE.BENEFICIARY_PERSON:
      return {
        beneficiaryType: '2', // 受益人类型: 1 受益所有人 2受益自然人 3受益机构
      }
    case GRAPH_MENU_TYPE.BENEFICIARY_ORG:
      return {
        beneficiaryType: '3', // 受益人类型: 1 受益所有人 2受益自然人 3受益机构
      }
    case GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS:
      return {
        rule: 'cas',
      }
    case GRAPH_MENU_TYPE.SSSE_RULES:
      return {
        rule: 'ssse',
      }
    case GRAPH_MENU_TYPE.SZSE_RULES:
      return {
        rule: 'szse',
      }
    case GRAPH_MENU_TYPE.CBIRC_RULES:
      return {
        rule: 'cbirc',
      }
    default:
      return null
  }
}
