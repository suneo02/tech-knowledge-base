import React from 'react'
import CompanyLink from '../../components/company/CompanyLink'
import intl from '../../utils/intl'
import { Tree } from '@wind/wind-ui'
import { DETAIL_COLUMNS } from './constant'
import { LinksModule } from '../../handle/link'
import { Links } from '../../components/common/links'

const TreeNode = Tree.TreeNode

const { wftCommon } = require('../../utils/utils')

const DETAILS = 'details'
const PARTICIPATINGANDCONTACT = 'participatingAndContact'
const BIDDERSANDDYNAMICS = 'biddersAndDynamics'

const getTreeNode = (arr, level) => {
  return (
    <TreeNode title={arr[0]} key={`${level}`} data-uc-id="hYSqedgXnBM" data-uc-ct="treenode" data-uc-x={`${level}`}>
      {arr.length > 1 && getTreeNode(arr.slice(1), level + 1)}
    </TreeNode>
  )
}

const subjectMap = {
  829002001: intl('142476', '采购单位'),
  829002002: intl('138136', '代理机构'),
  829002003: intl('372353', '拟定供应商'),
  829002004: intl('372333', '中标人/供应商'),
  829002005: intl('372334', '中标候选人'),
  829002006: intl('257824', '投标单位'),
}

//国家标准
const biddingColumns = {
  [DETAILS]: {
    getColumns: (type, showSubjectMatter, showCphone) => {
      let res = []
      switch (type) {
        case '资格预审公告':
          res = DETAIL_COLUMNS['type0']
          break
        case '公开招标公告':
        case '询价公告':
        case '邀请招标公告':
        case '竞争性谈判公告':
        case '竞争性磋商公告':
        case '竞价招标公告':
          res = DETAIL_COLUMNS['type1']
          break
        case '单一来源公告':
          res = DETAIL_COLUMNS['type2']
          break
        case '中标公告':
        case '成交公告':
        case '竞价结果公告':
        case '合同及验收公告':
          res = DETAIL_COLUMNS['type3']
          break
        case '废标流标公告':
        case '更正公告':
          res = DETAIL_COLUMNS['type4']
          break
        default:
          res = DETAIL_COLUMNS['type0']
      }
      if (!showSubjectMatter) {
        res = res.filter((i) => {
          return i[0].dataIndex != 'subjectMatter'
        })
      }
      if (!showCphone) {
        res = res.filter((i) => {
          return i[0].dataIndex != 'projContactPerson'
        })
      }
      return res
    },
    horizontal: true,
  },
  [PARTICIPATINGANDCONTACT]: {
    columns: [
      {
        title: intl('142474', '参与角色'),
        dataIndex: 'role',
        width: '15%',
        render: (text) => {
          let role = '--'
          if (text in subjectMap) {
            role = subjectMap[text]
          }
          return role
        },
      },
      {
        title: intl('32914', '公司名称'),
        dataIndex: 'corpName',
        render: (text, row) => {
          return <Links title={text} id={row.companyCode} module={LinksModule.COMPANY} />
        },
      },
      {
        title: intl('69149', '联系人'),
        width: '10%',
        dataIndex: 'contactPerson',
        align: 'left',
        render: (text, row) => {
          return wftCommon.formatCont(text) + (row.currency ? row.currency : '')
        },
      },
      {
        title: intl('257648', '联系方式'),
        dataIndex: 'phoneNumber',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('19414', '地址'),
        dataIndex: 'address',
        width: '35%',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    horizontal: false,
    name: intl('257822', '参与主体及联系方式'),
  },
  // 投标单位及竞标态势
  [BIDDERSANDDYNAMICS]: {
    columns: [
      {
        title: intl('28846', '序号'),
        dataIndex: 'draftingUnit',
        width: '5%',
        render: (text, row, index) => {
          return index + 1
        },
      },
      {
        title: intl('32914', '公司名称'),
        dataIndex: 'corpName',
        render: (text, row) => {
          return <CompanyLink name={text} id={row.companyCode} />
        },
      },
      {
        title: intl('451220', '注册资本（万）'),
        width: '15%',
        dataIndex: 'regCapital',
        align: 'right',
        render: (text, row) => {
          return wftCommon.formatMoneyComma(text)
        },
      },
      {
        title: intl('257690', '国标行业'),
        dataIndex: 'industryGb',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('257835', '是否中标/成交'),
        width: '15%',
        dataIndex: 'isDeal',
        render: (text) => {
          return text ? '中标人/供应商' : ''
        },
      },
    ],
    horizontal: false,
    name: intl('257825', '投标单位及竞标态势'),
  },
}

export { biddingColumns, DETAILS, PARTICIPATINGANDCONTACT, BIDDERSANDDYNAMICS }
