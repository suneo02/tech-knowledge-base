import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../actions/home'
import * as SearchListActions from '../actions/searchList'
import { getGroupHotView, getGroupList } from '../api/searchListApi.ts'
import defaultCompanyImg from '../assets/imgs/default_company.png'
import CompanyLink from '../components/company/CompanyLink'
import { HistoryList, ResultContainer, SearchTitleList } from '../components/searchListComponents/searchListComponents'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import './SearchList/index.less'

import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { groupCollationOption } from '../handle/searchConfig/groupCollationOption'
import { parseQueryString } from '../lib/utils'
import { searchCommon } from './commonSearchFunc'

// 产品介绍页面，游客访问
class GroupSearchList extends React.Component<any, any> {
  param: any
  constructor(props) {
    super(props)
    this.state = {
      filter: {
        pageNo: 0,
        pageSize: 10,
      },
      queryText: '阿里',
      resultNum: '',
      loading: true,
      loadingList: false,
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      const keyword = this.props.keyword

      this.setState({ queryText: keyword ? keyword : '小米' }, () => this.getGroupList())
    }
  }

  componentDidMount = () => {
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    urlSearch = window.decodeURIComponent(urlSearch)
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    this.setState({ queryText: keyword }, () => this.getGroupList())
    this.props.getGroupHotView({ pageSize: 10 })
    this.props.setGlobalSearch()
  }
  handleChange = (value) => {
    //排序功能事件
    const filter = this.state.filter
    filter['sort'] = value
    filter['pageNo'] = 0
    this.setState({ loading: true, ...filter, loadingList: false }, () => this.getGroupList())
  }
  getGroupList = (loadingList?) => {
    //执行搜索事件
    this.param = {
      queryText: this.state.queryText,
      ...this.state.filter,
      // this.state.key
    }
    console.log(this.param)
    return this.props
      .getGroupList({
        ...this.param,
      })
      .then((res) => {
        if (loadingList) {
          this.setState({ loadingList: false })
        } else {
          console.log(1232131)
          this.setState({ loading: false, resultNum: wftCommon.formatMoney(res.Page.Records, '', '', 1) })
        }
      })
  }

