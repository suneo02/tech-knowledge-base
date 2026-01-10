import { SingleTable } from '@/components/detail/singleTable'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { LoadingO } from '@wind/icons'
import { Spin, Tag } from '@wind/wind-ui'
import { BidTypeTag } from 'gel-ui'
import { t } from 'gel-util/intl'
import React, { useEffect, useState } from 'react'
import { Links } from '../../components/common/links'
import { usePageTitle } from '../../handle/siteTitle'
import intl from '../../utils/intl'
import { useScrollUtils } from '../../utils/scroll'
import { wftCommon } from '../../utils/utils'
import { BIDDERSANDDYNAMICS, biddingColumns, DETAILS, PARTICIPATINGANDCONTACT } from './columnsConfig'
import ProgressTimeline from './components/progressTimeline'
import './index.less'
import useBiddingDetail from './useStandardInfoDetail'

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
        <span
          className="last-rank"
          onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
          data-uc-id="g3Y6RV8zGo"
          data-uc-ct="span"
        >
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
                  <BidTypeTag bidType={data1.data.bidType} intl={t} />
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
              <SingleTable
                key={DETAILS}
                // @ts-expect-error ttt
                title={biddingColumns[DETAILS].name}
                horizontal={biddingColumns[DETAILS].horizontal}
                info={data1.data}
                isLoading={data1.loading}
                columns={biddingColumns[DETAILS].getColumns(
                  data1.data.bidType,
                  data1.data.subjectMatter,
                  data1.data.projContactPhone && data1.data.projContactPerson
                )}
                data-uc-id="dtJqEq42bL"
                data-uc-ct="tables"
                data-uc-x={DETAILS}
              />
            </div>
            <div className="each-div">
              <SingleTable
                key={PARTICIPATINGANDCONTACT}
                title={biddingColumns[PARTICIPATINGANDCONTACT].name}
                horizontal={biddingColumns[PARTICIPATINGANDCONTACT].horizontal}
                info={data2.data}
                columns={biddingColumns[PARTICIPATINGANDCONTACT].columns}
                data-uc-id="ZPSUDW_q6i"
                data-uc-ct="tables"
                data-uc-x={PARTICIPATINGANDCONTACT}
              />
            </div>
            {data1.data.bidCorpInfos &&
              (show ? (
                <div className="each-div">
                  <SingleTable
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
                    data-uc-id="1jVyXrFtKw"
                    data-uc-ct="tables"
                    data-uc-x={BIDDERSANDDYNAMICS}
                  />
                </div>
              ) : (
                <p
                  className="show-link"
                  onClick={() => {
                    setShow(true)
                  }}
                  data-uc-id="yj3ubqcsLv"
                  data-uc-ct="p"
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
                  <Tag
                    color="color-1"
                    type="secondary"
                    size="large"
                    style={{ fontWeight: 400, cursor: 'pointer' }}
                    onClick={() => {
                      const ele = window.document.getElementById('attachment')
                      ele.scrollIntoView()
                    }}
                    data-uc-id="e59fLmrGMQ"
                    data-uc-ct="tag"
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
                      data-uc-id="lfbMpJz88W"
                      data-uc-ct="loadingo"
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
                    <a href={i.attchAddress} data-uc-id="is9Z_1y8lIo" data-uc-ct="a">
                      {i.title}
                    </a>
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
