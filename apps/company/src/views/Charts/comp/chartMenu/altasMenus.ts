import intl from '@/utils/intl'
import { GRAPH_MENU_TYPE } from '../constants'

/**
 * @description 新版图谱平台菜单
 */
export const atlasTreeData = [
  {
    title: intl('367279', '图谱平台首页'),
    key: 'atlasplatform',
    parentNode: false, // 点击事件中为true是展开的效果，为false是跳转页面
    homePage: true, // 用来判断跳转的是否是react新的router
  },
  {
    title: intl('367256', '股权类图谱'),
    key: 'gqltp',
    parentNode: true,
    children: [
      {
        title: intl('138279', '股权穿透图'),
        key: 'chart_gqct',
        buryId: 922602100370,
        type: GRAPH_MENU_TYPE.EQUITY_PENETRATION,
        exportAction: true,
      },
      {
        title: intl('367274', '对外投资图'),
        key: 'chart_newtzct',
        buryId: 922602100998,
        type: GRAPH_MENU_TYPE.INVESTMENT,
        exportAction: true,
      },
      {
        title: intl('356113', '实控人图谱'),
        key: 'chart_yskzr',
        buryId: 922602100303,
        type: GRAPH_MENU_TYPE.ACTUAL_CONTROLLER,
      },
      {
        title: intl('367259', '受益人图谱'),
        key: 'chart_qysyr',
        buryId: 922602100994,
        children: [
          {
            title: intl('421585', '受益所有人'),
            key: 'beneficiaryOwner',
            type: GRAPH_MENU_TYPE.BENEFICIARY_OWNER,
          },
          {
            title: intl('421600', '受益自然人'),
            key: 'beneficiaryPerson',
            type: GRAPH_MENU_TYPE.BENEFICIARY_PERSON,
          },
          {
            title: intl('421586', '受益机构'),
            key: 'beneficiaryOrg',
            type: GRAPH_MENU_TYPE.BENEFICIARY_ORG,
          },
        ],
      },
    ],
  },
  {
    title: intl('367257', '关系类图谱'),
    key: 'gxltp',
    parentNode: true,
    children: [
      {
        title: intl('243685', '关联方图谱'),
        key: 'chart_glgx',
        children: [
          {
            title: intl('358256', '企业会计准则'),
            key: 'accountingStandards',
            type: GRAPH_MENU_TYPE.ACCOUNTING_STANDARDS,
            exportAction: true,
          },
          {
            title: intl('413113', '上交所规则'),
            key: 'ssseRules',
            type: GRAPH_MENU_TYPE.SSSE_RULES,
            exportAction: true,
          },
          {
            title: intl('413114', '深交所规则'),
            key: 'szseRules',
            type: GRAPH_MENU_TYPE.SZSE_RULES,
            exportAction: true,
          },
          {
            title: intl('413093', '银保监规则'),
            key: 'cbircRules',
            type: GRAPH_MENU_TYPE.CBIRC_RULES,
            exportAction: true,
          },
        ],
      },
      {
        title: intl('138676', '企业图谱'),
        key: 'chart_qytp',
        type: GRAPH_MENU_TYPE.ENTERPRISE,
      },
      {
        title: intl('138486', '疑似关系'),
        key: 'chart_ysgx',
        buryId: 922602100302,
        type: GRAPH_MENU_TYPE.SUSPECTED_RELATION,
      },
      {
        title: intl('342095', '竞争图谱'),
        key: 'chart_jztp',
        externalLink: '/windkg/index.html#/competitors?companyname=融创房地产集团有限公司&id=1015343518',
      },
    ],
  },
  {
    title: intl('367258', '融资类图谱'),
    key: 'rzltp',
    parentNode: true,
    children: [
      {
        title: intl('206370', '融资图谱'),
        key: 'chart_rztp',
        buryId: 922602100301,
        type: GRAPH_MENU_TYPE.FINANCING,
        noAction: true,
      },
      {
        title: intl('138297', '融资历程'),
        key: 'chart_rzlc',
        buryId: 922602100304,
        type: GRAPH_MENU_TYPE.FINANCING_HISTORY,
        noAction: true,
      },
    ],
  },
  {
    title: intl('422046', '查关系'),
    key: 'cgx',
    parentNode: true,
    children: [
      {
        title: intl('422046', '查关系'),
        key: 'chart_cgx',
        url: 'relationChart',
        type: GRAPH_MENU_TYPE.RELATION_QUERY,
        noSearch: true,
      },
      {
        title: intl('247485', '多对一触达'),
        key: 'chart_ddycd',
        url: 'chartDetach',
        buryId: 922602101004,
        type: GRAPH_MENU_TYPE.MULTI_TO_ONE,
        noSearch: true,
      },
      {
        title: intl('303394', '持股路径'),
        key: 'chart_cglj',
        noSearch: true,
        type: GRAPH_MENU_TYPE.SHAREHOLDING_PATH,
      },
    ],
  },
]

/**
 * @description 查找菜单是否存在
 * @param {Array} data 菜单数据
 * @param {string} targetKey 目标key
 */
export const findKeyInTree = (data, targetKey) => {
  for (const item of data) {
    if (item.key === targetKey && !item.children?.length) {
      return true
    }
    if (item.children?.length > 0) {
      if (findKeyInTree(item.children, targetKey)) {
        return true
      }
    }
  }
  return false
}

/**
 * @description 查找菜单是否存在
 * @param {Array} data 菜单数据
 * @param {string} targetKey 目标key
 * @returns {boolean} 如果有targetType，则返回查找到的targetType对应的值
 */
export const findKeyInTreeByType = (data, targetKey) => {
  for (const item of data) {
    if (item.key === targetKey && !item.children?.length) {
      return item
    }
    if (item.children?.length > 0) {
      const result = findKeyInTreeByType(item.children, targetKey)
      if (result) return result
    }
  }
  return null
}

/**
 * @description 获取默认展开的菜单
 */
export const getDefaultExpandedKeys = (data, targetKey, parentKeys = []) => {
  for (const item of data) {
    if (item.key === targetKey) {
      return parentKeys
    }
    if (item.children?.length > 0) {
      const result = getDefaultExpandedKeys(item.children, targetKey, [...parentKeys, item.key])
      if (result) return result
    }
  }
  return null
}