  scroll = (event) => {
    //触底加载
    if (event.target.clientHeight + event.target.scrollTop >= event.target.scrollHeight) {
      const filter = this.state.filter
      if ((filter['pageNo'] + 1) * 10 < this.state.resultNum.split(',').join('')) {
        this.setState({ loadingList: true })
        setTimeout(() => {
          filter['pageNo'] = filter['pageNo'] + 1
          this.setState(filter, () => this.getGroupList())
        }, 300)
      }
    }
  }
  searchCallBack = (item) => {
    if (!item) return null
    const _logo = item.logo ? 'http://news.windin.com/ns/imagebase/6288/' + item.logo : ''
    const shortname = item.groupsystem_name
    const bkcolor = wftCommon.calcLogoColor(item.industry_gb_1 || '')
    let logoName = shortname ? shortname.slice(0, 4) : shortname.slice(0, 4)
    const titleEnName = item.groupsystem_name_en
    if (logoName.charCodeAt(0) <= 255) {
      logoName = logoName.split('').join(' &nbsp;')
    }
    return (
      <div className="div_Card" id="divCardGroup">
        <div className="group-search-cont">
          <div>
            <div className="group-search-icon">
              {_logo ? (
                <img
                  className="big-logo"
                  onError={(e) => {
                    // @ts-expect-error ttt
                    e.target.src = defaultCompanyImg
                  }}
                  src={wftCommon.addWsidForImg(_logo)}
                />
              ) : (
                <span className="logo-title" style={{ background: bkcolor }}>
                  {logoName}
                </span>
              )}
            </div>
            <h5
              className="searchtitle-news wi-link-color"
              onClick={() =>
                window.open(
                  getUrlByLinkModule(LinksModule.GROUP, {
                    id: item.groupsystem_id,
                  })
                )
              }
            >
              {item.groupsystem_name ? item.groupsystem_name.replace(/\"/g, '') : '--'}
            </h5>

            {window.en_access_config && titleEnName ? (
              <div className="div_Card_name_en">
                {' '}
                <span> {titleEnName} </span> {<i>{intl('362293', '该翻译由AI提供')} </i>}{' '}
              </div>
            ) : null}
          </div>
        </div>
        <div className="searchtitle-bottom">
          <span className="searchitem-time">
            {intl('216412', '核心主体公司')}：
            <CompanyLink divCss="company-jump" name={item.core_main_corp_name} id={item.core_main_corp_id} />
          </span>
          <br />
          <span className="searchitem-no">
            {intl('224506', '集团企业数量')}：{parseInt(item.count_corp_num)}
          </span>
          <span className="searchitem-source">
            {intl('451213', '省份地区')}：{item.region ? item.region.replace(/\s*/g, '') : '--'}
          </span>
        </div>
      </div>
    )
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }
  viewCompany = (item, isDelete) => {
    const groupDetailLink = getUrlByLinkModule(LinksModule.GROUP, {
      id: item.groupSystemId,
    })
    return (
      <li className="history_list">
        <a className="wi-link-color" onClick={() => window.open(groupDetailLink)}>
          {item.groupSystemName}
        </a>
        {isDelete ? <span className="del-history"></span> : ''}
      </li>
    )
  }

  render() {
    const { groupList, groupListErrorCode, groupViewHot } = this.props
    return (
      <div className="SearchList" onScroll={this.scroll}>
        <SearchTitleList name="groupSearchList" jump={this.jump} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <ResultContainer
                resultType={intl('437223', '找到 % 个符合条件的集团系')}
                resultNum={this.state.resultNum}
                resultList={groupList}
                list={groupCollationOption}
                handleChange={this.handleChange}
                loading={this.state.loading}
                selectValue={this.state.filter ? this.state.filter.sort : ''}
                searchCallBack={this.searchCallBack}
                loadingList={this.state.loadingList}
                errorCode={groupListErrorCode}
                reload={this.getGroupList}
              />
            </div>
          </div>
          <div className="history-right">
            <div id="historyFocusList" className="search-r-model">
              {groupViewHot ? (
                <HistoryList
                  list={groupViewHot}
                  title={window.en_access_config ? 'Top Viewed' : intl('', '热门推荐集团系')}
                  listShowFun={this.viewCompany}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groupList: state.companySearchList.groupList,
    groupListErrorCode: state.companySearchList.groupListErrorCode,
    keyword: state.companySearchList.searchKeyWord,
    groupViewHot: state.companySearchList.groupViewHot,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupList: (data) => {
      return getGroupList(data).then((res) => {
        if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
          if (data.pageNo == '0') {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            dispatch(SearchListActions.getGroupList({ ...res, ...data }))
          }
        }
        new Promise((resolve) => {
          if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
            wftCommon.zh2en(
              res.data.list,
              (endData) => {
                endData.map((t, idx) => {
                  t.groupsystem_name_en = t.groupsystem_name || ''
                  t.groupsystem_name_en = t.groupsystem_name_en.replace
                    ? t.groupsystem_name_en.replace(/<em>|<\/em>/g, '')
                    : t.groupsystem_name_en
                  t.groupsystem_name = res.data.list[idx].groupsystem_name
                })
                res.data.list = endData
                dispatch(SearchListActions.getGroupList({ ...res, ...data }))
                resolve(res)
              },
              null,
              () => {
                dispatch(SearchListActions.getGroupList({ ...res, ...data }))
                resolve(res)
              }
            )
          } else {
            dispatch(SearchListActions.getGroupList({ ...res, ...data }))
            resolve(res)
          }
        })
        return res
      })
    },
    getGroupHotView: (data) => {
      return getGroupHotView(data).then((res) => {
        dispatch(SearchListActions.getGroupHotView({ ...res, ...data }))
        return res
      })
    },
    setGlobalSearch: () => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupSearchList)
