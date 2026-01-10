import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../actions/home'
import * as SearchListActions from '../actions/searchList.ts'
import { getGroupHotView, getGroupList } from '../api/searchListApi.ts'
import defaultCompanyImg from '../assets/imgs/default_company.png'
import CompanyLink from '../components/company/CompanyLink'
import { HistoryList, ResultContainer, SearchTitleList } from '../components/searchListComponents/searchListComponents'

import { wftCommon } from '../utils/utils'
import './SearchList/index.less'

import { deleteGroupRecentViewItem, getGroupRecentViewList } from '@/api/services/groupRecentView.ts'
import Links from '@/components/common/links/Links'
import { LinksModule } from '@/handle/link'
import { t } from 'gel-util/intl'
import { groupCollationOption } from '../handle/searchConfig/groupCollationOption'
import { parseQueryString } from '../lib/utils'
import { searchCommon } from './commonSearchFunc'

// 定义 Props 类型
interface GroupSearchListProps {
  groupList?: any
  groupListErrorCode?: any
  keyword?: string
  groupViewHot?: any
  globalSearchTimeStamp?: number
  getGroupList?: (data: any) => Promise<any>
  getGroupHotView?: (data: any) => Promise<any>
  setGlobalSearch?: () => void
}

// 产品介绍页面，游客访问
class GroupSearchList extends React.Component<GroupSearchListProps, any> {
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
      groupRecentView: [],
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      const keyword = this.props.keyword

      this.setState({ queryText: keyword ? keyword : '小米' }, () => this.getGroupList())
    }

    // 当 globalSearchTimeStamp 变化时，重新执行搜索
    if (
      this.props.keyword === prevProps.keyword &&
      this.props.globalSearchTimeStamp !== prevProps.globalSearchTimeStamp &&
      this.props.globalSearchTimeStamp !== undefined
    ) {
      this.setState({ loading: true, pageNo: 0 }, () => {
        this.getGroupList()
      })
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
    // 最近浏览（集团系）
    getGroupRecentViewList()
      .then((res) => {
        if (res && Array.isArray(res)) {
          this.setState({ groupRecentView: res })
        }
      })
      .catch(() => {})
    this.props.setGlobalSearch()
  }
  refreshGroupRecentView = () => {
    getGroupRecentViewList()
      .then((res) => {
        if (res && Array.isArray(res)) this.setState({ groupRecentView: res })
      })
      .catch(() => {})
  }
  handleChange = (value) => {
    //排序功能事件
    const filter = this.state.filter
    filter['sort'] = value
    filter['pageNo'] = 0
    this.setState({ loading: true, ...filter, loadingList: false }, () => this.getGroupList())
  }
  viewRecentCompany = (item, isDelete) => {
    return (
      <li className="history_list">
        <Links
          module={LinksModule.GROUP}
          id={item.entityId}
          title={item.entityName}
          addRecordCallback={() => this.refreshGroupRecentView()}
          className="wi-link-color"
          data-uc-id="recent-view-item"
          data-uc-ct="a"
        ></Links>
        {isDelete ? (
          <span
            className="del-history"
            onClick={() => deleteGroupRecentViewItem(item.entityId).then(this.refreshGroupRecentView)}
            data-uc-id="del-history"
            data-uc-ct="span"
          ></span>
        ) : (
          ''
        )}
      </li>
    )
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
                  data-uc-id="e323ga9pTBH"
                  data-uc-ct="img"
                />
              ) : (
                <span className="logo-title" style={{ background: bkcolor }}>
                  {logoName}
                </span>
              )}
            </div>
            <Links
              module={LinksModule.GROUP}
              id={item.groupsystem_id}
              title={item.groupsystem_name}
              addRecordCallback={() => this.refreshGroupRecentView()}
              className="searchtitle-news wi-link-color"
              data-uc-id="bfKQeQP5qUr"
              data-uc-ct="h5"
            ></Links>

            {window.en_access_config && titleEnName ? (
              <div className="div_Card_name_en">
                {' '}
                <span> {titleEnName} </span> {<i>{t('362293', '该翻译由AI提供')} </i>}{' '}
              </div>
            ) : null}
          </div>
        </div>
        <div className="searchtitle-bottom">
          <span className="searchitem-time">
            {t('216412', '核心主体公司')}：
            <CompanyLink divCss="company-jump" name={item.core_main_corp_name} id={item.core_main_corp_id} />
          </span>
          <br />
          <span className="searchitem-no">
            {t('224506', '集团企业数量')}：{parseInt(item.count_corp_num)}
          </span>
          <span className="searchitem-source">
            {t('451213', '省份地区')}：{item.region ? item.region.replace(/\s*/g, '') : '--'}
          </span>
        </div>
      </div>
    )
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }
  viewCompany = (item, isDelete) => {
    return (
      <li className="history_list">
        <Links
          className="wi-link-color"
          module={LinksModule.GROUP}
          id={item.groupSystemId}
          title={item.groupSystemName}
          addRecordCallback={() => this.refreshGroupRecentView()}
          data-uc-id="El1ffXJs2mU"
          data-uc-ct="a"
        ></Links>
        {isDelete ? <span className="del-history"></span> : ''}
      </li>
    )
  }

  render() {
    const { groupList, groupListErrorCode, groupViewHot } = this.props
    const { groupRecentView } = this.state
    return (
      <div className="SearchList" onScroll={this.scroll} data-uc-id="vs2l2qbEyMz" data-uc-ct="div">
        <SearchTitleList name="groupSearchList" jump={this.jump} keyword={this.state.queryText} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <ResultContainer
                resultType={t('437223', '找到 % 个符合条件的集团系')}
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
                  title={window.en_access_config ? 'Top Viewed' : t('', '热门推荐集团系')}
                  listShowFun={this.viewCompany}
                />
              ) : null}
              {groupRecentView && groupRecentView.length > 0 ? (
                <HistoryList
                  list={groupRecentView}
                  title={window.en_access_config ? 'Recently Viewed' : t('', '最近浏览集团系')}
                  isDelete={true}
                  allDelete={true}
                  listShowFun={this.viewRecentCompany}
                  showModal={() => {}}
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
    globalSearchTimeStamp: state.companySearchList.globalSearchTimeStamp,
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
