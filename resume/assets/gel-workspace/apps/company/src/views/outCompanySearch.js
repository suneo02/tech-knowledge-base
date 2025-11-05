import React from 'react'
import { connect } from 'react-redux'
import { Radio, Select, Tag } from '@wind/wind-ui'
import { getOutCompanySearch, getOutCompanyView } from '../api/searchListApi'
import * as SearchListActions from '../actions/searchList'
import * as HomeActions from '../actions/home'
import { HistoryList, ResultContainer, SearchTitleList } from '../components/searchListComponents/searchListComponents'
import { wftCommon } from '../utils/utils'
import defaultCompanyImg from '../assets/imgs/default_company.png'
import intl from '../utils/intl'
import './SearchList/index.less'
import { outCompanyParam, outCompanySort, outCompanySort2 } from '../handle/searchConfig'
import { searchCommon } from './commonSearchFunc'
import { parseQueryString } from '../lib/utils'
import './OutCompanySearch.less'
import { CompanyTagArr } from '../components/company/intro/tag/TagArr'
import { pointBuriedByModule } from '../api/pointBuried/bury'

const Option = Select.Option
const RadioGroup = Radio.Group

const StylePrefix = 'out-company-search'

// 产品介绍页面，游客访问
class outCompanySearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNo: 0,
      pageSize: 10,
      companyname: 'apple',
      resultNum: '',
      loading: true,
      loadingList: false,
      sort: '-1',
      areaType: '',
      sortChange: false,
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      let keyword = this.props.keyword
      this.setState({ companyname: keyword ? keyword : 'apple', loading: true }, () => this.getOutCompanySearch())
    }
  }

  componentDidMount = () => {
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    urlSearch = window.decodeURIComponent(urlSearch)
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    let type = qsParam['country'] || ''
    this.setState({ companyname: keyword, areaType: type }, () => this.getOutCompanySearch())
    this.props.getOutCompanyView({ type: 'ent', isKeyword: 0 })
    this.props.setGlobalSearch()
  }
  handleChange = (value) => {
    //排序功能事件
    let { pageNo, sort } = this.state
    sort = value
    pageNo = 0
    this.setState({ loading: true, pageNo: pageNo, sort: sort, loadingList: false }, () => {
      this.getOutCompanySearch()
    })
  }
  getOutCompanySearch = (loadingList) => {
    //执行搜索事件
    this.param = {
      companyname: this.state.companyname,
      source: 'cel',
      sort: this.state.sort,
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize,
      areaType: this.state.areaType,
    }
    return this.props
      .getOutCompanySearch({
        ...this.param,
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
    if (event.target.clientHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      let { pageNo, resultNum } = this.state
      console.log(event.target.clientHeight, event.target.scrollTop, event.target.scrollHeight, pageNo, resultNum)
      if ((pageNo + 1) * 10 < resultNum.split(',').join('')) {
        console.log(1111)
        this.setState({ loadingList: true })
        setTimeout(() => {
          this.setState({ pageNo: (pageNo = pageNo + 1) }, () => {
            this.getOutCompanySearch()
          })
        }, 300)
      }
    }
  }
  onChange = (e) => {
    if (this.state.loading) return false
    this.setState(
      {
        areaType: e.target.value,
        sortChange: e.target.value == 'deu' ? true : false,
        pageNo: 0,
        sort: '-1',
        loading: true,
      },
      () => {
        this.getOutCompanySearch()
      }
    )
  }
  gotoCorp = (item) => {
    item.corp_id && wftCommon.linkCompany('Bu3', item.corp_id)
  }
  searchCallBack = (item) => {
    let imgSrc = defaultCompanyImg
    let imgId = item.logo ? item.logo : ''
    if (imgId) {
      imgSrc = wftCommon.getlogoAccess(imgId, '', 6683)
    }
    let companyName = ''
    if (item.highlight && item.highlight.corp_name) {
      companyName = item.highlight.corp_name
    } else {
      companyName = item.corp_name ? item.corp_name : '--'
    }
    let titleEnName = item.corp_name_en || ''
    return (
      <div className="div_Card">
        <div className="searchcontent-global">
          <div className="div_Card_global_top">
            <div className="searchpic-brand">
              <img className="big-logo" width="60" src={imgSrc} onError={() => defaultCompanyImg} />
            </div>
            <div>
              <h4
                onClick={() => {
                  return this.gotoCorp(item)
                }}
                dangerouslySetInnerHTML={{ __html: companyName }}
                className="search-outcompany-top"
              ></h4>

              {window.en_access_config && titleEnName ? (
                <div className="div_Card_name_en">
                  {' '}
                  <span> {titleEnName} </span> {<i>{intl('362293', '该翻译由AI提供')} </i>}{' '}
                </div>
              ) : null}

              <div className="global_state">
                {item.govlevel ? <span className="state-yes">{item.govlevel ? item.govlevel : '--'}</span> : null}
                {item.corp_tags ? (
                  item.corp_tags === 'ipo' ? (
                    <Tag className={`${StylePrefix}--item-tag-feture`} type="primary" color="color-2">
                      {intl('69771', '海外上市')}
                    </Tag>
                  ) : (
                    <Tag className={`${StylePrefix}--item-tag-feture`} type="primary" color="color-2">
                      {item.corp_tags}
                    </Tag>
                  )
                ) : null}
                {Array.isArray(item?.corporationTags) && item?.corporationTags?.length ? (
                  <>
                    <CompanyTagArr tagArr={item.corporationTags || []} size="small" />
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div
            className="each-searchlist-item"
            dangerouslySetInnerHTML={{ __html: searchCommon.showTextfromCountry(item.area_type, item, companyName) }}
          ></div>
          {item.area_cn && item.area_cn.length ? (
            <Tag className={`${StylePrefix}--card-tag`} type="primary" color="color-2">
              {item.area_cn}
            </Tag>
          ) : null}
        </div>
      </div>
    )
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }
  outViewList = (item, isDelete) => {
    let region = item.detail ? item.detail.region : ''
    switch (region) {
      case 'usa':
        region = '美国'
        break
      case 'eng':
        region = '英国'
        break
      case 'jpn':
        region = '日本'
        break
      case 'kor':
        region = '韩国'
        break
      case 'deu':
        region = '德国'
        break
      case 'fra':
        region = '法国'
        break
      case 'sgp':
        region = '新加坡'
        break
      case 'ita':
        region = '意大利'
        break
      case 'can':
        region = '加拿大'
        break
      case 'cn':
        region = '中国'
        break
      default:
        region = '其他'
        break
    }
    region = region + ' | '
    return (
      <li className="history_list">
        <a
          className="wi-link-color"
          code={item.objectid}
          onClick={() => wftCommon.jumpJqueryPage(`Company.html?companycode=${item.objectid}`)}
        >
          {region} {item.keyword}
        </a>
        {isDelete ? <span className="del-history"></span> : ''}
      </li>
    )
  }

  render() {
    const { outCompanySearchList, outCompanySearchErrorCode, outCompanyView } = this.props
    console.log(outCompanySearchList, outCompanySearchErrorCode)
    return (
      <div className="SearchList" onScroll={this.scroll}>
        <SearchTitleList name="outCompanySearch" jump={this.jump} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <ul className="job-ul" id="filterList" style={{ height: 'auto' }}>
              <li className="search-company-type">
                <span className="filter-name">{intl('119542', '搜索范围')}：</span>
                <RadioGroup
                  onChange={(e) => {
                    pointBuriedByModule(922602101035)
                    this.onChange(e)
                  }}
                  value={this.state.areaType}
                >
                  {outCompanyParam.map((item) => {
                    return (
                      <Radio key={item.param} value={item.param}>
                        {intl(item.typeid, item.type)}
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </li>
            </ul>
            <div style={{ color: '#aaa', padding: '0 15px 10px 15px' }}>
              {window.en_access_config
                ? 'Chinese companies, please search in " Company " '
                : '中国企业请在“查企业”中进行搜索'}{' '}
            </div>
            <div className="search-for-company each-search-result">
              <ResultContainer
                resultType={intl('437222', '找到 % 家符合条件的企业')}
                resultNum={this.state.resultNum}
                resultList={outCompanySearchList}
                list={this.state.sortChange ? outCompanySort2 : outCompanySort}
                handleChange={this.handleChange}
                loading={this.state.loading}
                searchCallBack={this.searchCallBack}
                loadingList={this.state.loadingList}
                errorCode={outCompanySearchErrorCode}
                reload={this.getOutCompanySearch}
                selectValue={this.state.sort}
              />
            </div>
          </div>
          <div className="history-right">
            <div id="historyFocusList" className="search-r-model">
              {outCompanyView && outCompanyView.length ? (
                <HistoryList
                  list={outCompanyView}
                  listShowFun={this.outViewList}
                  title={intl('437296', '最近浏览企业')}
                />
              ) : null}
              {/* <HistoryList list={companyViewHot} title={intl('265471','热门浏览企业')}/> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    outCompanySearchList: state.companySearchList.outCompanySearchList,
    outCompanySearchErrorCode: state.companySearchList.outCompanySearchErrorCode,
    keyword: state.companySearchList.searchKeyWord,
    outCompanyView: state.companySearchList.outCompanyView,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOutCompanySearch: (data) => {
      return getOutCompanySearch(data).then((res) => {
        if (res.ErrorCode == '0' && res.data && res.data.length) {
          if (data.pageNo == '0') {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            dispatch(SearchListActions.getOutCompanySearch({ ...res, ...data }))
          }
        }

        new Promise((resolve, reject) => {
          if (res.ErrorCode == '0' && res.data && res.data.length) {
            const list = []
            if (window.en_access_config) {
              res.data.map((t) => {
                if (t.highlight && t.highlight.corp_name && t.highlight.corp_name[0]) {
                  list.push(t.highlight.corp_name[0])
                  t.highlight.corp_name = t.highlight.corp_name[0].replace(/<em>|<\/em>/g, '')
                } else {
                  t.corp_name = t.corp_name.replace(/<em>|<\/em>/g, '')
                }
              })
            }

            wftCommon.zh2en(
              res.data,
              (endata) => {
                window.en_access_config &&
                  endata.map((t, idx) => {
                    t.corp_name_en = t.corp_name || ''
                    t.corp_name_en = t.corp_name_en.replace
                      ? t.corp_name_en.replace(/<em>|<\/em>/g, '')
                      : t.corp_name_en
                    // t.corp_name = list[idx]
                    if (t.highlight) {
                      t.highlight.corp_name = t.corp_name
                    }
                  })
                res.data.list = endata
                dispatch(SearchListActions.getOutCompanySearch({ ...res, ...data }))
                resolve(res)
              },
              null,
              () => {
                dispatch(SearchListActions.getOutCompanySearch({ ...res, ...data }))
                resolve(res)
              }
            )
          } else {
            dispatch(SearchListActions.getOutCompanySearch({ ...res, ...data }))
            resolve(res)
          }
          // return res
        })

        return res
      })
    },
    getOutCompanyView: (data) => {
      return getOutCompanyView(data).then((res) => {
        dispatch(SearchListActions.getOutCompanyView({ ...res, ...data }))
        return res
      })
    },
    setGlobalSearch: (data) => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(outCompanySearch)
