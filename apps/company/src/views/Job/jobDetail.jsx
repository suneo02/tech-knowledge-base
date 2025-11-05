import React, { useEffect, useMemo, useState } from 'react'
import { wftCommon } from '../../utils/utils'
import intl from '../../utils/intl'

import { geJobDetail, geJobHots } from '../../api/singleDetail'
import CompanyLink from '../../components/company/CompanyLink'

import { Card, Col, Row } from '@wind/wind-ui'
import { pointBuriedGel } from '../../api/configApi'
import './jobDetail.less'
import BreadCrumb from '../../components/breadCrumb'
import Table from '@wind/wind-ui-table'
import { usePageTitle } from '../../handle/siteTitle'

const JobDetail = (props) => {
  const detailid = wftCommon.getQueryString('detailid') // 职位id
  const jobComCodeUrl = wftCommon.getQueryString('jobComCode') // 公司id
  const [detailInfo, setDetailInfo] = useState({})
  usePageTitle('JobDetail', [detailInfo?.companyName, detailInfo?.positionName])
  const [dataSource, setDataSource] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(true)

  const {
    companyName,
    eduReqName,
    experience,
    jobDuty,
    pay,
    positionName,
    publishDate,
    sourceName,
    sourceUrl,
    workPlace,
  } = detailInfo

  const jobComCode = useMemo(() => {
    return jobComCodeUrl || detailInfo?.companyCode
  }, [jobComCodeUrl, detailInfo])

  useEffect(() => {
    geJobDetail({
      detailId: detailid,
    })
      .then((res) => {
        if (res && Number(res.ErrorCode) === 0) {
          if (window.en_access_config) {
            wftCommon.translateService(res?.Data, (data) => {
              setDetailInfo(data || {})
            })
          } else {
            setDetailInfo(res?.Data || {})
          }
        }
      })
      .finally(() => {})

    pointBuriedGel('922602100649', '详情', 'detailView')
    pointBuriedGel('922602100879', '招聘', 'JobDetail')
  }, [])

  useEffect(() => {
    setLoading(true)
    geJobHots({
      companyCode: jobComCode,
      pageNo: pageNo - 1,
      pageSize: 10,
    })
      .then((res) => {
        if (res && Number(res.ErrorCode) === 0) {
          if (window.en_access_config) {
            setDataSource(res.Data || [])
            wftCommon.zh2en(res?.Data, (data) => {
              setDataSource(data || [])
            })
          } else {
            setDataSource(res.Data || [])
          }
        }
        setTotal(res?.Page?.Records || 0)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [pageNo, jobComCode])

  const columns = [
    {
      // title: intl('66742', '公司舆情'),
      dataIndex: 'news',
      width: '100%',
      render: (key, data) => {
        const { eduReqName, experience, pay, positionName, publishDate, seqId, workPlace } = data
        return (
          <div
            className="hotCard"
            onClick={() => {
              if (wftCommon.isDevDebugger()) {
                return window.open(`#/jobDetail?detailid=${seqId}&jobComCode=${jobComCode}`)
              }
              wftCommon.jumpJqueryPage(`index.html#/jobDetail?type=jobs?detailid=${seqId}&jobComCode=${jobComCode}`)
            }}
          >
            <Row type="flex" justify="space-between" className="jobHeader">
              <Col className="jobName">{positionName}</Col>
              <Col className="jobMoney">{pay}</Col>
            </Row>
            <Row gutter={48} type="flex" justify="start">
              <Col>
                {intl('138774', '发布时间')}：{wftCommon.formatTime(publishDate)}
              </Col>
              <Col>
                {intl('271969', '招聘企业')}：
                <span>
                  <CompanyLink stopPropagation divCss="companyLink" name={companyName} id={jobComCode}></CompanyLink>
                </span>
              </Col>
              <Col>
                {intl('214189', '学历要求')}：{eduReqName}
              </Col>
            </Row>
            <Row gutter={48} type="flex" justify="start">
              <Col>
                {intl('138583', '工作地点')}：{workPlace}
              </Col>
              <Col>
                {intl('349213', '经验要求')}：{experience}
              </Col>
            </Row>
          </div>
        )
      },
    },
  ]
  const pageProps = {
    current: pageNo,
    pageSize: 10,
    total: total,
    onChange: (page) => pageChange(page),
    hideOnSinglePage: false,
    showSizeChanger: false,
    showQuickJumper: true,
  }
  const pageChange = (page) => {
    if (window.en_access_config) {
      if (wftCommon.globalTranslating.size) return
    }
    setPageNo(page)
  }

  return (
    <div className="logo-detail">
      <BreadCrumb
        subTitle={intl('138356', '招聘')}
        width="1220px"
        onSubClick={() => {
          wftCommon.jumpJqueryPage('index.html#/searchJob?nosearch=1')
        }}
      ></BreadCrumb>

      <div className="jobDetail">
        {/* 职位简介 */}
        <Card className="jobCard">
          <Row type="flex" justify="space-between" className="jobHeader" style={{ fontSize: '18px' }}>
            <Col className="jobName">{positionName}</Col>
            <Col className="jobMoney">{pay}</Col>
          </Row>
          <Row type="flex" justify="space-between" className="jobSubTitle">
            <Col>
              <span>{workPlace}</span>
              &nbsp; |&nbsp;
              <span>{experience}</span>
              &nbsp;|&nbsp;
              <span>{eduReqName}</span>
              &nbsp;|&nbsp;
              <span>
                <CompanyLink divCss="companyLink" name={companyName} id={jobComCode}></CompanyLink>
              </span>
            </Col>
            <Col>
              {intl('9754', '来源')}：
              <span>
                <a href={sourceUrl} target="__blank">
                  {sourceName}
                </a>
              </span>
            </Col>
          </Row>
        </Card>

        {/* 职位描述 */}
        <Card className="jobCard">
          <p className="card-title">{intl('138355', '职位描述')}</p>
          <p>{jobDuty}</p>
        </Card>

        {/* 热招职位 */}
        <Card className="jobCard">
          <p className="card-title">{intl('214193', '所属企业热招的职位')}</p>
          <Table
            key={'companynews'}
            locale={{
              emptyText: loading ? 'loading...' : intl('132725', '暂无数据'),
            }}
            columns={columns}
            pagination={total > 10 ? pageProps : false}
            loading={loading}
            dataSource={dataSource}
            striped={false} // 是否显示隔行间色
            showHeader={false}
          />
        </Card>
      </div>
    </div>
  )
}

export default JobDetail
