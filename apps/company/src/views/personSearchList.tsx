import TextExpandable from '@/components/common/expandable/textExpandable/TextExpandable'
import { LinksModule } from '@/handle/link'
import { Modal } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../actions/home'
import * as SearchListActions from '../actions/searchList'
import { pointBuriedByModule } from '../api/pointBuried/bury'
import {
  addPersonView,
  delPersonViewAll,
  delPersonViewOne,
  getPersonList,
  getPersonView,
} from '../api/searchListApi.ts'
import man from '../assets/imgs/logo/man.png'
import Links from '../components/common/links/Links'
import SearchIndustry from '../components/searchListComponents/searchIndustry'
import { HistoryList, ResultContainer, SearchTitleList } from '../components/searchListComponents/searchListComponents'
import SearchRegion from '../components/searchListComponents/searchRegion'
import { map } from '../handle/searchConfig/map'
import { parseQueryString } from '../lib/utils'
import { globalIndustryOfNationalEconomy3 } from '../utils/industryOfNationalEconomyTree'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import './SearchList/index.less'
import { searchCommon } from './commonSearchFunc'

type PersonSearchListProps = {
  keyword: string
  getPersonList: (data: any) => Promise<any>
  setGlobalSearch: (data?: any) => void
  getPersonView: (data?: any) => Promise<any>
  setPersonView: (data?: any) => void
  clearPersonView: (data?: any) => Promise<any>
  personList: any[]
  personListErrorCode: string
  personView: any[]
}

type PersonSearchListState = {
  filter: {
    pageNo: number
    pageSize: number
  }
  queryText: string
  resultNum: string
  loading: boolean
  loadingList: boolean
  visible: boolean
  industryname: string[]
  regioninfo: string[]
}
// 产品介绍页面，游客访问
class PersonSearchList extends React.Component<PersonSearchListProps, PersonSearchListState> {
  private param: any
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
      visible: false,
      industryname: [],
      regioninfo: [],
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      const keyword = this.props.keyword

