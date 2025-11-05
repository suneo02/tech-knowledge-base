import { AddStarO, FileTextO, FingerO, StarF, UndoO } from '@wind/icons'
import { Button, Card, Col, Dropdown, Link, Menu, message, Row, Spin, Tabs, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode'
import React, { ReactNode } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as companyActions from '../../actions/company'
import * as globalActions from '../../actions/global'
import { deleteById } from '../../api/collect&namelist'
import {
  getCompanyTags,
  getMoreContact,
  getNewsScore,
  getTechScore,
  ICorpTagData,
  myWfcAjax,
} from '../../api/companyApi'
import { pointBuriedNew } from '../../api/configApi'
import { MyIcon } from '../../components/Icon'
import { parseQueryString } from '../../lib/utils'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './style/corpIntro.less'

import {
  getBusinessOpportunityTab,
  getCompanyHeadScanning,
  getMyCorpEventListNew,
  getNewsInternal,
} from '@/api/corp/event.ts'
import { ICorpEvent } from '@/api/corp/eventTypes.ts'
import { HKCorpIntro } from '@/components/company/intro/baseIntro/HK.tsx'
import { TWCorpIntro } from '@/components/company/intro/baseIntro/TW.tsx'
import { CHART_HASH } from '@/components/company/intro/charts'
import { getCorpIntroChartsCfg } from '@/components/company/intro/charts.tsx'
import { CorpProductWordTags } from '@/components/company/intro/tag/ProductTag.tsx'
import { BaiFenSites } from '@/handle/link'
import { ICorpState } from '@/reducers/company.ts'
import { FormInstance } from '@wind/wind-ui-form'
import {
  CorpDetailDynamicEventTypeTag,
  CorpDetailPublicSentimentTag,
  getDynamicEventInnerContent,
  TagsModule,
  TagWithModule,
} from 'gel-ui'
import _, { cloneDeep, isNil } from 'lodash'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { commonBuryList } from '../../api/pointBuried/config'
import ecPng from '../../assets/imgs/ec.png'
import { ICorpBasicNumFront } from '../../handle/corp/basicNum/type.ts'
import { getIfIndividualBusiness } from '../../handle/corp/corpType'
import Expandable from '../common/expandable/Expandable'
import { InfoCircleButton } from '../icons/InfoCircle/index.tsx'
import { CallHelpFormField } from '../misc/callHelpForm'
import { withContactManager } from './ContactManager/ContactManagerButton'
import { getLegalPersonField } from './handle/miscT.ts'
import HeaderChart from './intro/charts/HeaderChart.tsx'
import { organizeCorpListAndCorporationTag } from './intro/handle'
import {
  allRiskTag,
  formatAdviceTime,
  mailTitle,
  pageinationProps,
  sortData,
  telTitle,
  webTitle,
} from './intro/handle/misc'
import { CompanyReportModal } from './intro/report'
import { CompanyCardTag } from './intro/tag'
import { IndustryTag } from './intro/tag/IndustryTag.tsx'
import { CompanyMoreTagsModal } from './intro/tag/MoreTag.tsx'
import { CompanyTagArr } from './intro/tag/TagArr.tsx'
import { LinkByRowCompatibleCorpPerson } from './link/CorpOrPersonLink.tsx'
import { TechScoreHint } from './techScore/comp'

const RadarChartComponent = () => React.lazy(() => import('../charts/RadarChart'))
const RadarChartCss = RadarChartComponent()

const TabPane = Tabs.TabPane

const StylePrefix = 'company-intro'

export const defaultCardTabKey = 'dongtai' // 动态商机舆情 默认的 key 是动态
// 企业详情页-头部卡片
class CompanyIntroduction extends React.Component<
  {
    companycode: string
    companyname: string
    basicNum: ICorpBasicNumFront
    companyid
    collectState
    company: ICorpState
    menuClick
    onlyCompanyIntroduction
    isObjection
    collect
    canBack
    isAIRight
    onContactManager?: () => void
  },
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
    companyTags: Record<string, any> // 如果 companyTags 结构已知，可以定义具体的接口
    fetureCompanyTag: string | any[] // 假设是一个字符串
    riskTags: string[] // 风险标签列表
    allOtherTags: string
    score: number
    negativeNews: string
    selfRisk: string
    aroundRisk: string
    tabKey: string
    legalRiskEvents: any // 如果 legalRiskEvents 结构已知，可以定义具体的接口
    mycorpeventlist: ICorpEvent[] // 如果 mycorpeventlist 结构已知，可以定义具体的接口
    businessOpportunityInfo: any // 如果 businessOpportunityInfo 结构已知，可以定义具体的接口
    reportTier: string
    qrShow: string
    hasShareUrl: boolean
    collectList: any[] // 如果 collectList 结构已知，可以定义具体的接口
    userInfo: any // 如果 userInfo 结构已知，可以定义具体的接口
    radarChartOpts: any // 如果 radarChartOpts 结构已知，可以定义具体的接口
    actionModal: 'moreTags' | 'report' | ''
    corpHeaderInfoIntl: any // 假设 corpHeaderInfoIntl 是一个已知的结构或者 null
    callHelpForm: FormInstance<CallHelpFormField> | null
    // showIndustryTagTour: boolean
    // industryTagTourShown: boolean
  }
