import { Button, Checkbox, DatePicker, Empty, Input, Modal, Radio, Select, Spin } from '@wind/wind-ui'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { pointBuriedGel } from '../../api/configApi'
import { deleteAllJobHis, deleteSingleJobHis, getJobHistory, getJobSearch } from '../../api/searchListApi'
import { addSearchHistory, getSearchHistoryAndSlice } from '../../api/services/history.ts'
import { HistoryList } from '../../components/searchListComponents/searchListComponents'
import PreSearchInput from '../../components/singleSearch/preSearchInput.tsx'
import { wftCommon } from '../../utils/utils'

import { WindCascadeFieldNamesCommon } from '@/components/cascade/type'
import { WindCascade } from '@/components/cascade/WindCascade'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { globalIndustryOfNationalEconomy2 } from '@/utils/industryOfNationalEconomyTree'
import { message } from '@wind/wind-ui'
import { jobResultOption } from '../../handle/searchConfig'
import { newMap } from '../../handle/searchConfig/newMap'
import { setPageTitle } from '../../handle/siteTitle'
import intl from '../../utils/intl'
import { eduReq, expReq, releaseDate } from './config.ts'
import './SearchJob.less'
import { SearchJobProps, SearchJobState } from './type.ts'

const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const CheckboxGroup = Checkbox.Group

const StylePrefix = 'search-job'

class SearchBidNew extends React.Component<SearchJobProps, SearchJobState> {
  private child: any

  constructor(props) {
    super(props)
    this.state = {
      pageno: 0,
      pagesize: 10,
      loading: true,
      applySearchLoading: false,
      loadingList: false,
      allFilter: [],
      queryText: '',
      compIndustry: [],
      areaCodes: [],
      dateAllow: true,
      defaultTime: [],
      defaultRegion: [],
      defaultIndustry: [],
      oppTime: '',
      expIndeterminate: false,
      expCheckAll: false,
      expList: [],
      eduIndeterminate: false,
      eduCheckAll: false,
      eduList: [],
      releaseState: '~30',
      preKeyword: '',
      preList: [],
      showPre: [],
      selectValue: '',
      customizationTime: '',
      pageNo: 0,
      resultNum: '--',
      errorCode: '',
      resultList: [],
      historyList: [],
      visible: false,
      keywordHis: [],
      queryHisShow: 'none',
      recommend: true,
      companyHis: [],
    }
    this.child = React.createRef()
  }

  componentDidUpdate = () => {
    setPageTitle('JobSearch')
  }

  componentDidMount = () => {
    this.getData()
    this.getSearchHistory()
    this.getCompanySearchHistory()
    const hisParam = {
      type: 'recruit_detail',
      isKeyWord: 0,
    }
    getJobHistory(hisParam).then((res) => {
      if (res.ErrorCode == 0 && res.Data && res.Data.length) {
        if (res.Data.length > 8) {
          res.Data.length = 8
        }
        this.setState({
          historyList: res.Data,
        })
      }
    })

    pointBuriedGel('922602100878', '进入招聘搜索页', 'searchJobLoading')
  }

  getSearchHistory = () => {
    getSearchHistoryAndSlice('RECRUITMENT_SEARCH_POSITION').then((res) => {
      this.setState({
        keywordHis: res,
      })
    })
  }

  getCompanySearchHistory = () => {
    getSearchHistoryAndSlice('RECRUITMENT_SEARCH_COMPANY').then((res) => {
      this.setState({
        companyHis: res,
      })
    })
  }

  showModal = () => {
    this.setState({ visible: true })
  }
  scroll = (event) => {
    //触底加载

    const { pageNo, resultNum } = this.state
    const { clientHeight, scrollTop, scrollHeight } = event.target
    if (clientHeight + scrollTop >= scrollHeight) {
      if ((pageNo + 1) * 10 < parseInt(resultNum)) {
        setTimeout(() => {
          this.setState({ pageNo: pageNo + 1, loadingList: true }, () => this.getData())
        }, 600)
      }
    }
  }
  eduRadioChange = (e, list, indeterminate, checkAll, arr) => {
    // @ts-expect-error ttt
    this.setState({
      [list]: e,
      [indeterminate]: !!e.length && e.length < arr.length,
      [checkAll]: e.length === arr.length,
    })
  }
  eduOnchengeAll = (e, list, indeterminate, checkAll, arr) => {
    const newArr = []
    for (let i = 0; i < arr.length; i++) {
      newArr.push(arr[i].value)
    }
    // @ts-expect-error ttt
    this.setState({
      [list]: e.target.checked ? newArr : [],
      [indeterminate]: false,
      [checkAll]: e.target.checked,
    })
  }
  disabledDate = (current) => {
    return current && current >= moment().endOf('day')
  }

