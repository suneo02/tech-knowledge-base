import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, Menu, Select } from '@wind/wind-ui'
import { DownO } from '@wind/icons'
import { getJobHotView, getJobList, getJobView } from '../api/searchListApi'
import * as SearchListActions from '../actions/searchList'
import {
  AlreadyChooseFilter,
  HistoryList,
  ResultContainer,
  SearchTitleList,
} from '../components/searchListComponents/searchListComponents'
import { wftCommon } from '../utils/utils'
import { searchCommon } from './commonSearchFunc'
import intl from '../utils/intl'
import './SearchList/index.less'
import { jobCollationOption } from '../handle/searchConfig/jobCollationOption'
import { region } from '../handle/searchConfig/region'
import { jobIndustry } from '../handle/searchConfig/jobIndustry'
import { jobDescribe } from '../handle/searchConfig/jobDescribe'

const Option = Select.Option

// 产品介绍页面，游客访问
class JobSearchList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      pageno: 0,
      pagesize: 10,
      resultNum: '',
      loading: true,
      loadingList: false,
      allFilter: [],
      key: '小米',
      region: intl('138649', '不限'),
      industry: intl('138649', '不限'),
    }
    this.param = { type: 'recruit_search' }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      let keyword = this.props.keyword
      this.setState({ key: keyword }, () => this.clearAllFilter())
    }
  }

  componentDidMount = () => {
    let keyword = this.props.keyword || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    this.setState({ key: keyword }, () => this.getJobList())
    this.props.getJobView(this.param)
    this.props.getJobHotView(this.param)
  }
  handleChange = (value, type, select) => {
    //排序功能事件
    let { filter, allFilter } = this.state
    filter[type] = value
    if (select) {
      searchCommon.allFilterAdd(allFilter, select, value, type)
    }
    if (!value) {
      this.deleteFilter(type, select)
    } else {
      this.setState({ loading: true, ...filter, loadingList: false, pageno: 0, allFilter })
      this.getJobList()
    }
  }
  getJobList = (filter, loadingList) => {
    //执行搜索事件
    this.searchParam = {
      pageno: this.state.pageno,
      pagesize: this.state.pagesize,
      key: this.state.key,
      source: 'cel',
      ...this.state.filter,
    }
    return this.props
      .getJobList({
        ...this.searchParam,
      })
      .then((res) => {
        if (loadingList) {
          this.setState({ loadingList: false })
        } else {
          this.setState({ loading: false, resultNum: wftCommon.formatMoney(res.Page.Records, '', '', 1) })
        }
      })
  }

  scroll = (event) => {
    //触底加载
    let { pageno, resultNum } = this.state
    if (event.target.clientHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      if ((pageno + 1) * 10 < resultNum.split(',').join('')) {
        this.setState({ loadingList: true })
        setTimeout(() => {
          this.setState({ pageno: pageno + 1 })
          this.getJobList()
        }, 300)
      }
    }
  }
  searchCallBack = (item) => {
    let className = ''
    let url = ''
    if (item.company_code) {
      className = 'underline'
      url = `Company.html?companycode=${item.company_code}`
    }
    return (
      <div className="div_Card" id="jobCard">
        <h5
          className="searchtitle-brand wi-link-color"
          onClick={() =>
            wftCommon.jumpJqueryPage(
              `index.html#/jobDetail?type=jobs&detailid=${item.detail_id}$jobComCode=${item.company_code}`
            )
          }
        >
          {item.position_name ? item.position_name : '--'}
        </h5>
        <span className="list-opeation-job color-orange">{item.salary_range ? item.salary_range : '--'}</span>
        <div className="each-searchlist-item">
          <span className="searchitem-work">
            {intl('138908', '发布日期')}：{item.release_date ? wftCommon.formatTime(item.release_date) : '--'}
          </span>
          <span className="searchitem-work">
            {intl('271969', '招聘企业')}：
            <span className={className} onClick={() => wftCommon.jumpJqueryPage(url)}>
              {item.company_name ? item.company_name : '--'}
            </span>
          </span>
          <span className="searchitem-work">
            {intl('214189', '学历要求')}：{item.education_requirement ? item.education_requirement : '--'}
          </span>
          <br />
          <span className="searchitem-work">
            {intl('138583', '工作地点')}：{item.city ? item.city : '--'}
          </span>
          <span className="searchitem-work">
            {intl('214188', '经验要求')}：{item.work_experience ? item.work_experience : '--'}
          </span>
        </div>
      </div>
    )
  }
  jobViewList = (item, isDelete) => {
    return (
      <li className="history_list" id="jobViewList">
        <span
          style={{ lineHeight: '20px' }}
          onClick={() => wftCommon.jumpJqueryPage(`index.html#/jobDetail?type=jobs&detailid=${item.objectid}`)}
        >
          {item.keyword}
        </span>
        <br />
        <span className="job-corp" style={{ color: '#999999' }}>
          {intl('271969', '招聘企业')}:{item.detail.companyName}
        </span>
        {isDelete ? <span className="del-history"></span> : ''}
      </li>
    )
  }
  typeClick = (result, condition, param, paramResult, refresh) => {
    let { filter, allFilter, pageno } = this.state
    filter[param] = paramResult
    if (refresh) {
      pageno = 0
    }
    searchCommon.allFilterAdd(allFilter, condition, result, param)
    this.setState({ loading: true, filter, allFilter, pageno: pageno })
    this.getJobList()
  }
  clearAllFilter = () => {
    let { filter, allFilter } = this.state
    for (let key in filter) {
      delete filter[key]
    }
    allFilter = []
    this.setState({
      loading: true,
      filter: filter,
      allFilter,
      region: intl('138649', '不限'),
      industry: intl('138649', '不限'),
    })
    this.getJobList()
  }
  deleteFilter = (deleteType, deleteFilter) => {
    let { filter, allFilter, region, industry } = this.state
    for (let key in filter) {
      if (key == deleteType) {
        delete filter[key]
      }
    }
    if (deleteType == 'region') {
      region = intl('138649', '不限')
    } else if (deleteType == 'industry') {
      industry = intl('138649', '不限')
    }
    const newAllFilter = allFilter.filter((e) => {
      return e.type !== deleteFilter
    })
    this.setState({ loading: true, ...filter, allFilter: newAllFilter, region: region, industry: industry })
    this.getJobList()
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }

  render() {
    const { jobList, jobView, jobHotView, jobListErrorCode } = this.props
    return (
      <div className="SearchList" onScroll={this.scroll}>
        <SearchTitleList name="jobSearchList" jump={this.jump} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <AlreadyChooseFilter
                list={this.state.allFilter}
                delete={this.deleteFilter}
                deleteAll={this.clearAllFilter}
              />

              <ul className="job-ul" id="filterList" style={{ height: 'auto' }}>
                <li>
                  <span className="filter-name">{intl('138583', '工作地点')}：</span>
                  <Select
                    allowClear
                    placeholder={intl('138649', '不限')}
                    onChange={(e) => this.handleChange(e, 'region', intl('138583', '工作地点'))}
                    style={{ width: '284px', marginRight: '102px' }}
                    value={this.state.region}
                  >
                    {region.map((item) => {
                      return (
                        <Option key={item.region} title={item.region}>
                          {intl(item.regionid, item.region)}
                        </Option>
                      )
                    })}
                  </Select>
                  <span className="filter-name">{intl('257690', '国标行业')}：</span>
                  <Select
                    allowClear
                    placeholder={intl('138649', '不限')}
                    onChange={(e) => this.handleChange(e, 'industry', intl('257690', '国标行业'))}
                    style={{ width: '284px' }}
                    value={this.state.industry}
                  >
                    {jobIndustry.map((item) => {
                      return (
                        <Option key={item.region} title={item.region}>
                          {intl(item.regionid, item.region)}
                        </Option>
                      )
                    })}
                  </Select>
                </li>
                <li style={{ marginTop: '18px' }}>
                  <span className="filter-name">{intl('259951', '岗位描述')}：</span>
                  {jobDescribe.map((item) => {
                    let menu = (
                      <Menu>
                        {item.menu.map((i) => {
                          return (
                            <Menu.Item key={i.key}>
                              <li
                                onClick={(e) =>
                                  this.typeClick(
                                    intl(i.keyid, i.key),
                                    intl(item.typeid, item.typeid),
                                    item.param,
                                    i.key,
                                    1
                                  )
                                }
                              >
                                {intl(i.keyid, i.key)}
                              </li>
                            </Menu.Item>
                          )
                        })}
                      </Menu>
                    )
                    return (
                      <Dropdown overlay={menu}>
                        <a className="w-dropdown-link">
                          <span className="wi-link-color">{intl(item.typeid, item.type)}</span>
                          <DownO />
                        </a>
                      </Dropdown>
                    )
                  })}
                </li>
              </ul>
              <ResultContainer
                resultType={intl('271962', '找到%个符合条件的招聘信息')}
                resultNum={this.state.resultNum}
                resultList={jobList}
                list={jobCollationOption}
                handleChange={this.handleChange}
                loading={this.state.loading}
                searchCallBack={this.searchCallBack}
                loadingList={this.state.loadingList}
                errorCode={jobListErrorCode}
                reload={this.getJobList}
              />
            </div>
          </div>
          <div className="history-right">
            <div id="historyFocusList" className="search-r-model">
              <HistoryList
                list={jobView}
                title={intl('271967', '最近浏览的招聘信息')}
                listShowFun={this.jobViewList}
                isDelete
              />
              <HistoryList list={jobHotView} title={intl('271976', '热门浏览记录')} listShowFun={this.jobViewList} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jobList: state.companySearchList.jobList,
    jobView: state.companySearchList.jobView,
    jobHotView: state.companySearchList.jobHotView,
    jobListErrorCode: state.companySearchList.jobListErrorCode,
    keyword: state.companySearchList.searchKeyWord,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getJobList: (data) => {
      // if(data){
      return getJobList(data).then((res) => {
        dispatch(SearchListActions.getJobList({ ...res, ...data }))
        return res
      })
      // }
    },
    getJobView: (data) => {
      return getJobView(data).then((res) => {
        dispatch(SearchListActions.getJobView({ ...res, ...data }))
        return res
      })
    },
    getJobHotView: (data) => {
      return getJobHotView(data).then((res) => {
        dispatch(SearchListActions.getJobHotView({ ...res, ...data }))
        return res
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobSearchList)
