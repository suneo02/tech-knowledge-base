import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { LoadingO } from '@wind/icons'
import { Spin, Tag } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { Links } from '../../components/common/links'
import Tables from '../../components/detail/singleTable'
import { usePageTitle } from '../../handle/siteTitle'
import intl from '../../utils/intl'
import { useScrollUtils } from '../../utils/scroll'
import { wftCommon } from '../../utils/utils'
import { BIDDERSANDDYNAMICS, biddingColumns, DETAILS, PARTICIPATINGANDCONTACT } from './columnsConfig'
import ProgressTimeline from './components/progressTimeline'
import './index.less'
import useBiddingDetail from './useStandardInfoDetail'

function type2Stage(type) {
  switch (type) {
    case '资格预审公告':
      return ' | ' + intl('257809', '预审')
    case '公开招标公告':
      return ' | ' + intl('100969', '招标')
    case '询价公告':
      return ' | ' + intl('100969', '招标')
    case '竞争性谈判公告':
      return ' | ' + intl('100969', '招标')
    case '单一来源公告':
      return ' | ' + intl('100969', '招标')
    case '邀请招标公告':
      return ' | ' + intl('100969', '招标')
    case '竞争性磋商公告':
      return ' | ' + intl('100969', '招标')
    case '竞价招标公告':
      return ' | ' + intl('100969', '招标')
    case '意向公告':
      return ' | ' + intl('100969', '招标')
    case '中标公告':
      return ' | ' + intl('315493', '结果')
    case '成交公告':
      return ' | ' + intl('315493', '结果')
    case '竞价结果公告':
      return ' | ' + intl('315493', '结果')
    case '废标流标公告':
      return ' | ' + intl('315493', '结果')
    case '更正公告':
      return ''
    case '开标公告':
      return ' | ' + intl('315493', '结果')
    case '合同及验收公告':
      return ' | ' + intl('315493', '结果')
    default:
      return ' '
  }
}

