import { DownO } from '@wind/icons'
import { Checkbox, DatePicker, Dropdown, Menu, Modal, Radio } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../../actions/home'
import * as SearchListActions from '../../actions/searchList'
import {
  clearCompanyView,
  createDownload,
  delCompanyView,
  getCompanyHotView,
  getCompanySearchList,
  getCompanyView,
} from '../../api/searchListApi'
import SearchIndustry from '../../components/searchListComponents/searchIndustry'
import {
  AlreadyChooseFilter,
  HistoryList,
  ResultContainer,
  SearchTitleList,
} from '../../components/searchListComponents/searchListComponents'
import SearchRegion from '../../components/searchListComponents/searchRegion'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import './index.less'

import { globalIndustryOfNationalEconomy3 } from '@/utils/industryOfNationalEconomyTree'
import { getcorpiscollect, getcustomercountgroupnew } from '../../api/companyDynamic'
import { parseQueryString } from '../../lib/utils'
import { globalAreaTree } from '../../utils/areaTree'
import { searchCommon } from '../commonSearchFunc'
import { handleCompanySearchListData } from './handle'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { moreFilter } from '../../handle/searchConfig/moreFilter'
import { corpDescCondition } from '../../handle/searchConfig/corpDescCondition'
import { createDate } from '../../handle/searchConfig/createDate'
import { organizationType } from '../../handle/searchConfig/organizationType'
import { collationOption } from '../../handle/searchConfig/collationOption'

const RadioGroup = Radio.Group
const { RangePicker } = DatePicker

const StylePrefix = 'search-list'