      this.setState({ queryText: keyword ? keyword : '小米', industryname: [], regioninfo: [], loading: true }, () =>
        this.getPersonList()
      )
    }
  }

  componentDidMount = () => {
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    urlSearch = window.decodeURIComponent(urlSearch)
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    this.setState({ queryText: keyword }, () => this.getPersonList())
    this.props.setGlobalSearch()
    this.props.getPersonView()
  }
  handleChange = (value) => {
    //排序功能事件
    const filter = this.state.filter
    filter['sort'] = value
    filter['pageNo'] = 0
    // @ts-expect-error ttt
    this.setState({ loading: true, ...filter, loadingList: false }, () => this.getPersonList())
  }
  getPersonList = (loadingList?) => {
    const regioninfo = this.state.regioninfo
    let regionVal = ''
    if (regioninfo && regioninfo.length) {
      regioninfo.map((t) => {
        if (t.length > 1) {
          if (regionVal) {
            regionVal = regionVal + '|' + (t[0] + ' ' + t[1])
          } else {
            regionVal = t[0] + ' ' + t[1]
          }
        } else {
          if (regionVal) {
            regionVal = regionVal + '|' + t[0]
          } else {
            regionVal = t[0]
          }
        }
      })
    }

    const industryname = this.state.industryname
    let industryVal = ''
    if (industryname && industryname.length) {
      industryname.map((t) => {
        if (t.length > 1) {
          if (industryVal) {
            industryVal = industryVal + '|' + t[t.length - 1]
          } else {
            industryVal = t[t.length - 1]
          }
        } else {
          if (industryVal) {
            industryVal = industryVal + '|' + t[0]
          } else {
            industryVal = t[0]
          }
        }
      })
    }

    //执行搜索事件
    this.param = {
      queryText: this.state.queryText,
      industryname: industryVal,
      regioninfo: regionVal,
      ...this.state.filter,
      // this.state.key
    }
    return this.props
      .getPersonList({
        ...this.param,
      })
      .then((res) => {
        if (loadingList) {
          this.setState({ loadingList: false })
        } else {
          console.log(1232131)
          this.setState({
            loading: false,
            resultNum: wftCommon.formatMoney(res.Page ? res.Page.Records : 0, '', '', 1),
          })
        }
      })
  }

  searchChange = (e, type, _ctype, state) => {
    const choose = []
    const show = []
    for (let i = 0; i < e.length; i++) {
      if (type == 'industryname') {
        choose.push(e[i][e[i].length - 1])
      } else {
        choose.push(e[i].join(' '))
        show.push(e[i][e[i].length - 1])
      }
    }
    let condition: any = ''
    if (type == 'industryname') {
      condition = choose.join('、')
    } else {
      condition = show.join('、')
    }
    const filter = this.state.filter
    filter['pageNo'] = 0
    // @ts-expect-error ttt
    this.setState({ [state]: e, loading: true, ...filter }, () => {
      this.getPersonList()
    })
  }

  scroll = (event) => {
    //触底加载
    if (event.target.clientHeight + event.target.scrollTop + 3 >= event.target.scrollHeight) {
      const filter = this.state.filter
      // @ts-expect-error ttt
      if ((filter['pageNo'] + 1) * 10 < this.state.resultNum.split(',').join('')) {
        if (this.state.loadingList) {
          return false
        }
        filter['pageNo'] = filter['pageNo'] + 1
        this.setState({ filter: filter, loadingList: true }, () => {
          this.getPersonList(true)
        })
      }
    }
  }
  searchCallBack = (item) => {
    const personIdStr = item.personId ? item.personId : ''
    const introduce = item.introduce ? item.introduce : '--'
    const personName = item.personName ? item.personName : '--'
    const hasCompany =
      item.companyName && item.companyCode ? (
        <span
          className="person-company underline"
          onClick={() => {
            addPersonView({
              parameter: item.companyCode,
              entityId: item.personId,
            })
            wftCommon.jumpJqueryPage('Company.html?companycode=' + item.companyCode + '&linksource=personSearch')
          }}
        >
          {item.companyName}
        </span>
      ) : (
        '--'
      )
    const position = item.position ? item.position : ''
    const titleEnName = item.personName_en || ''
    return (
      <div className="person-div">
        <div className="person-title">
          <div className="person-message">
            <div className="person-logo">
              {item.image ? (
                <img
                  className="person-img"
                  onError={(e) => {
                    // @ts-expect-error ttt
                    e.target.src = man
                  }}
                  src={wftCommon.addWsidForImg(item.image)}
                />
              ) : (
                <span className="person-span">
                  {item.personName ? item.personName.replace(/<em>([^<]*?)<\/em>/gi, '$1').slice(0, 1) : '--'}
                </span>
              )}
            </div>
            <div className="person-detail">
              <div className="person-name">
                <Links
                  module={LinksModule.CHARACTER}
                  id={item.personId}
                  title={<h5 className="person-name-h5" dangerouslySetInnerHTML={{ __html: personName }}></h5>}
                ></Links>

                {window.en_access_config && titleEnName ? (
                  <div className="div_Card_name_en">
                    {' '}
                    <span> {titleEnName} </span> {<i>{intl('362293', '该翻译由AI提供')} </i>}{' '}
                  </div>
                ) : null}
              </div>
              <div className="person-have">
                {hasCompany}
                <span className="person-position">{position}</span>
              </div>
            </div>
          </div>
        </div>
        <TextExpandable content={`${intl('451241', '简介')}：${introduce}`} maxLines={3} />
      </div>
    )
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }

  delViewCorp = (item, idx, data) => {
    let list = []
    list = Object.assign(list, data)
    list.splice(idx, 1)
    delPersonViewOne({ parameter: item.parameter, entityId: item.entityId })
    this.props.setPersonView({ data: list, code: '0' })
  }
  viewPersonList = (item, isDelete, idx, data) => {
    let name = item.entityName ? item.entityName + ' | ' : ''
    name = name + item.parameterName

    return (
      <li className="history_list">
        <a
          className="wi-link-color"
          // @ts-expect-error ttt
          code={item.parameter}
          onClick={() => wftCommon.jumpJqueryPage(`Company.html?companycode=${item.companycode || item.parameter}`)}
        >
          {name}
        </a>
        {isDelete ? (
          <span
            className="del-history"
            onClick={() => {
              return this.delViewCorp(item, idx, data)
            }}
          ></span>
        ) : (
          ''
        )}
      </li>
    )
  }
  showModal = () => {
    this.setState({ visible: true })
  }
  handleOk = (_e) => {
    this.props.clearPersonView()
    this.setState({ visible: false })
  }
  handleCancel = (_e) => {
    this.setState({ visible: false })
  }

  render() {
    const { personList, personListErrorCode, personView } = this.props
    return (
      <div className="SearchList" onScroll={this.scroll}>
        <SearchTitleList name="personSearchList" jump={this.jump} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <ul className="filterlist-person">
                <li className="industry-choose">
                  <div className="city-industry clearfix">
                    <span className="title-city-industry">
                      <span>{intl('451213', '省份地区')}</span>：
                    </span>
                    <SearchRegion
                      placeholder={intl('138649', '不限')}
                      // open={}
                      from
                      options={map}
                      value={this.state.regioninfo}
                      // defaultValue = {this.state.regioninfo && this.state.regioninfo.length ? this.state.regioninfo : null}
                      valueType="name"
                      height="190px"
                      dropMatchWidth
                      cssName="casader-choose-region"
                      onChange={(e) => {
                        pointBuriedByModule(922602101033)
                        this.searchChange(e, 'regioninfo', intl('451213', '省份地区'), 'regioninfo')
                      }}
                    />
                    <span className="title-city-industry" id="TitleIndustry">
                      <span>{intl('257690', '国标行业')}</span>：
                    </span>
                    <SearchIndustry
                      placeholder={intl('138649', '不限')}
                      // open={}
                      options={globalIndustryOfNationalEconomy3}
                      value={this.state.industryname}
                      valueType="name"
                      height="190px"
                      dropMatchWidth
                      cssName="casader-choose-industry"
                      onChange={(e) => {
                        pointBuriedByModule(922602101034)
                        this.searchChange(e, 'industryname', intl('257690', '国标行业'), 'industryname')
                      }}
                    />
                  </div>
                </li>
              </ul>

              <ResultContainer
                resultType={intl('437313', '找到%个符合条件的人物')}
                resultNum={this.state.resultNum}
                resultList={personList}
                loading={this.state.loading}
                searchCallBack={this.searchCallBack}
                loadingList={this.state.loadingList}
                errorCode={personListErrorCode}
                reload={this.getPersonList}
              />
            </div>
          </div>

          <div className="history-right">
            <div id="historyFocusList" className="search-r-model">
              {personView && personView.length ? (
                <HistoryList
                  list={personView}
                  title={intl('437334', '最近浏览人物')}
                  listShowFun={this.viewPersonList}
                  isDelete
                  allDelete
                  showModal={this.showModal}
                />
              ) : null}
            </div>
          </div>
          {this.state.visible ? (
            // @ts-expect-error ttt
            <Modal
              title={intl('31041', '提示')}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>{intl('272002', '全部清除最近浏览人物')}</p>
            </Modal>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    personList: state.companySearchList.personList,
    personListErrorCode: state.companySearchList.personListErrorCode,
    keyword: state.companySearchList.searchKeyWord,
    personView: state.companySearchList.personView,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPersonList: (data) => {
      return getPersonList(data).then((res) => {
        if (res.ErrorCode == '0' && res.data && res.data.length) {
          if (data.pageNo == '0') {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            dispatch(SearchListActions.getPersonList({ ...res, ...data }))
          }
        }
        new Promise((resolve, _reject) => {
          if (res.ErrorCode == '0' && res.data && res.data.length) {
            wftCommon.zh2en(
              res.data,
              (endata) => {
                endata.map((t, idx) => {
                  t.personName_en = t.personName || ''
                  t.personName_en = t.personName_en.replace
                    ? t.personName_en.replace(/<em>|<\/em>/g, '')
                    : t.personName_en
                  t.personName = res.data[idx].personName
                })
                res.data = endata
                dispatch(SearchListActions.getPersonList({ ...res, ...data }))
                resolve(res)
              },
              null,
              () => {
                dispatch(SearchListActions.getPersonList({ ...res, ...data }))
                resolve(res)
              }
            )
          } else {
            dispatch(SearchListActions.getPersonList({ ...res, ...data }))
            resolve(res)
          }
          // return res;
        })
        return res
      })
    },
    setGlobalSearch: (_data) => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
    getPersonView: (data) => {
      return getPersonView(data).then((res) => {
        dispatch(SearchListActions.getPersonView({ ...res, ...data }))
        return res
      })
    },
    setPersonView: (data) => {
      return dispatch(SearchListActions.getPersonView({ ...data }))
    },
    clearPersonView: (data) => {
      return delPersonViewAll(data).then((_res) => {
        return dispatch(SearchListActions.getPersonView({ data: [], code: '0' }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonSearchList)
