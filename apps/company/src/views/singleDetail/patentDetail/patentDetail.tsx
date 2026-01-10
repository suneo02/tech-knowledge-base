import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Steps, Tabs } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { ErrorBoundary } from 'gel-ui'
import { getUrlSearchValue } from 'gel-util/common'
import { isEn } from 'gel-util/intl'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { patentDetailApi } from '../../../api/singleDetail'
import CompanyLink from '../../../components/company/CompanyLink'
import { usePageTitle } from '../../../handle/siteTitle'
import { useTranslateService } from '../../../hook'
import intl, { translateToEnglish } from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { handlePatentDetailApi } from './api'
import { patentIndustryRows } from './handle/patentIndustryRows'
import { patentLawRows } from './handle/patentLawRows'
import { patentPdfRows } from './handle/patentPdfRows'
import { patentRows } from './handle/patentRows'
import './patentDetail.less'

const { HorizontalTable } = Table
const TabPane = Tabs.TabPane
const Step = Steps.Step

const StylePrefix = 'patent-detail'

export default function PatentDetail() {
  const [detailData, setDetailData] = useState<any>('')
  usePageTitle('PatentDetail', detailData?.patentName)
  const [noData, setNoData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pdfList, setPdfList] = useState([])
  const [detailRight, setDetailRight] = useState('')
  const [instruction, setInstruction] = useState('')
  const detailId = getUrlSearchValue('detailId')
  const typeFromUrl = getUrlSearchValue('type')
  const [type, setType] = useState(typeFromUrl)
  const [tableRow, setTableRow] = useState(patentRows)
  const [showType, setShowType] = useState(typeFromUrl)
  const [applyForShow, setApplyForShow] = useState(false)
  const [empowerShow, setEmpowerShowShow] = useState(false)
  const isTranslateRef = useRef(false)
  const [industryData, setIndustryData] = useState(null)
  const [industryDataIntl] = useTranslateService(industryData, true, true)

  useEffect(() => {
    let param = {
      detailId: detailId,
      __primaryKey: detailId,
    }
    patentDetailApi(param).then((res) => {
      if (res.ErrorCode == '0' && res.Data) {
        if (!type) {
          setType(res.Data.patentType)
          setShowType(res.Data.patentType)
        }

        if (isEn()) {
          isTranslateRef.current = true
          // 分类号及分类描述翻译单独处理，数据结构太恶心了
          let lists = res.Data.classifyDescriptionMap || {}
          res.Data.classifyDescriptionMapEn = Object.keys(lists)
            .map((t) => {
              return `${t}: ${lists[t]
                ?.map((tt, idx) => {
                  return idx
                    ? '-' + tt?.currentClassifyNum + tt?.classifyDescription
                    : tt?.currentClassifyNum + tt?.classifyDescription
                })
                .join('')}`
            })
            .join('')
          translateToEnglish(res.Data, {
            skipFields: ['assigneeName', 'assigneeList', 'applicantList'],
          })
            .then((newDataRes) => {
              isTranslateRef.current = false
              setDetailData(() => newDataRes.data)
            })
            .catch(() => {
              setDetailData(() => res.Data)
            })
        }
        setDetailData(() => res.Data)
      } else {
        setNoData(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!detailData || isTranslateRef.current) {
      return
    }
    handlePatentDetailApi({
      detailId,
      setPdfList,
      setDetailRight,
      setInstruction,
      setIndustryData,
    })
    if (showType == '发明申请') {
      if (!detailData.authorizationAnnouncementNumber) {
        setEmpowerShowShow(true)
      }
    }
    if (showType == '授权发明') {
      if (!detailData.applicationPublicationNumber) {
        setApplyForShow(true)
      }
    }
  }, [detailData])

  useEffect(() => {
    if (showType !== '发明申请' && showType !== '授权发明') {
      let newArr = []
      for (let i = 0; i < patentRows.length; i++) {
        if (i !== 2) {
          newArr.push(patentRows[i])
        }
      }
      setTableRow(newArr)
    } else {
      if (showType == '发明申请') {
        let newArr = []
        for (let i = 0; i < patentRows.length; i++) {
          if (i !== 3) {
            newArr.push(patentRows[i])
          }
        }
        setTableRow(newArr)
      } else {
        setTableRow(patentRows)
      }
    }
  }, [showType])

  const cardDetail = () => {
    return (
      <div className="detail-card">
        <span className="card-title">{wftCommon.formatCont(detailData.patentName)}</span>
        <div className="card-detail">
          <div className="card-col">
            <div className="col-3">
              <span>
                {intl('138154', '申请号')}：{wftCommon.formatCont(detailData.applicationNumber)}
              </span>
            </div>
            <div className="col-7">
              <span className="card-applicantList">
                {intl('58656', '申请人')}：
                {detailData.applicantList && detailData.applicantList.length
                  ? detailData.applicantList.map((item, index) => {
                      return (
                        <div>
                          {index > 0 ? '，' : ''}
                          <CompanyLink name={item.mainBodyName} id={item.mainBodyId} />
                        </div>
                      )
                    })
                  : '--'}
              </span>
            </div>
          </div>
          <div className="card-col">
            <div className="col-3">
              <span>
                {intl('138660', '申请日期')}：{wftCommon.formatTime(detailData.applicationDate)}
              </span>
            </div>
            <div className="col-7">
              <span className="card-assigneeList">
                {intl('383123', '专利权人')}：
                {detailData.assigneeList && detailData.assigneeList.length
                  ? detailData.assigneeList.map((item, index) => {
                      return (
                        <div>
                          {index > 0 ? '，' : ''}
                          <CompanyLink name={item.mainBodyName} id={item.mainBodyId} />
                        </div>
                      )
                    })
                  : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const StepsShow = () => {
    let secondShow = true
    if ((type == '授权发明' && applyForShow) || type == '实用新型' || type == '外观设计') {
      secondShow = false
    }
    let today = new Date()

    let d = today.getDate().toString()
    // @ts-expect-error 类型错误
    d = d < 10 ? `0${d}` : d
    let needEstimate = false
    if (detailData.expiryDate) {
      needEstimate = false
    } else {
      if (detailData.anticipatedExpiryDate) {
        needEstimate = true
      } else {
        needEstimate = true
      }
    }

    const dotStatus = useMemo(() => {
      const processState = 'process'
      const waitState = 'wait'
      const finishState = 'finish'
      let lastDat = waitState
      let thirdDat = waitState
      let secondDat = waitState
      let firstDat = waitState

      const res = [firstDat, secondDat, thirdDat, lastDat]
      if (!detailData.applicationDate) {
        // 没有申请日期，等待状态
        return res
      } else {
        res[0] = finishState
      }
      // 有申请发布日期
      if (detailData.applicationPublicationDate) {
        res[1] = finishState
      } else {
        return res
      }
      if (detailData.authorizationAnnouncementDate) {
        res[2] = finishState
      } else {
        return res
      }
      //最后一点判断状态 如果有失效日期

      if (detailData.expiryDate) {
        res[3] = finishState
      } else if (detailData.anticipatedExpiryDate) {
        // 判断预估失效日期是否超过今天

        if (new Date() < new Date(detailData.anticipatedExpiryDate)) {
          res[3] = processState
        } else {
          res[3] = finishState
        }
      }

      return res
    }, [detailData])

    const children = [
      <Step
        title={intl('138660', '申请日期')}
        description={wftCommon.formatTime(detailData.applicationDate)}
        // @ts-expect-error 类型错误
        status={dotStatus[0]}
        data-uc-id="6JVeOmtrey"
        data-uc-ct="step"
      />,
      secondShow ? (
        <Step
          title={intl('383121', '申请公告日期')}
          description={wftCommon.formatTime(detailData.applicationPublicationDate)}
          // @ts-expect-error 类型错误
          status={dotStatus[1]}
          data-uc-id="MsFdtqCkJJ"
          data-uc-ct="step"
        />
      ) : null,
      <Step
        title={intl('383153', '授权日期')}
        description={wftCommon.formatTime(detailData.authorizationAnnouncementDate)}
        // @ts-expect-error 类型错误
        status={dotStatus[2]}
        data-uc-id="M8eziNx7fU"
        data-uc-ct="step"
      />,
      <Step
        title={needEstimate ? intl('383128', '预估失效日期') : intl('383313', '失效日期')}
        description={
          needEstimate
            ? detailData.anticipatedExpiryDate == '20790604'
              ? '--'
              : wftCommon.formatTime(detailData.anticipatedExpiryDate)
            : wftCommon.formatTime(detailData.expiryDate)
        }
        // @ts-expect-error 类型错误
        status={dotStatus[3]}
        data-uc-id="W7VgKMx5aF"
        data-uc-ct="step"
      />,
    ].filter(Boolean)

    return (
      <ErrorBoundary>
        {/* @ts-expect-error 类型错误 */}
        <Steps className={`${StylePrefix}--steps`} progressDot>
          {children}
        </Steps>
      </ErrorBoundary>
    )
  }

  const BasicDetail = () => {
    let LawDetailPageChange = useMemo(() => {
      return detailData.lawList && detailData.lawList.length > 10
    }, [detailData])

    const PDFDetailPagChange = useMemo(() => {
      return pdfList && pdfList.length > 10
    }, [pdfList])
    return (
      <div className="middle-detail">
        <div className="steps-detail">
          <span className="middle-title">{intl('383127', '专利申请进度')}</span>
          {StepsShow()}
        </div>
        <div className="basic-detail">
          {/* <h5></h5> */}
          <HorizontalTable
            bordered={'dotted'}
            locale={{
              emptyText: intl('132725', '暂无数据'),
            }}
            loading={loading}
            title={intl('478739', '专利基本信息')}
            size="default"
            rows={tableRow}
            dataSource={detailData}
            data-uc-id="poSIEjKcOI"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        </div>
        <div className="lawlist-detail">
          <Table
            title={intl('138372', '法律状态')}
            empty={intl('132725', '暂无数据')}
            columns={patentLawRows}
            dataSource={detailData.lawList}
            pagination={LawDetailPageChange}
            data-uc-id="i3yfwnl55C"
            data-uc-ct="table"
          />
        </div>
        <div className="lawlist-detail">
          <HorizontalTable
            bordered={'dotted'}
            locale={{
              emptyText: intl('132725', '暂无数据'),
            }}
            loading={loading}
            title={intl(392542, '专利所属行业/产业')}
            size="default"
            rows={patentIndustryRows}
            dataSource={industryDataIntl}
            data-uc-id="gZCJFTNJgQ"
            data-uc-ct="horizontaltable"
          ></HorizontalTable>
        </div>
        <div className="pdf-detail">
          <Table
            title={intl('478740', 'PDF文件')}
            empty={intl('132725', '暂无数据')}
            columns={patentPdfRows}
            dataSource={pdfList}
            pagination={PDFDetailPagChange}
            data-uc-id="r_ld3itHyx"
            data-uc-ct="table"
          />
        </div>
      </div>
    )
  }

  const powerNeed = () => {
    return (
      <div className="middle-detail">
        <span className="middle-title">{intl('470287', '权利要求')}</span>
        {detailRight ? ( // @ts-expect-error 类型错误
          <div dangerouslySetInnerHTML={{ __html: detailRight.content }} className="long-content"></div>
        ) : (
          <span>{intl('132725', '暂无数据')}</span>
        )}
      </div>
    )
  }

  const instructionBook = () => {
    return (
      <div className="middle-detail">
        <span className="middle-title">{intl('470288', '说明书')}</span>
        {instruction ? ( // @ts-expect-error 类型错误
          <div dangerouslySetInnerHTML={{ __html: instruction.content }} className="long-content"></div>
        ) : (
          <span>{intl('132725', '暂无数据')}</span>
        )}
      </div>
    )
  }

  const tabCallBack = (key) => {
    setShowType(key)
  }

  return (
    <div className="">
      {!wftCommon.isBaiFenTerminalOrWeb() ? (
        <div className="bread-crumb">
          <div className="bread-crumb-content">
            <span
              className="last-rank"
              onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
              data-uc-id="whzjlPQQsCQ"
              data-uc-ct="span"
            >
              {intl('19475', '首页')}
            </span>
            <i></i>
            <span>{intl('124585', '专利')}</span>
          </div>
        </div>
      ) : null}
      <div className="wrapper">
        {type == '发明申请' || type == '授权发明' ? (
          <div className="type-navigation">
            <Tabs
              activeKey={showType}
              defaultActiveKey={showType}
              tabPosition="left"
              type="block"
              animated="false"
              onChange={tabCallBack}
              data-uc-id="rRyrML7KO"
              data-uc-ct="tabs"
            >
              <TabPane
                tab={intl('383126', '发明申请')}
                key="发明申请"
                disabled={applyForShow}
                data-uc-id="b1LqQq4-8o"
                data-uc-ct="tabpane"
              ></TabPane>
              <TabPane
                tab={intl('383155', '授权发明')}
                key="授权发明"
                disabled={empowerShow}
                data-uc-id="aOFe4M-Adg"
                data-uc-ct="tabpane"
              ></TabPane>
            </Tabs>
          </div>
        ) : null}
        <div className={type == '发明申请' || type == '授权发明' ? 'patent-detail-needBar' : 'patent-detail'}>
          {cardDetail()}
          {BasicDetail()}
          {powerNeed()}
          {instructionBook()}
        </div>
      </div>
    </div>
  )
}