const BiddingDetail = () => {
  const { data1, data2, detail, navData, jumpAttach } = useBiddingDetail()
  const [show, setShow] = useState(false)
  const { scrollToView } = useScrollUtils()

  usePageTitle('TenderDetail', data1?.data?.bidName)

  useEffect(() => {
    jumpAttach &&
      setTimeout(() => {
        scrollToView('attachment')
      }, 1000)
  }, [jumpAttach])

  const breadCrumb = wftCommon.isBaiFenTerminalOrWeb() ? null : (
    <div className="bread-crumb">
      <div className="bread-crumb-content">
        <span className="last-rank" onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span>{intl('308653', '招标公告详情')}</span>
      </div>
    </div>
  )

  return (
    <div className="bidding-detail">
      {breadCrumb}
      <div className={'bid-detail-nav wrapper'}>
        {navData && (
          <div className="sub-nav-list">
            <div className="sub-nav-title">{intl(257819)}</div>
            <div className="sub-nav-timeline">
              <ProgressTimeline dataList={navData}></ProgressTimeline>
            </div>
          </div>
        )}
        <div className="item-detail" style={{ marginLeft: navData ? 230 : 0 }}>
          <div className="each-module title-padding"></div>
          <div className="tab-content">
            <span className="detail-header">
              <div>{wftCommon.formatCont(data1.data.bidName)}</div>
              <div>
                <span className="type-bid">
                  {/* @ts-expect-error ttt */}
                  <Tag color="color-1" type="primary">
                    {data1.data.bidType ? `${data1.data.bidType}${type2Stage(data1.data.bidType)}` : `--`}
                  </Tag>
                </span>
              </div>
            </span>

            <div className="header-item">
              <span className="item-span" style={{ marginRight: 100 }}>
                {`${intl(138774)} : ${wftCommon.formatCont(data1.data.announcementTime)}`}
              </span>
              <span className="item-span">
                {`${intl(142476)} ：`}
                {data1.data?.purchaseUnits?.split(',').map((i, index, arr) => (
                  <>
                    <Links
                      className="company-link"
                      key={index}
                      module={LinksModule.COMPANY}
                      title={i}
                      id={data1.data?.purchasIds?.split(',')[index]}
                    />
                    {index < arr.length - 1 && <span>；</span>}
                  </>
                ))}
              </span>
            </div>
            <div className="each-div" style={{ marginTop: 16 }}>
              <Tables
                key={DETAILS}
                title={biddingColumns[DETAILS].name}
                horizontal={biddingColumns[DETAILS].horizontal}
                info={data1.data}
                isLoading={data1.loading}
                columns={biddingColumns[DETAILS].getColumns(
                  data1.data.bidType,
                  data1.data.subjectMatter,
                  data1.data.projContactPhone && data1.data.projContactPerson
                )}
              />
            </div>
            <div className="each-div">
              <Tables
                key={PARTICIPATINGANDCONTACT}
                title={biddingColumns[PARTICIPATINGANDCONTACT].name}
                horizontal={biddingColumns[PARTICIPATINGANDCONTACT].horizontal}
                info={data2.data}
                columns={biddingColumns[PARTICIPATINGANDCONTACT].columns}
              />
            </div>
            {data1.data.bidCorpInfos &&
              (show ? (
                <div className="each-div">
                  <Tables
                    key={BIDDERSANDDYNAMICS}
                    title={
                      <p>
                        {biddingColumns[BIDDERSANDDYNAMICS].name}
                        <span style={{ float: 'right', color: '#c5c5c5', fontWeight: 400 }}>{intl('305133')}</span>
                      </p>
                    }
                    horizontal={biddingColumns[BIDDERSANDDYNAMICS].horizontal}
                    info={data1.data.bidCorpInfos}
                    isLoading={data1.loading}
                    columns={biddingColumns[BIDDERSANDDYNAMICS].columns}
                  />
                </div>
              ) : (
                <p
                  className="show-link"
                  onClick={() => {
                    setShow(true)
                  }}
                >
                  <span className="down-show"></span>
                  {intl('308673')}
                </p>
              ))}
          </div>

          <div className="main__content">
            <div className="detail-header">
              <div>
                {intl('272147', '招标公告正文')}{' '}
                {detail?.attachment && !detail.copyrightDeclare && (
                  // @ts-expect-error ttt
                  <Tag
                    color="color-1"
                    type="primary"
                    style={{ fontWeight: 400, cursor: 'pointer' }}
                    onClick={() => {
                      const ele = window.document.getElementById('attachment')
                      ele.scrollIntoView()
                    }}
                  >
                    {intl('309242') + `(${detail?.attachment?.length})`}
                  </Tag>
                )}
              </div>
              <div>
                {detail.translating ? (
                  <span style={{ fontSize: 14, fontWeight: 'normal' }}>
                    In Translation...
                    <LoadingO
                      style={{ marginInlineStart: 12 }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </span>
                ) : // <Button size="small" icon={<TranslateO />}></Button>
                null}
              </div>
            </div>

            {detail.loading ? (
              <div
                style={{
                  width: '100%',
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc',
                }}
              >
                <Spin tip="加载中" />
              </div>
            ) : detail?.copyrightDeclare ? (
              <div
                style={{
                  width: '100%',
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc',
                }}
              >
                {intl('391553', '应版权方要求此招投标公告不展示正文')}
              </div>
            ) : detail?.data ? (
              <div className="pdfhtml" dangerouslySetInnerHTML={{ __html: detail.data }}></div>
            ) : (
              <div
                style={{
                  width: '100%',
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc',
                }}
              >
                {intl('132725', '暂无数据')}
              </div>
            )}
          </div>

          {/* 有版权时不显示附件 */}
          {detail.attachment && !detail.copyrightDeclare && (
            <div id="attachment" className="main__content" style={{ paddingTop: 20 }}>
              <div style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{intl('294217')}</span>
                <span style={{ color: '#c5c5c5' }}>{intl('294184')}</span>
              </div>
              <div>
                {detail.attachment.map((i) => (
                  <p>
                    <a href={i.attchAddress}>{i.title}</a>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BiddingDetail