> {
  statusArr: any[]
  logo: any
  ulCharts: any[]
  companyLabel: any
  govSupportTag: any //来觅投资机构标签
  corpTagList: any //企业性质标签
  industryTags: any //产业分类 2025-05-21 added by Calvin

  enumTags: any //空壳公司及四牌挂牌标签
  showMoreTags: any
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

      companyTags: {},
      fetureCompanyTag: '', //入选名录标签
      riskTags: [], // 风险标签
      allOtherTags: '',

      score: 50,
      negativeNews: '0',
      selfRisk: '0',
      aroundRisk: '0',
      tabKey: 'yuqing',
      legalRiskEvents: null,
      mycorpeventlist: [],
      businessOpportunityInfo: null, // 商机
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

      callHelpForm: null,
    }
    this.logo = null
    this.ulCharts = getCorpIntroChartsCfg({
      companyCode: props.companycode,
      companyName: props.companyname,
    })
    this.companyLabel = ''
    this.govSupportTag = '' //来觅投资机构标签
    this.corpTagList = '' //企业性质标签
    this.industryTags = [] // 产业分类

    this.enumTags = '' //空壳公司及四牌挂牌标签
    this.showMoreTags = null
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
    } else if (nextState.mycorpeventlist !== this.state.mycorpeventlist) {
      return true
    } else if (nextState.businessOpportunityInfo !== this.state.businessOpportunityInfo) {
      return true
    } else if (nextProps.collectState !== this.props.collectState) {
      return true
    } else {
      return false
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
    this.onCardTabChange(defaultCardTabKey)

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
    getCompanyTags(this.props.companycode).then((data) => {
      if (!(data.ErrorCode == 0 && data.Data)) {
        return
      }
      const res: Partial<ICorpTagData> = data.Data || {}
      /**
       * @type {string[]} corporationTags - 企业性质和规模标签
       */
      const corporationTags = res.corporationTags
      /**
       * @type {string[]} govSupport - 政府支持标签
       */
      const govSupport = res.govSupport
      const kkTag = []
      const productWord = res.productWords && res.productWords.length > 0 ? res.productWords : []
      if (govSupport && govSupport.length) {
        let flag = 0
        for (let i = 0; i < corporationTags.length; i++) {
          const tag = corporationTags[i]
          if (tag.split('_')[0] == '股票') {
            flag = flag + 1
          }
        }
        if (corporationTags && corporationTags.length > -1) {
          corporationTags.splice(
            flag,
            0,
            // @ts-expect-error ttt
            `投资机构_${intl('138727', '投资机构') + '|' + govSupport[0].investmentName}_${govSupport[0].investmentId}`
          )
        }
      }
      const parsedCompanyTagsRes = organizeCorpListAndCorporationTag(res.corpListTags, corporationTags)
      this.corpTagList = parsedCompanyTagsRes.corpTagList
      this.industryTags = res.industryTags
      if (res.enumTags && res.enumTags.length > 0) {
        for (var i = 0; i < res.enumTags.length; i++) {
          kkTag.push('<div className="blank-company">' + res.enumTags[i] + '</div>')
        }
      }
      this.setState({ fetureCompanyTag: parsedCompanyTagsRes.featureCompanyTagList })
      if (res.riskTags) {
        const newRiskTags = []
        for (const key in res.riskTags) {
          const onTagClick = this.props.onlyCompanyIntroduction
            ? undefined
            : () => this.onRiskTagJump(allRiskTag[key].jumpType)

          if (res.riskTags[key]) {
            // 湖南攸县农村商业银行股份有限公司 破产重整临时处理去掉 待后端统计数字修改后删除
            if (this.props.companycode === '1009919320' && key === 'bankruptcyevent_count') {
              continue
            }
            newRiskTags.push(
              <TagWithModule className={`${StylePrefix}--risk-tag`} module={TagsModule.RISK} onClick={onTagClick}>
                {allRiskTag[key]?.name}
              </TagWithModule>
            )
          }
        }

        this.setState({ riskTags: [...this.state.riskTags, ...newRiskTags] })
      }
      const tagsArr = []
      if (productWord.length > 0) {
        for (var i = 0; i < productWord.length; i++) {
          tagsArr.push(
            '<span className="each-tags-company" title="' + productWord[i] + '">' + productWord[i] + '</span>'
          )
        }
      }
      this.setState({ allOtherTags: tagsArr.join('') })
      if (productWord.length > 5) {
        this.companyLabel = res
        this.showMoreTags = (
          <span
            onClick={() => {
              pointBuriedByModule(922602100313)
              this.setState({ actionModal: 'moreTags' })
            }}
            className="more-tags-company"
          >
            {intl('138737', '查看更多')}
          </span>
        )
      }
      this.setState({ companyTags: data.Data }, () => {
        try {
          const eventListener = (e) => {
            const ele = e.target
            if (!ele) {
              return
            }
            if (e.target.className.includes('company-card-tags')) {
              return
            }
            if (e.target.className.includes('risk-tag')) {
              const menu = e.target.getAttribute('jump-type')
              this.props.menuClick([menu], { selected: true })
              if (e.target.className.includes('each-tags-company')) {
                const val = e.target.getAttribute('data-val')
                const type = e.target.getAttribute('data-type')
                if (type && val) {
                  if (type == '产品') {
                    wftCommon.jumpJqueryPage('index.html#/findCustomer?type=' + type + '&val=' + val)
                  }
                }
              }
            }
          }
          setTimeout(() => {
            if (document.querySelector('.company-modal-tags')) {
              document.querySelector('.company-modal-tags').addEventListener('click', eventListener)
            }

            if (document.querySelector('.company-card-tags')) {
              document.querySelector('.company-card-tags').addEventListener('click', eventListener)
            }
          }, 1000)

          if (window.en_access_config) {
            setTimeout(() => {
              wftCommon.translateDivHtml('.company-card-tags', window.$('.company-card-tags'))
            }, 300)
          }
        } catch (e) {
          console.error(e)
        }
      })
    })
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
    const newCode = this.props.companycode?.length > 10 ? this.props.companycode.slice(2, 12) : this.props.companycode
    getNewsInternal(newCode, {
      __primaryKey: this.props.companycode,
      pageNo: 0,
      pageSize: 3,
    }).then(
      (res) => {
        if (res && res.data) {
          if (res.data.legalRiskEvents && res.data.legalRiskEvents.length) {
            const call = (data) => {
              this.setState({
                legalRiskEvents: data,
              })
            }

            if (window.en_access_config) {
              call(res.data.legalRiskEvents)

              wftCommon.zh2en(res.data.legalRiskEvents, function (endata) {
                res.data.legalRiskEvents = endata
                call(res.data.legalRiskEvents)
              })
            } else {
              call(res.data.legalRiskEvents)
            }
          } else {
            this.setState({
              legalRiskEvents: [],
            })
          }
        } else {
          this.setState({
            legalRiskEvents: [],
          })
        }
      },
      () => {
        this.setState({
          legalRiskEvents: [],
        })
      }
    )
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

  showContent = (type, status, role, eachList) => {
    if (type) {
      const source_id = eachList.event_source_id
      if (type == '招投标公告' && !role) {
        // 单独处理
        return (
          <>
            <a
              className="w-link wi-link-color"
              target="_blank"
              onClick={this.dynamicEvent}
              href={`index.html?nosearch=1#/biddingDetail?detailid=${wftCommon.formatCont(source_id)}`}
              rel="noreferrer"
            >
              <CorpDetailDynamicEventTypeTag content={wftCommon.formatCont(type)} />
              招投标项目发布新公告
            </a>
          </>
        )
      } else {
        return (
          <>
            <CorpDetailDynamicEventTypeTag content={wftCommon.formatCont(type)} />
            {getDynamicEventInnerContent(type, status, role, eachList)}
          </>
        )
      }
    } else {
      return <div className="r-dynamic-event">{intl('132725', '暂无数据')}</div>
    }
  }

  dynamicEvent = (e) => {
    const a = e.currentTarget.querySelector('a')
    if (a) {
      const url = a.getAttribute('href')
      wftCommon.jumpJqueryPage(url)
    }
    e.stopPropagation()
    e.preventDefault()
  }

  redirectChartFun = (t) => {
    if (t?.bury?.id) {
      pointBuriedByModule(t.bury.id)
    }
    wftCommon.jumpJqueryPage(t.url)
  }

  onCardTabChange = async (key) => {
    this.setState({
      tabKey: key,
    })
    if (key === 'dongtai' && (!this.state.mycorpeventlist || this.state.mycorpeventlist.length === 0)) {
      const today = new Date()
      getMyCorpEventListNew({
        companyCode: this.props.companycode,
        endDate: this.getFullDate(today),
        type: 1,
      }).then(
        (res) => {
          if (res && Number(res.ErrorCode) === 0 && res.Data && res.Data.length) {
            this.setState({
              mycorpeventlist: res.Data,
            })

            setTimeout(() => {
              try {
                document.querySelector('.r-dynamic-event') &&
                  document.querySelectorAll('.r-dynamic-event').forEach((t) => {
                    if (isNil(t)) {
                      return
                    }
                    t.addEventListener('mouseenter', function (e) {
                      //  @ts-expect-error ttt
                      let tt = e.target.querySelector('.dynamic-event-abstract')
                      if (!tt) {
                        //  @ts-expect-error ttt
                        tt = e.target.querySelector('.wi-link-color')
                      }
                      if (!tt) {
                        return
                      }
                      if (!tt.hasAttribute('title')) {
                        const txt = tt.innerText || ''
                        if (txt) {
                          tt.setAttribute('title', txt)
                        }
                      }
                    })
                  })
              } catch (error) {
                console.error(error)
              }
            }, 100)

            if (window.en_access_config) {
              setTimeout(() => {
                wftCommon.translateDivHtml('.dynamic-table', window.$('.dynamic-table'))
              }, 300)
            }
          } else {
            this.setState({ mycorpeventlist: [] })
          }
        },
        () => {
          this.setState({ mycorpeventlist: [] })
        }
      )
    }
    if (key === 'shangji') {
      const info = await getBusinessOpportunityTab(this.props.companycode)
      this.setState({ businessOpportunityInfo: info })
    }
  }

  onRiskTagJump = (jumpType) => {
    if (wftCommon.fromPage_shfic !== wftCommon.fromPage()) {
      this.props.menuClick([jumpType], { selected: true })
      this.setState({ actionModal: '' }) // 关闭弹窗
    }
  }

  renderLogo = (baseInfo, headerInfo) => {
    if (headerInfo.ent_log_v) {
      return wftCommon.imageBaseCorp(6683, headerInfo.ent_log, 'logo', true)
    } else {
      const bkcolor = baseInfo ? wftCommon.calcLogoColor(baseInfo.industry_gb) : ''
      const shortname = baseInfo && baseInfo.chinese_abbr ? baseInfo.chinese_abbr : headerInfo.corp_name
      let logoName = headerInfo.corp_name || ''
      if (logoName.charCodeAt(0) < 255 && logoName.charCodeAt(logoName.length - 1) < 255) {
        // 英文
        logoName = headerInfo.corp_name.split(' ')[0]
        logoName = logoName.length > 7 ? logoName.slice(0, 7) : logoName
        if (logoName.length > 3) {
          logoName = logoName.slice(0, 3) + '\n' + logoName.slice(3, logoName.length)
        }
      } else {
        logoName = shortname ? shortname.slice(0, 4) : logoName.slice(0, 4)
      }

      return logoName.length < 3 ? (
        <span style={{ backgroundColor: bkcolor, lineHeight: '76px' }}> {logoName} </span>
      ) : (
        <span style={{ backgroundColor: bkcolor }}> {logoName} </span>
      )
    }
  }

  renderTitle = (baseInfo, headerInfo) => {
    return baseInfo && baseInfo.chinese_abbr ? baseInfo.chinese_abbr : headerInfo.corp_name
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
        content: <Table columns={colunms} dataSource={data} pagination={pageinationProps}></Table>,
        footer:
          title == intl('138805', '网址')
            ? [
                <span style={{ float: 'left', textAlign: 'left' }}>
                  {' '}
                  {intl('356873', '以上网站大数据判定为官方网站，该企业全部网址请点击查看')}{' '}
                  <span
                    id="gotoWeb"
                    style={{ color: '#00aec7', cursor: 'pointer' }}
                    onClick={() => {
                      store.dispatch(globalActions.clearGolbalModal())
                      this.props.menuClick(['getdomainname'], {
                        selected: true,
                      })
                    }}
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
          QRCode.toCanvas(canvas, wftCommon.addWsidForImg(res.Data.url), { width: 169 }, function () {
            self.setState({ qrShow: 'block', hasShareUrl: true })
          })
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

  newsopen = (item) => {
    const id = item.mediaId
    const title = item.title
    if (id) {
      const url = 'http://SmartReaderServer/SmartReaderWeb/SmartReader/?type=23&id=' + id + '&fav=1'
      if (window.external && window.external.ClientFunc) {
        window.external.ClientFunc(
          JSON.stringify({
            func: 'command',
            isGlobal: 1,
            cmdid: '29979',
            url: url,
            title: title || '',
            disableuppercase: 1,
          })
        )
      } else {
        window.open(url, '_newTab' + new Date().valueOf())
      }
    } else {
      window.open(item.url)
    }
  }

  render() {
    const { mycorpeventlist, radarChartOpts } = this.state
    const companybaseInfo = this.props.company.baseInfo || {}
    const corpArea = this.props.company.corpArea
    const ifIndividualBusiness = getIfIndividualBusiness(companybaseInfo.corp_type, companybaseInfo.corp_type_id)

    // @ts-expect-error ttt
    const baseInfo = companybaseInfo.corp || {}
    const headerInfo = cloneDeep(this.props.company.corpHeaderInfo)

    _.forOwn(this.state.corpHeaderInfoIntl, (value, key) => {
      if (_.has(headerInfo, key) && value != null && value) {
        headerInfo[key] = value
      }
    })
    const originalName = headerInfo.former_name || []
    const { isObjection, collectState, onlyCompanyIntroduction, basicNum, isAIRight } = this.props
    const corpState = headerInfo.state || ''
    let stateTxt = headerInfo.state
    const is_terminal = wftCommon.usedInClient()
    const emailCount = headerInfo.emailCount || 0
    const telCount = headerInfo.telCount || 0
    const websiteCount = headerInfo.websiteCount || 0

    const corptypeid = companybaseInfo.corp_type_id || '--'
    const ishk = corptypeid && String(corptypeid) == '298060000'
    const istw = companybaseInfo.areaCode == '030407'

    const hasTechScore = basicNum?.technologicalInnovationCount > 0

    // 第一行展示两个图谱
    const showKGChartInRowFirst = corpArea || ifIndividualBusiness
    // 展示较大的 舆情卡片 占行三分之一
    const showBigRiskCard = !hasTechScore || !radarChartOpts
    let card: ReactNode = ''
    let hkTagStr: ReactNode = ''

    if (ishk) {
      hkTagStr = <CompanyCardTag key={'oversea-tag-hk'} content={intl('261972', '中国香港企业')} />
    }
    if (istw) {
      hkTagStr = <CompanyCardTag key={'oversea-tag-tw'} content={intl('224478', '中国台湾企业')} />
    }

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
            <span className="itemTitle">{intl('4944', '电话')} :</span>{' '}
            <span className="">{headerInfo.tel ? headerInfo.tel.split(',')[0] : '--'}</span>
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
              >
                {intl('272167', '更多')} ({websiteCount})
              </span>
            ) : null}
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <span className="itemTitle">{intl('4944', '电话')} :</span>{' '}
            <span className="">{headerInfo.tel ? headerInfo.tel.split(',')[0] : '--'}</span>
            {telCount > 1 ? (
              <span className="morecontact" onClick={() => this.getMoreAction('moreTel', this.showMoreContact)}>
                {intl('272167', '更多')} ({telCount})
              </span>
            ) : null}
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
    if (corpState) {
      switch (stateTxt) {
        case '撤销':
          stateTxt = intl('2690', '撤销')
          break
        case '吊销':
          stateTxt = intl('271249', '吊销')
          break
        case '迁出':
          stateTxt = intl('134788', '迁出')
          break
        case '停业':
          stateTxt = intl('134791', '停业')
          break
        case '吊销,未注销':
          stateTxt = intl('134789', '吊销,未注销')
          break
        case '吊销,已注销':
          stateTxt = intl('134790', '吊销,已注销')
          break
        case '注销':
          stateTxt = intl('36489', '注销')
          break
        case '责令关闭':
          stateTxt = '责令关闭'
          break
        case '非正常户':
        case '已告解散':
        case '解散':
        case '廢止':
        case '已废止':
        case '歇業':
        case '破產':
        case '破產程序終結(終止)':
        case '合併解散':
        case '撤銷':
        case '已终止':
        case '解散已清算完結':
        case '该单位已注销':
        case '核准設立，但已命令解散':
          stateTxt = intl('257686', '非正常户')
          break
        case '成立':
        case '存续':
        case '在业':
        case '正常':
          stateTxt = intl('240282', '存续')
          break
        case '其他':
          stateTxt = intl('23435', '其他')
          break
        default:
          break
      }
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
                >
                  {intl('272167', '更多')} ({websiteCount})
                </span>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <span className="itemTitle">{intl('4944', '电话')} :</span>{' '}
              <span className="">{headerInfo.tel ? headerInfo.tel.split(',')[0] : '--'}</span>
              {telCount > 1 ? (
                <span className="morecontact" onClick={() => this.getMoreAction('moreTel', this.showMoreContact)}>
                  {intl('272167', '更多')} ({telCount})
                </span>
              ) : null}
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

    const zeroRotateZ = 140 // 左边最大角度 -140
    let rotateZ = 0
    if (this.state.score && this.state.score !== 50) {
      rotateZ = this.state.score - 0
      rotateZ = (rotateZ / 50) * zeroRotateZ
      rotateZ = 0 - zeroRotateZ + rotateZ
    }
    return (
      <>
        <Card className="companyIntroduction" bordered={false}>
          {/* 公司logo */}
          <div className="corpIcon">
            {Object.entries(headerInfo).length ? this.renderLogo(baseInfo, headerInfo) : null}
          </div>

          {/* 公司基础信息 */}
          <div className="corpInfoMsg">
            <div className="corpInfoTitle">
              <Tooltip placement="topLeft" title="点击复制企业名称">
                <span
                  className="corpTitle"
                  onClick={() => {
                    copy(this.renderTitle(baseInfo, headerInfo))
                    message.success('复制成功')
                  }}
                >
                  {this.renderTitle(baseInfo, headerInfo)}
                </span>
              </Tooltip>

              {originalName.length > 0 && (
                <Dropdown
                  overlay={
                    // @ts-expect-error ttt
                    <Menu className="originNameList">
                      {originalName.map((ele, index) => {
                        const use_from = ele.useFrom ? ele.useFrom : intl('367373', '日期不明')
                        const use_to = ele.useTo ? ele.useTo : intl('367373', '日期不明')
                        let time = use_from + (window.en_access_config ? ' ~ ' : ' 至 ') + use_to
                        if (!ele.useFrom && !ele.useTo) {
                          time = intl('367373', '日期不明')
                        }
                        return (
                          <Menu.Item key={index.toString()}>
                            {' '}
                            <div className="used-name-title"> {ele.formerName} </div>
                            <div className="used-name-time"> {time} </div>{' '}
                          </Menu.Item>
                        )
                      })}
                    </Menu>
                  }
                >
                  <span className="state-normal originName">
                    {`${intl(451194, '曾用名')}${originalName.length > 0 ? '(' + originalName.length + ')' : ''}`}
                    <MyIcon className="arrowDown" name={'Arrow_Down@1x'} />
                    <MyIcon className="arrowUp" name={'Arrow_Up_999@1x'} />
                  </span>
                </Dropdown>
              )}
              {isObjection ? (
                <Tooltip placement="topLeft" title={isObjection}>
                  <span className=" risk-tag-nojump">{intl('366153', '异议处理')}</span>
                </Tooltip>
              ) : null}
              {isAIRight ? null : (
                <div className="company-operation">
                  <Button
                    onClick={() => {
                      const { moduleId, opActive, describe } = commonBuryList.find(
                        (res) => res.moduleId === 922602100187
                      )
                      pointBuriedNew(moduleId, { opActive, opEntity: describe })
                      wftCommon.jumpJqueryPage(
                        `index.html?isSeparate=1&nosearch=1&companycode=${this.props.companycode}&companyname=${this.props.companyname}&activeKey=chart_ddycd#/${CHART_HASH}`
                      )
                    }}
                  >
                    <FingerO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <span>{intl('437412', '触达')}</span>
                  </Button>
                  <Button onClick={() => this.setState({ actionModal: 'report' })}>
                    <FileTextO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <span>{intl('175211', '报告')}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      const { moduleId, opActive, describe } = commonBuryList.find(
                        (res) => res.moduleId === 922602100273
                      )
                      pointBuriedNew(moduleId, { opActive, opEntity: describe })
                      this.props.collect()
                    }}
                  >
                    {collectState ? (
                      <StarF
                        className="corpCollectState"
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    ) : (
                      <AddStarO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    )}
                    <span>{collectState ? intl('138129', '已收藏') : intl('143165', '收藏')}</span>
                  </Button>
                </div>
              )}

              {this.props.canBack ? (
                <div className="company-operation">
                  <Button onClick={this.backToRoot}>
                    <UndoO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <span>{intl('5550', '返回')}</span>
                  </Button>
                </div>
              ) : null}
            </div>

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
                  content={`${intl(257678, '公司简介')} : ${headerInfo.brief}`}
                  // marginBottom="-40px"
                ></Expandable>
              </div>
            )}

            {this.state.companyTags ? (
              <div className={`${StylePrefix}--card-tags company-card-tags`}>
                {hkTagStr}
                <CompanyTagArr tagArr={this.corpTagList} />
                {this.enumTags}

                <IndustryTag tags={this.industryTags} />
                <CompanyTagArr tagArr={this.state.fetureCompanyTag} />
                {this.state.riskTags}
                <CorpProductWordTags productWords={this.state.companyTags?.productWords} />
                {this.showMoreTags}
              </div>
            ) : null}
          </div>
          {onlyCompanyIntroduction ? null : (
            <div className="share-weixin--container">
              <span
                className="share-weixin"
                id="shareWeixin"
                onMouseEnter={() => this.getShareCode()}
                onMouseLeave={() => this.setState({ qrShow: 'none' })}
              ></span>
              <div id="wxShare" className="popover bottom" style={{ display: this.state.qrShow }}>
                <div className="arrow"></div>
                <h3 className="popover-title">{intl('137841', '微信扫码分享')}</h3>
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
              {showKGChartInRowFirst ? (
                this.ulCharts.map((t) => {
                  return (
                    <HeaderChart key={t.txt} text={t.txt} isFirstRow={true} onClick={() => this.redirectChartFun(t)} />
                  )
                })
              ) : showBigRiskCard ? (
                <Col span={8} className="gutter-row">
                  <Card
                    className="risk-card"
                    title={
                      <>
                        {intl('451196', '舆情得分')}
                        <Tooltip
                          overlayClassName="corp-tooltip"
                          title={intl(
                            '437436',
                            '企业无重要舆情时，企业舆情分数为50分； 舆情分数越高，舆情正面程度越高；分数越低，舆情负面程度越高，该数据从公示结果解析得出，仅供参考，不代表万得企业库任何明示、暗示之观点或保证。'
                          )}
                        >
                          <InfoCircleButton />
                        </Tooltip>
                      </>
                    }
                    extra={
                      <span>
                        <a
                          className="risk-link"
                          href={`//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${this.props.companycode}/1/RiskOverviews`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {intl('40513', '详情')}
                        </a>
                      </span>
                    }
                  >
                    <div className="risk-score-module">
                      {this.state.score !== 50 ? (
                        <div className="ec-for-risk">
                          <span className="ec-for-risk1" style={{ transform: `rotateZ(${rotateZ}deg)` }}></span>
                          <span className="ec-for-risk2">{this.state.score}</span>
                        </div>
                      ) : (
                        <img style={{ marginLeft: '-2px', marginTop: '-2px' }} src={ecPng} alt="" className="" />
                      )}

                      <div className="score-text">
                        <div className="title">{intl('260157', '近3月')}</div>
                        <div className="part">
                          {intl('259931', '舆情资讯')}
                          <span>{this.state.negativeNews}</span>
                        </div>
                        <div className="part">
                          {intl('138502', '自身风险')}
                          <span>{this.state.selfRisk}</span>
                        </div>
                        <div className="part">
                          {intl('138166', '关联风险')}
                          <span>{this.state.aroundRisk}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ) : null}
              {!showKGChartInRowFirst && !showBigRiskCard && (
                <Col span={4} className="gutter-row">
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
                        >
                          {intl('40513', '详情')}
                        </a>
                      </span>
                    }
                  >
                    <div className="center-container">
                      {radarChartOpts ? (
                        <React.Suspense fallback={<div></div>}>
                          {<RadarChartCss opts={radarChartOpts}> </RadarChartCss>}
                        </React.Suspense>
                      ) : null}
                    </div>
                  </Card>
                </Col>
              )}
              {!showKGChartInRowFirst && !showBigRiskCard && (
                <Col span={4} className="gutter-row corpintro-risk-col-small ">
                  <Card
                    className="risk-card"
                    title={
                      <>
                        {intl('451196', '舆情得分')}
                        <Tooltip
                          overlayClassName="corp-tooltip"
                          title={intl(
                            '437436',
                            '企业无重要舆情时，企业舆情分数为50分； 舆情分数越高，舆情正面程度越高；分数越低，舆情负面程度越高，该数据从公示结果解析得出，仅供参考，不代表万得企业库任何明示、暗示之观点或保证。'
                          )}
                        >
                          <InfoCircleButton />
                        </Tooltip>
                      </>
                    }
                    extra={
                      <span>
                        <a
                          className="risk-link"
                          href={`//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${this.props.companycode}/1/RiskOverviews`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {intl('40513', '详情')}
                        </a>
                      </span>
                    }
                  >
                    <div className="risk-score-module">
                      {this.state.score !== 50 ? (
                        <div className="ec-for-risk">
                          <span className="ec-for-risk1" style={{ transform: `rotateZ(${rotateZ}deg)` }}></span>
                          <span className="ec-for-risk2">{this.state.score}</span>
                        </div>
                      ) : (
                        <img style={{ marginLeft: '-2px', marginTop: '-2px' }} src={ecPng} alt="" className="" />
                      )}
                    </div>
                  </Card>
                </Col>
              )}
              <Col span={16} className="gutter-row gutter-row-tab">
                {/* @ts-expect-error ttt*/}
                <Tabs
                  className="risk-tabs-css"
                  defaultActiveKey={defaultCardTabKey}
                  onChange={this.onCardTabChange}
                  tabBarExtraContent={
                    <a
                      className="risk-link"
                      onClick={() => {
                        if (this.state.tabKey == 'yuqing') {
                          wftCommon.jumpJqueryPage(
                            'index.html#/companyNews?nosearch=1&companycode=' + this.props.companycode
                          )
                        } else if (this.state.tabKey === 'shangji') {
                          const { creditOpportunities: creditOpportunitiesUrl } = BaiFenSites()
                          if (this.state?.businessOpportunityInfo?.more?.url && creditOpportunitiesUrl) {
                            window.open(creditOpportunitiesUrl)
                          } else {
                            console.log(1)
                          }
                        } else {
                          const { moduleId, opActive, describe } = commonBuryList.find(
                            (res) => res.moduleId === 922602100276
                          )
                          pointBuriedNew(moduleId, { opActive, opEntity: describe })
                          wftCommon.jumpJqueryPage(
                            'index.html#/SingleCompanyDynamic?companycode=' +
                              this.props.companycode +
                              '&companyname=' +
                              baseInfo.corp_name
                          )
                        }
                      }}
                      target="_blank"
                    >
                      {intl('272167', '更多')}
                    </a>
                  }
                >
                  {/* @ts-expect-error ttt*/}
                  <TabPane tab={intl('437413', '动态')} key="dongtai">
                    <div className="dynamic-body dynamic-table">
                      {!this.state.mycorpeventlist ? (
                        <Spin />
                      ) : mycorpeventlist && mycorpeventlist.length ? (
                        mycorpeventlist.map((item, index) => (
                          <div key={'dynamicevent-' + index} className="news-tips dongtai">
                            <span className="date">{item.event_date}</span>
                            {this.showContent(item.event_type, item.event_status, item.role, item)}
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            lineHeight: '90px',
                            color: '#999',
                          }}
                        >
                          {intl('132725', '暂无数据')}
                        </div>
                      )}
                    </div>
                  </TabPane>
                  {ifIndividualBusiness ? null : (
                    // @ts-expect-error ttt
                    <TabPane tab={intl('421503', '舆情')} key="yuqing">
                      <div className="dynamic-body">
                        {!this.state.legalRiskEvents ? (
                          !this.props.companycode ? (
                            <div
                              style={{
                                textAlign: 'center',
                                lineHeight: '90px',
                                color: '#999',
                              }}
                            >
                              {intl('132725', '暂无数据')}
                            </div>
                          ) : (
                            <Spin />
                          )
                        ) : this.state.legalRiskEvents && this.state.legalRiskEvents.length ? (
                          this.state.legalRiskEvents.map((item, index) => (
                            <div key={'legaldiv-' + index} className="news-tips">
                              <span className="date">{formatAdviceTime(item.releaseTime).split(' ')[0]}</span>
                              {item.mediaRelatedInfo && item.mediaRelatedInfo.tagName ? (
                                <CorpDetailPublicSentimentTag
                                  emotion={item.mediaRelatedInfo.emotion}
                                  level={item.mediaRelatedInfo.level}
                                  content={item.mediaRelatedInfo.tagName}
                                />
                              ) : null}
                              {/* @ts-expect-error ttt */}
                              <Link title={item.title} target="_blank" onClick={() => this.newsopen(item)}>
                                {wftCommon.formatCont(item.title)}
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              lineHeight: '90px',
                              color: '#999',
                            }}
                          >
                            {intl('132725', '暂无数据')}
                          </div>
                        )}
                      </div>
                    </TabPane>
                  )}

                  {!is_terminal || window.en_access_config ? null : (
                    // @ts-expect-error ttt
                    <TabPane tab={intl('272288', '商机')} key="shangji">
                      <div className="dynamic-body dynamic-table">
                        {!this.state.businessOpportunityInfo ? (
                          <Spin />
                        ) : this.state.businessOpportunityInfo.list?.length ? (
                          this.state.businessOpportunityInfo.list.map((item, index) => (
                            <div key={'dynamicevent-' + index} className="news-tips dongtai">
                              <span className="date">{wftCommon.formatTime(item.date)}</span>
                              <CorpDetailDynamicEventTypeTag content={wftCommon.formatCont(item.tagName)} />
                              <a className="w-link wi-link-color" target="_blank" href={item.url} rel="noreferrer">
                                {item.tagContent}
                              </a>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              lineHeight: '90px',
                              color: '#999',
                            }}
                          >
                            {intl('132725', '暂无数据')}
                          </div>
                        )}
                      </div>
                    </TabPane>
                  )}
                </Tabs>
              </Col>
            </Row>

            {/* 图谱相关Card */}
            {!showKGChartInRowFirst ? (
              <Row gutter={12} style={{ marginTop: '12px' }}>
                {this.ulCharts.map((t) => {
                  return <HeaderChart key={t.txt} text={t.txt} onClick={() => this.redirectChartFun(t)} />
                })}
              </Row>
            ) : null}
          </>
        )}
        <CompanyReportModal
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
        />
        <CompanyMoreTagsModal
          open={this.state.actionModal === 'moreTags'}
          setOpen={(open) => {
            if (open) {
              this.setState({ actionModal: 'moreTags' })
            } else {
              this.setState({ actionModal: '' })
            }
          }}
          companyTags={this.state.companyTags}
          corpTagStrList={this.corpTagList}
          featureCompanyTagStrList={this.state.fetureCompanyTag}
          riskTags={this.state.riskTags}
          industryTags={this.industryTags}
        />
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

const mapDispatchToProps = (dispatch) => {
  return {
    deleteById: (data) => {
      return deleteById(data).then((res) => {
        dispatch(companyActions.toggleCollect(res))
        return res
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withContactManager(CompanyIntroduction)))