  releaseDateChange = (e) => {
    let { defaultTime } = this.state
    console.log(e.target.value)
    if (e.target.value !== 'custome') {
      // @ts-expect-error ttt
      defaultTime = ''
    }
    console.log(defaultTime)
    this.setState({ releaseState: e.target.value, defaultTime: defaultTime })
  }

  onTimeChange = (date, dateString) => {
    let newArr = []
    if (date) {
      for (let i = 0; i < dateString.length; i++) {
        if (dateString[i]) {
          newArr.push(dateString[i].replace(/-/g, ''))
        }
      } // @ts-expect-error ttt
      newArr = newArr.join('-')
      // value = dateString.join('~')
      // @ts-expect-error ttt
      this.setState({ defaultTime: date, customizationTime: newArr, releaseState: 'custome' })
    } else {
      this.setState({
        // @ts-expect-error ttt
        defaultTime: '',
        customizationTime: '',
      })
    }
  }
  cascaderChange = (e, param, state) => {
    const newArr = []
    for (let i = 0; i < e.length; i++) {
      newArr.push(e[i][e[i].length - 1])
    }
    // @ts-expect-error ttt
    this.setState({
      [param]: newArr.join('|'),
      [state]: e,
    })
  }
  keywordChange = (event) => {
    const newValue = event.target.value

    this.setState({ queryText: newValue, queryHisShow: event.target.value ? 'none' : 'block' })
  }
  handleChange = (value) => {
    this.setState(
      {
        selectValue: value,
        pageNo: 0,
      },
      () => this.getData()
    )
  }

