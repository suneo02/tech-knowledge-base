import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Card } from '@wind/wind-ui'

import './GameapprovalDetail.less'

import { wftCommon } from '../utils/utils'
import { parseQueryString } from '../lib/utils'
import Table from '@wind/wind-ui-table'
import intl from '../utils/intl'
import { getgameapprovaldetail } from '../api/gameapprovalApi'
import CompanyLink from '../components/company/CompanyLink'
import { BreadCrumbT } from '../components/BreadCrumbT'

const { HorizontalTable } = Table

function GameapprovalDetail(props) {
  let { id } = parseQueryString()
  const [dataSource, setDataSource] = useState({})
  useEffect(() => {
    getgameapprovaldetail(id).then((res) => {
      wftCommon.translateService(res?.data, (endData) => {
        res?.data?.changeInfoList &&
          res.data.changeInfoList.length &&
          wftCommon.zh2en(res.data.changeInfoList, (endDatas) => {
            setDataSource({
              ...endData,
              changeInfoList: endDatas,
            })
          })
        endData &&
          setDataSource({
            ...endData,
            changeInfoList: res?.data?.changeInfoList,
          })
      })
    })
  }, [])
  const changeInfoKey = [
    [
      {
        title: intl('149548', '变更日期'),
        colSpan: 5,
        dataIndex: 'changeDate',
        render: (txt, row) => {
          return wftCommon.formatTime(txt) || '--'
        },
      },
    ],
    [
      {
        title: intl('354829', '变更内容'),
        colSpan: 5,
        dataIndex: 'changeContent',
        render: (txt, row) => {
          return txt || '--'
        },
      },
    ],
  ]
  const itemKey = [
    [
      {
        title: intl('354858', '游戏名称'),
        colSpan: 2,
        dataIndex: 'gameName',
        render: (txt, row) => {
          return txt || '--'
        },
      },
      {
        title: intl('148644', '批准日期'),
        colSpan: 2,
        dataIndex: 'year',
        render: (txt, row) => {
          return wftCommon.formatTime(txt) || '--'
        },
      },
    ],
    [
      {
        title: intl('354823', '审批类型'),
        colSpan: 2,
        dataIndex: 'approvalType',
        render: (txt, row) => {
          return txt || '--'
        },
      },
      {
        title: intl('149321', '申报类别'),
        colSpan: 2,
        dataIndex: 'declarationCategory',
        render: (txt, row) => {
          return txt || '--'
        },
      },
    ],
    [
      {
        title: intl('354819', '运营单位'),
        colSpan: 2,
        dataIndex: 'operatingUnit',
        render: (txt, row) => {
          return <CompanyLink name={txt || '--'} id={row.operatingUnitId}></CompanyLink>
        },
      },
      {
        title: intl('354820', '出版单位'),
        colSpan: 2,
        dataIndex: 'publisher',
        render: (txt, row) => {
          return <CompanyLink name={txt || '--'} id={row.publisherId}></CompanyLink>
        },
      },
    ],
    [
      {
        title: intl('354821', '文号'),

        colSpan: 2,
        dataIndex: 'documentNumber',
        render: (txt, row) => {
          return txt || '--'
        },
      },
      {
        title: intl('354855', '出版物号'),

        colSpan: 2,
        dataIndex: 'publicationNumber',
        render: (txt, row) => {
          return txt || '--'
        },
      },
    ],
  ]

  return (
    <React.Fragment>
      <div className="breadcrumb-box">
        <BreadCrumbT subTitle={intl('354853', '游戏审批')} />
      </div>
      <div className="gameapproval">
        {/* 页面的任何地方加上Prompt组件都生效 */}
        {/* <Prompt when={isHoldUpRouter} message={this.handleRouterHoldUp} /> */}
        <Card title={intl('354824', '游戏审批详情')} styleType="block">
          <HorizontalTable
            bordered={'default'}
            className=""
            loading={false}
            rows={itemKey}
            dataSource={dataSource}
            data-uc-id="MgL1gdwfi"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        </Card>
        {dataSource?.changeInfoList &&
          dataSource.changeInfoList.length > 0 &&
          dataSource?.changeInfoList.map((changeInfo, index) => (
            <Card key={index} title={`${intl('354825', '变更信息')} ${index + 1}`} styleType="block">
              <HorizontalTable
                bordered={'default'}
                className=""
                loading={false}
                rows={changeInfoKey}
                dataSource={changeInfo}
                data-uc-id="g7WU100WF9"
                data-uc-ct="horizontaltable"
              ></HorizontalTable>
            </Card>
          ))}
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    baseInfo: state.company.baseInfo.corp,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: () => {
      dispatch({ type: 'RESET' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameapprovalDetail)
