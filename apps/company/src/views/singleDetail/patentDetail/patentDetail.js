import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Steps, Tabs } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  getPatentDetailIndustry,
  getPatentDetailInstruction,
  getPatentDetailPdf,
  getPatentDetailRight,
  patentDetailApi,
} from '../../../api/singleDetail'
import CompanyLink from '../../../components/company/CompanyLink'
import { usePageTitle } from '../../../handle/siteTitle'
import { useTranslateService } from '../../../hook'
import { parseQueryString } from '../../../lib/utils'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { patentIndustryRows } from './handle/patentIndustryRows'
import { patentLawRows } from './handle/patentLawRows'
import { patentPdfRows } from './handle/patentPdfRows'
import { patentRows } from './handle/patentRows'
import './patentDetail.less'

const { HorizontalTable } = Table
const TabPane = Tabs.TabPane
const Step = Steps.Step

const StylePrefix = 'patent-detail'

function generateIndustry(node, currentPath = []) {
  if (!node.childNodeList || node.childNodeList.length === 0) {
    // 叶子节点，插入到数组中
    return [[...currentPath, node.industryName]]
  }
  // 遍历子节点递归
  const paths = []
  node.childNodeList.forEach((child) => {
    const childPaths = generateIndustry(child, [...currentPath, node.industryName])
    paths.push(...childPaths)
  })

  return paths
}

