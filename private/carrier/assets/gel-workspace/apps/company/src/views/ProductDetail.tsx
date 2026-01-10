import React, { useEffect, useState } from 'react'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'

import { getAPPDetail } from '../api/singleDetail'
import CompanyLink from '../components/company/CompanyLink'

import { pointBuriedGel } from '@/api/configApi'
import { Card, Col, Row } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import BreadCrumb from '../components/breadCrumb'
import { usePageTitle } from '../handle/siteTitle'
import { prodDetailColumns } from './ProdDetail/columns'
import { getProdDetailRows } from './ProdDetail/rows'
import './ProductDetail.less'

const { HorizontalTable } = Table

const ProductDetail = () => {
  const detailid = wftCommon.getQueryString('detailid') // 职位id
  const [detailInfo, setDetailInfo] = useState<any>({})
  usePageTitle('AppProductDetails', detailInfo?.appAbbr)
  const { appAbbr, appBrief, appCat, appRowkey, corpName, windId } = detailInfo

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

  const rows = getProdDetailRows(windId)
  return (
    <div className="logo-detail">
      <BreadCrumb
        subTitle={intl('451258', 'APP产品')}
        width="1282px"
        onSubClick={() => {
          wftCommon.jumpJqueryPage('index.html#/searchJob?nosearch=1')
        }}
        data-uc-id="yaH6mGM7E4d"
        data-uc-ct="breadcrumb"
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
            rows={rows}
            dataSource={detailInfo}
            striped
            data-uc-id="Tp_DA1puk-N"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>

          {/* 应用市场发布信息 */}
          {/* <p className='cardTitle'>{intl('470280', '应用市场发布信息')}</p> */}
          <Table
            style={{
              marginTop: '12px',
            }}
            title={intl('470280', '应用市场发布信息')}
            columns={prodDetailColumns}
            dataSource={detailInfo?.stores}
            pagination={false}
            data-uc-id="6t4FEjsGkFX"
            data-uc-ct="table"
          ></Table>
        </Card>
      </div>
    </div>
  )
}

export default ProductDetail
