import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { DownloadO, NoteO } from '@wind/icons'
import { Button, Checkbox, DatePicker, Input, message, Modal, Radio, Select } from '@wind/wind-ui'
import dayjs from 'dayjs'
import { CorpPresearchModule, WindCascade } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import React, { createRef } from 'react'
import { connect } from 'react-redux'
import {
  addBidSubscribe,
  deleteBidSingleHis,
  deleteSingleSubscribe,
  downloadBid,
  getBidSearchNew,
  getBidSubscribeDetail,
  getBidSubscribeEmail,
} from '../../api/searchListApi.ts'
import { getSearchHistoryAndSlice } from '../../api/services/history.ts'
import { CardList } from '../../components/CardList/CardList'
import { CorpPresearch } from '../../components/CorpPreSearch'
import InnerHtml from '../../components/InnerHtml'
import SpaceTagInput from '../../components/SpaceTagInput/SpaceTagInput'
import NumberRangeOption from '../../components/restructFilter/comps/filterOptions/NumberRangeOption'
import PreSearchInput from '../../components/singleSearch/preSearchInput'
import { bidResultOption } from '../../handle/searchConfig'
import { newMap } from '../../handle/searchConfig/newMap'
import { globalIndustryOfNationalEconomy4 } from '../../utils/industryOfNationalEconomyTree'
import intl, { translateToEnglish } from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import BidHistoryFocus from '../BidHistoryFocus'
import { BidCard } from '../BusinessComponent/bid'
import HistoryFocusList from '../HistoryFocusList'
import './SearchBidNew.less'
import { allAnnoc, biddingMoney, money, programStatus, releaseDate, showMap } from './config.ts'
import { processAllCompanyNames } from './extra.ts'
import { updateSearchHistory } from './history'
import { SearchBidNewProps, SearchBidNewState } from './type.tsx'

const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const CheckboxGroup = Checkbox.Group

const StylePrefix = 'search-bid-new'

class SearchBidNew extends React.Component<SearchBidNewProps, SearchBidNewState> {
  buyCom: any
  winCom: any
  bidWinnerCom: any
  noBread: string
  isRequesting: boolean
  bidHistoryRef: any
  participateInputRef: any
  purchaserInputRef: any
  winnerInputRef: any
  constructor(props) {
    super(props)
    this.state = {
      pagesize: 10,
      loading: true,
      loadingList: false,
      title: '',
      productName: '',
      compIndustry: [],
      areaCodes: [],
      defaultTime: [],
      moneyList: [],
      releaseState: '~30',
      selectValue: '',
      customizationTime: '',
      pageNo: 0,
      resultNum: '0',
      errorCode: '',
      resultList: [],
      historyList: [],
      visible: false,
      keywordHis: [],
      productsHis: [],
      queryHisShow: 'none',
      productHisShow: 'none',
      announcement: [],
      customValue: '',
      customValueBid: '',
      bidMoney: [],
      subscribeList: [],
      subBotton: true,
      modalType: '',
      edit: false,
      addNewSubName: '',
      emailAlert: true,
      addSubNameWarning: '',
      newEmail: '',
      emailError: false,
      alreadyEmail: '',
      recommend: true,
      userType: '',
      buyGive: [],
      winGive: [],
      showGive: [],
      defaultRegion: [],
      defaultIndustry: [],
      downloadValue: '',
      downloadRangWarning: false,
      downloadWantMore: false,
      dowmloadOverRun: false,
      nowSubId: '',
      nowSubName: '',
      newPrelist: [],
      newBiddinglist: [],
      newDeallist: [],
      preIndeterminate: false,
      biddingIndeterminate: false,
      dealIndeterminate: false,
      preCheckAll: false,
      biddingCheckAll: false,
      dealCheckAll: false,
      visibleSubList: false,
      hasAttach: false, //是否仅看有附件公告
      partHis: [],
      purchaseHis: [],
      winHis: [],
      participateInputValues: [], // 参与单位
      purchaserInputValues: [], // 采购单位
      winnerInputValues: [], // 中标单位
      titleTags: [],
      productTags: [],

      //  订阅后的点击回显label
      participateInputInitialLabels: [],
      purchaserInputInitialLabels: [],
      winnerInputInitialLabels: [],
    }
    this.buyCom = React.createRef()
    this.winCom = React.createRef()
    this.bidWinnerCom = React.createRef()
    this.noBread = wftCommon.getQueryString('noBread')
    this.isRequesting = false
    this.bidHistoryRef = createRef() // 创建 ref

    this.participateInputRef = createRef()
    this.purchaserInputRef = createRef()
    this.winnerInputRef = createRef()
  }

  async componentDidMount() {
    document.title = intl('228333', '招投标查询')
    const from = wftCommon.getQueryString('linkfrom')
    if (from == 'em') {
      const conId = wftCommon.getQueryString('conditionId')
      this.appSub(conId)
    } else {
      this.getData()
    }
    // 获取历史记录
    const [titleHis, productHis] = await Promise.all([
      getSearchHistoryAndSlice('BID_SEARCH_TITLE'),
      getSearchHistoryAndSlice('BID_SEARCH_PRODUCT'),
    ])
    this.setState({
      keywordHis: titleHis,
      productsHis: productHis,
    })
  }

  getUserPackage = () => {
    //获取用户权限
    let userPackageType = ''
    if (
      this.props.homePackageName == 'EQ_APL_GEL_SVIP' ||
      this.props.homePackageName == 'EQ_APL_GEL_FORSTAFF' ||
      this.props.homePackageName == 'EQ_APL_GEL_FORTRAIL'
    ) {
      userPackageType = 'svip'
    } else if (this.props.homePackageName == 'EQ_APL_GEL_VIP' || this.props.homePackageName == 'EQ_APL_GEL_EP') {
      userPackageType = 'vip'
    } else {
      userPackageType = 'bs'
    }
    return userPackageType
  }

  loadMore = () => {
    let { pageNo, resultNum } = this.state
    if ((pageNo + 1) * 10 < parseInt(resultNum)) {
      if (!this.isRequesting) {
        this.setState({ pageNo: pageNo + 1, loadingList: true }, () => {
          this.getData()
        })
      }
    }
  }