export default function PatentDetail() {
  const qsParam = parseQueryString()
  const [detailData, setDetailData] = useState('')
  usePageTitle('PatentDetail', detailData?.patentName)
  const [noData, setNoData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pdfList, setPdfList] = useState([])
  const [detailRight, setDetailRight] = useState('')
  const [instruction, setInstruction] = useState('')
  const detailId = qsParam['detailId']
  const typeFromUrl = qsParam['type']
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

        if (window.en_access_config) {
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
          wftCommon.pureTranslateService(res.Data, (newData) => {
            isTranslateRef.current = false
            setDetailData(() => newData)
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
    let param = {
      patentId: detailData.applicationNumber,
    }
    getPatentDetailPdf(param).then((res) => {
      if (res.Data && res.Data.length > 0) {
        setPdfList(res.Data)
        wftCommon.zh2enAlwaysCallback(res.Data, (newData) => {
          setPdfList(() => newData)
        })
      }
    })
    getPatentDetailRight(param).then(async (res) => {
      if (res.Data && res.Data.length > 0) {
        let data = res.Data[0]
        if (data && data.content && data.content.replace) {
          // 2024.03.15 数据部 img 未输入完整url，先前端拼接 todo
          data.content = data.content.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
          setDetailRight(data)
          const htmlStr = await wftCommon.translateHTML(data.content)
          data.content = htmlStr
          setDetailRight(() => data)
        } else if (data && data.patentUrl) {
          const is_terminal = wftCommon.usedInClient()
          const url = is_terminal ? data.patentUrl : data.patentUrl + '?wind.sessionid=' + wftCommon.getwsd()
          fetch(url)
            .then((res) => {
              if (res.ok) {
                return res.text()
              }
            })
            .then(async (con) => {
              let conNew = con.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
              setDetailRight({ content: conNew })
              const htmlStr = await wftCommon.translateHTML(conNew)
              setDetailRight(() => ({ content: htmlStr }))
            })
        }
      }
    })
    getPatentDetailInstruction(param).then(async (res) => {
      if (res.Data && res.Data.length > 0) {
        let data = res.Data[0]
        if (data && data.content && data.content.replace) {
          // 2024.03.15 数据部 img 未输入完整url，先前端拼接 todo
          data.content = data.content.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
          setInstruction(data)
          const htmlStr = await wftCommon.translateHTML(data.content)
          data.content = htmlStr
          setInstruction(() => data)
        } else if (data && data.contentUrl) {
          const is_terminal = wftCommon.usedInClient()
          const url = is_terminal ? data.contentUrl : data.contentUrl + '?wind.sessionid=' + wftCommon.getwsd()
          fetch(url)
            .then((res) => {
              if (res.ok) {
                return res.text()
              }
            })
            .then(async (con) => {
              let conNew = con.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
              setInstruction({ content: conNew })
              const htmlStr = await wftCommon.translateHTML(conNew)
              setInstruction(() => ({ content: htmlStr }))
            })
        }
      }
    })
    getPatentDetailIndustry({ detailId }).then((res) => {
      if (res.ErrorCode == '0' && res.Data) {
        const digitalEconomyCoreIndustryLeaves = res.Data.digitalEconomyCoreIndustryLeaves
        const greenLowCarbonTechnologyLeaves = res.Data.greenLowCarbonTechnologyLeaves
        const notionalEconomyLeaves = res.Data.notionalEconomyLeaves
        const strategicEmergingLeaves = res.Data.strategicEmergingLeaves
        const digitalArr = []
        const greenLowArr = []
        const notionalArr = []
        const strategicArr = []
        digitalEconomyCoreIndustryLeaves.forEach((node) => {
          const nodePaths = generateIndustry(node)
          digitalArr.push(...nodePaths)
        })
        greenLowCarbonTechnologyLeaves.forEach((node) => {
          const nodePaths = generateIndustry(node)
          greenLowArr.push(...nodePaths)
        })
        notionalEconomyLeaves.forEach((node) => {
          const nodePaths = generateIndustry(node)
          notionalArr.push(...nodePaths)
        })
        strategicEmergingLeaves.forEach((node) => {
          const nodePaths = generateIndustry(node)
          strategicArr.push(...nodePaths)
        })
        if (digitalArr?.length) {
          digitalArr.clickFn = (arr) => {
            const t = [...arr]
            t.expanded = !arr.expanded
            t.clickFn = arr.clickFn
            setIndustryData({
              strategicArr,
              greenLowArr,
              digitalArr: t,
              notionalArr,
            })
          }
        }
        if (greenLowArr?.length) {
          greenLowArr.clickFn = (arr) => {
            const t = [...arr]
            t.expanded = !arr.expanded
            t.clickFn = arr.clickFn
            setIndustryData({
              strategicArr,
              greenLowArr: t,
              digitalArr,
              notionalArr,
            })
          }
        }
        if (notionalArr?.length) {
          notionalArr.clickFn = (arr) => {
            const t = [...arr]
            t.expanded = !arr.expanded
            t.clickFn = arr.clickFn
            setIndustryData({
              strategicArr,
              greenLowArr,
              digitalArr,
              notionalArr: t,
            })
          }
        }
        if (strategicArr?.length) {
          strategicArr.clickFn = (arr) => {
            const t = [...arr]
            t.expanded = !arr.expanded
            t.clickFn = arr.clickFn
            setIndustryData({
              strategicArr: t,
              greenLowArr,
              digitalArr,
              notionalArr,
            })
          }
        }
        setIndustryData({
          strategicArr,
          greenLowArr,
          digitalArr,
          notionalArr,
        })
      }
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
    
    let y = today.getFullYear().toString()
    let m = today.getMonth() < 10 ? `0${today.getMonth() + 1}` : today.getMonth()
    let d = today.getDate().toString()
    d = d < 10 ? `0${d}` : d
    let date = Number(y + m + d)
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

    return (
      <Steps className={`${StylePrefix}--steps`} progressDot>
        <Step
          title={intl('138660', '申请日期')}
          description={wftCommon.formatTime(detailData.applicationDate)}
          status={dotStatus[0]}
        />
        {secondShow ? (
          <Step
            title={intl('383121', '申请公告日期')}
            description={wftCommon.formatTime(detailData.applicationPublicationDate)}
            status={dotStatus[1]}
          />
        ) : null}
        <Step
          title={intl('383153', '授权日期')}
          description={wftCommon.formatTime(detailData.authorizationAnnouncementDate)}
          status={dotStatus[2]}
        />
        <Step
          title={needEstimate ? intl('383128', '预估失效日期') : intl('', '失效日期')}
          description={
            needEstimate
              ? detailData.anticipatedExpiryDate == '20790604'
                ? '--'
                : wftCommon.formatTime(detailData.anticipatedExpiryDate)
              : wftCommon.formatTime(detailData.expiryDate)
          }
          status={dotStatus[3]}
        />
      </Steps>
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
            title={intl('222875', '专利基本信息')}
            size="default"
            rows={tableRow}
            dataSource={detailData}
          ></HorizontalTable>
        </div>
        <div className="lawlist-detail">
          <Table
            title={intl('138372', '法律状态')}
            empty={intl('132725', '暂无数据')}
            columns={patentLawRows}
            dataSource={detailData.lawList}
            pagination={LawDetailPageChange}
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
          ></HorizontalTable>
        </div>
        <div className="pdf-detail">
          <Table
            title={intl('265685', 'PDF文件')}
            empty={intl('132725', '暂无数据')}
            columns={patentPdfRows}
            dataSource={pdfList}
            pagination={PDFDetailPagChange}
          />
        </div>
      </div>
    )
  }

  const powerNeed = () => {
    return (
      <div className="middle-detail">
        <span className="middle-title">{intl('265660', '权利要求')}</span>
        {detailRight ? (
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
        <span className="middle-title">{intl('260342', '说明书')}</span>
        {instruction ? (
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
            <span className="last-rank" onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>
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
            >
              <TabPane tab={intl('383126', '发明申请')} key="发明申请" disabled={applyForShow}></TabPane>
              <TabPane tab={intl('383155', '授权发明')} key="授权发明" disabled={empowerShow}></TabPane>
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
