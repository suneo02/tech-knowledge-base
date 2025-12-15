import { globalIndustryOfNationalEconomy3 } from '@/utils/industryOfNationalEconomyTree'
import { DatePicker, Radio } from '@wind/wind-ui'
import RadioGroup from '@wind/wind-ui/lib/radio/group'
import { WindCascade } from 'gel-ui'
import { globalAreaTree } from 'gel-util/config'
import { isEn } from 'gel-util/intl'
import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../../actions/home'
import * as SearchListActions from '../../actions/searchList'
import { getBidSearchList, getBidViewList } from '../../api/searchListApi'
import {
  AlreadyChooseFilter,
  ResultContainer,
  SearchTitleList,
} from '../../components/searchListComponents/searchListComponents'
import { bidResultOption, createDatebidSearch } from '../../handle/searchConfig'
import { setPageTitle } from '../../handle/siteTitle'
import global from '../../lib/global'
import { parseQueryString } from '../../lib/utils'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { BidCard } from '../BusinessComponent/bid'
import '../SearchList/index.less'
import { searchCommon } from '../commonSearchFunc'
import './BidSearchList.less'
import { BidSearchListProps, BidSearchListState } from './type'

const RangePicker = DatePicker.RangePicker

const StylePrefix = 'bid-search-list'