  stageChange = (e, indeterminate, checkAll, list, arrName) => {
    //选择项目阶段的回调
    // @ts-expect-error ttt
    this.setState({
      [list]: e.target.checked ? allAnnoc[arrName] : [],
      [indeterminate]: false,
      [checkAll]: e.target.checked,
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }
  subStage = (arr, indeterminate, checkAll, list, stateList) => {
    //订阅回调时项目阶段及公告类型的应用
    let checkAlled = false
    let newIndeterminate = false
    if (arr.length > 0) {
      if (allAnnoc[list].length == arr.length) {
        checkAlled = true
        newIndeterminate = false
      } else {
        checkAlled = false
        newIndeterminate = true
      }
    }
    // @ts-expect-error ttt
    this.setState({
      [indeterminate]: newIndeterminate,
      [checkAll]: checkAlled,
      [stateList]: arr,
    })
  }

  releaseDateChange = (e) => {
    //单选公告日期回调函数
    let { defaultTime } = this.state
    if (e.target.value == 'custome') {
      if (defaultTime.length == 0) {
        message.warning('请选择自定义公告日期')
        return false
      }
    }
    this.setState({
      releaseState: e.target.value,
      // defaultTime:e.target.value == 'custome' ? defaultTime: '',
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }

  onTimeChange = (date, dateString) => {
    //自定义公告日期回调函数
    let newArr: any = []
    if (date) {
      for (let i = 0; i < dateString.length; i++) {
        if (dateString[i]) {
          newArr.push(dateString[i].replace(/-/g, ''))
        } else {
          newArr.push(null) // [1000,]支持 无上限（无下限）传参
        }
      }
      newArr = newArr.join('-')
      this.setState({
        defaultTime: date,
        customizationTime: newArr,
        releaseState: 'custome',
        nowSubId: '',
        nowSubName: '',
        subBotton: true,
      })
    } else {
      this.setState({
        // @ts-expect-error ttt
        defaultTime: '',
        customizationTime: '',
        nowSubId: '',
        nowSubName: '',
        subBotton: true,
      })
    }
  }
  cascaderChange = (e, param, state) => {
    console.log('🚀 ~ SearchBidNew ~ e:', e)
    //招标地区、国标行业选择后的回调函数
    let newArr = []
    if (param == 'areaCodes') {
      for (let i = 0; i < e.length; i++) {
        newArr.push(e[i].join(' '))
      }
    } else {
      for (let i = 0; i < e.length; i++) {
        newArr.push(e[i][e[i].length - 1])
      }
    } // @ts-expect-error ttt
    this.setState({
      [param]: newArr.join('|'),
      [state]: e,
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }
  keywordChange = (event, key = 'title') => {
    let newValue = event.target.value
    // if(!/\|\s$/.test(event.target.value)){
    //     newValue =  event.target.value.replace(/\s+/g, ' ').replace(/\s/g, '|');
    // }else{
    //     event.preventDefault();
    // }
    // @ts-expect-error ttt
    this.setState({
      [key]: newValue,
      [showMap[key]]: event.target.value ? 'none' : 'block',
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }

  handleTitleTagsChange = (values: string[]) => {
    const uniq = Array.from(new Set(values.filter(Boolean)))
    this.setState({
      titleTags: uniq,
      title: uniq.join('|'),
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
      queryHisShow: uniq.length ? 'none' : 'block',
    })
  }

  handleProductTagsChange = (values: string[]) => {
    const uniq = Array.from(new Set(values.filter(Boolean)))
    this.setState({
      productTags: uniq,
      productName: uniq.join('|'),
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
      productHisShow: uniq.length ? 'none' : 'block',
    })
  }

  // 是否有附件筛选
  handleAttachChange = (e) => {
    this.setState(
      {
        pageNo: 0,
        loading: true,
        hasAttach: e.target.checked,
      },
      () => this.getData()
    )
  }

  handleChange = (value) => {
    //选择排序条件
    this.setState(
      {
        pageNo: 0,
        loading: true,
        selectValue: value,
      },
      () => this.getData()
    )
  }

  getParam = () => {
    //获取搜索参数
    const {
      title,
      productName,
      defaultIndustry,
      defaultRegion,
      releaseState,
      moneyList,
      customizationTime,
      pageNo,
      selectValue,
      newPrelist,
      newBiddinglist,
      newDeallist,
      customValue,
      bidMoney,
      customValueBid,
      hasAttach,
    } = this.state
    console.log('🚀 ~ SearchBidNew ~  this.state:', this.state)
    let newBuyArr = []
    let newbidWinnerArr = []
    let newWinArr = []
    let param = {}
    const showBuyPre = this.state.purchaserInputValues
    const showWinPre = this.state.participateInputValues
    const showbidWinnerPre = this.state.winnerInputValues
    const allAnnocment = newPrelist.concat(newBiddinglist).concat(newDeallist)
    const newRegion = []
    const newIndustry = []
    const newMoney = []
    const newBidMoney = []
    const stageList = []
    console.log('showBuyPre, showWinPre,showbidWinnerPre', showBuyPre, showWinPre, showbidWinnerPre)
    if (newPrelist.length > 0) {
      stageList.push('预审阶段')
    }
    if (newBiddinglist.length > 0) {
      stageList.push('招标阶段')
    }
    if (newDeallist.length > 0) {
      stageList.push('结果阶段')
    }
    for (let i = 0; i < defaultRegion.length; i++) {
      newRegion.push(defaultRegion[i].join(' '))
    }
    for (let i = 0; i < defaultIndustry.length; i++) {
      let len = defaultIndustry[i]?.length || 0
      newIndustry.push(defaultIndustry[i]?.[len - 1])
    }
    for (let i = 0; i < moneyList.length; i++) {
      if (moneyList[i] == 'custome') {
        const [min, max] = customValue.split('-').map((i) => Number(i) * 10000 || null)
        newMoney.push('[' + (min ? min + ',' : ',') + (max ? max + ']' : ']'))
      } else {
        newMoney.push(moneyList[i])
      }
    }
    for (let i = 0; i < bidMoney.length; i++) {
      if (bidMoney[i] == 'custome') {
        const [min, max] = customValueBid.split('-').map((i) => Number(i) * 10000 || null)
        newBidMoney.push('[' + (min ? min + ',' : ',') + (max ? max + ']' : ']'))
      } else {
        newBidMoney.push(bidMoney[i])
      }
    }
    if (showBuyPre.length > 0) {
      for (let i = 0; i < showBuyPre.length; i++) {
        newBuyArr.push(showBuyPre[i].split('|')[1])
      }
    } else {
      newBuyArr = []
    }
    if (showWinPre) {
      for (let i = 0; i < showWinPre.length; i++) {
        newWinArr.push(showWinPre[i].split('|')[1])
      }
    } else {
      newWinArr = []
    }
    // 中标单位暂时传企业名，待改成id
    if (showbidWinnerPre) {
      for (let i = 0; i < showbidWinnerPre.length; i++) {
        newbidWinnerArr.push(showbidWinnerPre[i].split('|')[1])
      }
    } else {
      newbidWinnerArr = []
    }
    let releaseDate = releaseState ? releaseState : ''
    if (releaseState) {
      if (releaseState == 'custome') {
        releaseDate =
          customizationTime && customizationTime.length > 0
            ? '[' + customizationTime.split('-')[0] + ',' + customizationTime.split('-')[1] + ']'
            : null
      }
    }

    param = {
      pageNo: pageNo,
      pageSize: 10,
      productName: productName ? productName.split(' ').join('|') : '',
      title: title || '',
      purchasingUnit: newBuyArr.join('|'),
      bidWinnerUnit: newbidWinnerArr.join('|'),
      participateUnit: newWinArr.join('|'),
      region: newRegion ? newRegion.join('|') : '',
      industryCode: newIndustry ? newIndustry.join('|') : '',
      biddingStage: stageList.length > 0 ? stageList.join('|') : '',
      filterBiddingType: allAnnocment ? allAnnocment.join('|') : '',
      oppTime: releaseDate,
      money: newMoney && newMoney.length > 0 ? newMoney.join('|') : '',
      bidWinningMoney: newBidMoney && newBidMoney.length > 0 ? newBidMoney.join('|') : '',
      sort: `${selectValue || '_score_desc,sort_date_desc'}`,
      hasAttach: hasAttach ? 1 : null,
    }
    return wftCommon.preProcessData(param)
  }
  getSubName = () => {
    //根据筛选区状态获取默认订阅名
    const param = this.getParam()
    const {
      newPrelist,
      newBiddinglist,
      newDeallist,
      title,
      productName,
      participateInputValues,
      winnerInputValues,
      purchaserInputValues,
    } = this.state
    const newBuyArr = []
    const newWinArr = []
    const newbidWinnerArr = []
    const showBuyPre = purchaserInputValues
    const showWinPre = participateInputValues
    const showbidWinnerPre = winnerInputValues
    const newArr = []
    if (param.title) {
      newArr.push('公告标题：' + title)
    }

    if (param.productName) {
      newArr.push('招标产品：' + productName)
    }

    if (param.purchasingUnit) {
      for (let i = 0; i < showBuyPre.length; i++) {
        newBuyArr.push(showBuyPre[i].split('|')[0])
      }
      newArr.push('采购单位：' + newBuyArr.join('、'))
    }
    if (param.participateUnit) {
      for (let i = 0; i < showWinPre.length; i++) {
        newWinArr.push(showWinPre[i].split('|')[0])
      }
      newArr.push('参与单位：' + newWinArr.join('、'))
    }
    if (param.bidWinnerUnit) {
      for (let i = 0; i < showbidWinnerPre.length; i++) {
        newbidWinnerArr.push(showbidWinnerPre[i].split('|')[0])
      }
      newArr.push('中标单位：' + newbidWinnerArr.join('、'))
    }
    if (param.region) {
      const region = param.region.split('|')
      const newRegion = []
      for (let i = 0; i < region.length; i++) {
        let a = region[i].split(' ')
        newRegion.push(a[a.length - 1])
      }
      newArr.push('招标地区：' + newRegion.join('、'))
    }
    if (param.industryCode) {
      newArr.push('国标行业：' + param.industryCode.split('|').join('、'))
    }
    if (param.biddingStage) {
      newArr.push('项目阶段：' + param.biddingStage.split('|').join('、'))
    }
    if (param.filterBiddingType) {
      const annc = []
      if (newPrelist.length !== 1) {
        for (let i = 0; i < newPrelist.length; i++) {
          annc.push(newPrelist[i])
        }
      }
      if (newBiddinglist.length !== 8) {
        for (let i = 0; i < newBiddinglist.length; i++) {
          annc.push(newBiddinglist[i])
        }
      }
      if (newDeallist.length !== 6) {
        for (let i = 0; i < newDeallist.length; i++) {
          annc.push(newDeallist[i])
        }
      }
      if (annc.length > 0) {
        newArr.push('公告类型：' + annc.join('、'))
      }
    }
    if (param.oppTime) {
      let time = ''
      if (param.oppTime.indexOf('~') > -1) {
        for (let i = 0; i < releaseDate.length; i++) {
          if (releaseDate[i].value == param.oppTime) {
            time = releaseDate[i].name
          }
        }
      } else {
        time =
          wftCommon.formatTime(this.state.customizationTime.split('-')[0]) +
          '~' +
          wftCommon.formatTime(this.state.customizationTime.split('-')[1])
      }
      newArr.push('公告日期：' + time)
    }
    if (param.money) {
      const moneyArr = param.money.split('|')
      const newMoneyArr = []
      for (let i = 0; i < moneyArr.length; i++) {
        if (moneyArr[i].indexOf('~') > -1) {
          for (let j = 0; j < money.length; j++) {
            if (moneyArr[i] == money[j].value) {
              newMoneyArr.push(money[j].label)
            }
          }
        } else {
          const cusMoney =
            Number(this.state.customValue.split('-')[0]) + '万~' + Number(this.state.customValue.split('-')[1]) + '万'
          newMoneyArr.push(cusMoney)
        }
      }
      newArr.push('招标预算：' + newMoneyArr.join('、'))
    }
    if (param.bidWinningMoney) {
      const moneyArr = param.bidWinningMoney.split('|')
      const newMoneyArr = []
      for (let i = 0; i < moneyArr.length; i++) {
        if (moneyArr[i].indexOf('~') > -1) {
          for (let j = 0; j < biddingMoney.length; j++) {
            if (moneyArr[i] == biddingMoney[j].value) {
              newMoneyArr.push(biddingMoney[j].label)
            }
          }
        } else {
          const cusMoney =
            Number(this.state.customValueBid.split('-')[0]) +
            '万~' +
            Number(this.state.customValueBid.split('-')[1]) +
            '万'
          newMoneyArr.push(cusMoney)
        }
      }
      newArr.push('中标金额：' + newMoneyArr.join('、'))
    }
    let string = newArr.join('；')
    if (string.length > 30) {
      string = string.slice(0, 30)
    }
    this.setState({
      addNewSubName: string ? string : '',
    })
  }

  getData = (extraParam?) => {
    //获取搜索数据
    let param = this.getParam()
    param = { ...param, ...extraParam }
    const showBuyPre = this.buyCom.state.showPre
    const showWinPre = this.winCom.state.showPre
    const showbidWinnerPre = this.bidWinnerCom.state.showPre
    let buyResult = true
    let winResult = true
    let bidWinnerResult = true
    if (showBuyPre.length == 0) {
      buyResult = this.buyCom.retrievalWarning()
    }
    if (showWinPre.length == 0) {
      winResult = this.winCom.retrievalWarning()
    }
    if (showbidWinnerPre.length == 0) {
      bidWinnerResult = this.bidWinnerCom.retrievalWarning()
    }
    if (buyResult && winResult && bidWinnerResult) {
      this.setState({ loading: true })
      this.isRequesting = true
      getBidSearchNew(param)
        .then((res) => {
          if (res.ErrorCode == 0 && res.Data) {
            var self = this

            if (isEn()) {
              if (param.pageNo == '0') {
                if (res.Data.list && res.Data.list.length) {
                  callback(res.Data.list)
                }
              }
              res.Data.list &&
                res.Data.list.length &&
                res.Data.list.map((t) => {
                  if (t.purchasing_unit && typeof t.purchasing_unit === 'string') {
                    const purchasing_unit = t.purchasing_unit.split('|')[0]
                    const purchasing_unit_id = t.purchasing_unit.split('|')[1]
                    t.purchasing_unit_id$ = purchasing_unit_id || ''
                    t.purchasing_unit = purchasing_unit
                  }
                })

              translateToEnglish(res.Data.list, {
                skipFields: ['purchasing_unit', 'bidWinner', 'purchasingUnit'],
              })
                .then((enDataRes) => {
                  callback(enDataRes.data)
                })
                .catch((err) => {
                  console.log(err)
                  callback(res.Data.list)
                })
            } else {
              callback(res.Data.list)
            }

            function callback(endata) {
              if (isEn()) {
                endata &&
                  endata.length &&
                  endata.map((t, idx) => {
                    if (t.purchasing_unit_id$) {
                      t.purchasing_unit = t.purchasing_unit + '|' + t.purchasing_unit_id$
                    }
                    t.bidding_type_name = res.Data.list[idx].bidding_type_name
                  })
              }

              console.log(self.state.participateInputValues)

              // 保存历史记录
              updateSearchHistory(self.setState.bind(self), {
                title: self.state.title,
                productName: self.state.productName,
                showBuyPre: self.state.purchaserInputValues,
                showWinPre: self.state.participateInputValues,
                showbidWinnerPre: self.state.winnerInputValues,
              })

              self.setState({
                loading: false,
                loadingList: false, // @ts-expect-error ttt
                resultNum: res.Page.Records ? res.Page.Records : '0',
                resultList: param.pageNo == 0 ? endata : self.state.resultList.concat(endata),
                recommend: false,
              })
            }
          } else {
            this.setState({
              // @ts-expect-error ttt
              errorCode: res.ErrorCode,
              loadingList: false,
              loading: false,
              recommend: false,
            })
          }
        })
        .finally(() => {
          this.setState({
            loadingList: false,
            loading: false,
            recommend: false,
          })
          this.isRequesting = false
        })
    }
  }

  appSub = (id, name?) => {
    //根据订阅id调取订阅条件
    const param = {
      id: id,
    }
    console.log(name)
    this.setState(
      {
        nowSubId: id,
        nowSubName: name,
      },
      () => {
        getBidSubscribeDetail(param).then((res) => {
          if (res && res.Data.queryCondition) {
            const callBack = JSON.parse(res.Data.queryCondition)
            this.callBackSub(callBack)
          }
        })
      }
    )
  }

  callBackSub = (param) => {
    //应用订阅到筛选框，并按照订阅条件执行一次搜索

    let newBidding = []
    let newDeal = []
    let newStage = []
    let newBuy = []
    let newWin = []
    let newGive = []
    let newIndustry = []
    let newRegion = []
    let cusReleaseTime = []
    let newMoney = []
    let newCusMoney = ''
    let newBidMoney = []
    let newCusBidMoney = ''
    if (param.filterBiddingType) {
      let typeArr = param.filterBiddingType.split('|')
      for (var i = 0; i < typeArr.length; i++) {
        if (typeArr[i] == '资格预审公告') {
          newStage.push(typeArr[i])
        } else if (
          typeArr[i] == '公开招标公告' ||
          typeArr[i] == '询价公告' ||
          typeArr[i] == '邀请招标公告' ||
          typeArr[i] == '竞争性谈判公告' ||
          typeArr[i] == '竞争性磋商公告' ||
          typeArr[i] == '单一来源公告' ||
          typeArr[i] == '竞价招标公告' ||
          typeArr[i] == '意向公告'
        ) {
          newBidding.push(typeArr[i])
        } else {
          newDeal.push(typeArr[i])
        }
      }
      this.subStage(newStage, 'preIndeterminate', 'preCheckAll', 'preStage', 'newPrelist')
      this.subStage(newBidding, 'biddingIndeterminate', 'biddingCheckAll', 'biddingStage', 'newBiddinglist')
      this.subStage(newDeal, 'dealIndeterminate', 'dealCheckAll', 'dealStage', 'newDeallist')
    } else {
      this.setState({
        preIndeterminate: false,
        preCheckAll: false,
        newPrelist: [],
        biddingIndeterminate: false,
        biddingCheckAll: false,
        newBiddinglist: [],
        dealIndeterminate: false,
        dealCheckAll: false,
        newDeallist: [],
      })
    }
    if (param.purchasingUnit) {
      newBuy = param.purchasingUnit.split('|')
    }
    if (param.bidWinnerUnit) {
      newWin = param.bidWinnerUnit.split('|')
    }
    if (param.biddingUnit) {
      newGive = param.biddingUnit?.split('|') || []
    }
    if (param.participateUnit) {
      newGive = param.participateUnit?.split('|') || []
    }
    if (param.industryCode) {
      let newI = param.industryCode.split('|')
      for (let i = 0; i < newI.length; i++) {
        let a = wftCommon.getPathByKey(newI[i], 'name', globalIndustryOfNationalEconomy4)
        let value = []
        for (let j = 0; j < a.length; j++) {
          value.push(a[j].name)
        }
        newIndustry.push(value)
      }
    }
    if (param.region) {
      let newR = param.region.split('|')
      for (let i = 0; i < newR.length; i++) {
        newRegion.push(newR[i].split(' '))
      }
    }
    if (param.oppTime) {
      if (param.oppTime.indexOf('~') < 0) {
        let time = param.oppTime.replace(/\[|]/g, '').split(',')
        for (let i = 0; i < time.length; i++) {
          cusReleaseTime.push(dayjs(time[i]))
        }
      }
    }
    if (param.money) {
      let subMoney = param.money.split('|')
      for (let i = 0; i < subMoney.length; i++) {
        if (subMoney[i].indexOf('~') > -1) {
          newMoney.push(subMoney[i])
        } else if (subMoney[i].indexOf(',') > -1) {
          let cusMoney = subMoney[i].replace(/\[|]/g, '').split(',')
          let m = Number(cusMoney[0]) / 10000
          let n = Number(cusMoney[1]) / 10000
          newMoney.push('custome')
          newCusMoney = m + '-' + n
        }
      }
    }
    if (param.bidWinningMoney) {
      let subMoney = param.bidWinningMoney.split('|')
      for (let i = 0; i < subMoney.length; i++) {
        if (subMoney[i].indexOf('~') > -1) {
          newBidMoney.push(subMoney[i])
        } else if (subMoney[i].indexOf(',') > -1) {
          let cusMoney = subMoney[i].replace(/\[|]/g, '').split(',')
          let m = Number(cusMoney[0]) / 10000
          let n = Number(cusMoney[1]) / 10000
          newBidMoney.push('custome')
          newCusBidMoney = m + '-' + n
        }
      }
    }
    this.setState(
      {
        pageNo: 0,
        loading: true,
        title: param?.title || param?.queryText || '',
        productName: param.productName ? param.productName : '',
        titleTags:
          param?.title || param?.queryText || ''
            ? (param?.title || param?.queryText || '').split(/\s+|\|/).filter(Boolean)
            : [],
        productTags: param.productName || '' ? param.productName.split(/\s+|\|/).filter(Boolean) : [],
        buyGive: newBuy && newBuy.length > 0 ? newBuy : [],
        winGive: newWin && newWin.length > 0 ? newWin : [],
        showGive: newGive && newGive.length > 0 ? newGive : [],
        defaultIndustry: newIndustry ? newIndustry : [],
        defaultRegion: newRegion ? newRegion : [],
        releaseState: param.oppTime ? (param.oppTime.indexOf('~') > -1 ? param.oppTime : 'custome') : '',
        // @ts-expect-error ttt
        defaultTime: cusReleaseTime ? cusReleaseTime : '',
        moneyList: newMoney && newMoney.length > 0 ? newMoney : [],
        customValue: newCusMoney ? newCusMoney : '',
        bidMoney: newBidMoney && newBidMoney.length > 0 ? newBidMoney : [],
        customValueBid: newCusBidMoney ? newCusBidMoney : '',
        subBotton: false,
      },
      () => {
        this.getData({
          purchasingUnit: newBuy.join('|'),
          participateUnit: newGive.join('|'),
          bidWinnerUnit: newWin.join('|'),
        })
        //  通过订阅的id获取公司名称，并更新下拉输入框状态
        processAllCompanyNames(newGive, newWin, newBuy, this.setState.bind(this))
      }
    )
  }
  deleteSingleBidHis = (id) => {
    //删除单条最近浏览
    if (id) {
      let param = {
        type: 'one',
        detailId: id,
      }
      deleteBidSingleHis(param).then((res) => {
        let { historyList } = this.state
        let newArr = []
        if (res.Data == 'success') {
          for (let i = 0; i < historyList.length; i++) {
            if (historyList[i].detailId !== id) {
              newArr.push(historyList[i])
            }
          }
          this.setState({
            historyList: newArr,
          })
        }
      })
    }
  }
  deleteSubscribeOne = (id) => {
    //删除单条订阅
    if (id) {
      let param = {
        conditionIds: id,
      }
      return deleteSingleSubscribe(param).then((res) => {
        let { subscribeList } = this.state
        let newArr = []
        if (res.ErrorCode == '0') {
          for (let i = 0; i < subscribeList.length; i++) {
            if (subscribeList[i].id !== id) {
              newArr.push(subscribeList[i])
            }
          }
          this.setState({
            subscribeList: newArr,
            nowSubId: '',
            nowSubName: '',
            visible: false,
            subBotton: true,
          })
        } else {
          this.setState({
            visible: false,
          })
          message.error(intl('349079', '清除失败!'))
        }
      })
    }
  }
  handleOk = () => {
    //弹窗点击确定时的回调
    let { modalType, addNewSubName, subscribeList, newEmail, edit, downloadValue, nowSubId, emailAlert } = this.state
    let userType = this.getUserPackage()
    switch (modalType) {
      case 'addNewSub':
        //添加一条订阅
        let flag = false
        for (let i = 0; i < subscribeList.length; i++) {
          if (subscribeList[i].conditionName == addNewSubName) {
            flag = true
          }
        }
        this.setState(
          {
            addSubNameWarning: flag
              ? intl('349134', '该招投标名称已经存在')
              : addNewSubName.length == 0
                ? intl('349135', '"订阅名称"字段为必填字段，长度最多为30个字')
                : '',
            emailError: edit ? (!wftCommon.validateEmail(newEmail) ? true : false) : false,
          },
          () => {
            if (flag || addNewSubName.length == 0 || (edit && !wftCommon.validateEmail(newEmail))) {
              return false
            } else {
              let param = this.getParam()
              let { newEmail, addNewSubName, subscribeList } = this.state
              let userType = this.getUserPackage()
              let subParam = {
                emailReminder: emailAlert ? 1 : 0,
                conditionName: addNewSubName,
                receivers: newEmail ? newEmail : '',
                queryCondition: JSON.stringify(param),
              }
              console.log(userType)
              if (userType == 'svip') {
                if (subscribeList.length < 100) {
                  this.getNewSubscribeList(subParam)
                } else {
                  this.overrunSubscriber()
                }
              } else if (userType == 'vip') {
                if (subscribeList.length < 10) {
                  this.getNewSubscribeList(subParam)
                } else {
                  this.overrunSubscriber()
                }
              } else {
                if (subscribeList.length < 5) {
                  this.getNewSubscribeList(subParam)
                } else {
                  this.overrunSubscriber()
                }
              }

              // this.setState({ visible: false});
            }
          }
        )
        break
      case 'overrunSub':
        // 用户可订阅条件数超限
        this.setState(
          {
            visible: false,
          },
          () => wftCommon.jumpJqueryPage('Company.html#/versionPrice?nosearch=1')
        )
        break

      case 'downloadBid':
        //导出下载
        let start = +downloadValue.split('-')[0]
        let end = +downloadValue.split('-')[1]
        let rangeFlag = false
        let maxFlag = false
        let couldFlag = false
        if ((!start && !end) || start > end || !end) {
          this.setState({
            dowmloadOverRun: false,
            downloadRangWarning: true,
            downloadWantMore: false,
          })
          rangeFlag = false
        } else {
          rangeFlag = true
        }
        // @ts-expect-error ttt
        if (parseInt(end) - parseInt(start ? start : 0) > wftCommon.bidDownloadUserSize(userType)) {
          this.setState({
            dowmloadOverRun: true,
            downloadRangWarning: false,
            downloadWantMore: false,
          })
          couldFlag = false
        } else {
          couldFlag = true
        }
        if (end >= 20000 || start >= 20000) {
          this.setState({
            dowmloadOverRun: false,
            downloadRangWarning: false,
            downloadWantMore: true,
          })
          maxFlag = false
        } else {
          maxFlag = true
        }

        if (rangeFlag && maxFlag && couldFlag) {
          const param = this.getParam()
          const newParam = {
            ...param, // @ts-expect-error ttt
            from: start ? parseInt(start) - 1 : 0,
          } // @ts-expect-error ttt
          newParam.pageSize = start ? parseInt(end) - parseInt(start) + 1 : parseInt(end)
          console.log('🚀 ~ SearchBidNew ~ newParam:', newParam)
          downloadBid(newParam).then((res) => {
            if (res.ErrorCode == '0') {
              this.setState(
                {
                  visible: false,
                },
                () => {
                  wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
                }
              )
            } else {
              message.warning(intl('478689', '导出出错'))
            }
          })
        }
        break
      case 'delSingleSub':
        console.log(nowSubId)
        this.deleteSubscribeOne(nowSubId).then(() => {
          this.bidHistoryRef.current.getAllSub()
        })
        break
    }
  }
  getNewSubscribeList = (param) => {
    //发起订阅请求
    let { newPrelist, newBiddinglist, newDeallist } = this.state
    let newArr = []
    let newStage = []
    if (newPrelist.length == 1) {
      newArr.push('预审阶段')
    } else if (newPrelist.length > 0) {
      newStage.push('预审阶段')
    }
    if (newBiddinglist.length == 8) {
      newArr.push('招标阶段')
    } else if (newBiddinglist.length > 0) {
      newStage.push('招标阶段')
    }
    if (newDeallist.length == 6) {
      newArr.push('结果阶段')
    } else if (newDeallist.length > 0) {
      newStage.push('结果阶段')
    }
    if (newStage.length == newArr.length) {
      let queryCondition = JSON.parse(param.queryCondition)
      queryCondition.biddingStage = newArr.join('|')
      param.queryCondition = JSON.stringify(queryCondition)
    } else {
      let queryCondition = JSON.parse(param.queryCondition)
      queryCondition.biddingStage = ''
      param.queryCondition = JSON.stringify(queryCondition)
    }
    addBidSubscribe(param).then((res) => {
      if (res.ErrorCode == '0') {
        message.success(intl('250581', '添加成功!'))
        this.setState(
          {
            visible: false,
            edit: false,
            addNewSubName: '',
            emailAlert: true,
            addSubNameWarning: '',
            newEmail: '',
            emailError: false,
            alreadyEmail: '',
            nowSubId: res.Data.id,
            nowSubName: res.Data.conditionName,
            subBotton: false,
          },
          () => {
            if (this.bidHistoryRef.current) {
              this.bidHistoryRef.current.getAllSub() // 调用 BidHistoryFocus 的方法
            }
          }
        )
      } else {
        message.warning(res.ErrorMessage)
      }
    })
  }
  overrunSubscriber = () => {
    //用户超限提醒，发起弹窗
    this.setState(
      {
        visible: false,
      },
      () => {
        this.setState(
          {
            modalType: 'overrunSub',
          },
          () => {
            this.setState({
              visible: true,
            })
          }
        )
      }
    )
  }
  deleteBidHisAll = () => {
    //清除所有最近浏览
    let deletetParam = {
      type: 'all',
    }
    deleteBidSingleHis(deletetParam).then((res) => {
      if (res.Data == 'success') {
        this.setState({
          historyList: [],
        })
      }
    })
  }
  handleCancel = () => {
    //关闭弹窗
    this.setState({
      visible: false,
      edit: false,
      addNewSubName: '',
      emailAlert: true,
      addSubNameWarning: '',
      newEmail: '',
      emailError: false,
      alreadyEmail: '',
    })
  }
  focusQuery = (key) => {
    //关键词输入框失焦后，历史搜索框处理
    // @ts-expect-error ttt
    this.setState((prev) => {
      const has =
        key === 'title'
          ? (prev as any).titleTags?.length
          : key === 'productName'
            ? (prev as any).productTags?.length
            : (prev as any).title

      return { [showMap[key]]: has ? 'none' : 'block' }
    })
  }
  moneyChange = (e, list, value, alertMessage, warningMessage) => {
    console.log('🚀 ~ SearchBidNew ~ e:', e)
    //招标金额及中标金额选择回调
    let hasCus = false
    for (let i = 0; i < e.length; i++) {
      if (e[i] == 'custome') {
        hasCus = !hasCus
      }
    }
    if (hasCus) {
      let first = Number(this.state[value].split('-')[0])
      let second = Number(this.state[value].split('-')[1])
      if (first && second) {
        if (first > second) {
          message.warning(warningMessage)
          return false
        }
      }
    } // @ts-expect-error ttt
    this.setState({
      // [list]: hasCus ? ['custome'] : e
      [list]: e,
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }

  announcementChange = (e, indeterminate, checkAll, list, arrName) => {
    //公告类型选择后的回调
    console.log(e, indeterminate, checkAll, list, arrName)
    // @ts-expect-error ttt
    this.setState({
      [list]: e,
      [indeterminate]: !!e.length && e.length < allAnnoc[arrName].length,
      [checkAll]: e.length === allAnnoc[arrName].length,
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }

  customValueChange = (e, list, value) => {
    //自定义框回调处理

    const newArr = []
    for (let i = 0; i < this.state[list].length; i++) {
      newArr.push(this.state[list][i])
    }
    console.log(e)
    // @ts-expect-error ttt
    this.setState({
      [value]: e,
      [list]: e == value ? this.state[list] : newArr,
      nowSubId: '',
      nowSubName: '',
      subBotton: true,
    })
  }

  addSubName = (e) => {
    //输入新的订阅名称回调处理
    if (e.target.value.length > 30) {
      e.target.value.length = 30
    }
    this.setState({
      addNewSubName: e.target.value,
      addSubNameWarning: '',
    })
  }
  editEmail = (e) => {
    //邮箱编辑回调
    this.setState({
      newEmail: e.target.value,
      emailError: false,
    })
  }
  getNewEmail = () => {
    //获取订阅邮箱
    getBidSubscribeEmail().then((res) => {
      let email = ''
      let { edit } = this.state
      email = res.Data !== 'null' && res.Data ? wftCommon.emailHide(res.Data) : this.props.homeEmail
      if (!email) {
        edit = true
      }
      this.setState({
        alreadyEmail: email,
        edit: edit,
      })
    })
  }
  modalShow = () => {
    //弹窗内容展示
    const {
      modalType,
      edit,
      addNewSubName,
      emailAlert,
      addSubNameWarning,
      newEmail,
      emailError,
      alreadyEmail,
      subscribeList,
      downloadValue,
      dowmloadOverRun,
      downloadRangWarning,
      downloadWantMore,
      nowSubName,
    } = this.state
    let userType = this.getUserPackage()
    switch (modalType) {
      case 'addNewSub':
        // this.getNewEmail()
        return (
          <div className="subscribe-box">
            <span className="box-prompt">
              {intl('349075', '订阅后，我们将保存您已经选择的筛选条件，并为您推送最新符合条件的招投标公告')}
            </span>
            <br />
            <div className="bid-title">
              <span className="box-title">{intl('5026', '订阅名称')}</span>
              <Input
                placeholder={intl('349162', '请输入招投标名称，长度最多为30个字')}
                value={addNewSubName}
                onChange={this.addSubName}
                data-uc-id="fU47a_3sLr"
                data-uc-ct="input"
              />
            </div>
            {addSubNameWarning && addSubNameWarning.length > 0 ? (
              <span className="input-warning">{addSubNameWarning}</span>
            ) : null}
            <div className="email-alert">
              <Checkbox
                checked={emailAlert}
                onChange={(e) => this.setState({ emailAlert: e.target.checked })}
                data-uc-id="u0ncs_qbCn"
                data-uc-ct="checkbox"
              >
                {intl('121', '邮件提醒')}
              </Checkbox>
              {emailAlert ? (
                <div className="msg2-email">
                  <span className="email-to">{intl('349076', '发送至')}：</span>
                  {edit ? (
                    <Input
                      placeholder={intl('257723', '请输入邮箱地址')}
                      onChange={this.editEmail}
                      value={newEmail}
                      data-uc-id="_FD2nQB45h"
                      data-uc-ct="input"
                    />
                  ) : (
                    <span className="email-addr">
                      {alreadyEmail}
                      <NoteO
                        onClick={() => this.setState({ edit: true, newEmail: alreadyEmail })}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        data-uc-id="JyvGL1Fy4w"
                        data-uc-ct="noteo"
                      />
                    </span>
                  )}
                </div>
              ) : null}
            </div>
            {emailError ? (
              <span className="title-emial" style={{ color: 'red' }}>
                {intl('349117', '请输入正确的邮箱格式!')}
              </span>
            ) : null}
          </div>
        )
      case 'overrunSub':
        let user = ''
        let needType = ''
        let maxLen = ''
        if (userType == 'bs') {
          user = '普通用户'
          needType = '开通VIP会员'
          maxLen = '5'
        } else if (userType == 'vip') {
          user = 'VIP用户'
          needType = '开通SVIP会员'
          maxLen = '10'
        } else {
          user = 'SVIP用户'
          needType = '删除部分订阅'
          maxLen = '100'
        }
        return (
          <div>
            <span>
              作为{user}，仅可订阅{maxLen}个招投标条件，您已经订阅{subscribeList.length}个。如需订阅更多，请{needType}
              后使用
            </span>
          </div>
        )
      case 'downloadBid':
        let type = ''
        let userSize: any = ''
        if (userType == 'svip') {
          type = 'SVIP用户'
          userSize = 1000
        } else if (userType == 'vip') {
          type = 'VIP用户'
          userSize = 500
        } else {
          type = '普通用户'
          userSize = 0
        }
        return (
          <div className="download-box">
            <span>
              {type}每日最多导出{userSize}条数，请选择导出范围
            </span>
            <br />
            <NumberRangeOption
              min={downloadValue ? downloadValue.split('-')[0] : ''}
              max={downloadValue ? downloadValue.split('-')[1] : ''}
              changeOptionCallback={(e) => this.setState({ downloadValue: e })}
              fromBid
              changeInputAlert={() =>
                this.setState({
                  dowmloadOverRun: false,
                  downloadRangWarning: false,
                  downloadWantMore: false,
                })
              }
              unit={intl('149186', '条')}
              data-uc-id="iyJIJr1_yv"
              data-uc-ct="numberrangeoption"
            />
            {downloadRangWarning ? (
              <span className="download-warning">{intl('349119', '请输入正确的导出范围')}</span>
            ) : null}
            {downloadWantMore ? (
              <span className="download-warning">
                {intl('349137', '仅支持导出前20000条内的数据。如需导出更多，请联系客户经理进行数据定制。')}
              </span>
            ) : null}
            {dowmloadOverRun ? (
              <span className="download-warning">{intl('349138', '超出今日可导出数量！')}</span>
            ) : null}
          </div>
        )
      case 'delSingleSub':
        console.log(nowSubName)
        return (
          <div>
            {intl('349093', '确认要删除招投标订阅')} "{nowSubName}"?
          </div>
        )
    }
  }
  alertModal = (type) => {
    //根据不同type发起不同的弹窗
    if (type == 'addNewSub') {
      this.getNewEmail()
      this.getSubName()
    }
    console.log(this.state.nowSubId, this.state.nowSubName)
    this.setState(
      {
        modalType: type,
        downloadValue: '',
      },
      () => {
        this.setState({
          visible: true,
        })
      }
    )
  }

  reset = () => {
    //重置筛选框
    this.buyCom.deleteAllPre()
    this.winCom.deleteAllPre()
    this.bidWinnerCom.deleteAllPre()
    this.participateInputRef.current.clearSelection()
    this.purchaserInputRef.current.clearSelection()
    this.winnerInputRef.current.clearSelection()
    this.setState({
      title: '',
      productName: '',
      titleTags: [],
      productTags: [],
      moneyList: [],
      releaseState: '',
      defaultTime: [],
      customizationTime: '',
      pageNo: 0,
      visible: false,
      queryHisShow: 'none',
      announcement: [],
      customValue: '',
      customValueBid: '',
      bidMoney: [],
      subBotton: true,
      modalType: '',
      edit: false,
      addNewSubName: '',
      emailAlert: true,
      addSubNameWarning: '',
      newEmail: '',
      emailError: false,
      alreadyEmail: '',
      buyGive: [],
      winGive: [],
      showGive: [],
      defaultRegion: [],
      defaultIndustry: [],
      downloadValue: '',
      downloadRangWarning: false,
      downloadWantMore: false,
      dowmloadOverRun: false,
      nowSubId: '',
      nowSubName: '',
      newPrelist: [],
      newBiddinglist: [],
      newDeallist: [],
      preIndeterminate: false,
      biddingIndeterminate: false,
      dealIndeterminate: false,
      preCheckAll: false,
      biddingCheckAll: false,
      dealCheckAll: false,

      participateInputValues: [], // 参与单位
      purchaserInputValues: [], // 采购单位
      winnerInputValues: [], // 中标单位
    })
  }
  disabledDate = (current) => {
    //日期选择框不允许选择未来日期
    return current && current >= dayjs().endOf('day')
  }

  render() {
    let {
      errorCode,
      resultList,
      loading,
      loadingList,
      customValue,
      keywordHis,
      productsHis,
      queryHisShow,
      productHisShow,
      customValueBid,
      recommend,
    } = this.state
    let resultAlert = recommend ? intl('308674', '为您推荐%个符合条件的公告') : intl('284975', '找到%条符合条件的公告')

    resultAlert = resultAlert.replace(
      /%/,
      '<span style="color:#333">' +
        // @ts-expect-error ttt
        (this.state.resultNum && this.state.resultNum > 0
          ? wftCommon.formatMoney(this.state.resultNum, '', '', 1)
          : '0') +
        '</span>'
    )
    return (
      <div className="search_bid">
        {this.noBread || wftCommon.isBaiFenTerminalOrWeb() ? null : (
          <div className="bread-crumb">
            <div className="bread-crumb-content">
              <span
                className="last-rank"
                onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
                data-uc-id="Tr7q-UbDmv"
                data-uc-ct="span"
              >
                {intl('19475', '首页')}
              </span>
              <i></i>
              <span>{intl('271633', '招投标')}</span>
            </div>
          </div>
        )}
        <div className="wrapper">
          <div className="search_l">
            <div className="search-condition">
              <h3 className="condition-title">{intl('228333', '招投标查询')}</h3>

              <div className="condition-area">
                <span className="condition-title-span">{intl('90845', '公告标题')}：</span>
                <div id="queryHisList">
                  <SpaceTagInput
                    value={this.state.titleTags}
                    onChange={(vals) => this.handleTitleTagsChange(vals)}
                    placeholder={intl('416859', '请输入公告标题关键字')}
                    onFocus={() => this.focusQuery('title')}
                    onBlur={() => setTimeout(() => this.setState({ queryHisShow: 'none' }), 0)}
                    data-uc-id="af-F6kxGzl"
                    data-uc-ct="select"
                  />
                  <div className="historySearch" style={{ display: queryHisShow }}>
                    {keywordHis && keywordHis.length > 0 ? <div>{intl('437396', '历史搜索')}</div> : null}
                    {keywordHis && keywordHis.length > 0
                      ? keywordHis.map((item, index) => {
                          return (
                            <div
                              onMouseDown={() => {
                                this.setState((prev: any) => {
                                  const next = Array.from(
                                    new Set([...(prev.titleTags || []), ...(item?.name?.split('|') || [])])
                                  )
                                  return { titleTags: next, title: next.join('|'), queryHisShow: 'none' }
                                })
                              }}
                              key={index}
                              data-uc-id="BRVhItD52G"
                              data-uc-ct="div"
                              data-uc-x={index}
                            >
                              {item.name}
                            </div>
                          )
                        })
                      : null}
                  </div>
                </div>
              </div>
              <div className="condition-area">
                <span className="condition-title-span">{intl('327495', '招标产品')}：</span>
                <div id="queryHisList">
                  <SpaceTagInput
                    value={this.state.productTags}
                    onChange={(vals) => this.handleProductTagsChange(vals)}
                    placeholder={intl(
                      '284955',
                      '请输入招投标项目包含的关键词，并用空格隔开多个关键词，示例：大数据 ��电池'
                    )}
                    onFocus={() => this.focusQuery('productName')}
                    onBlur={() => setTimeout(() => this.setState({ productHisShow: 'none' }), 0)}
                    data-uc-id="f4faEbRntWA"
                    data-uc-ct="select"
                  />
                  <div className="historySearch" style={{ display: productHisShow }}>
                    {productsHis && productsHis.length > 0 ? <div>{intl('437396', '历史搜索')}</div> : null}
                    {productsHis && productsHis.length > 0
                      ? productsHis.map((item, index) => {
                          return (
                            <div
                              onMouseDown={() =>
                                this.setState((prev: any) => {
                                  const next = Array.from(
                                    new Set([...(prev.productTags || []), ...(item?.name?.split('|') || [])])
                                  )
                                  return { productTags: next, productName: next.join('|'), productHisShow: 'none' }
                                })
                              }
                              key={index}
                              data-uc-id="and7wBqgOPZ"
                              data-uc-ct="div"
                              data-uc-x={index}
                            >
                              {item.name}
                            </div>
                          )
                        })
                      : null}
                  </div>
                </div>
              </div>

              <div className="condition-area">
                <span className="condition-title-span">{intl('416854', '参与单位')}：</span>
                <div className="condition-pre">
                  <PreSearchInput
                    onRef={(node) => (this.winCom = node)}
                    onChange={() => {
                      this.setState({
                        subBotton: true,
                      })
                    }}
                    placeholder={intl('313033', '请输入目标单位名称')}
                    state={this.state.showGive}
                    historyList={this.state.partHis}
                    style={{ display: 'none' }}
                    data-uc-id="olwOyFUIWM6"
                    data-uc-ct="presearchinput"
                  />
                  <CorpPresearch
                    placeholder={intl('313033', '请输入目标单位名称')}
                    onSelectChange={(value, option) => {
                      const values = option?.map((item) => {
                        return item?.value + '|' + item?.data?.corpId
                      })
                      setTimeout(() => {
                        this.setState({ participateInputValues: values })
                      }, 50)
                    }}
                    widthAuto={true}
                    minWidth={'100%'}
                    searchMode="select"
                    ref={this.participateInputRef}
                    needHistory={true}
                    module={CorpPresearchModule.BID_SEARCH_PARTICIPATING_UNIT}
                    data-uc-id="3ZW4IFBc0Qo"
                    data-uc-ct="corppresearch"
                    initialSelectedValues={this.state.participateInputInitialLabels}
                  />
                </div>
              </div>

              <div className="condition-area">
                <div className="condition-region">
                  <span className="region-span">{intl('142476', '采购单位')}：</span>
                  <div className="filter-item">
                    <PreSearchInput
                      onChange={() => {
                        this.setState({
                          subBotton: true,
                        })
                      }}
                      onRef={(node) => (this.buyCom = node)}
                      placeholder={intl('313053', '请输入采购单位名称')}
                      state={this.state.buyGive}
                      historyList={this.state.purchaseHis}
                      style={{ display: 'none' }}
                      data-uc-id="3YbcnM2Hju9"
                      data-uc-ct="presearchinput"
                    />

                    <CorpPresearch
                      placeholder={intl('313053', '请输入采购单位名称')}
                      onSelectChange={(value, option) => {
                        console.log('onSelectChange - value:', value)
                        console.log('onSelectChange - option:', option)
                        const values = option?.map((item) => {
                          return item?.value + '|' + item?.data?.corpId
                        })
                        setTimeout(() => {
                          this.setState({ purchaserInputValues: values })
                        }, 50)
                      }}
                      widthAuto={true}
                      minWidth={'100%'}
                      searchMode="select"
                      ref={this.purchaserInputRef}
                      needHistory={true}
                      module={CorpPresearchModule.BID_SEARCH_PURCHASING_UNIT}
                      data-uc-id="yudxxSrk8uc"
                      data-uc-ct="corppresearch"
                      initialSelectedValues={this.state.purchaserInputInitialLabels}
                    />
                  </div>
                </div>
                <div className="condition-industry">
                  <span className="region-span">{intl('257823', '中标单位')}：</span>
                  <div className="filter-item">
                    <PreSearchInput
                      onChange={() => {
                        this.setState({
                          subBotton: true,
                        })
                      }}
                      onRef={(node) => (this.bidWinnerCom = node)}
                      placeholder={intl('416838', '请输入中标单位名称')}
                      state={this.state.winGive}
                      historyList={this.state.winHis}
                      style={{ display: 'none' }}
                      data-uc-id="C78XEN41NPF"
                      data-uc-ct="presearchinput"
                    />

                    <CorpPresearch
                      placeholder={intl('416838', '请输入中标单位名称')}
                      onSelectChange={(value, option) => {
                        const values = option?.map((item) => {
                          return item?.value + '|' + item?.data?.corpId
                        })
                        setTimeout(() => {
                          this.setState({ winnerInputValues: values })
                        }, 50)
                      }}
                      widthAuto={true}
                      minWidth={'100%'}
                      searchMode="select"
                      ref={this.winnerInputRef}
                      needHistory={true}
                      module={CorpPresearchModule.BID_SEARCH_BID_WINNER}
                      data-uc-id="-pMjDJameBo"
                      data-uc-ct="corppresearch"
                      initialSelectedValues={this.state.winnerInputInitialLabels}
                    />
                  </div>
                </div>
              </div>

              <div className="condition-area">
                <div className="condition-region">
                  <span className="region-span">{intl('257786', '招标地区')}：</span>
                  <WindCascade
                    placeholder={intl('19498', '全部')}
                    options={newMap}
                    fieldNames={{ label: 'name', value: 'name', children: 'node' }}
                    value={this.state.defaultRegion}
                    className="filter-item"
                    showSearch
                    onChange={(e) => this.cascaderChange(e, 'areaCodes', 'defaultRegion')}
                    data-uc-id="kERuk6rVrtn"
                    data-uc-ct="windcascade"
                  />
                </div>
                <div className="condition-industry">
                  <span className="region-span">{intl('257690', '国标行业')}：</span>
                  <WindCascade
                    placeholder={intl('19498', '全部')}
                    options={globalIndustryOfNationalEconomy4}
                    fieldNames={{ label: 'name', value: 'code', children: 'node' }}
                    className="filter-item"
                    showSearch
                    value={this.state.defaultIndustry}
                    onChange={(e) => this.cascaderChange(e, 'compIndustry', 'defaultIndustry')}
                    data-uc-id="W6XmhsEQzpx"
                    data-uc-ct="windcascade"
                  />
                </div>
              </div>

              <div className="condition-area">
                <span className="condition-title-span">{intl('257807', '项目阶段')}：</span>
                <div style={{ height: '32px', lineHeight: '32px' }}>
                  <Checkbox
                    indeterminate={this.state.preIndeterminate}
                    checked={this.state.preCheckAll}
                    onChange={(e) => this.stageChange(e, 'preIndeterminate', 'preCheckAll', 'newPrelist', 'preStage')}
                    data-uc-id="ruvxBaMAhP"
                    data-uc-ct="checkbox"
                  >
                    {intl('257788', '预审阶段')}
                  </Checkbox>
                  <Checkbox
                    indeterminate={this.state.biddingIndeterminate}
                    checked={this.state.biddingCheckAll}
                    onChange={(e) =>
                      this.stageChange(e, 'biddingIndeterminate', 'biddingCheckAll', 'newBiddinglist', 'biddingStage')
                    }
                    data-uc-id="ZH7Wj6gECB"
                    data-uc-ct="checkbox"
                  >
                    {intl('257789', '招标阶段')}
                  </Checkbox>
                  <Checkbox
                    indeterminate={this.state.dealIndeterminate}
                    checked={this.state.dealCheckAll}
                    onChange={(e) =>
                      this.stageChange(e, 'dealIndeterminate', 'dealCheckAll', 'newDeallist', 'dealStage')
                    }
                    data-uc-id="nWIG6ntJlH"
                    data-uc-ct="checkbox"
                  >
                    {intl('257808', '结果阶段')}
                  </Checkbox>
                </div>
              </div>

              {this.state.newPrelist.length > 0 ||
              this.state.newBiddinglist.length > 0 ||
              this.state.newDeallist.length > 0 ? (
                <div className="condition-area">
                  <span className="condition-title-span">{intl('6196', '公告类型')}：</span>
                  <div id="AnnouncementType">
                    {this.state.newPrelist.length > 0 ? (
                      <CheckboxGroup
                        options={programStatus[0].children}
                        value={this.state.newPrelist}
                        onChange={(e) =>
                          this.announcementChange(e, 'preIndeterminate', 'preCheckAll', 'newPrelist', 'preStage')
                        }
                        data-uc-id="Zft3lG4MIv"
                        data-uc-ct="checkboxgroup"
                      />
                    ) : null}
                    {this.state.newBiddinglist.length > 0 ? (
                      <CheckboxGroup
                        options={programStatus[1].children}
                        value={this.state.newBiddinglist}
                        onChange={(e) =>
                          this.announcementChange(
                            e,
                            'biddingIndeterminate',
                            'biddingCheckAll',
                            'newBiddinglist',
                            'biddingStage'
                          )
                        }
                        data-uc-id="_dTHJIDfvj"
                        data-uc-ct="checkboxgroup"
                      />
                    ) : null}
                    {this.state.newDeallist.length > 0 ? (
                      <CheckboxGroup
                        options={programStatus[2].children}
                        value={this.state.newDeallist}
                        onChange={(e) =>
                          this.announcementChange(e, 'dealIndeterminate', 'dealCheckAll', 'newDeallist', 'dealStage')
                        }
                        data-uc-id="tSkKkF8y9f"
                        data-uc-ct="checkboxgroup"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className={`${StylePrefix}--announce-date condition-area`}>
                <span className={`condition-title-span ${StylePrefix}--announce-date--title`}>
                  {intl('257639', '公告日期')}：
                </span>
                <div className={`${StylePrefix}--announce-date--filter`}>
                  <RadioGroup
                    className={`${StylePrefix}--announce-date--radio`}
                    onChange={this.releaseDateChange}
                    value={this.state.releaseState}
                    data-uc-id="CToLBrDoPB"
                    data-uc-ct="radiogroup"
                  >
                    {releaseDate.map((item, index) => {
                      return (
                        <Radio
                          value={item.value}
                          key={index}
                          data-uc-id="hced4m6zFW5"
                          data-uc-ct="radio"
                          data-uc-x={index}
                        >
                          {item.name}
                        </Radio>
                      )
                    })}
                    <Radio value="custome" data-uc-id="p6FVOPIFD-k" data-uc-ct="radio">
                      {intl('25405', '自定义')}
                    </Radio>
                  </RadioGroup>
                  <RangePicker
                    className={`${StylePrefix}--announce-date--picker`}
                    placeholder={[intl('9524', '开始时间'), intl('138688', '截止时间')]}
                    onChange={this.onTimeChange}
                    value={this.state.defaultTime}
                    allowClear
                    disabledDate={this.disabledDate}
                    data-uc-id="X_vdWcZbdw"
                    data-uc-ct="rangepicker"
                  />
                </div>
              </div>

              <div className="condition-area">
                <span className="condition-title-span">{intl('260900', '招标预算：')}</span>
                <div style={{ height: '32px', lineHeight: '32px' }} className="money">
                  <CheckboxGroup
                    value={this.state.moneyList}
                    onChange={(e) =>
                      this.moneyChange(
                        e,
                        'moneyList',
                        'customValue',
                        intl('349113', '请填写招标预算自定义范围'),
                        intl('349114', '招标预算范围不正确')
                      )
                    }
                    data-uc-id="oMrinn2IMh"
                    data-uc-ct="checkboxgroup"
                  >
                    {money.map((item, index) => {
                      return (
                        <Checkbox
                          value={item.value}
                          key={index}
                          data-uc-id="iQ8eDSEq4k"
                          data-uc-ct="checkbox"
                          data-uc-x={index}
                        >
                          {item.label}
                          {item.value == 'custome' ? (
                            <NumberRangeOption
                              className="sc-bcXHqe"
                              min={customValue ? customValue.split('-')[0] : ''}
                              max={customValue ? customValue.split('-')[1] : ''}
                              changeOptionCallback={(e) => this.customValueChange(e, 'moneyList', 'customValue')}
                              unit={intl('420221', '万')}
                              data-uc-id="MclymaViQGq"
                              data-uc-ct="numberrangeoption"
                            />
                          ) : null}
                        </Checkbox>
                      )
                    })}
                  </CheckboxGroup>
                </div>
              </div>

              {this.state.newDeallist.length > 0 ? (
                <div className="condition-area">
                  <span className="condition-title-span">{intl('260907', '中标金额：')}</span>
                  <div style={{ height: '32px', lineHeight: '32px' }} className="money">
                    <CheckboxGroup
                      value={this.state.bidMoney}
                      onChange={(e) =>
                        this.moneyChange(
                          e,
                          'bidMoney',
                          'customValueBid',
                          intl('349115', '请填写中标金额自定义范围'),
                          intl('349116', '中标金额范围不正确')
                        )
                      }
                      data-uc-id="NuJE2sKtZt"
                      data-uc-ct="checkboxgroup"
                    >
                      {biddingMoney.map((item, index) => {
                        return (
                          <Checkbox
                            value={item.value}
                            key={index}
                            data-uc-id="Et6HSN7Xoq"
                            data-uc-ct="checkbox"
                            data-uc-x={index}
                          >
                            {item.label}
                            {item.value == 'custome' ? (
                              <NumberRangeOption
                                className="sc-bcXHqe"
                                min={customValueBid ? customValueBid.split('-')[0] : ''}
                                max={customValueBid ? customValueBid.split('-')[1] : ''}
                                changeOptionCallback={(e) => this.customValueChange(e, 'bidMoney', 'customValueBid')}
                                unit={intl('420221', '万')}
                                data-uc-id="wqXEsEDoVya"
                                data-uc-ct="numberrangeoption"
                              />
                            ) : null}
                          </Checkbox>
                        )
                      })}
                    </CheckboxGroup>
                  </div>
                </div>
              ) : null}
              <div className="condition-area" id="conditionButton">
                <div style={{ float: 'right' }}>
                  <Button
                    size="large"
                    onClick={() => this.alertModal(this.state.subBotton ? 'addNewSub' : 'delSingleSub')}
                    data-uc-id="u0cz8RR8ej"
                    data-uc-ct="button"
                  >
                    {this.state.subBotton ? intl('349136', '立即订阅') : intl('229017', '取消订阅')}
                  </Button>
                  <Button size="large" onClick={this.reset} data-uc-id="vMSriaKhKL" data-uc-ct="button">
                    {intl('138490', '重置条件')}
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => this.setState({ pageNo: 0 }, () => this.getData())}
                    data-uc-id="lybj1hlx0C"
                    data-uc-ct="button"
                  >
                    {intl('257693', '应用筛选')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="search-result">
              <div className="result-r">
                <InnerHtml html={resultAlert} className="searchResultNum" />
                {/* <p dangerouslySetInnerHTML={{ __html: resultAlert }}></p> */}
                <div className="operation-area">
                  <Checkbox onChange={this.handleAttachChange} data-uc-id="yVWKeOIa1v" data-uc-ct="checkbox">
                    {intl('410222', '仅看有附件公告')}
                  </Checkbox>
                  <Select
                    placeholder="默认排序"
                    style={{ width: 125, height: '28px' }}
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.selectValue}
                    data-uc-id="h8emP3vnQ"
                    data-uc-ct="select"
                  >
                    {bidResultOption.map(({ sort, key }) => {
                      return (
                        <Option key={key} data-uc-id={`_TIExiPJ7SW${key}`} data-uc-ct="option" data-uc-x={key}>
                          {sort}
                        </Option>
                      )
                    })}
                  </Select>
                  {!wftCommon.is_overseas_config ? (
                    <Button
                      icon={
                        <DownloadO
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                          data-uc-id="pvxvPh-hH"
                          data-uc-ct="downloado"
                        />
                      }
                      style={{ marginLeft: 12 }}
                      onClick={() => this.alertModal('downloadBid')}
                      data-uc-id="TzJ487O6BF"
                      data-uc-ct="button"
                    >
                      {intl('4698', '导出数据')}
                    </Button>
                  ) : null}
                </div>
              </div>
              {/* 搜索结果列表 */}
              <CardList
                errorCode={errorCode}
                loading={loading}
                loadingMore={loadingList}
                onLoadMore={this.loadMore}
                data={resultList}
                refetch={this.getData}
                render={(item, index) => <BidCard item={item} key={index} />}
                data-uc-id="6TLjMg5Y9pw"
                data-uc-ct="cardlist"
              />
            </div>
          </div>
          <div className="history-right">
            {/* 我的订阅 */}
            <BidHistoryFocus
              ref={this.bidHistoryRef}
              onApplySub={(params, name, id) => {
                // 设置当前取消订阅的名称
                this.setState({
                  nowSubId: id,
                  nowSubName: name,
                })
                // 调用取消订阅
                this.callBackSub(params)
              }}
              data-uc-id="BhLK6ys1gg7"
              data-uc-ct="bidhistoryfocus"
            />
            {/* 最近浏览 */}
            <HistoryFocusList />
          </div>
        </div>
        {this.state.visible ? (
          <Modal
            title={intl('349133', '招投标订阅')}
            visible={this.state.visible}
            width={this.state.modalType == 'addNewSub' ? '575px' : '520px'}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            data-uc-id="vWjR-Qm5f-X"
            data-uc-ct="modal"
          >
            {this.modalShow()}
          </Modal>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    homeEmail: state.home.userPackageinfo ? state.home.userPackageinfo.email : '',
    homePackageName: state.home.userPackageinfo ? state.home.userPackageinfo.packageName : '',
  }
}

const mapDispatchToProps = () => {}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBidNew)
