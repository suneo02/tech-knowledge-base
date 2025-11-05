import React, { useEffect, useState } from 'react'
import { wftCommon } from '../utils/utils'
import intl from '../utils/intl'

import { getAPPDetail } from '../api/singleDetail'
import CompanyLink from '../components/company/CompanyLink'

import { Card, Col, Row } from '@wind/wind-ui'
import { pointBuriedGel } from '../api/configApi'
import './ProductDetail.less'
import Table from '@wind/wind-ui-table'
import BreadCrumb from '../components/breadCrumb'
import { usePageTitle } from '../handle/siteTitle'

const { HorizontalTable } = Table

const ProductDetail = (props) => {
  const detailid = wftCommon.getQueryString('detailid') // 职位id
  const [detailInfo, setDetailInfo] = useState({})
  usePageTitle('AppProductDetails', detailInfo?.appAbbr)
  const { appAbbr, appBrief, appCat, appDesc, appId, appRowkey, corpName, dateRpGen, downNum, noteNum, windId } =
    detailInfo

  useEffect(() => {
    getAPPDetail({
      detailId: detailid,
    })
      .then((res) => {
        if (res && Number(res.ErrorCode) === 0) {
          if (window.en_access_config) {
            wftCommon.pureTranslateService(res?.Data, (data) => {
              if (res?.Data?.stores?.length) {
                wftCommon.zh2en(res?.Data?.stores, (stores) => {
                  console.log('🚀 ~.then ~ res?.Data?.stores:', res?.Data?.stores)
                  data.stores = stores
                  console.log('🚀 ~.then ~ data:', data)
                  setDetailInfo(data || {})
                })
              } else {
                setDetailInfo(data || {})
              }
            })
          } else {
            setDetailInfo(res?.Data || {})
          }
        }
      })
      .finally(() => {})

    pointBuriedGel('922602100649', '详情', 'detailView')
    pointBuriedGel('922602100846', 'App产品', 'appDetail')
  }, [])

  // 基本信息 横向表格column
  const rows = [
    [
      {
        title: intl('301088', '产品简称'),
        dataIndex: 'appAbbr',
        key: 'appAbbr',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
      {
        title: intl('112710', '所属企业'),
        dataIndex: 'corpName',
        dataIndex: 'corpName',
        titleAlign: 'left',
        render: (data, row) => <CompanyLink divCss="companyLink" name={data} id={windId}></CompanyLink>,
      },
    ],
    [
      {
        title: intl('451260', '产品类别'),
        dataIndex: 'appCat',
        dataIndex: 'appCat',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
      {
        title: intl('208862', '下载总数量'),
        dataIndex: 'downNum',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('208881', '评分'),
        dataIndex: 'score',
        titleAlign: 'left',
        render: (data) => (data && (+data).toFixed(1)) || '--', // 小数点保留一位
      },
      {
        title: intl('208863', '评论总数量'),
        dataIndex: 'noteNum',
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('451261', '产品简述'),
        dataIndex: 'appBrief',
        colSpan: 3,
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
    [
      {
        title: intl('208888', '产品介绍'),
        dataIndex: 'appDesc',
        colSpan: 3,
        titleAlign: 'left',
        render: (data) => data || '--',
      },
    ],
  ]

  // 应用市场发布信息
  const columns = [
    {
      title: intl('28846', '序号'),
      dataIndex: 'storeName',
      render: (i, obj, index) => index + 1,
      width: 60,
    },
    {
      title: intl('207828', '应用市场'),
      dataIndex: 'storeName',
      render: (data) => data || '--',
    },
    {
      title: intl('208884', '产品全称'),
      dataIndex: 'appName',
      render: (data) => data || '--',
    },
    {
      title: intl('207829', '开发商名称'),
      dataIndex: 'creatorName',
      render: (data) => data || '--',
      width: 200,
    },
    {
      title: intl('138774', '发布时间'),
      dataIndex: 'relDate',
      render: (data) => data || '--',
    },
    {
      title: intl('208885', '下载数量'),
      dataIndex: 'downNum',
      render: (data) => data || '--',
    },
    {
      title: intl('208881', '评分'),
      dataIndex: 'score',
      render: (data) => data || '--',
    },
    {
      title: intl('207830', '评论数量'),
      dataIndex: 'noteNum',
      render: (data) => data || '--',
    },
    {
      title: intl('208874', '最新版本号'),
      dataIndex: 'lstVer',
      render: (data) => data || '--',
    },
    {
      title: intl('138868', '更新时间'),
      dataIndex: 'uptDate',
      render: (data) => wftCommon.formatTime(data),
    },
  ]

  return (
    <div className="logo-detail">
      <BreadCrumb
        subTitle={intl('451258', 'APP产品')}
        width="1282px"
        onSubClick={() => {
          wftCommon.jumpJqueryPage('index.html#/searchJob?nosearch=1')
        }}
      ></BreadCrumb>

      <div className="APPDetail">
        <Card className="Card">
          {/* 图片和简介 */}
          <Row gutter={16} type="flex" justify="start">
            <Col style={{ height: '92px' }}>{wftCommon.imageBase(6730, appRowkey, '', false, '90')}</Col>
            <Col span={20}>
              <Row className="Header">
                <p className="Name">{appAbbr}</p>
              </Row>
              <Row type="flex" justify="start">
                <Col span={6}>
                  {intl('451260', '产品类别')}：{appCat || '--'}
                </Col>
                <Col>
                  {intl('112710', '所属企业')}：
                  {<CompanyLink divCss="companyLink" name={corpName} id={windId}></CompanyLink>}
                </Col>
              </Row>
              <Row>
                {intl('451261', '产品简述')}：{appBrief || '--'}
              </Row>
            </Col>
          </Row>

          {/* 基本信息 */}
          {/* <p className='cardTitle'>{intl('257642', '基本信息')}</p> */}
          <HorizontalTable
            title={intl('257642', '基本信息')}
            bordered={'dotted'}
            loading={false}
            // title={expandDetail.title || null}
            rows={rows}
            dataSource={detailInfo}
            striped
          ></HorizontalTable>

          {/* 应用市场发布信息 */}
          {/* <p className='cardTitle'>{intl('207825', '应用市场发布信息')}</p> */}
          <Table
            style={{
              marginTop: '12px',
            }}
            title={intl('207825', '应用市场发布信息')}
            columns={columns}
            dataSource={detailInfo?.stores}
            pagination={false}
          ></Table>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetail
