import { Card, Col, Row, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { ReactNode } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as globalActions from '../../actions/global'
import { getMoreContact, getNewsScore, getTechScore, myWfcAjax } from '../../api/companyApi'
import { parseQueryString } from '../../lib/utils'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './style/corpIntro.less'

import { getCompanyHeadScanning } from '@/api/corp/event.ts'
import { request } from '@/api/request.ts'
import { HKCorpIntro } from '@/components/company/intro/baseIntro/HK.tsx'
import { TWCorpIntro } from '@/components/company/intro/baseIntro/TW.tsx'
import { getCorpIntroChartsCfg } from '@/components/company/intro/charts.tsx'
import { CorpState } from '@/reducers/company.ts'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum.ts'
import { CorpEsgScore } from 'gel-api'
import { EsgBrand } from 'gel-ui'
import _, { cloneDeep } from 'lodash'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { getIfIndividualBusiness } from '../../handle/corp/corpType'
import { isChineseName } from '../../utils/utils'
import Expandable from '../common/expandable/Expandable'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import { withContactManager } from './ContactManager/ContactManagerButton'
import { getLegalPersonField } from './handle/miscT.ts'
import { CorpBasicInfoFront } from './info/handle.tsx'
import HeaderChart from './intro/charts/HeaderChart.tsx'
import { TelField } from './intro/comp/TelField'
import { CorpInfoMsg } from './intro/CorpInfoMsg'
import { DynamicTabs } from './intro/dynamic/DynamicTabs.tsx'
import { mailTitle, pageinationProps, sortData, telTitle, webTitle } from './intro/handle/misc'
import { CorpIntroRiskCardBig, CorpIntroRiskCardSmall } from './intro/RiskCard/index.tsx'
import { CompanyDetailTags } from './intro/tag/index.tsx'
import { getCorpRiskRowSpan, redirectChartFun } from './intro/utils.ts'
import { LinkByRowCompatibleCorpPerson } from './link/CorpOrPersonLink.tsx'
import { TechScoreHint } from './techScore/comp'
import { CorpTreeMenuClick } from './type/companyBaseY.ts'

const RadarChartComponent = () => React.lazy(() => import('../charts/RadarCanvas.tsx'))
const RadarChartCss = RadarChartComponent()

const CompanyReportModalComponent = () =>
  React.lazy(() => import('./intro/report').then((module) => ({ default: module.CompanyReportModal })))

const CompanyReportModalLazy = CompanyReportModalComponent()

// QRCode 懒加载缓存
let QRCodeModule: any = null

export const defaultCardTabKey = 'dongtai' // 动态商机舆情 默认的 key 是动态

type Props = {
  companycode: string
  companyname: string
  basicNum: CorpBasicNumFront
  companyid: string
  collectState: boolean
  company: CorpState
  menuClick: CorpTreeMenuClick
  onlyCompanyIntroduction: boolean
  isObjection: boolean
  collect: () => void
  canBack: boolean
  isAIRight: boolean
  onContactManager?: () => void
}
// 企业详情页-头部卡片
class CompanyIntroduction extends React.Component<
  Props,
  {
    corpId: string | null
    showMore: boolean
    isAll: boolean
    initEnd: boolean
    moreTel: string[]
    modalShow: boolean
    moreMail: string[]
    moreDomain: string[]
    loadSuccess: boolean
    updateCorpClick: boolean
    score: number
    negativeNews: string
    selfRisk: string
    aroundRisk: string
    reportTier: string
    qrShow: string
    hasShareUrl: boolean
    collectList: any[] // 如果 collectList 结构已知，可以定义具体的接口
    userInfo: any // 如果 userInfo 结构已知，可以定义具体的接口
    radarChartOpts: any // 如果 radarChartOpts 结构已知，可以定义具体的接口
    actionModal: 'moreTags' | 'report' | ''
    corpHeaderInfoIntl: any // 假设 corpHeaderInfoIntl 是一个已知的结构或者 null
    esgInfo?: CorpEsgScore[]
  }
> {
  statusArr: any[]
  logo: any
  ulCharts: any[]

  userVipInfo: any
  abstractDiv: any

  constructor(props) {
    super(props)
    console.log('🚀 ~ constructor ~ props:', props)
    this.state = {
      corpId: parseQueryString().id || sessionStorage.getItem('corpId'),
      showMore: false,
      isAll: false,
      initEnd: false,
      moreTel: [],
      modalShow: false,
      moreMail: [],
      moreDomain: [],
      //   loadSuccess: false,
      loadSuccess: true,
      updateCorpClick: false,

      score: 50,
      negativeNews: '0',
      selfRisk: '0',
      aroundRisk: '0',
      reportTier: '6',
      qrShow: 'none',
      hasShareUrl: false,
      collectList: [],
      userInfo: null,
      radarChartOpts: null,
      /**
       * @typedef actionModal 'moreTags'| 'report'
       */
      actionModal: '',

      /**
       * @typedef {Object} CorpHeaderInfoIntl
       * @property {string} brief
       * @property {string} legal_person_name
       *
       * @type {CorpHeaderInfoIntl}
       */
      corpHeaderInfoIntl: null,
    }
    this.logo = null
    this.ulCharts = getCorpIntroChartsCfg({
      companyCode: props.companycode,
      companyName: props.companyname,
    })
    this.userVipInfo = null
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const stateKeys = Object.keys(this.state)
    const nextStateKeys = Object.keys(nextState)

    const shouldUpdateState = stateKeys.some((key) => {
      return nextStateKeys.includes(key) && nextState[key] !== this.state[key]
    })
    if (shouldUpdateState) {
      return true
    }

    if (nextProps.basicNum !== this.props.basicNum) {
      this.displayBrief()

      return true
    } else if (nextProps.companyname !== this.props.companyname) {
      return true
    } else if (nextProps.companyid !== this.props.companyid) {
      return true
    } else if (nextProps.collectState !== this.props.collectState) {
      return true
    } else {
      return false
    }
  }

  getEsgScore = async () => {
    try {
      const res = await request('detail/company/getEsgScore', {
        id: this.props.companycode,
      })
      if (res && res.Data) {
        this.setState({
          esgInfo: res.Data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  translateCorpHeaderInfo = () => {
    if (!window.en_access_config) {
      return
    }
    wftCommon.translateService(
      {
        brief: this.props.company.corpHeaderInfo.brief,
        legal_person_name: this.props.company.corpHeaderInfo.legal_person_name,
      },
      (endData) => {
        this.setState({
          corpHeaderInfoIntl: endData,
        })
      }
    )
  }
  componentDidMount = () => {
    this.showTechScore()
    this.getEsgScore()

    setTimeout(() => {
      this.fetchData()
    }, 50)
  }

  showTechScore = () => {
    getTechScore(this.props.companycode, { latest: 1 }).then((res) => {
      if (res && res?.code == '0' && res.data?.length) {
        const data = res.data
        const key4score = {
          strengthScore: intl('273193', '企业实力'),
          influenceScore: intl('378216', '社会影响力'),
          qualityScore: intl('378215', '技术质量'),
          layoutScore: intl('378214', '技术布局'),
          scaleScore: intl('378213', '研发规模'),
        }
        const lastReportData = data[data.length - 1] // 取最新一期
        const time = lastReportData.report // 报告期时间
        const opts: any = {
          data: [
            {
              name: wftCommon.formatTime(time),
              value: [],
            },
          ],
          indicator: [],
          radarExtras: {
            name: {
              formatter: '', // 图上文本不显示
            },
            radius: 40, // 小图 可以通过配置这个来展示
          },
        }
        for (const k in key4score) {
          if (key4score[k]) {
            opts.indicator.push({
              name: key4score[k],
              max: 10,
            })
            opts.data[0].value.push(lastReportData[k])
          }
        }
        opts.centerTxt =
          (window.en_access_config ? 'Score: ' : '总分: ') +
          (lastReportData['innovateScore'] ? lastReportData['innovateScore'].toFixed(1) : '0')
        opts.centerTxtFontSize = 12
        opts.tooltipHide = true
        opts.radarClick = () => {
          this.props.menuClick(['gettechscore'], {
            selected: true,
          })
        }
        this.setState({
          radarChartOpts: opts,
        })
      }
    })
  }

  displayBrief = () => {
    if (!window.en_access_config) {
      return
    }
    this.displayBrief = function () {}
    setTimeout(() => {
      wftCommon.translateDivHtml('.corpAbstractText', window.$('.corpAbstractText'))
      this.translateCorpHeaderInfo()
    }, 300)
  }

  fetchData = () => {
    const { onlyCompanyIntroduction } = this.props
    if (onlyCompanyIntroduction) {
      return
    }
    const today = new Date()
    const dateNow = this.getFullDate(today)
    getNewsScore(this.props.companycode, {
      __primaryKey: this.props.companycode,
      dateFrom: dateNow,
      dateTo: dateNow,
    }).then((res) => {
      if (res && res.data && res.data.length && res.data[0] && res.data[0].score) {
        if (res.data[0].score !== 50) {
          this.setState({
            score: res.data[0].score,
          })
        }
      }
    })
    const threeMonthAgo = new Date()
    threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3)
    const code = this.props.companycode?.length > 10 ? this.props.companycode.substr(2, 10) : this.props.companycode
    getCompanyHeadScanning(code, {
      __primaryKey: this.props.companycode,
      dateFrom: this.getFullDate(new Date(threeMonthAgo.getTime() + 24 * 60 * 60 * 1000)),
      dateTo: dateNow,
    }).then((res) => {
      if (res && res.data && res.data.total) {
        res.data.total.eventCount &&
          this.setState({
            selfRisk: res.data.total.eventCount,
          })
        res.data.total.relatedCount &&
          this.setState({
            aroundRisk: res.data.total.relatedCount,
          })
        res.data.total.newsCount &&
          this.setState({
            negativeNews: res.data.total.newsCount,
          })
      }
    })
  }

  getMoreAction = (type, successCall) => {
    if (type == 'moreDomain') {
      if (this.state.moreDomain.length) {
        successCall(type, this.state.moreDomain)
        return
      }
      getMoreContact({
        companycode: this.props.companycode,
        type: 'moreDomain',
        pageSize: '500',
      }).then((res) => {
        if (res && res.ErrorCode == 0 && res.Data.length > 0) {
          const data = res.Data
          this.setState({ moreDomain: data })
          successCall(type, data)
        }
      })
    } else {
      if (type == 'moreMail') {
        if (this.state.moreMail.length) {
          successCall(type, this.state.moreMail)
          return
        }
      } else {
        if (this.state.moreTel.length) {
          successCall(type, this.state.moreTel)
          return
        }
      }
      getMoreContact({
        companycode: this.props.companycode,
        type: type,
        pageSize: '500',
      }).then((res) => {
        if (res && res.ErrorCode == 0 && res.Data.length > 0) {
          if (window.en_access_config) {
            wftCommon.zh2en(res.Data, (endata) => {
              const d = sortData(endata)
              if (type == 'moreMail') {
                this.setState({ moreMail: d })
              } else {
                this.setState({ moreTel: d })
              }
              successCall(type, d)
            })
          } else {
            const d = sortData(res.Data)
            if (type == 'moreMail') {
              this.setState({ moreMail: d })
            } else {
              this.setState({ moreTel: d })
            }
            successCall(type, d)
          }
        }
      })
    }
  }

  getFullDate = (date) => {
    const year = Number(date.getFullYear())
    const month = this.fullDate(date.getMonth() + 1)
    const day = this.fullDate(date.getDate())
    return String(year) + String(month) + String(day)
  }

  fullDate = (n) => {
    if (Number(n) < 10) {
      return '0' + String(n)
    } else {
      return String(n)
    }
  }

  /**
   * 是否跳转风险标签
   * 如果是在 上海工商联 页面，则不跳转风险标签
   * 如果是 只有公司简介，则不跳转风险标签
   * @returns 是否跳转风险标签
   */
  getIfJumpRisk = () => {
    if (wftCommon.fromPage_shfic === wftCommon.fromPage()) {
      return false
    }
    return !this.props.onlyCompanyIntroduction
  }

  onRiskTagJump = (jumpType) => {
    if (!this.getIfJumpRisk()) {
      return
    }
    if (wftCommon.fromPage_shfic !== wftCommon.fromPage()) {
      this.props.menuClick([jumpType], { selected: true })
      this.setState({ actionModal: '' }) // 关闭弹窗
    }
  }

  renderLogo = (baseInfo, headerInfo) => {
    try {
      if (headerInfo.ent_log_v) {
        return wftCommon.imageBaseCorp(6683, headerInfo.ent_log, 'logo', true)
      } else {
        const bkcolor = baseInfo ? wftCommon.calcLogoColor(baseInfo.industry_gb) : ''
        const shortname = baseInfo && baseInfo.chinese_abbr ? baseInfo.chinese_abbr : headerInfo.corp_name
        let logoName = headerInfo.corp_name || ''
        if (!isChineseName(logoName)) {
          // 非汉字情况下
          logoName = headerInfo.corp_name.split(' ')[0]
          if (logoName.length) {
            logoName = logoName.slice(0, 1)
          }
          return <span style={{ backgroundColor: bkcolor, lineHeight: '76px', fontSize: '72px' }}> {logoName} </span>
        } else {
          logoName = shortname ? shortname.slice(0, 4) : logoName.slice(0, 4)
        }

        return logoName.length < 3 ? (
          <span style={{ backgroundColor: bkcolor, lineHeight: '76px' }}> {logoName} </span>
        ) : (
          <span style={{ backgroundColor: bkcolor }}> {logoName} </span>
        )
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  showMoreContact = (type, data) => {
    let colunms = null
    let title = ''
    if (type == 'moreDomain') {
      colunms = webTitle
      title = intl('138805', '网址')
    } else if (type == 'moreTel') {
      colunms = telTitle
      title = intl('4946', '电话号码')
    } else {
      colunms = mailTitle
      title = intl('91283', '电子邮箱')
    }
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'companyIntroductionTagModal moreContact',
        width: 800,
        height: title == intl('138805', '网址') ? 400 : 600,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: title,
        content: (
          <Table
            columns={colunms}
            dataSource={data}
            pagination={pageinationProps}
            data-uc-id="j61UJdxdis"
            data-uc-ct="table"
          ></Table>
        ),
        footer:
          title == intl('138805', '网址')
            ? [
                <span style={{ float: 'left', textAlign: 'left' }}>
                  {' '}
                  {intl('478596', '以上网站大数据判定为官方网站，该企业全部网址请点击查看')}{' '}
                  <span
                    id="gotoWeb"
                    style={{ color: '#00aec7', cursor: 'pointer' }}
                    onClick={() => {
                      store.dispatch(globalActions.clearGolbalModal())
                      this.props.menuClick(['getdomainname'], {
                        selected: true,
                      })
                    }}
                    data-uc-id="64W_SJPW3qG"
                    data-uc-ct="span"
                  >
                    {' '}
                    {intl('138804', '网站备案')}{' '}
                  </span>
                </span>,
              ]
            : [],
      })
    )
  }

  getShareCode = () => {
    const parameter = { companycode: this.props.companycode }
    const self = this
    if (this.state.hasShareUrl) {
      self.setState({ qrShow: 'block' })
    } else {
      myWfcAjax('getshareurl', parameter).then(function (res) {
        if (res && res.Data && res.Data.url) {
          const canvas = window.document.querySelector('#qrCodeCompanyCanvas')

          const generateQRCode = (QRCode: any) => {
            QRCode.toCanvas(canvas, wftCommon.addWsidForImg(res.Data.url), { width: 169 }, function () {
              self.setState({ qrShow: 'block', hasShareUrl: true })
            })
          }

          // 如果已经缓存了 QRCode 模块，直接使用
          if (QRCodeModule) {
            generateQRCode(QRCodeModule)
          } else {
            // 第一次使用时导入并缓存
            import('qrcode')
              .then((QRCode) => {
                QRCodeModule = QRCode.default
                generateQRCode(QRCodeModule)
              })
              .catch((error) => {
                console.error('Failed to load QRCode library:', error)
              })
          }
        }
      })
    }
  }

  callHelp = () => {
    this.props.onContactManager?.()
  }

  backToRoot = () => {
    window.parent.postMessage('GelBackToRoot', '*')
  }

  render() {
    const { radarChartOpts, esgInfo } = this.state
    const companybaseInfo = this.props.company.baseInfo || {}
    const corpArea = this.props.company.corpArea
    const ifIndividualBusiness = getIfIndividualBusiness(companybaseInfo.corp_type, companybaseInfo.corp_type_id)

    const baseInfo: Partial<CorpBasicInfoFront> = companybaseInfo.corp || {}
    const headerInfo = cloneDeep(this.props.company.corpHeaderInfo)
    _.forOwn(this.state.corpHeaderInfoIntl, (value, key) => {
      if (_.has(headerInfo, key) && value != null && value) {
        headerInfo[key] = value
      }
    })
    const originalName = headerInfo.former_name || []
    const { isObjection, collectState, onlyCompanyIntroduction, basicNum, isAIRight } = this.props
    const emailCount = headerInfo.emailCount || 0
    const websiteCount = headerInfo.websiteCount || 0

    const corptypeid = companybaseInfo.corp_type_id || '--'
    const ishk = corptypeid && String(corptypeid) == '298060000'
    const istw = companybaseInfo.areaCode == '030407'

    const hasTechScore = basicNum?.technologicalInnovationCount > 0

    // 第一行展示两个图谱
    const showKGChartInRowFirst = corpArea || ifIndividualBusiness

    // 是否展示科创分
    const showTechScore = hasTechScore && radarChartOpts
    let card: ReactNode = ''

    card = onlyCompanyIntroduction ? (
      <>
        <Row>
          <Col span={12}>
            <span className="itemTitle">{getLegalPersonField(companybaseInfo.corp_type)} :</span>{' '}
            <LinkByRowCompatibleCorpPerson row={headerInfo} nameKey={'legal_person_name'} idKey={'legal_person_id'} />
          </Col>
          <Col span={12}>
            <span className="itemTitle">{intl('101049', '网站')} :</span>{' '}
            <span className="">{wftCommon.formatWebsite(headerInfo.official_web)}</span>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <TelField headerInfo={headerInfo} showMore={false} />
          </Col>
          <Col span={12}>
            <span className="itemTitle">{intl('93833', '邮箱')} :</span>{' '}
            <span className="">
              {headerInfo.email_add == '用户填无'
                ? emailCount
                  ? '用户填无'
                  : '--'
                : wftCommon.formatWebsite(headerInfo.email_add, 'email')}
            </span>
          </Col>
        </Row>
      </>
    ) : (
      <>
        <Row>
          <Col span={12}>
            <span className="itemTitle">{getLegalPersonField(companybaseInfo.corp_type)} :</span>{' '}
            <LinkByRowCompatibleCorpPerson
              row={headerInfo}
              nameKey={'legal_person_name'}
              idKey={'legal_person_id'}
              useUnderline
            />
          </Col>
          <Col span={12}>
            <span className="itemTitle">{intl('101049', '网站')} :</span>{' '}
            <span className="">{wftCommon.formatWebsite(headerInfo.official_web)}</span>
            {websiteCount > 1 ? (
              <span
                className="morecontact"
                onClick={() => {
                  this.getMoreAction('moreDomain', this.showMoreContact)
                }}
                data-uc-id="Sh8-sv20PiN"
                data-uc-ct="span"
              >
                {intl('272167', '更多')} ({websiteCount})
              </span>
            ) : null}
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <TelField
              headerInfo={headerInfo}
              showMore={true}
              onMoreClick={() => this.getMoreAction('moreTel', this.showMoreContact)}
            />
          </Col>
          <Col span={12}>
            <span className="itemTitle">{intl('93833', '邮箱')} :</span>{' '}
            <span className="">
              {headerInfo.email_add == '用户填无'
                ? emailCount
                  ? '用户填无'
                  : '--'
                : wftCommon.formatWebsite(headerInfo.email_add, 'email')}
            </span>
            {emailCount > 1 ? (
              <span
                className="morecontact"
                onClick={() => {
                  this.getMoreAction('moreMail', this.showMoreContact)
                }}
                data-uc-id="ZR1VIWslL3u"
                data-uc-ct="span"
              >
                {intl('272167', '更多')} ({emailCount})
              </span>
            ) : null}
          </Col>
        </Row>
      </>
    )

    if (ishk) {
      card = <HKCorpIntro headerInfo={headerInfo} companybaseInfo={companybaseInfo} />
    }
    if (istw) {
      card = <TWCorpIntro headerInfo={headerInfo} companybaseInfo={companybaseInfo} />
    }

    if (corpArea) {
      this.ulCharts.length = 2
      card = (
        <>
          <Row>
            <Col span={12}>
              <span className="itemTitle">{intl('93833', '邮箱')} :</span>{' '}
              <span className="">
                {headerInfo.email_add == '用户填无'
                  ? emailCount
                    ? '用户填无'
                    : '--'
                  : wftCommon.formatWebsite(headerInfo.email_add, 'email')}
              </span>
              {emailCount > 1 ? (
                <span
                  className="morecontact"
                  onClick={() => {
                    this.getMoreAction('moreMail', this.showMoreContact)
                  }}
                  data-uc-id="2Fx_ltPfzfA"
                  data-uc-ct="span"
                >
                  {intl('272167', '更多')} ({emailCount})
                </span>
              ) : null}
            </Col>
            <Col span={12}>
              <span className="itemTitle">{intl('101049', '网站')} :</span>{' '}
              <span className="">{wftCommon.formatWebsite(headerInfo.official_web)}</span>
              {websiteCount > 1 ? (
                <span
                  className="morecontact"
                  onClick={() => {
                    this.getMoreAction('moreDomain', this.showMoreContact)
                  }}
                  data-uc-id="umn4o_-NbN9"
                  data-uc-ct="span"
                >
                  {intl('272167', '更多')} ({websiteCount})
                </span>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <TelField
                headerInfo={headerInfo}
                showMore={true}
                onMoreClick={() => this.getMoreAction('moreTel', this.showMoreContact)}
              />
            </Col>
            <Col span={12}>
              <span className="itemTitle">{window.en_access_config ? intl('32674', '地区') : '国家/地区'} :</span>
              <span className="">{headerInfo.province || '--'}</span>
            </Col>
          </Row>
        </>
      )
    }

    if (showKGChartInRowFirst) {
      this.ulCharts.length = 2
    }

    const riskRowSpan = getCorpRiskRowSpan(showTechScore, esgInfo, Boolean(showKGChartInRowFirst))
    return (
      <>
        <Card className="companyIntroduction" bordered={false}>
          {/* 公司logo */}
          <div className="corpIcon">
            {Object.entries(headerInfo).length ? this.renderLogo(baseInfo, headerInfo) : null}
          </div>

          {/* 公司基础信息 */}
          <div className="corpInfoMsg">
            <CorpInfoMsg
              baseInfo={baseInfo}
              headerInfo={headerInfo}
              originalName={originalName}
              isObjection={isObjection}
              isAIRight={isAIRight}
              companycode={this.props.companycode}
              companyname={this.props.companyname}
              collectState={collectState}
              canBack={this.props.canBack}
              onClickReport={() => this.setState({ actionModal: 'report' })}
              onClickCollect={this.props.collect}
              onClickBack={this.backToRoot}
            />

            {card}

            {headerInfo.brief && (
              <div
                // className="corpAbstract"
                ref={(el) => {
                  this.abstractDiv = el
                }}
              >
                <Expandable
                  maxLines={2}
                  // marginBottom="-40px"
                  content={`${intl(257678, '公司简介')} : ${headerInfo.brief}`}
                  data-uc-id="03i1NQi4c6p"
                  data-uc-ct="expandable"
                ></Expandable>
              </div>
            )}
            <CompanyDetailTags
              companyCode={this.props.companycode}
              corpBasicInfo={baseInfo}
              onJumpRisk={this.getIfJumpRisk() ? this.onRiskTagJump : undefined}
            />
          </div>
          {onlyCompanyIntroduction ? null : (
            <div className="share-weixin--container">
              <span
                className="share-weixin"
                id="shareWeixin"
                onMouseEnter={() => this.getShareCode()}
                onMouseLeave={() => this.setState({ qrShow: 'none' })}
                data-uc-id="6cwoMV-gsdq"
                data-uc-ct="span"
              ></span>
              <div id="wxShare" className="popover bottom" style={{ display: this.state.qrShow }}>
                <div className="arrow"></div>
                <h3 className="popover-title">{intl('459294', '微信扫码分享')}</h3>
                <div className="popover-content">
                  <div className="qrCode" id="qrCodeCompany">
                    <canvas id="qrCodeCompanyCanvas" width="165" height="165"></canvas>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        {onlyCompanyIntroduction ? null : (
          <>
            {/* 舆情得分 */}
            <Row gutter={12} style={{ marginTop: '12px' }} className="header-news-dynamic">
              {showKGChartInRowFirst
                ? this.ulCharts.map((t) => {
                    return (
                      <HeaderChart
                        key={t.txt}
                        text={t.txt}
                        isFirstRow={true}
                        onClick={() => redirectChartFun(t)}
                        data-uc-id="8tE_8lFKBX_"
                        data-uc-ct="headerchart"
                        data-uc-x={t.txt}
                      />
                    )
                  })
                : null}
              {riskRowSpan.risk === 8 && (
                <Col span={riskRowSpan.risk} className="gutter-row">
                  <CorpIntroRiskCardBig
                    companycode={this.props.companycode}
                    score={this.state.score}
                    selfRisk={this.state.selfRisk}
                    aroundRisk={this.state.aroundRisk}
                    negativeNews={this.state.negativeNews}
                  />
                </Col>
              )}
              {riskRowSpan.techScore ? (
                <Col span={riskRowSpan.techScore} className="gutter-row">
                  <Card
                    className="risk-card innovation-card"
                    title={
                      <>
                        {window.en_access_config ? 'Innovation' : intl('451195', '科创分')}
                        <Tooltip overlayClassName="corp-tooltip" title={<TechScoreHint />}>
                          <InfoCircleButton />
                        </Tooltip>
                      </>
                    }
                    extra={
                      <span>
                        <a
                          className="risk-link"
                          onClick={() => {
                            pointBuriedByModule(922602101126, {
                              company_id: this.state.corpId,
                            })
                            this.props.menuClick(['gettechscore'], {
                              selected: true,
                            })
                          }}
                          data-uc-id="ZUUttej22WZ"
                          data-uc-ct="a"
                        >
                          {intl('40513', '详情')}
                        </a>
                      </span>
                    }
                  >
                    <div className="center-container">
                      {radarChartOpts ? (
                        <React.Suspense fallback={<div></div>}>
                          {<RadarChartCss opts={radarChartOpts} />}
                        </React.Suspense>
                      ) : null}
                    </div>
                  </Card>
                </Col>
              ) : null}
              {riskRowSpan.risk === 4 && (
                <Col span={4} className="gutter-row corpintro-risk-col-small ">
                  <CorpIntroRiskCardSmall companycode={this.props.companycode} score={this.state.score} />
                </Col>
              )}

              {riskRowSpan.esg ? (
                <Col span={riskRowSpan.esg} className="gutter-row">
                  <EsgBrand className="risk-card" info={esgInfo && esgInfo.length > 0 ? esgInfo[0] : null} />
                </Col>
              ) : null}
              <Col span={riskRowSpan.dynamic} className="gutter-row gutter-row-tab">
                <DynamicTabs
                  companycode={this.props.companycode}
                  baseInfo={baseInfo}
                  ifIndividualBusiness={ifIndividualBusiness}
                />
              </Col>
            </Row>

            {/* 图谱相关Card */}
            {!showKGChartInRowFirst ? (
              <Row gutter={12} style={{ marginTop: '12px' }}>
                {this.ulCharts.map((t) => {
                  return (
                    <HeaderChart
                      key={t.txt}
                      text={t.txt}
                      onClick={() => redirectChartFun(t)}
                      data-uc-id="sDBDqFho10X"
                      data-uc-ct="headerchart"
                      data-uc-x={t.txt}
                    />
                  )
                })}
              </Row>
            ) : null}
          </>
        )}
        <React.Suspense fallback={<div></div>}>
          <CompanyReportModalLazy
            open={this.state.actionModal === 'report'}
            setOpen={(open) => {
              if (open) {
                this.setState({ actionModal: 'report' })
              } else {
                this.setState({ actionModal: '' })
              }
            }}
            companycode={this.props.companycode}
            companyid={this.props.companyid}
            onClickCallHelp={this.callHelp}
            company={this.props.company}
            basicNum={basicNum}
            data-uc-id="26-UdhJu-ym"
            data-uc-ct="companyreportmodal"
          />
        </React.Suspense>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    company: state.company,
    en_access_config: state.global.en_access_config,
    collectState: state.company.collectState,
    isObjection: state.company.isObjection,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withContactManager(CompanyIntroduction)))