// 产品介绍页面，游客访问
class BidSearchList extends React.Component<BidSearchListProps, BidSearchListState> {
  private searchParam: any
  private dateAction: any
  private param: any
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      pageNo: 0,
      pageSize: 10,
      resultNum: '',
      loading: true,
      loadingList: false,
      allFilter: [],
      region: intl('265435', '不限'),
      industry: intl('265435', '不限'),
      queryText: '阿里',
      industryname: [],
      regioninfo: [],
      dateAllow: true,
      defaultTime: [],
      oppTime: '~30',
    }
  }

  componentDidUpdate = (prevProps) => {
    setPageTitle('TenderSearch')
    if (this.props.keyword !== prevProps.keyword) {
      let keyword = this.props.keyword
      this.setState({ queryText: keyword }, () => this.clearAllFilter())
    }
  }

  componentDidMount = () => {
    this.param = {
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize,
      sort: 'sort_date_desc',
    }
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    urlSearch = window.decodeURIComponent(urlSearch)
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    this.setState({ queryText: keyword }, () => this.getBidSearchList())
    // this.props.getBidViewList(this.param)
    // this.props.getBidSearchList(this.param)
    this.props.setGlobalSearch()
    this.typeClick(intl('228620', '30天内'), intl('138908', '发布日期'), 'oppTime', '~30', 1)
  }
  handleChange = (value, type, select) => {
    //排序功能事件
    let { filter, allFilter } = this.state
    filter[type] = value
    if (select) {
      searchCommon.allFilterAdd(allFilter, select, value, type)
    }
    this.setState({ loading: true, ...filter, loadingList: false, pageNo: 0, allFilter })
    this.getBidSearchList()
  }
  getBidSearchList = (_filter?: any, loadingList?: boolean) => {
    //执行搜索事件
    this.searchParam = {
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize,
      queryText: this.state.queryText,
      oppTime: this.state.oppTime,
      ...this.state.filter,
    }
    return this.props
      .getBidSearchList({
        ...this.searchParam,
      })
      .then((res) => {
        if (res.ErrorCode == global.SUCCESS) {
          if (loadingList) {
            this.setState({ loadingList: false })
          } else {
            this.setState({ loading: false, resultNum: wftCommon.formatMoney(res.Page.Records, '', '', 1) })
          }
        } else {
          this.setState({ loading: false, resultNum: 0 })
        }
      })
  }

  scroll = (event) => {
    //触底加载
    let { pageNo, resultNum } = this.state
    console.log(
      '🚀 ~ BidSearchList ~ event:',
      pageNo,
      resultNum,
      event.target.clientHeight + event.target.scrollTop,
      event.target.scrollHeight
    )
    if (event.target.clientHeight + event.target.scrollTop >= event.target.scrollHeight - 20) {
      // @ts-expect-error ttt
      if ((pageNo + 1) * 10 < resultNum.split(',').join('')) {
        this.setState({ loadingList: true })
        setTimeout(() => {
          this.setState({ pageNo: pageNo + 1 }, () => this.getBidSearchList())
        }, 300)
      }
    }
  }
  searchCallBack = (item) => {
    return <BidCard item={item}></BidCard>
  }
  bidViewList = (item, _isDelete) => {
    return (
      <li className="history_list" id="bidViewList">
        <div className="content-history-person">
          <a
            className="wi-link-color"
            onClick={() =>
              wftCommon.jumpJqueryPage(
                `index.html#/biddingDetail?type=bid&detailid=${item.detail_id}&title=${item.title}`
              )
            }
            data-uc-id="Ofrg_R0Xn_-"
            data-uc-ct="a"
          >
            {item.title}
          </a>
          <br />
          <span className="view-bid-bottom">
            <span>{item.bidding_type_name}</span>
            <span className="view-bid-time">{item.announcement_time.split(' ')[0]}</span>
          </span>
        </div>
      </li>
    )
  }
  typeClick = (result, condition, param, paramResult, refresh) => {
    console.log(result, condition, param, paramResult, refresh)
    let { filter, allFilter, pageNo } = this.state
    filter[param] = paramResult
    if (refresh) {
      pageNo = 0
      this.setState({ pageNo: 0 })
    }
    let newAllFilterAdd = searchCommon.allFilterAdd(allFilter, condition, result, param)
    this.setState({ loading: true, filter, allFilter: newAllFilterAdd, pageNo: pageNo }, () => {
      this.getBidSearchList()
    })
  }
  clearAllFilter = () => {
    let { filter, allFilter } = this.state
    for (let key in filter) {
      delete filter[key]
    }
    allFilter = []
    this.setState({ loading: true, filter: filter, allFilter, regioninfo: [], industryname: [], pageNo: 0 }, () => {
      this.getBidSearchList()
    })
  }
  deleteFilter = (deleteType, deleteFilter) => {
    let { filter, allFilter } = this.state
    for (let key in filter) {
      if (key == deleteType) {
        delete filter[key]
      }
    }
    if (deleteType == 'regioninfo' || deleteType == 'industryname') {
      // @ts-expect-error ttt
      this.setState({ [deleteType]: [] })
    } else if (deleteType == 'oppTime') {
      filter['oppTime'] = ''
      this.setState({ dateAllow: true, oppTime: '', filter: filter })
    }
    const newAllFilter = allFilter.filter((e) => {
      return e.type !== deleteFilter
    })
    this.setState({ loading: true, ...filter, allFilter: newAllFilter })
    this.getBidSearchList()
  }
  searchChange = (e: string[][], type: string, ctype: string, state: string) => {
    let choose = []
    let show = []
    console.log(e)
    for (let i = 0; i < e.length; i++) {
      if (type == 'industryname') {
        choose.push(e[i][e[i].length - 1])
      } else {
        choose.push(e[i].join(' '))
        show.push(e[i][e[i].length - 1])
      }
    }
    let condition = []
    if (type == 'industryname') {
      condition = choose.join('、') as any
    } else {
      condition = show.join('、') as any
    }
    this.typeClick(condition, ctype, type, choose.join('|'), 1)
    // @ts-expect-error ttt
    this.setState({ [state]: e })
  }
  onChangeDate = (e, _title, _param, _refresh) => {
    let dateAllow
    console.log(e)
    if (e.target.value) {
    }
    {
    }
    if (e.target.value !== 'custome') {
      this.typeClick(
        searchCommon.timeParam[e.target.value] || e.target.value,
        intl('138908', '发布日期'),
        'oppTime',
        e.target.value,
        1
      )
      dateAllow = true
      this.setState({ oppTime: e.target.value, dateAllow: dateAllow })
      // this.typeClick('establishedTime',e.target.value,1,intl('2824','成立时间'),value)
    } else {
      dateAllow = false
      this.setState({ oppTime: 'custome', dateAllow: dateAllow })
      if (this.dateAction) this.dateAction()
    }
    // this.typeClick(value, intl('138908','发布日期'),'oppTime',newArr,1,)
    // this.setState({ [param]: e.target.value })
    // this.setState({oppTime: e.target.value,dateAllow : dateAllow})
  }
  onTimeChange = (date, dateString) => {
    let newArr = []
    let value = ''
    if (date) {
      for (let i = 0; i < dateString.length; i++) {
        newArr.push(dateString[i].replace(/-/g, ''))
      }
      newArr = newArr.join('~') as any
      value = dateString.join('~')
      this.setState({ defaultTime: date, oppTime: 'custome' })
      this.dateAction = () => {
        this.typeClick(value, intl('138908', '发布日期'), 'oppTime', newArr, 1)
      }
      this.dateAction()
    }
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }

  render() {
    const { bidErrorCode, bidSearchList, bidViewList } = this.props
    console.log('🚀 ~ BidSearchList ~ render ~ bidViewList:', bidViewList)
    return (
      <div className={`${StylePrefix}--container`}>
        <div
          className={`SearchList ${StylePrefix}`}
          id={StylePrefix}
          onScroll={this.scroll}
          data-uc-id="BaMXthOteFG"
          data-uc-ct="div"
        >
          <SearchTitleList name="bidSearchList" jump={this.jump} keyword={this.state.queryText} />
          <div className="wrapper workspace-fix" id="SearchHome">
            <div className="search-l">
              <div className="search-for-company each-search-result">
                <AlreadyChooseFilter
                  list={this.state.allFilter}
                  delete={this.deleteFilter}
                  deleteAll={this.clearAllFilter}
                />

                <ul className={`job-ul bid-job-ul `} id="filterList" style={{ height: 'auto' }}>
                  <li className={`${StylePrefix}--filter--li--first`} style={{ position: 'relative' }}>
                    <div className={`${StylePrefix}--filter--li--first--left`}>
                      <span className="filter-name">{intl('138908', '发布日期')}：</span>

                      <RadioGroup
                        onChange={this.onChangeDate}
                        value={this.state.oppTime}
                        data-uc-id="iT6S-i_e-Cj"
                        data-uc-ct="radiogroup"
                      >
                        {createDatebidSearch.map((item) => {
                          return (
                            <Radio value={item.type} data-uc-id="GpjKyhvKXKD" data-uc-ct="radio">
                              {intl(item.timeId, item.time)}
                            </Radio>
                          )
                        })}
                        <Radio value="custome" data-uc-id="45AwtML8oku" data-uc-ct="radio">
                          {intl('25405', '自定义')}
                        </Radio>
                      </RadioGroup>

                      <RangePicker
                        onChange={this.onTimeChange}
                        value={this.state.defaultTime}
                        allowClear
                        data-uc-id="j3RaDxPdc3K"
                        data-uc-ct="rangepicker"
                      />
                    </div>
                    <a
                      className={`${StylePrefix}--filter--bid-more`}
                      onClick={() => {
                        wftCommon.jumpJqueryPage('SearchBid.html')
                        return false
                      }}
                      data-uc-id="gkbP5280rC7"
                      data-uc-ct="a"
                    >
                      {intl('257674', '更多筛选')}
                    </a>
                  </li>
                  <li className="industry-choose" id="bidChoose">
                    <span className="title-city-industry">{intl('451213', '省份地区')}：</span>
                    <WindCascade
                      placeholder={intl('265435', '不限')}
                      options={globalAreaTree}
                      value={this.state.regioninfo}
                      className="casader-choose-region"
                      fieldNames={{
                        label: isEn() ? 'nameEn' : 'name',
                        value: 'name',
                        children: 'node',
                      }}
                      onChange={(e) => this.searchChange(e, 'regioninfo', intl('451213', '省份地区'), 'regioninfo')}
                      data-uc-id="mu7kzFl0htv"
                      data-uc-ct="windcascade"
                    />
                    <span className="title-city-industry" id="TitleIndustry">
                      {intl('257690', '国标行业')}：
                    </span>
                    <WindCascade
                      placeholder={intl('265435', '不限')}
                      options={globalIndustryOfNationalEconomy3}
                      value={this.state.industryname}
                      fieldNames={{ label: 'name', value: 'name', children: 'node' }}
                      className="casader-choose-industry"
                      popupPlacement="bottomRight"
                      onChange={(e) => this.searchChange(e, 'industryname', intl('257690', '国标行业'), 'industryname')}
                      data-uc-id="97nce2tIZ11"
                      data-uc-ct="windcascade"
                    />
                  </li>
                </ul>
                <ResultContainer
                  resultType={intl('437224', '找到 % 条符合条件的招投标公告')}
                  resultNum={this.state.resultNum}
                  resultList={bidSearchList}
                  list={bidResultOption}
                  handleChange={this.handleChange}
                  loading={this.state.loading}
                  searchCallBack={this.searchCallBack}
                  loadingList={this.state.loadingList}
                  errorCode={bidErrorCode}
                  selectValue={this.state.filter ? this.state.filter.sort : ''}
                  reload={this.getBidSearchList}
                />
              </div>
            </div>
            <div className="history-right">
              <div id="historyFocusList" className="search-r-model"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bidSearchList: state.companySearchList.bidSearchList,
    bidViewList: state.companySearchList.bidViewList,
    bidErrorCode: state.companySearchList.bidErrorCode,
    keyword: state.companySearchList.searchKeyWord,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBidSearchList: (data) => {
      data.industryGb2 = data.industryname || ''
      data.region = data.regioninfo || ''

      return getBidSearchList(data).then((res) => {
        if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
          if (data.pageNo == '0') {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            dispatch(SearchListActions.getBidSearchList({ ...res, ...data }))
          }
        }
        new Promise((resolve, _reject) => {
          if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
            res.data.list.map((t) => {
              delete t.highlight
            })
            wftCommon.zh2en(
              res.data.list,
              (endata) => {
                endata.map((t, idx) => {
                  t.title_en = t.title || ''
                  t.title_en = t.title_en.replace ? t.title_en.replace(/<em>|<\/em>/g, '') : t.title_en
                  t.title = res.data.list[idx].title
                })
                res.data.list = endata
                dispatch(SearchListActions.getBidSearchList({ ...res, ...data }))
                resolve(res)
              },
              null,
              () => {
                dispatch(SearchListActions.getBidSearchList({ ...res, ...data }))
                resolve(res)
              }
            )
          } else {
            dispatch(SearchListActions.getBidSearchList({ ...res, ...data }))
            resolve(res)
          }
          // return res
        })
        return res
      })
    },
    getBidViewList: (data) => {
      return getBidViewList(data).then((res) => {
        dispatch(SearchListActions.getBidViewList({ ...res, ...data }))
        return res
      })
    },
    setGlobalSearch: (_data) => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BidSearchList)
