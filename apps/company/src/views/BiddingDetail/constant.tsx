import { Tree } from '@wind/wind-ui'
import React from 'react'
import intl from '../../utils/intl'
import { biddingDetailPurchaseUnitList } from './config'

const TreeNode = Tree.TreeNode
const getTreeNode = (arr, level) => {
  return (
    <TreeNode
      title={arr[0]}
      key={`${level}`}
      icon={() => <span>123</span>}
      data-uc-id="kUliCkPwq4"
      data-uc-ct="treenode"
      data-uc-x={`${level}`}
    >
      {arr.length > 1 && getTreeNode(arr.slice(1), level + 1)}
    </TreeNode>
  )
}

const { wftCommon } = require('../../utils/utils')
export const DETAIL_COLUMNS = {
  type0: [
    [
      {
        title: intl('199999', '项目名称'),
        dataIndex: 'projectName',
        colSpan: 5,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('38785', '标的物'),
        dataIndex: 'subjectMatter',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
        render: (text, row) => {
          let { product } = row
          let attendProduct = <></>
          if (product) {
            let temp = product.split('|')
            attendProduct = (
              <p>
                {temp.map((i) => (
                  <span className="bdw-product">#{i}</span>
                ))}
              </p>
            )
          }
          return (
            <>
              <p>{wftCommon.formatCont(text)}</p>
              {attendProduct}
            </>
          )
        },
      },
    ],
    [
      {
        title: intl('114650', '项目编号'),
        dataIndex: 'projectCode',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.slice(0, 5) == 'WIND_' ? '--' : text) : '--'
        },
      },
      {
        title: intl('257807', '项目阶段'),
        dataIndex: 'projectStage',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      biddingDetailPurchaseUnitList,
      {
        title: intl('257690', '国标行业'),
        dataIndex: 'industryGb',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          if (!text) return '--'
          let arr = text.split('-')
          return (
            <Tree showLine={true} selectable={false} defaultExpandAll={true} data-uc-id="uPgg3TBLf" data-uc-ct="tree">
              {getTreeNode(arr, 0)}
            </Tree>
          )
        },
      },
    ],
    [
      {
        title: intl('261808', '预算金额'),
        dataIndex: 'budgetMoney',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
      {
        title: intl('228341', '投标保证金'),
        dataIndex: 'deposit',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
    ],
    [
      {
        title: intl('222821', '项目联系人'),
        dataIndex: 'projContactPerson',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('222823', '项目联系电话'),
        dataIndex: 'projContactPhone',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('257820', '资格预审文件获取时间'),
        dataIndex: 'prequalFileGetTime',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.substring(0, 4) === '2079' ? '--' : wftCommon.formatTime(text.split(' ')[0])) : '--'
        },
      },
      {
        title: intl('257821', '提交文件截止时间'),
        dataIndex: 'docSubmitDeadline',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.substring(0, 4) === '2079' ? '--' : wftCommon.formatTime(text.split(' ')[0])) : '--'
        },
      },
    ],
  ],
  type1: [
    [
      {
        title: intl('199999', '项目名称'),
        dataIndex: 'projectName',
        colSpan: 5,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('38785', '标的物'),
        dataIndex: 'subjectMatter',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
        render: (text, row) => {
          let { product } = row
          let attendProduct = <></>
          if (product) {
            let temp = product.split('|')
            attendProduct = (
              <p>
                {temp.map((i) => (
                  <span className="bdw-product">#{i}</span>
                ))}
              </p>
            )
          }
          return (
            <>
              <p>{wftCommon.formatCont(text)}</p>
              {attendProduct}
            </>
          )
        },
      },
    ],
    [
      {
        title: intl('114650', '项目编号'),
        dataIndex: 'projectCode',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.slice(0, 5) == 'WIND_' ? '--' : text) : '--'
        },
      },
      {
        title: intl('257807', '项目阶段'),
        dataIndex: 'projectStage',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      biddingDetailPurchaseUnitList,
      {
        title: intl('246676', '国标行业'),
        dataIndex: 'industryGb',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          if (!text) return '--'
          let arr = text.split('-')
          return (
            <Tree showLine={true} selectable={false} defaultExpandAll={true} data-uc-id="RcoiRSvUgL" data-uc-ct="tree">
              {getTreeNode(arr, 0)}
            </Tree>
          )
        },
      },
    ],
    [
      {
        title: intl('261808', '预算金额'),
        dataIndex: 'budgetMoney',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
      {
        title: intl('228341', '投标保证金'),
        dataIndex: 'deposit',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
    ],
    [
      {
        title: intl('222821', '项目联系人'),
        dataIndex: 'projContactPerson',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('222823', '项目联系电话'),
        dataIndex: 'projContactPhone',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('228349', '投标截止时间'),
        dataIndex: 'bidDeadline',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.substring(0, 4) === '2079' ? '--' : wftCommon.formatTime(text.split(' ')[0])) : '--'
        },
      },
      {
        title: intl('228348', '开标时间'),
        dataIndex: 'bidOpenTime',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.substring(0, 4) === '2079' ? '--' : wftCommon.formatTime(text.split(' ')[0])) : '--'
        },
      },
    ],
  ],
  type2: [
    [
      {
        title: intl('199999', '项目名称'),
        dataIndex: 'projectName',
        colSpan: 5,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('38785', '标的物'),
        dataIndex: 'subjectMatter',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
        render: (text, row) => {
          let { product } = row
          let attendProduct = <></>
          if (product) {
            let temp = product.split('|')
            attendProduct = (
              <p>
                {temp.map((i) => (
                  <span className="bdw-product">#{i}</span>
                ))}
              </p>
            )
          }
          return (
            <>
              <p>{wftCommon.formatCont(text)}</p>
              {attendProduct}
            </>
          )
        },
      },
    ],
    [
      {
        title: intl('114650', '项目编号'),
        dataIndex: 'projectCode',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.slice(0, 5) == 'WIND_' ? '--' : text) : '--'
        },
      },
      {
        title: intl('257807', '项目阶段'),
        dataIndex: 'projectStage',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      biddingDetailPurchaseUnitList,
      {
        title: intl('246676', '国标行业'),
        dataIndex: 'industryGb',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          if (!text) return '--'
          let arr = text.split('-')
          return (
            <Tree showLine={true} selectable={false} defaultExpandAll={true} data-uc-id="oF3ZflKQgH" data-uc-ct="tree">
              {getTreeNode(arr, 0)}
            </Tree>
          )
        },
      },
    ],
    [
      {
        title: intl('261808', '预算金额'),
        dataIndex: 'budgetMoney',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
      {
        title: intl('228341', '投标保证金'),
        dataIndex: 'deposit',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
    ],
    [
      {
        title: intl('222821', '项目联系人'),
        dataIndex: 'projContactPerson',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('222823', '项目联系电话'),
        dataIndex: 'projContactPhone',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
  ],
  type3: [
    [
      {
        title: intl('199999', '项目名称'),
        dataIndex: 'projectName',
        colSpan: 5,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('38785', '标的物'),
        dataIndex: 'subjectMatter',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
        render: (text, row) => {
          let { product } = row
          let attendProduct = <></>
          if (product) {
            let temp = product.split('|')
            attendProduct = (
              <p>
                {temp.map((i) => (
                  <span className="bdw-product">#{i}</span>
                ))}
              </p>
            )
          }
          return (
            <>
              <p>{wftCommon.formatCont(text)}</p>
              {attendProduct}
            </>
          )
        },
      },
    ],
    [
      {
        title: intl('114650', '项目编号'),
        dataIndex: 'projectCode',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.slice(0, 5) == 'WIND_' ? '--' : text) : '--'
        },
      },
      {
        title: intl('257807', '项目阶段'),
        dataIndex: 'projectStage',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      biddingDetailPurchaseUnitList,
      {
        title: intl('246676', '国标行业'),
        dataIndex: 'industryGb',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          if (!text) return '--'
          let arr = text.split('-')
          return (
            <Tree showLine={true} selectable={false} defaultExpandAll={true} data-uc-id="xUiUxyv8u_" data-uc-ct="tree">
              {getTreeNode(arr, 0)}
            </Tree>
          )
        },
      },
    ],
    [
      {
        title: intl('228352', '中标/成交日期'),
        dataIndex: 'bidWinningTime',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatTime(text)
        },
      },
      {
        title: intl('228353', '总中标/成交金额'),
        dataIndex: 'totalTradeAmount',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? wftCommon.formatMoneyComma(text) + '元' : '--'
        },
      },
    ],
    [
      {
        title: intl('222821', '项目联系人'),
        dataIndex: 'projContactPerson',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('222823', '项目联系电话'),
        dataIndex: 'projContactPhone',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
  ],
  type4: [
    [
      {
        title: intl('199999', '项目名称'),
        dataIndex: 'projectName',
        colSpan: 5,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      {
        title: intl('38785', '标的物'),
        dataIndex: 'subjectMatter',
        contentAlign: 'left',
        titleAlign: 'left',
        colSpan: 5,
        render: (text, row) => {
          let { product } = row
          let attendProduct = <></>
          if (product) {
            let temp = product.split('|')
            attendProduct = (
              <p>
                {temp.map((i) => (
                  <span className="bdw-product">#{i}</span>
                ))}
              </p>
            )
          }
          return (
            <>
              <p>{wftCommon.formatCont(text)}</p>
              {attendProduct}
            </>
          )
        },
      },
    ],
    [
      {
        title: intl('114650', '项目编号'),
        dataIndex: 'projectCode',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return text ? (text.slice(0, 5) == 'WIND_' ? '--' : text) : '--'
        },
      },
      {
        title: intl('257807', '项目阶段'),
        dataIndex: 'projectStage',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
    [
      biddingDetailPurchaseUnitList,
      {
        title: intl('246676', '国标行业'),
        dataIndex: 'industryGb',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          if (!text) return '--'
          let arr = text.split('-')
          return (
            <Tree showLine={true} selectable={false} defaultExpandAll={true} data-uc-id="p5dDi1p8Gi" data-uc-ct="tree">
              {getTreeNode(arr, 0)}
            </Tree>
          )
        },
      },
    ],
    [
      {
        title: intl('222821', '项目联系人'),
        dataIndex: 'projContactPerson',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
      {
        title: intl('222823', '项目联系电话'),
        dataIndex: 'projContactPhone',
        colSpan: 2,
        contentAlign: 'left',
        titleAlign: 'left',
        render: (text) => {
          return wftCommon.formatCont(text)
        },
      },
    ],
  ],
}