// 产品介绍页面，游客访问
class SearchList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateRange: '',
      typeStatus: 'cn',
      selectedKeys: '',
      resultNum: '',
      loading: true,
      loadFalse: false,
      searchError: false,
      purchaseVip: false,
      loadingList: false,
      orgType: '',
      createDateDefault: '',
      filter: {},
      pageNo: 0,
      pageSize: 10,
      companyname: '小米',
      source: 'cel',
      allFilter: [],
      visible: false,
      status: [],
      capitalType: [],
      corpType: [],
      dateAllow: true,
      defaultTime: [],
      industryname: [],
      regioninfo: [],
    }
    this.dateAction = null
    this.urlKeyword = ''
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.keyword !== prevProps.keyword) {
      let keyword = this.props.keyword

      this.setState({ companyname: keyword ? keyword : '小米' }, () => this.clearAllFilter())
    }
  }

  componentDidMount = () => {
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    urlSearch = window.decodeURIComponent(urlSearch)
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    this.urlKeyword = keyword ? keyword : '小米'
    this.setState({ companyname: this.urlKeyword })
    this.getCompanySearchList()
    this.props.getCompanyView()
    this.props.getCompanyHotView()
    this.props.getCollectlist({ from: 'main' })
    this.props.setGlobalSearch()
  }

  onTimeChange = (date, dateString) => {
    if (dateString?.some((i) => !i) && dateString?.some((i) => i)) return
    let newArr = []
    let value = ''
    if (date) {
      for (let i = 0; i < dateString.length; i++) {
        if (dateString[i]) {
          newArr.push(dateString[i].replace(/-/g, ''))
        }
      }
      newArr = newArr.join('~')
      value = dateString.join('~')
      this.setState({ defaultTime: date, createDateDefault: 'custome' })
      this.dateAction = null
      this.dateAction = () => {
        this.typeClick('establishedTime', newArr, 1, intl('2824', '成立时间'), value)
      }
      this.dateAction()
    } else {
      this.setState({ defaultTime: '' })
    }
  }
  handleDateRangeChange = (e) => {
    this.setState({ dateRange: e.target.value })
  }
  typeClick = (type, value, refresh, typeName, valueName, multiple) => {
    //修改筛选项进行搜索
    let { filter, allFilter, pageNo } = this.state
    if (multiple) {
      filter[type] = filter[type] ? (filter[type] = filter[type] + '|' + value) : (filter[type] = value)
    } else {
      filter[type] = value
    }
    if (refresh) {
      this.setState({ pageNo: 0 })
    }
    let newAllFilter = searchCommon.allFilterAdd(allFilter, typeName, valueName, type, multiple)
    this.setState({ loading: true, filter, allFilter: newAllFilter })
    this.getCompanySearchList()
  }
  orgClick = (e) => {
    //机构类型选择事件
    this.setState({ orgType: e.target.value })
    this.typeClick('orgType', e.target.value, 1, intl('31990', '机构类型'), wftCommon.corpOrgType[e.target.value])
  }
  createDataChange = (e) => {
    let { dateAllow } = this.state
    let value = ''
    if (e.target.value) {
      value = e.target.value + '年'
    } else {
      value = '不限'
    }
    if (e.target.value !== 'custome') {
      this.typeClick('establishedTime', e.target.value, 1, intl('2824', '成立时间'), value)
      dateAllow = true
      this.setState({ createDateDefault: e.target.value, dateAllow: dateAllow })
    } else {
      dateAllow = false
      this.setState({ createDateDefault: 'custome', dateAllow: dateAllow })
      if (this.dateAction) this.dateAction()
    }
  }
  handleChange = (value, type) => {
    //排序功能事件
    let filter = this.state.filter
    filter[type] = value
    this.setState({ loading: true, ...filter, loadingList: false, pageNo: 0 })
    this.getCompanySearchList()
  }
  getCompanySearchList = (refresh, loadingList) => {
    //执行搜索事件, 名称过短不执行搜索
    this.searchParam = {
      pageNo: refresh ? this.state.pageNo : 0,
      pageSize: this.state.pageSize,
      companyname: this.state.companyname,
      ...this.state.filter,
    }
    if (this.urlKeyword) {
      this.searchParam.companyname = this.urlKeyword
      this.urlKeyword = ''
    } else if (this.state.companyname && this.state.companyname.length < 2) {
      this.setState({ loading: false })
      return
    }
    return this.props
      .getCompanySearchList({
        ...this.searchParam,
      })
      .then((res) => {
        if (loadingList) {
          this.setState({ loadingList: false })
        }
        this.setState({
          loading: false,
          resultNum:
            refresh && this.state.pageNo > 0
              ? this.state.resultNum
              : wftCommon.formatMoney(res.Data ? res.Data.total : res.Page?.Records, '', '', 1),
        })
      })
  }

  scroll = (event) => {
    //触底加载
    let { pageNo, resultNum } = this.state
    if (event.target.clientHeight + event.target.scrollTop + 20 >= event.target.scrollHeight) {
      if ((pageNo + 1) * 10 < resultNum.split(',').join('')) {
        if (this.state.loadingList) {
          setTimeout(() => {
            this.setState({
              loadingList: false,
            })
          }, 1000)
          return false
        }
        this.setState({ pageNo: pageNo + 1, loadingList: true }, () => this.getCompanySearchList(true, true))
      }
    }
  }
  clearAllFilter = () => {
    let { filter, allFilter } = this.state
    for (let key in filter) {
      delete filter[key]
    }
    allFilter = []
    this.setState({
      loading: true,
      orgType: '',
      createDateDefault: '',
      filter: filter,
      allFilter,
      status: [],
      capitalType: [],
      corpType: [],
      regioninfo: [],
      industryname: [],
      pageNo: 0,
    })
    this.getCompanySearchList()
  }
  deleteFilter = (deleteType, deleteFilter) => {
    let { filter, allFilter, dateAllow } = this.state
    for (let key in filter) {
      if (key == deleteType) {
        delete filter[key]
      }
    }
    if (deleteType == 'status' || deleteType == 'capitalType' || deleteType == 'corpType' || deleteType == 'orgType') {
      this.setState({ [deleteType]: '' })
    } else if (deleteType == 'establishedTime') {
      this.setState({ dateAllow: true, createDateDefault: '', defaultTime: [] })
    } else if (deleteType == 'regioninfo' || deleteType == 'industryname') {
      console.log(deleteType)
      this.setState({ [deleteType]: [] }, () => {
        console.log(this.state[deleteType])
      })
    }
    const newAllFilter = allFilter.filter((e) => {
      console.log(12312)
      return e.type !== deleteFilter
    })
    this.setState({ loading: true, ...filter, allFilter: newAllFilter }, () => {
      this.getCompanySearchList()
    })
  }
  delViewCorp = (item, idx, data) => {
    let list = []
    list = Object.assign(list, data)
    list.splice(idx, 1)
    delCompanyView({ isKeyword: 0, type: 'ent', companycode: item.companycode })
    this.props.setCompanyView({ data: list, code: '0' })
  }
  viewCompany = (item, isDelete, idx, data) => {
    return (
      <li className="history_list">
        <a
          className="wi-link-color"
          code={item.companycode}
          onClick={() => wftCommon.jumpJqueryPage(`Company.html?companycode=${item.companycode || item.companyCode}`)}
        >
          {item.keyword || item.companyName}
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
  viewHotCompany = (item, isDelete, idx, data) => {
    return (
      <li className="history_list">
        <a
          className="wi-link-color"
          code={item.id}
          onClick={() => wftCommon.jumpJqueryPage(`Company.html?companycode=${item.id || item.companyCode}`)}
        >
          {item.keyword || item.name}
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
  handleOk = (e) => {
    let deletetParam = {
      isKeyword: 0,
      type: 'ent',
    }
    pointBuriedByModule(922602101031)
    this.props.clearCompanyView(deletetParam)
    this.setState({ visible: false })
  }
  handleCancel = (e) => {
    this.setState({ visible: false })
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }

  multiSelect = (e, key, type, multiple) => {
    let change = this.state[key]
    this.setState({ [key]: e })
    const val = e ? e.join('|') : ''
    const valName = e ? e.join(',') : ''
    this.typeClick(key, val, 1, type, valName)
  }

  multiple = (e, key, type, multiple) => {
    let valuename = e.item.props.children.props.children.props.children
    let change = this.state[key]
    if (multiple) {
      change.push(e.key)
    }
    this.setState({ [key]: change })
    if (e.key == 'item_0') {
      this.typeClick(key, '', 1, type, valuename, multiple)
    } else {
      this.typeClick(key, e.key, 1, type, valuename, multiple)
    }
  }
  deSelect = (e, key, type) => {
    let { filter, allFilter } = this.state
    let change = this.state[key]
    if (filter[key]) {
      let a = filter[key].split('|')
      let newArr = []
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== e.key) {
          newArr.push(a[i])
        }
      }
      filter[key] = newArr.join('|')
      this.setState(
        {
          filter: filter,
        },
        () => this.getCompanySearchList()
      )
    }
    let newArr3 = []
    for (let j = 0; j < allFilter.length; j++) {
      if (allFilter[j].filter == key) {
        allFilter[j].value = e.selectedKeys.join('、')
      }
      if (allFilter[j].value) {
        newArr3.push(allFilter[j])
      }
    }
    let now = []
    for (let x = 0; x < change.length; x++) {
      if (change[x] !== e.key) {
        now.push(change[x])
      }
    }
    this.setState({ allFilter: newArr3, [key]: now })
  }
  download = () => {
    this.searchParam = {
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize,
      companyname: this.state.companyname,
      ...this.state.filter,
    }
    pointBuriedByModule(922602101032)
    createDownload(this.searchParam).then((res) => {
      if (res.ErrorCode == '0') {
        wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
      }
    })
  }
  searchChange = (e, type, ctype, state) => {
    let choose = []
    let show = []
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
      condition = choose.join('、')
    } else {
      condition = show.join('、')
    }
    console.log(e, type, ctype, state)
    this.typeClick(type, choose.join('|'), 1, ctype, condition)
    this.setState({ [state]: e })
  }

  render() {
    const { companyView, companyViewHot, companySearchList, companySearchErrorCode, collectList } = this.props
    return (
      <div className={`SearchList ${StylePrefix}`} onScroll={this.scroll}>
        <SearchTitleList name="searchList" jump={this.jump} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <div className="search-filter" id="searchFilter">
                <AlreadyChooseFilter
                  list={this.state.allFilter}
                  delete={this.deleteFilter}
                  deleteAll={this.clearAllFilter}
                />
                <ul id="filterList">
                  <li>
                    <span className="fitler-title">
                      <span langkey="">{intl('31990', '机构类型')}</span>：
                    </span>
                    <div id="corpTypeCondition">
                      <RadioGroup onChange={this.orgClick} value={this.state.orgType}>
                        {organizationType
                          .filter((res) => !res.disabled)
                          .map((item, index) => {
                            return (
                              <Radio value={item.type} key={index}>
                                {intl(item.nameId, item.name)}
                              </Radio>
                            )
                          })}
                      </RadioGroup>
                      <span
                        className="condi-high-search"
                        langkey=""
                        onClick={() => wftCommon.jumpJqueryPage('AdvancedSearch04.html')}
                      >
                        {intl('437294', '高级筛选条件')}
                      </span>
                    </div>
                  </li>

                  <li className="industry-choose">
                    <div className="city-industry clearfix">
                      <span className="title-city-industry">
                        <span langkey="">{intl('451213', '省份地区')}</span>：
                      </span>
                      <SearchRegion
                        placeholder={intl('138649', '不限')}
                        from
                        maxTagCount="responsive"
                        options={globalAreaTree}
                        value={this.state.regioninfo}
                        valueType="name"
                        height="190px"
                        dropMatchWidth
                        cssName="casader-choose-region"
                        onChange={(e) => this.searchChange(e, 'regioninfo', intl('451213', '省份地区'), 'regioninfo')}
                      />
                      <span className="title-city-industry" id="TitleIndustry">
                        <span langkey="">{intl('257690', '国标行业')}</span>：
                      </span>
                      <SearchIndustry
                        placeholder={intl('138649', '不限')}
                        maxTagCount="responsive"
                        options={globalIndustryOfNationalEconomy3}
                        value={this.state.industryname}
                        valueType="name"
                        height="190px"
                        dropMatchWidth
                        cssName="casader-choose-industry"
                        onChange={(e) =>
                          this.searchChange(e, 'industryname', intl('257690', '国标行业'), 'industryname')
                        }
                      />
                    </div>
                  </li>

                  <li>
                    <span className="fitler-title">
                      <span langkey="">{intl('2824', '成立时间')}</span> {window.en_access_config ? '' : ': '}
                    </span>
                    <div id="createDate">
                      <RadioGroup onChange={this.createDataChange} value={this.state.createDateDefault}>
                        {createDate.map((item, index) => {
                          return <Radio value={item.type}>{intl(item.timeId, item.time)}</Radio>
                        })}
                        <Radio className="custome" value="custome">
                          {intl('25405', '自定义')}
                          &nbsp;&nbsp;
                          <RangePicker
                            className={`${StylePrefix}--filter--create-date--picker`}
                            onChange={this.onTimeChange}
                            value={this.state.defaultTime}
                            allowClear
                          />
                        </Radio>
                      </RadioGroup>
                    </div>
                  </li>

                  <li>
                    <span className="fitler-title">
                      <span langkey="">{intl('437316', '企业描述')}</span>
                      {window.en_access_config ? '' : ': '}
                    </span>

                    <div id="corpDescCondition">
                      {corpDescCondition.map((item, index) => {
                        const conType = item.key
                        let menu = ''

                        if (conType == 'capitalType' || conType == 'corpType') {
                          menu = (
                            <Menu
                              selectedKeys={item.multiple ? this.state[item.key] : null}
                              selectable={item.multiple ? true : false}
                              multiple={item.multiple}
                            >
                              {
                                <Checkbox.Group
                                  value={
                                    this.state[item.key] && this.state[item.key].length ? this.state[item.key] : null
                                  }
                                  className="filter-corp-cbx"
                                  onChange={(e) =>
                                    this.multiSelect(e, item.key, intl(item.typeId, item.type), item.multiple)
                                  }
                                >
                                  {item.children.map((itemM, indexM) => {
                                    return (
                                      <Checkbox value={itemM.option}>{intl(itemM.optionId, itemM.option)}</Checkbox>
                                    )
                                  })}
                                </Checkbox.Group>
                              }
                            </Menu>
                          )
                        }

                        if (conType == 'status') {
                          let selItem = []
                          item.children.map((t) => {
                            if (t.key == this.state.typeStatus) {
                              selItem = t.option
                            }
                          })
                          menu = (
                            <Menu
                              selectedKeys={item.multiple ? this.state[item.key] : null}
                              selectable={item.multiple ? true : false}
                              multiple={item.multiple}
                            >
                              {
                                <Checkbox.Group
                                  value={
                                    this.state[item.key] && this.state[item.key].length ? this.state[item.key] : null
                                  }
                                  className="filter-corp-cbx"
                                  onChange={(e) =>
                                    this.multiSelect(e, item.key, intl(item.typeId, item.type), item.multiple)
                                  }
                                >
                                  {selItem.map((itemM, indexM) => {
                                    return (
                                      <Checkbox value={itemM.option}>{intl(itemM.optionId, itemM.option)}</Checkbox>
                                    )
                                  })}
                                </Checkbox.Group>
                              }
                            </Menu>
                          )
                        }

                        if (!menu) {
                          menu = (
                            <Menu
                              selectedKeys={item.multiple ? this.state[item.key] : null}
                              selectable={item.multiple ? true : false}
                              multiple={item.multiple}
                              onClick={
                                item.multiple ? null : (e) => this.multiple(e, item.key, intl(item.typeId, item.type))
                              }
                              onSelect={
                                item.multiple
                                  ? (e) => this.multiple(e, item.key, intl(item.typeId, item.type), item.multiple)
                                  : null
                              }
                              onDeselect={(e) => this.deSelect(e, item.key, intl(item.typeId, item.type))}
                            >
                              {item.children.map((itemM, indexM) => {
                                return item.key == 'status' ? (
                                  itemM.key == this.state.typeStatus ? (
                                    itemM.option.map((itemZ, indexZ) => {
                                      return (
                                        <Menu.Item ref={(el) => (this.nodeEle = el)} key={itemZ.optionType}>
                                          <li type={itemZ.optionType}>
                                            <span>{intl(itemZ.optionId, itemZ.option)}</span>
                                          </li>
                                        </Menu.Item>
                                      )
                                    })
                                  ) : null
                                ) : (
                                  <Menu.Item ref={(el) => (this.nodeEle = el)} key={itemM.optionType}>
                                    <li type={itemM.optionType}>
                                      <span>{intl(itemM.optionId, itemM.option)}</span>
                                    </li>
                                  </Menu.Item>
                                )
                              })}
                            </Menu>
                          )
                        }
                        return (
                          <Dropdown overlay={menu}>
                            <a className="w-dropdown-link">
                              <span className="wi-link-color">{intl(item.typeId, item.type)}</span>
                              {item.isVip ? <i className="vipjb"></i> : null}
                              <DownO />
                            </a>
                          </Dropdown>
                        )
                      })}
                    </div>
                  </li>

                  <li style={{ marginTop: '22px' }}>
                    <span className="fitler-title">
                      <span className="remain">
                        <span langkey="">{intl('257674', '更多筛选')}</span>
                        <i className="vipjb"></i>：
                      </span>
                    </span>
                    <div id="corpOtherCondition" className="sort-dialog-corp">
                      {moreFilter.map((item, index) => {
                        let menu = (
                          <Menu>
                            {item.menu.map((itemM, indexM) => {
                              return (
                                <Menu.Item key={itemM.dataType}>
                                  <li
                                    key={itemM.dataType}
                                    onClick={() => {
                                      this.typeClick(item.type, itemM.dataType, 1, item.title, itemM.title)
                                    }}
                                  >
                                    {intl(itemM.titleId, itemM.title)}
                                  </li>
                                </Menu.Item>
                              )
                            })}
                          </Menu>
                        )
                        return (
                          <Dropdown overlay={menu}>
                            <a className="w-dropdown-link">
                              <span className="wi-link-color">{intl(item.titleId, item.title)}</span>
                              <DownO />
                            </a>
                          </Dropdown>
                        )
                      })}
                    </div>
                  </li>
                </ul>
                <ResultContainer
                  resultType={intl('260454', '找到%家符合条件的企业')}
                  typeFrom="corp"
                  selectValue={this.state.filter ? this.state.filter.sort : '-1'}
                  resultNum={this.state.resultNum}
                  resultList={companySearchList}
                  list={collationOption}
                  handleChange={this.handleChange}
                  loading={this.state.loading}
                  searchCallBack={(e) => searchCommon.searchCallBack(e, collectList)}
                  loadingList={this.state.loadingList}
                  errorCode={companySearchErrorCode}
                  reload={this.getCompanySearchList}
                  export
                  download={this.download}
                />
              </div>
            </div>
          </div>
          <div className="history-right">
            <div id="historyFocusList" className="search-r-model">
              {companyView && companyView.length ? (
                <HistoryList
                  list={companyView}
                  title={intl('437296', '最近浏览企业')}
                  listShowFun={this.viewCompany}
                  isDelete
                  allDelete
                  showModal={this.showModal}
                />
              ) : null}
              {companyViewHot && companyViewHot.length ? (
                <HistoryList
                  list={companyViewHot}
                  title={intl('437297', '热门浏览企业')}
                  listShowFun={this.viewHotCompany}
                />
              ) : null}
            </div>
          </div>
          {this.state.visible ? (
            <Modal
              title={intl('31041', '提示')}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>{intl('272001', '全部清除最近浏览企业')}</p>
            </Modal>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    companySearchList: state.companySearchList.companySearchList,
    companyViewHot: state.companySearchList.companyViewHot,
    companyView: state.companySearchList.companyView,
    companySearchErrorCode: state.companySearchList.companySearchErrorCode,
    collectList: state.companySearchList.collectList,
    keyword: state.companySearchList.searchKeyWord,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanySearchList: (data) => {
      if (!data) {
        return
      }
      if (!data.sort) {
        data.sort = '-1'
      }
      return getCompanySearchList(data).then((res) => {
        let searchDataHandled = handleCompanySearchListData(res?.data?.search)
        if (res?.data?.search) {
          res.data.search = searchDataHandled
        }
        if (res.ErrorCode == '0' && res.data && res.data.search && res.data.search.length) {
          const list = []
          res.data.search.map((t, idx) => {
            list.push(t.corp_id)
          })

          if (!window.en_access_config) {
            // 继续取翻译标志
            getcorpiscollect({ companyCode: list.join(',') }).then(
              (listRes) => {
                if (listRes.ErrorCode == '0' && listRes.Data) {
                  res.data.search.map((t) => {
                    if (listRes.Data[t.corp_id]) {
                      t.is_mycustomer = true
                    }
                  })
                }
                dispatch(
                  SearchListActions.getCompanySearchList({
                    ...res,
                    ...data,
                    collectFrom: data.companyname + '$' + data.pageNo,
                  })
                )
              },
              () => {
                dispatch(SearchListActions.getCompanySearchList({ ...res, ...data }))
              }
            )
            return res
          } else {
            if (data.pageNo == '0') {
              // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
              // 继续取翻译标志
              getcorpiscollect({ companyCode: list.join(',') }).then(
                (listRes) => {
                  if (listRes.ErrorCode == '0' && listRes.Data) {
                    res.data.search.map((t) => {
                      if (listRes.Data[t.corp_id]) {
                        t.is_mycustomer = true
                      }
                    })
                  }
                  dispatch(
                    SearchListActions.getCompanySearchList({
                      ...res,
                      ...data,
                      collectFrom: data.companyname + '$' + data.pageNo,
                    })
                  )
                },
                () => {
                  dispatch(SearchListActions.getCompanySearchList({ ...res, ...data }))
                }
              )
            }
          }
        }

        new Promise((resolve, reject) => {
          if (res.ErrorCode == '0' && res.data && res.data.search && res.data.search.length) {
            wftCommon.zh2en(
              res.data.search,
              (endata) => {
                endata.map((t, idx) => {
                  t.corp_name = res.data.search[idx].corp_name
                })
                res.data.search = endata
                dispatch(SearchListActions.getCompanySearchList({ ...res, ...data }))
                resolve(res)
              },
              null,
              () => {
                dispatch(SearchListActions.getCompanySearchList({ ...res, ...data }))
                resolve(res)
              }
            )
          } else {
            dispatch(SearchListActions.getCompanySearchList({ ...res, ...data }))
            resolve(res)
          }
        })

        return res
      })
    },
    getCompanyView: (data) => {
      return getCompanyView(data).then((res) => {
        dispatch(SearchListActions.getCompanyView({ ...res, ...data }))
        return res
      })
    },
    setCompanyView: (data) => {
      return dispatch(SearchListActions.getCompanyView({ ...data }))
    },
    getCompanyHotView: (data) => {
      return getCompanyHotView(data).then((res) => {
        dispatch(SearchListActions.getCompanyHotView({ ...res, ...data }))
        return res
      })
    },
    clearCompanyView: (data) => {
      return clearCompanyView(data).then((res) => {
        dispatch(SearchListActions.clearCompanyView({ ...res, ...data }))
        return res
      })
    },
    getCollectlist: (data) => {
      return getcustomercountgroupnew().then((res) => {
        dispatch(SearchListActions.getCollectlist({ ...res, ...data }))
        return res
      })
    },
    setGlobalSearch: (data) => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchList)