  getData = () => {
    const {
      queryText,
      areaCodes,
      compIndustry,
      releaseState,
      expList,
      eduList,
      customizationTime,
      pageNo,
      selectValue,
    } = this.state
    const newArr: string[] = []
    let param: any = {}
    const showPre = this.child.state.showPre
    if (showPre) {
      for (let i = 0; i < showPre.length; i++) {
        newArr.push(showPre[i].split('|')[1])
      }
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
      queryText: queryText ? queryText.split(' ').join('|') : '',
      compCodes: newArr.join('|'),
      areaCodes: areaCodes ? areaCodes : '',
      compIndustry: compIndustry ? compIndustry : '',
      releaseDate: releaseDate,
      expReq: expList ? expList.join('|') : '',
      eduReq: eduList ? eduList.join('|') : '',
      sortFieldType: selectValue ? selectValue : '',
    }
    this.setState({ applySearchLoading: true })
    getJobSearch(wftCommon.preProcessData(param))
      .then((res) => {
        const callback = (endata) => {
          if (this.state.queryText) {
            addSearchHistory('RECRUITMENT_SEARCH_POSITION', this.state.queryText).then(() => {
              this.getSearchHistory()
            })
          }
          if (showPre && showPre.length > 0) {
            console.log('🚀 ~ SearchBidNew ~ callback ~ showPre:', showPre)
            addSearchHistory('RECRUITMENT_SEARCH_COMPANY', showPre?.[0]).then(() => {
              this.getCompanySearchHistory()
            })
          }
          this.setState({
            loading: false,
            loadingList: false,
            resultNum: res.Page.Records ? res.Page.Records.toString() : '0',
            resultList: param.pageNo == 0 ? endata : this.state.resultList.concat(endata),
            recommend: false,
          })
        }

        if (res.ErrorCode == 0 && res.Data && res.Data.length) {
          if (window.en_access_config) {
            if (param.pageNo == '0') {
              // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
              callback(res.Data)
            }
            wftCommon.zh2en(res.Data, callback, null, callback)
          } else {
            callback(res.Data)
          }
        } else {
          this.setState({
            // @ts-expect-error ttt
            errorCode: res.ErrorCode,
            loadingList: false,
            loading: false,
            resultList: [],
            resultNum: '0',
            recommend: false,
          })
        }
      })
      .finally(() => {
        this.setState({ applySearchLoading: false })
      })
  }
  saveHisCompany = () => {
    const showPre = this.child.state.showPre
    let hisCom = window.localStorage.getItem('searchJobCompany')
    if (hisCom) {
      hisCom = JSON.parse(hisCom)
      if (hisCom && hisCom.length) {
        const newArr = wftCommon.getArrDifference(hisCom, showPre)
        hisCom = newArr.concat(hisCom)
      } else {
        // @ts-expect-error ttt
        hisCom = []
        if (showPre) {
          for (let i = 0; i < showPre.length; i++) {
            // @ts-expect-error ttt
            hisCom.unshift(showPre[i])
          }
        }
      }
    } else {
      // @ts-expect-error ttt
      hisCom = []
      if (showPre) {
        for (let i = 0; i < showPre.length; i++) {
          // @ts-expect-error ttt
          hisCom.unshift(showPre[i])
        }
      }
    }
    if (hisCom.length) {
      if (hisCom.length > 5) {
        // @ts-expect-error ttt
        hisCom.length = 5
      }
      hisCom = JSON.stringify(hisCom)
      window.localStorage.setItem('searchJobCompany', hisCom)
    }
  }
  searchCallBack = (item) => {
    const detailid = item.seqId ? item.seqId : ''
    const jumpCode = item.companyCode ? item.companyCode : ''
    const jumpUrl = 'index.html#/jobDetail?type=jobs&detailid=' + detailid + '&jobComCode=' + jumpCode

    let companyLinkComp
    const companyName = item.companyName ? item.companyName : '--'
    if (item.companyCode && companyName !== '--') {
      const onLinkClick = () => wftCommon.linkCompany('Bu3', item.companyCode)
      companyLinkComp = (
        <span className="underline-company" onClick={onLinkClick}>
          {companyName}
        </span>
      )
    } else {
      companyLinkComp = <span>{companyName}</span>
    }

    return (
      <div className={`${StylePrefix}--item div_Card`}>
        <h5 className="searchtitle-brand wi-link-color" onClick={() => wftCommon.jumpJqueryPage(jumpUrl)}>
          {item.positionName ? item.positionName : '--'}
        </h5>
        <span className="list-opeation-job color-orange">{item.pay ? item.pay : '--'}</span>
        <div className="each-searchlist-item">
          <span className="searchitem-work">
            {intl('138908', '发布日期')}：{item.publishDate ? wftCommon.formatTime(item.publishDate) : '--'}
          </span>
          <span className="searchitem-work">
            {intl('271969', '招聘企业')}：{companyLinkComp}
          </span>
          <span className="searchitem-work">
            {intl('214189', '学历要求')}：{item.eduReqName ? item.eduReqName : '--'}
          </span>
          <br />
          <span className="searchitem-work">
            {intl('138583', '工作地点')}：{item.workPlace ? item.workPlace : '--'}
          </span>
          <span className="searchitem-work">
            {intl('214188', '经验要求')}：{item.experience ? item.experience : '--'}
          </span>
        </div>
      </div>
    )
  }

  viewHistory = (item, isDelete, index) => {
    const detailid = item.objectid ? item.objectid : ''
    const detail = JSON.parse(item.detail)
    const jumpCode = detail.companyCode ? detail.companyCode : ''
    const jumpUrl = 'index.html#/jobDetail?type=jobs&detailid=' + detailid + '&jobComCode=' + jumpCode
    if (index > 7) {
      return false
    }
    return (
      <li className="history-Joblist">
        <span className="job-history-title" onClick={() => wftCommon.jumpJqueryPage(jumpUrl)}>
          {item.keyword}
        </span>
        <br />
        <span className="job-corp">
          {intl('271969', '招聘企业')}：<span>{detail.companyName ? detail.companyName : '--'}</span>
        </span>
        {isDelete ? <span className="del-history" onClick={() => this.deleteSingleJobHis(detailid)}></span> : ''}
      </li>
    )
  }
  deleteSingleJobHis = (id) => {
    if (id) {
      const param = {
        type: 'recruit_detail',
        detailId: id,
      }
      deleteSingleJobHis(param).then((res) => {
        const { historyList } = this.state
        const newArr = []
        console.log(historyList)
        if (res.Data && res.ErrorCode == 0) {
          for (let i = 0; i < historyList.length; i++) {
            // if( i != index){
            if (historyList[i].objectid !== id) {
              newArr.push(historyList[i])
            }
            // }
          }
          console.log(newArr)
          this.setState({
            historyList: newArr,
          })
        }
      })
    }
  }

  reset = () => {
    this.child.deleteAllPre()
    this.setState({
      pageno: 0,
      pagesize: 10,
      queryText: '',
      compIndustry: [],
      areaCodes: [],
      dateAllow: true,
      defaultTime: [],
      oppTime: '',
      expIndeterminate: false,
      expCheckAll: false,
      expList: [],
      eduIndeterminate: false,
      eduCheckAll: false,
      eduList: [],
      releaseState: '',
      showPre: [],
      customizationTime: '',
      queryHisShow: 'none',
      defaultRegion: [],
      defaultIndustry: [],
    })
  }

  handleOk = () => {
    const deletetParam = {
      type: 'recruit_detail',
    }
    deleteAllJobHis(deletetParam).then((res) => {
      if (res.Data && res.ErrorCode == 0) {
        this.setState(
          {
            visible: false,
            historyList: [],
          },
          () => {
            message.success('清除成功！')
          }
        )
      }
    })
    // this.props.clearCompanyView(deletetParam)
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  focusQuery = () => {
    this.setState({
      queryHisShow: this.state.queryText ? 'none' : 'block',
    })
  }

  render() {
    const { errorCode, resultList, loading, loadingList, keywordHis, queryHisShow, recommend, companyHis } = this.state
    console.log('🚀 ~ SearchBidNew ~ render ~ keywordHis:', keywordHis)
    let resultAlert = recommend ? intl('345554', '为您推荐%个符合条件的岗位') : intl('345573', '找到%条符合条件的岗位')
    resultAlert = resultAlert.replace(
      /%/,
      '<span style="color:#333">' +
        (this.state.resultNum && parseInt(this.state.resultNum) > 0
          ? wftCommon.formatMoney(this.state.resultNum, '', '', 1)
          : '0') +
        '</span>'
    )
    let showResult = <></>
    if (errorCode == '-2') {
      showResult = (
        <div className="loading-failed">
          <p>{intl('313373', '加载失败，请重试')}</p>
          <p>
            {/*  @ts-expect-error ttt */}
            <Button size="default" type="primary" onClick={this.getData}>
              {intl('138836', '确定')}
            </Button>
          </p>
        </div>
      )
    } else {
      showResult = loading ? (
        <Spin />
      ) : resultList && resultList.length > 0 ? (
        <>
          {resultList.map((item) => {
            return this.searchCallBack(item)
          })}
        </>
      ) : (
        <Empty status={'no-data'} direction="vertical" />
      )
    }
    return (
      <div onScroll={this.scroll} className={`search_job ${StylePrefix}`}>
        <div className="bread-crumb">
          <div className="bread-crumb-content">
            <span className="last-rank" onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}>
              {intl('19475', '首页')}
            </span>
            <i></i>
            <span>{intl('138356', '招聘')}</span>
          </div>
        </div>
        <div className={`wrapper ${StylePrefix}--body`}>
          <div className="search_l">
            <div className="search-condition">
              <h3 className="condition-title">{intl('205523', '招聘查询')}</h3>
              <div className={`condition-area ${StylePrefix}--filter--item`}>
                <span className={`${StylePrefix}--filter--item--title`}>{intl('349163', '招聘岗位')}：</span>
                <div id="queryHisList" className={`${StylePrefix}--filter--item--content`}>
                  <Input
                    size="large"
                    type="text"
                    value={this.state.queryText}
                    placeholder={intl('349195', '请输入岗位关键词，并用空格隔开多个关键词')}
                    allowClear
                    onChange={this.keywordChange}
                    onFocus={this.focusQuery}
                    onBlur={() => {
                      setTimeout(() => {
                        this.setState({ queryHisShow: 'none' })
                      }, 150)
                    }}
                  />
                  <div className="historySearch" style={{ display: queryHisShow }}>
                    {keywordHis && keywordHis.length > 0 ? <div>{intl('437396', '历史搜索')}</div> : null}
                    {keywordHis && keywordHis.length > 0
                      ? keywordHis.map((item, index) => {
                          return (
                            <div key={index} onClick={() => this.setState({ queryText: item.name })}>
                              {item.name}
                            </div>
                          )
                        })
                      : null}
                  </div>
                </div>
              </div>
              <div className="condition-area">
                <span className={`${StylePrefix}--filter--item--title`}>{intl('271969', '招聘企业')}：</span>
                <PreSearchInput
                  onRef={(node) => (this.child = node)}
                  placeholder={intl('349196', '请输入招聘企业名称')}
                  onChange={() => {}}
                  historyList={companyHis}
                />
              </div>
              <div className="condition-area">
                <div className="condition-region">
                  <span className={`${StylePrefix}--filter--item--title`}>{intl('349197', '招聘地区')}：</span>
                  <WindCascade
                    className="cascade-filter-item"
                    placeholder={intl('19498', '全部')}
                    options={newMap}
                    fieldNames={{ label: 'name', value: 'code', children: 'node' }}
                    value={this.state.defaultRegion}
                    onChange={(e) => this.cascaderChange(e, 'areaCodes', 'defaultRegion')}
                  />
                </div>
                <div className="condition-industry">
                  <span className={`${StylePrefix}--filter--item--title`}>{intl('257690', '国标行业')}：</span>
                  <WindCascade
                    className="cascade-filter-item"
                    placeholder={intl('19498', '全部')}
                    options={globalIndustryOfNationalEconomy2}
                    fieldNames={WindCascadeFieldNamesCommon}
                    value={this.state.defaultIndustry}
                    onChange={(e) => this.cascaderChange(e, 'compIndustry', 'defaultIndustry')}
                  />
                </div>
              </div>
              <div className="condition-area">
                <span className={`${StylePrefix}--publish-date--title ${StylePrefix}--filter--item--title`}>
                  {intl('138908', '发布日期')}：
                </span>
                <RadioGroup
                  className={`${StylePrefix}--publish-date--radio`}
                  onChange={this.releaseDateChange}
                  value={this.state.releaseState}
                >
                  {releaseDate.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {item.name}
                      </Radio>
                    )
                  })}
                  <Radio value="custome">{intl('25405', '自定义')}</Radio>
                </RadioGroup>
                <RangePicker
                  className={`${StylePrefix}--publish-date--picker`}
                  placeholder={[intl('9524', '开始时间'), intl('138688', '截止时间')]}
                  onChange={this.onTimeChange}
                  // @ts-expect-error ttt
                  value={this.state.defaultTime}
                  allowClear
                  disabledDate={this.disabledDate}
                />
              </div>
              <div className="condition-area">
                <span className={`${StylePrefix}--filter--item--title`}>{intl('349213', '经验要求')}：</span>
                <div style={{ height: '32px', lineHeight: '32px' }}>
                  <CheckboxGroup
                    options={expReq}
                    value={this.state.expList}
                    onChange={(e) => this.eduRadioChange(e, 'expList', 'expIndeterminate', 'expCheckAll', expReq)}
                  />
                </div>
              </div>
              <div className="condition-area" style={{ height: '64px' }}>
                <span className={`${StylePrefix}--filter--item--title`}>{intl('214189', '学历要求')}：</span>
                <div style={{ height: '32px', lineHeight: '32px', width: '810px' }}>
                  <CheckboxGroup
                    options={eduReq}
                    value={this.state.eduList}
                    onChange={(e) => this.eduRadioChange(e, 'eduList', 'eduIndeterminate', 'eduCheckAll', eduReq)}
                  />
                </div>
              </div>
              <div className="condition-area" id="conditionButton">
                <div style={{ float: 'right' }}>
                  <Button size="large" onClick={this.reset}>
                    {intl('138490', '重置条件')}
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    style={{ marginLeft: '12px' }}
                    loading={this.state.applySearchLoading}
                    onClick={() => {
                      this.setState({ pageNo: 0 }, this.getData)
                    }}
                  >
                    {intl('257693', '应用筛选')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="search-result">
              <div className="result-r">
                <p dangerouslySetInnerHTML={{ __html: resultAlert }} className="searchResultNum"></p>
                <div className="operation-area">
                  <Select
                    placeholder="默认排序"
                    style={{ width: 164 }}
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.selectValue}
                  >
                    {jobResultOption.map(({ sort, key }) => {
                      // @ts-expect-error ttt
                      return <Option key={key}>{sort}</Option>
                    })}
                  </Select>
                </div>
              </div>
              <div className="div_List">
                {showResult}
                {loadingList ? <Spin /> : null}
              </div>
            </div>
          </div>
          <div className={`history-right ${StylePrefix}--history`}>
            <div id="historyFocusList" className="search-r-model">
              {this.state.historyList && this.state.historyList.length > 0 ? (
                <HistoryList
                  list={this.state.historyList}
                  title={intl('271967', '最近浏览的招聘信息')}
                  allDelete
                  listShowFun={this.viewHistory}
                  isDelete
                  showModal={this.showModal}
                />
              ) : null}
            </div>
          </div>
        </div>

        {this.state.visible ? (
          // @ts-expect-error ttt
          <Modal
            title={intl('138910', '提示')}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>{intl('272001', '全部清除最近浏览企业')}</p>
          </Modal>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = () => {}

const mapDispatchToProps = () => {}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBidNew)
