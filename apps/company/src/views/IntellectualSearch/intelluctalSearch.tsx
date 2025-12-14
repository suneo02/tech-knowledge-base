import { translateLoadManager } from '@/utils/intl/translateLoadManager.ts'
import { DownO } from '@wind/icons'
import { Checkbox, Dropdown, Menu, Radio } from '@wind/wind-ui'
import { LoadMoreTrigger } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import React from 'react'
import { connect } from 'react-redux'
import * as HomeActions from '../../actions/home'
import * as SearchListActions from '../../actions/searchList'
import { getIntellectualList, getIntellectualViewList, getPatentList } from '../../api/searchListApi.ts'
import IndustryCascader from '../../components/myCascader/IndustryCascader'
import {
  AlreadyChooseFilter,
  ResultContainer,
  SearchTitleList,
} from '../../components/searchListComponents/searchListComponents'
import { brandCollationOption } from '../../handle/searchConfig/brandCollationOption'
import { intellectualParam } from '../../handle/searchConfig/intellectualParam'
import { intelluctalCollationOption } from '../../handle/searchConfig/intelluctalCollationOption'
import { patentCollationOption } from '../../handle/searchConfig/patentCollationOption'
import { softwareCollationOption } from '../../handle/searchConfig/softwareCollationOption'
import { workCollationOption } from '../../handle/searchConfig/workCollationOption'
import { parseQueryString } from '../../lib/utils'
import { globalElectronEconomy } from '../../utils/config/electronEconomyTree'
import { globalLowCarbon } from '../../utils/config/lowCarbonTree'
import { globalStrategicEmergingIndustry } from '../../utils/config/strategicEmergingIndustryTree'
import { globalIndustryOfNationalEconomy } from '../../utils/industryOfNationalEconomyTree'
import { default as intl } from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import '../SearchList/index.less'
import { searchCommon } from '../commonSearchFunc'
import { lawStatusRoot } from '../singleDetail/patentDetail/patentConfig'
import IndustryFilterItem from './IndustryFilterItem'

const lawStatus = []
lawStatusRoot.map((t) => {
  t.node.map((tt) => {
    tt.parentCode = t.code
    tt.node &&
      tt.node.length &&
      tt.node.map((ttt) => {
        ttt.parentCode = t.code + '|' + tt.code
      })
  })
  lawStatus.push(t)
})

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const patentNewType = [
  {
    zh: '发明申请',
    en: 'Patent for Invention',
  },
  {
    zh: '授权发明',
    en: 'Patent for Authorized Invention',
  },
  {
    zh: '实用新型',
    en: 'Utility Model',
  },
  {
    zh: '外观设计',
    en: 'Design Patent',
  },
]

// 专利搜索
class IntelluctalSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNo: 0,
      pageSize: 10,
      resultNum: '',
      loading: true,
      loadingList: false,
      allFilter: [],
      type: 'intellectual_property_merge_search',
      key: 'apple',
      secondType: '',
      filter: {},
      category: '',
      showModal: false,
      moreFilter: false,
      patentType: '',
      patentClassification: '',
      selectValue: '',
      simpleLawValue: [],
      patentLawSels: [],
      patentLawOptions: [],
      strategicEmergingCodes: '',
      notionalEconomyCodes: '',
      greenLowCarbonTechnologyCodes: '',
      digitalEconomyCoreIndustryCodes: '',
    }
    // @ts-expect-error ttt
    this.param = { type: 'intellectual_property_merge_search' }
    // @ts-expect-error ttt
    this.simpleLaw = []
  }

  componentDidUpdate = (prevProps) => {
    // @ts-expect-error ttt
    if (this.props.keyword !== prevProps.keyword) {
      // @ts-expect-error ttt
      const keyword = this.props.keyword
      this.setState({ key: keyword }, () => this.clearAllFilter())
    }
  }

  componentDidMount = () => {
    const qsParam = parseQueryString()
    let urlSearch = qsParam['keyword'] || ''
    let urlType = qsParam['type'] || ''
    urlSearch = window.decodeURIComponent(urlSearch) // @ts-expect-error ttt
    let keyword = this.props.keyword || urlSearch || window.localStorage.getItem('searchValue') //redux中存储的预搜索框value
    keyword = window.decodeURIComponent(keyword)
    for (let i = 0; i < lawStatus.length; i++) {
      // @ts-expect-error ttt
      this.simpleLaw.push({
        label: intl(lawStatus[i].enCode, lawStatus[i].name),
        value: lawStatus[i].code,
      })
    }
    if (urlType) {
      // 从单项搜索进来，url上带了type
      if (urlType == 'patent_search') {
        urlType = 'patent_search'
      } else if (urlType == 'trademark_search') {
        urlType = 'trademark_search'
      } else {
        urlType = ''
      }
    }

    this.setState(
      {
        key: keyword,
        // @ts-expect-error ttt
        type: urlType ? urlType : this.state.type,
      }, // @ts-expect-error ttt
      () => this.getIntellectualList(urlType ? (urlType == 'patent_search' ? 'patent' : urlType) : this.state.type)
    ) // @ts-expect-error ttt
    this.props.getIntellectualViewList() // @ts-expect-error ttt
    this.props.setGlobalSearch()
    if (window.en_access_config) {
      patentNewType.map((t) => {
        if (!window.__GLOBAL__ZHKEYS__) window.__GLOBAL__ZHKEYS__ = {}
        if (!window.__GLOBAL__ZHKEYS__[t.zh]) window.__GLOBAL__ZHKEYS__[t.zh] = t.en
      })
    }
  }
  handleChange = (value, ntype, select) => {
    //排序功能事件
    // let { filter ,allFilter,type } = this.state
    // @ts-expect-error ttt
    const { allFilter, type } = this.state
    // filter[ntype] = value
    if (select) {
      searchCommon.allFilterAdd(allFilter, select, value, ntype)
    }
    this.setState(
      {
        loading: true,
        // ...filter,
        loadingList: false,
        pageNo: 0,
        allFilter,
        selectValue: value,
      },
      () => {
        // @ts-expect-error ttt
        this.getIntellectualList(type == 'patent_search' ? 'patent' : '')
      }
    )
  }
  getIntellectualList = (type, loadingList) => {
    //执行搜索事件
    // @ts-expect-error ttt
    this.searchParam = {
      // @ts-expect-error ttt
      pageNo: this.state.pageNo, // @ts-expect-error ttt
      pageSize: this.state.pageSize, // @ts-expect-error ttt
      type: this.state.type, // @ts-expect-error ttt
      key: this.state.key,
      source: 'cel', // @ts-expect-error ttt
      ...this.state.filter, // @ts-expect-error ttt
      sort: this.state.selectValue,
      // status: this.state.status.length > 0 ? this.state.status.join(',') + ','+this.state.badstatus.join(',') : this.state.badstatus.join(','),
    }
    if (type == 'patent') {
      const param = {
        // @ts-expect-error ttt
        queryText: this.state.key, // @ts-expect-error ttt
        ...this.state.filter, // @ts-expect-error ttt
        pageNo: this.state.pageNo, // @ts-expect-error ttt
        pageSize: this.state.pageSize, // @ts-expect-error ttt
        sort: this.state.selectValue,
      } // @ts-expect-error ttt
      this.props.getPatentList(param).then((res) => {
        if (res?.ErrorCode !== '0') {
          this.setState({ loading: false })
          if (param.pageNo < 1) {
            this.setState({ resultNum: '--' })
          }
        } else {
          if (loadingList) {
            this.setState({ loadingList: false })
          } else {
            this.setState({ loading: false, resultNum: wftCommon.formatMoney(res.Page.Records, '', '', 1) })
          }
        }
      })
    } else {
      this.props // @ts-expect-error ttt
        .getIntellectualList({
          // @ts-expect-error ttt
          ...this.searchParam,
        })
        .then((res) => {
          if (res?.ErrorCode !== '0') {
            this.setState({ loading: false }) // @ts-expect-error ttt
            if (this.searchParam.pageNo < 1) {
              this.setState({ resultNum: '--' })
            }
          } else {
            if (loadingList) {
              this.setState({ loadingList: false })
            } else {
              this.setState({ loading: false, resultNum: wftCommon.formatMoney(res.Page.Records, '', '', 1) })
            }
          }
        })
    }
  }

  loadMore = () => {
    // @ts-expect-error ttt
    const { pageNo, resultNum, type, loadingList } = this.state
    if (loadingList) {
      return
    }
    let newType = ''
    if (type == 'patent_search') {
      newType = 'patent'
    }

    if (resultNum && (pageNo + 1) * 10 < Number(String(resultNum).split(',').join(''))) {
      this.setState({ loadingList: true })
      this.setState({ pageNo: pageNo + 1 }, () => {
        this.getIntellectualList(newType, true)
      })
    }
  }

  searchCallBack = (item) => {
    // @ts-expect-error ttt
    const { type } = this.state
    return searchCommon.showIntelluctalBlock(item, type)
  }
  typeClick = (result, condition, param, paramResult, refresh, type) => {
    // @ts-expect-error ttt
    let { allFilter, pageNo, filter } = this.state
    if (param == 'patentType') {
      filter.patentClassification = ''
    }
    filter[param] = paramResult
    if (refresh) {
      pageNo = 0
    }
    if (param == 'type') {
      this.clearPatent()
      allFilter = []
      for (const key in filter) {
        delete filter[key]
      }
      this.setState({
        patentType: '',
      })
    }
    const newAllFilter = searchCommon.allFilterAdd(allFilter, condition, result, param)

    this.setState({ loading: true, allFilter: newAllFilter, pageNo: pageNo, filter }, () => {
      // @ts-expect-error ttt
      this.getIntellectualList(type)
    })
  }
  clearAllFilter = () => {
    // @ts-expect-error ttt
    let { filter, allFilter } = this.state
    for (const key in filter) {
      delete filter[key]
    }
    allFilter = []
    this.clearPatent()
    this.setState(
      {
        loading: true,
        filter: filter,
        allFilter,
        category: '',
        type: 'intellectual_property_merge_search',
        patentType: '',
        patentClassification: '',
        pageNo: 0,
      },
      () => {
        // @ts-expect-error ttt
        this.getIntellectualList()
      }
    )
  }
  clearPatent = () => {
    // @ts-expect-error ttt
    this.props.clearIntellectualList()
  }
  deleteFilter = (deleteType, deleteFilter) => {
    // @ts-expect-error ttt
    let { filter, allFilter, type, category } = this.state
    let newAllFilter = ''
    for (const key in filter) {
      if (key == deleteType) {
        delete filter[key]
      }
    }

    if (deleteType == 'lawStatus_leaveCode1') {
      this.setState({ simpleLawValue: [], patentLawSels: [] })
      filter['lawStatus_leaveCode2'] = ''
      filter['lawStatus_leaveCode3'] = ''
    }
    if (deleteType == 'lawStatus_leaveCode23') {
      this.setState({ patentLawSels: [] })
      filter['lawStatus_leaveCode2'] = ''
      filter['lawStatus_leaveCode3'] = ''
    }

    if (deleteType == 'type') {
      this.clearPatent()
      type = 'intellectual_property_merge_search'
    } else if (deleteType == 'category' && deleteFilter == intl('259004', '专利类型')) {
      category = ''
      filter[deleteType] = ''
    } else {
      filter[deleteType] = ''
    }
    if (deleteType == 'type') {
      allFilter = []
    } else {
      newAllFilter = allFilter.filter((e) => {
        if (deleteType == 'lawStatus_leaveCode1') {
          return e.type !== deleteFilter && e.filter !== 'lawStatus_leaveCode23'
        }
        return e.type !== deleteFilter
      })
    }
    this.setState(
      { loading: true, ...filter, allFilter: newAllFilter || allFilter, type: type, category: category },
      () => {
        // @ts-expect-error ttt
        this.getIntellectualList(this.state.type == 'patent_search' ? 'patent' : '')
      }
    )
  }
  onChange = (e, title, param, _refresh, type) => {
    // @ts-expect-error ttt
    if (this.state.loading) return false
    if (isEn() && translateLoadManager.isTranslating()) return false

    const selTab = e.target.value // @ts-expect-error ttt
    let { moreFilter } = this.state
    moreFilter = selTab == 'patent_search' ? true : false
    if (selTab == 'intellectual_property_merge_search') {
      this.setState({ patentClassification: '', simpleLawValue: [], patentLawSels: [], patentLawOptions: [] })
    }
    if (param == 'patentType') {
      // @ts-expect-error ttt
      if (this.state.patentType !== selTab) {
        this.setState({ patentClassification: '' })
      }
    }
    if (param == 'type') {
      this.setState({ selectValue: '' })
    }
    this.setState({ [param]: selTab, moreFilter: moreFilter })
    this.typeClick(
      searchCommon.searchParam[selTab] || selTab,
      title,
      param,
      selTab,
      1,
      selTab == 'patent_search' ? 'patent' : type
    )
  }
  jump = (data) => {
    searchCommon.jumpOtherSearch(this.props, data)
  }
  lotfilter = () => {
    this.setState({ showModal: true })
  }

  cascaderChange = (e: string[][], selectedOptions: any[]) => {
    console.log('cascaderChange', e, selectedOptions)
    const newArr2 = []
    const newArr3 = []
    if (selectedOptions) {
      for (let i = 0; i < selectedOptions.length; i++) {
        const code = selectedOptions[i][selectedOptions[i].length - 1].code
        if (selectedOptions[i].length > 1) {
          code && newArr3.push(code)
        } else {
          code && newArr2.push(code)
        }
      }
    }
    this.setState({
      patentLawSels: e,
    }) // @ts-expect-error ttt
    const { allFilter, filter } = this.state
    let newAllFilter = ''
    const txts = []
    if (newArr2.length) {
      filter['lawStatus_leaveCode2'] = newArr2.join(',')
      selectedOptions.map((t) => {
        t.map((tt) => {
          if (newArr2.indexOf(tt.code) > -1) {
            txts.push(tt.name)
          }
        })
      })
    } else {
      filter['lawStatus_leaveCode2'] = ''
    }

    if (newArr3.length) {
      filter['lawStatus_leaveCode3'] = newArr3.join(',')
      selectedOptions.map((t) => {
        t.map((tt) => {
          if (newArr3.indexOf(tt.code) > -1) {
            txts.push(tt.name)
          }
        })
      })
    } else {
      filter['lawStatus_leaveCode3'] = ''
    }
    if (txts.length) {
      newAllFilter = searchCommon.allFilterAdd(
        allFilter,
        intl('362039', '专利法律状态'),
        txts.join(','),
        'lawStatus_leaveCode23'
      )
    } else {
      newAllFilter = searchCommon.allFilterAdd(allFilter, intl('362039', '专利法律状态'), '', 'lawStatus_leaveCode23')
    }
    this.setState({ loading: true, allFilter: newAllFilter, pageNo: 0, filter }, () => {
      // @ts-expect-error ttt
      this.getIntellectualList('patent')
    })
  }

  patentIndustryChange = (e, typeCn, type, data) => {
    const industryArr = []
    if (data?.length) {
      data.map((t) => {
        industryArr.push(t[t.length - 1])
      })
    }
    // 根据 code 获取 options

    this.typeClick(e.join(','), typeCn, type, industryArr.join(','), 1, 'patent')
  }

  simpleLawChange = (e) => {
    // @ts-expect-error ttt
    const { allFilter, filter } = this.state
    if (!e || !e.length) {
      this.setState({
        simpleLawValue: e,
        patentLawSels: [],
        lawStatus_leaveCode2: '',
        lawStatus_leaveCode3: '',
      })
      filter['lawStatus_leaveCode2'] = ''
      filter['lawStatus_leaveCode3'] = ''
      const newAllFilter = searchCommon.allFilterAdd(
        allFilter,
        intl('362039', '专利法律状态'),
        '',
        'lawStatus_leaveCode23'
      )
      this.setState({ allFilter: newAllFilter, filter })
    } else {
      // @ts-expect-error ttt
      if (this.state.simpleLawValue && this.state.simpleLawValue.length > e.length) {
        // 一级取消
        // 有二三级情况下 需要同步取消二三级
        let delSimpleLawCode = ''
        // @ts-expect-error ttt
        this.state.simpleLawValue.map((t) => {
          if (e.indexOf(t) == -1) {
            delSimpleLawCode = t
          }
        })
        const patentLawOptions = []
        const delVal = []
        const txts = []
        // @ts-expect-error ttt
        this.state.patentLawSels.map((t) => {
          if (t instanceof Array) {
            txts.push(t[0])
          } else {
            txts.push(t)
          }
        }) // @ts-expect-error ttt
        this.state.patentLawOptions && // @ts-expect-error ttt
          this.state.patentLawOptions.length && // @ts-expect-error ttt
          this.state.patentLawOptions.map((t) => {
            if (t.parentCode !== delSimpleLawCode) {
              patentLawOptions.push(t)
            } else {
              if (txts.indexOf(t.name) > -1) {
                delVal.push(t.name)
              }
            }
          })
        const kepVal = []
        const kepCode2 = []
        const kepCode3 = []
        if (delVal && delVal.length) {
          txts.map((t) => {
            if (delVal.indexOf(t) == -1) {
              kepVal.push(t)
            }
          })
        }
        kepVal.map((t) => {
          patentLawOptions.map((tt) => {
            if (tt.name == t) {
              kepCode2.push(tt.code)
            } else {
              tt.node &&
                tt.node.length &&
                tt.node.map((ttt) => {
                  if (ttt.name == t) {
                    kepCode3.push(ttt.code)
                  }
                })
            }
          })
        })
        filter['lawStatus_leaveCode2'] = kepCode2.join(',')
        filter['lawStatus_leaveCode3'] = kepCode3.join(',')
        if (kepVal.length) {
          allFilter.map((t) => {
            if (t.filter == 'lawStatus_leaveCode23') {
              t.value = kepVal.join(',')
            }
          })
        } else {
          allFilter.map((t, idx) => {
            if (t.filter == 'lawStatus_leaveCode23') {
              allFilter.splice(idx, 1)
            }
          })
        }
        this.setState({
          patentLawSels: kepVal,
          patentLawOptions: patentLawOptions,
          filter: filter,
          allFilter: allFilter,
        })
      }
      this.setState({
        simpleLawValue: e,
      })
    }
    const opts = []
    if (e.indexOf('13772932779') > -1) {
      lawStatus[0].node.map((t) => {
        opts.push(t)
      })
    }
    if (e.indexOf('13772949036') > -1) {
      lawStatus[1].node.map((t) => {
        opts.push(t)
      })
    }
    if (e.indexOf('13772962293') > -1) {
      lawStatus[2].node.map((t) => {
        opts.push(t)
      })
    }
    const lawTxt = []
    e.map((t) => {
      // @ts-expect-error ttt
      this.simpleLaw.map((tt) => {
        if (t == tt.value) {
          lawTxt.push(tt.label)
        }
      })
    })
    this.setState({ patentLawOptions: opts })
    this.typeClick(
      lawTxt.join(','),
      intl('437312', '专利简单法律状态'),
      'lawStatus_leaveCode1',
      e.join(','),
      1,
      'patent'
    )
  }

  render() {
    // @ts-expect-error ttt
    const { intelluctalList, brandState, brandType, intelluctalErrorCode, patentSecondType } = this.props
    // @ts-expect-error ttt
    const { type, allFilter, patentType, patentClassification, loadingList, key } = this.state
    let intelluctalCollationOption2 = intelluctalCollationOption
    let css = ''
    if (type == 'patent_search') {
      intelluctalCollationOption2 = patentCollationOption
    } else if (type == 'trademark_search') {
      intelluctalCollationOption2 = brandCollationOption
    } else if (type == 'production_search') {
      intelluctalCollationOption2 = workCollationOption
    } else if (type == 'software_search') {
      intelluctalCollationOption2 = softwareCollationOption
    }
    if (type == 'intellectual_property_merge_search' || type == 'trademark_search') {
      css = 'intelluctalSearch-img-block'
    }
    return (
      <div className="SearchList">
        <SearchTitleList name="intelluctalSearch" jump={this.jump} keyword={key} />
        <div className="wrapper workspace-fix" id="SearchHome">
          <div className="search-l">
            <div className="search-for-company each-search-result">
              <AlreadyChooseFilter list={allFilter} delete={this.deleteFilter} deleteAll={this.clearAllFilter} />

              <ul className={`job-ul `} id="filterList" style={{ height: 'auto' }}>
                <li>
                  <span className="filter-name">{intl('119542', '搜索范围')}：</span>
                  <RadioGroup
                    // @ts-expect-error wind
                    onChange={(e) => this.onChange(e, intl('119542', '搜索范围'), 'type', 1)}
                    value={type}
                    data-uc-id="esDh70mUSP"
                    data-uc-ct="radiogroup"
                  >
                    {intellectualParam.map((item) => {
                      return (
                        <Radio value={item.param} data-uc-id="v_7KMP-ilF" data-uc-ct="radio">
                          {intl(item.typeid, item.type)}
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </li>
                {type == 'patent_search' ? (
                  patentNewType && patentNewType.length > 0 ? (
                    <li style={{ marginTop: '6px' }} className="patent-li">
                      <span className="filter-name" id="intSpan">
                        {intl('138430', '专利类型')}：
                      </span>
                      <div style={{ display: 'inline-block' }}>
                        <RadioGroup
                          onChange={(e) => this.onChange(e, intl('138430', '专利类型'), 'patentType', 1, 'patent')}
                          value={patentType}
                          data-uc-id="Ne2hxkVLHG"
                          data-uc-ct="radiogroup"
                        >
                          {
                            <Radio value={''} data-uc-id="MUeJOHfKpX" data-uc-ct="radio">
                              {intl('138649', '不限')}
                            </Radio>
                          }
                          {patentNewType.map((item) => {
                            return (
                              <Radio value={item.zh} data-uc-id="lsO51LSrcg" data-uc-ct="radio">
                                {window.en_access_config ? item.en : item.zh}
                              </Radio>
                            )
                          })}
                        </RadioGroup>
                      </div>
                    </li>
                  ) : null
                ) : null}
                {type == 'patent_search' ? (
                  <li className="patent-li industry-choose" id="bidChoose">
                    <IndustryFilterItem
                      title="战略新兴产业"
                      titleId="416840"
                      options={globalStrategicEmergingIndustry}
                      stateKey="strategicEmergingCodes"
                      onChange={this.patentIndustryChange}
                      data-uc-id="lB4UxSN7Pu"
                      data-uc-ct="industryfilteritem"
                    />
                    <IndustryFilterItem
                      title="国民经济行业"
                      titleId="312254"
                      options={globalIndustryOfNationalEconomy}
                      stateKey="notionalEconomyCodes"
                      onChange={this.patentIndustryChange}
                      data-uc-id="7xHblmQbIWT"
                      data-uc-ct="industryfilteritem"
                    />
                    <IndustryFilterItem
                      title="数字经济及其核心产业"
                      titleId="441760"
                      options={globalElectronEconomy}
                      stateKey="digitalEconomyCoreIndustryCodes"
                      onChange={this.patentIndustryChange}
                      data-uc-id="ZbQZdlAUTo8"
                      data-uc-ct="industryfilteritem"
                    />
                    <IndustryFilterItem
                      title="绿色低碳技术"
                      titleId="388434"
                      options={globalLowCarbon}
                      stateKey="greenLowCarbonTechnologyCodes"
                      onChange={this.patentIndustryChange}
                      data-uc-id="TQkOa8qWRQv"
                      data-uc-ct="industryfilteritem"
                    />
                  </li>
                ) : null}
                {type == 'patent_search' && patentType ? (
                  patentSecondType && patentSecondType.length > 0 ? (
                    <li style={{ marginTop: '6px' }} className="patent-li">
                      <span className="filter-name" id="intSpan">
                        {intl('272008', '专利类别')}：
                      </span>
                      <div style={{ display: 'inline-flex' }}>
                        <RadioGroup
                          onChange={(e) =>
                            this.onChange(e, intl('272008', '专利类别'), 'patentClassification', 1, 'patent')
                          }
                          value={patentClassification}
                          data-uc-id="rVFxt_Zxg8"
                          data-uc-ct="radiogroup"
                        >
                          {
                            <Radio value={''} data-uc-id="384jSOlFpa" data-uc-ct="radio">
                              {intl('138649', '不限')}
                            </Radio>
                          }
                          {patentSecondType.map((item) => {
                            return (
                              <Radio value={item.key} data-uc-id="JKAf27mPCU" data-uc-ct="radio">
                                {window.en_access_config ? item.key_en : item.key}
                              </Radio>
                            )
                          })}
                        </RadioGroup>
                      </div>
                    </li>
                  ) : null
                ) : null}
                {type == 'patent_search' ? (
                  <li style={{ marginTop: '6px' }} className="patent-li">
                    <span className="filter-name" id="intSpan">
                      {intl('437312', '专利简单法律状态')}：
                    </span>
                    <div style={{ display: 'inline-block' }}>
                      <CheckboxGroup
                        // @ts-expect-error ttt
                        options={this.simpleLaw}
                        // @ts-expect-error ttt
                        value={this.state.simpleLawValue}
                        onChange={(e) => this.simpleLawChange(e)}
                        data-uc-id="KakAPJly6u"
                        data-uc-ct="checkboxgroup"
                      ></CheckboxGroup>
                    </div>
                  </li>
                ) : null}
                {/* @ts-expect-error ttt */}
                {type == 'patent_search' && this.state.simpleLawValue && this.state.simpleLawValue.length ? (
                  <li style={{ marginTop: '6px' }} className="patent-li">
                    <span className="filter-name" id="intSpan">
                      {intl('362039', '专利法律状态')}：
                    </span>
                    <IndustryCascader
                      className="patent-cascader"
                      placeholder={intl('19498', '全部')}
                      // @ts-expect-error ttt
                      options={this.state.patentLawOptions}
                      from="bid"
                      valueType="name"
                      height="300px"
                      // @ts-expect-error ttt
                      value={this.state.patentLawSels}
                      industryLv3={true}
                      onChange={(e, item) => this.cascaderChange(e, item)}
                      data-uc-id="uz8tY669yfd"
                      data-uc-ct="industrycascader"
                    />
                  </li>
                ) : null}
                {type == 'trademark_search' && !window.en_access_config ? (
                  (brandState && brandState.length > 0) || (brandType && brandType.length > 0) ? (
                    <li style={{ marginTop: '6px', position: 'relative' }}>
                      <span className="filter-name filter-brandinfo" id="intSpan">
                        {intl('204102', '商标信息')}：
                      </span>
                      <div className="filter-brandoption">
                        {brandState.length > 0 ? (
                          <Dropdown
                            overlay={
                              // @ts-expect-error ttt
                              <Menu data-uc-id="tHye-Ov-rE" data-uc-ct="menu">
                                {brandState.map((item) => {
                                  return (
                                    <Menu.Item
                                      key={item.key}
                                      data-uc-id="2_sWDS0rEO"
                                      data-uc-ct="menu"
                                      data-uc-x={item.key}
                                    >
                                      <li
                                        onClick={() => {
                                          // @ts-expect-error ttt
                                          this.typeClick(item.key, intl('149497', '商标状态'), 'status', item.key, 1)
                                        }}
                                        data-uc-id="17QlypMij_U"
                                        data-uc-ct="li"
                                      >
                                        {item.key}
                                      </li>
                                    </Menu.Item>
                                  )
                                })}
                              </Menu>
                            }
                            data-uc-id="68PeVwymh"
                            data-uc-ct="dropdown"
                          >
                            <a className="w-dropdown-link">
                              {intl('149497', '商标状态')}
                              {/* @ts-expect-error ttt */}
                              <DownO data-uc-id="wkwijwLNi-" data-uc-ct="downo" />
                            </a>
                          </Dropdown>
                        ) : null}
                        {brandType.length > 0 ? (
                          <Dropdown
                            overlay={
                              // @ts-expect-error ttt
                              <Menu
                                style={{ maxHeight: '250px', overflow: 'scroll' }}
                                data-uc-id="iphOCggLDE"
                                data-uc-ct="menu"
                              >
                                {brandType.map((item) => {
                                  return (
                                    <Menu.Item
                                      key={item.key}
                                      data-uc-id="QSaY2_mdF4"
                                      data-uc-ct="menu"
                                      data-uc-x={item.key}
                                    >
                                      <li
                                        onClick={() => {
                                          // @ts-expect-error ttt
                                          this.typeClick(item.key, intl('145353', '商标类别'), 'category', item.key, 1)
                                        }}
                                        data-uc-id="EL55Pkps8PU"
                                        data-uc-ct="li"
                                      >
                                        {item.key}
                                      </li>
                                    </Menu.Item>
                                  )
                                })}
                              </Menu>
                            }
                            data-uc-id="gexQiVi-4J"
                            data-uc-ct="dropdown"
                          >
                            <a className="w-dropdown-link">
                              {intl('145353', '商标类别')}
                              {/* @ts-expect-error ttt */}
                              <DownO data-uc-id="ArisciBgAU" data-uc-ct="downo" />
                            </a>
                          </Dropdown>
                        ) : null}
                      </div>
                    </li>
                  ) : null
                ) : null}
              </ul>
              <ResultContainer
                css={css || ''}
                resultType={intl('437205', '找到 % 个符合条件的知识产权信息')}
                // @ts-expect-error ttt
                resultNum={this.state.resultNum}
                resultList={intelluctalList}
                list={intelluctalCollationOption2}
                handleChange={this.handleChange}
                // @ts-expect-error ttt
                loading={this.state.loading}
                searchCallBack={this.searchCallBack}
                // @ts-expect-error ttt
                loadingList={this.state.loadingList}
                // @ts-expect-error ttt
                moreFilter={this.state.moreFilter}
                errorCode={intelluctalErrorCode}
                reload={this.getIntellectualList}
                // @ts-expect-error ttt
                selectValue={this.state.selectValue}
              />
              <LoadMoreTrigger
                onLoadMore={this.loadMore}
                loading={loadingList}
                data-uc-id="MSSPdGdhrxU"
                data-uc-ct="loadmoretrigger"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    intelluctalList: state.companySearchList.intelluctalList,
    intelluctalViewList: state.companySearchList.intelluctalViewList,
    patentSecondType: state.companySearchList.patentSecondType,
    brandState: state.companySearchList.brandState,
    brandType: state.companySearchList.brandType,
    intelluctalErrorCode: state.companySearchList.intelluctalErrorCode,
    keyword: state.companySearchList.searchKeyWord,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getIntellectualList: (data) => {
      return getIntellectualList(data).then(
        (res) => {
          if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
            if (data.pageNo == '0') {
              // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
              dispatch(SearchListActions.getIntellectualList({ ...res, ...data }))
            }
          }

          new Promise((resolve, _reject) => {
            if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
              wftCommon.zh2en(
                res.data.list,
                (endata) => {
                  endata.map((t, idx) => {
                    t.search_tag = res.data.list[idx].search_tag

                    t.trademark_name_en = t.trademark_name || ''
                    t.trademark_name_en = t.trademark_name_en.replace
                      ? t.trademark_name_en.replace(/<em>|<\/em>/g, '')
                      : t.trademark_name_en
                    t.trademark_name = res.data.list[idx].trademark_name

                    t.patentName_en = t.patentName || ''
                    t.patentName_en = t.patentName_en.replace
                      ? t.patentName_en.replace(/<em>|<\/em>/g, '')
                      : t.patentName_en
                    t.patentName = res.data.list[idx].patentName

                    t.software_copyright_name_en = t.software_copyright_name || ''
                    t.software_copyright_name_en = t.software_copyright_name_en.replace
                      ? t.software_copyright_name_en.replace(/<em>|<\/em>/g, '')
                      : t.software_copyright_name_en
                    t.software_copyright_name = res.data.list[idx].software_copyright_name

                    t.work_title_en = t.work_title || ''
                    t.work_title_en = t.work_title_en.replace
                      ? t.work_title_en.replace(/<em>|<\/em>/g, '')
                      : t.work_title_en
                    t.work_title = res.data.list[idx].work_title
                  })
                  res.data.list = endata
                  dispatch(SearchListActions.getIntellectualList({ ...res, ...data }))
                  resolve(res)
                },
                null,
                () => {
                  dispatch(SearchListActions.getIntellectualList({ ...res, ...data }))
                  resolve(res)
                }
              )
            } else {
              dispatch(SearchListActions.getIntellectualList({ ...res, ...data }))
              resolve(res)
            }
            // return res
          })

          return res
        },
        (_res) => {
          // 接口error 404 的处理
          dispatch(
            SearchListActions.getPatentList({
              ErrorCode: '-2',
              code: '-2',
            })
          )
        }
      )
    },
    getPatentList: (data) => {
      return getPatentList(data).then(
        (res) => {
          if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
            if (data.pageNo == '0') {
              // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
              dispatch(SearchListActions.getPatentList({ ...res, ...data }))
            }
          }

          new Promise((resolve, _reject) => {
            let count = 0
            if (res.ErrorCode == '0' && res.data && res.data.list && res.data.list.length) {
              if (
                res.data.aggregations &&
                res.data.aggregations.agg_patentClassification &&
                res.data.aggregations.agg_patentClassification.length
              ) {
                wftCommon.zh2en(
                  res.data.aggregations.agg_patentClassification,
                  (endata) => {
                    endata.map((t, idx) => {
                      res.data.aggregations.agg_patentClassification[idx].key_en = t.key
                    })
                    count++
                    if (count == 2) {
                      resolve(res)
                      count = 0
                    }
                  },
                  null,
                  () => {
                    count++
                    if (count == 2) {
                      resolve(res)
                      count = 0
                    }
                  }
                )
              } else {
                count++
              }
              wftCommon.zh2en(
                res.data.list,
                (endata) => {
                  endata.map((t, idx) => {
                    t.patentName_en = t.patentName || ''
                    t.patentName_en = t.patentName_en.replace
                      ? t.patentName_en.replace(/<em>|<\/em>/g, '')
                      : t.patentName_en
                    t.patentName = res.data.list[idx].patentName
                  })
                  res.data.list = endata
                  dispatch(SearchListActions.getPatentList({ ...res, ...data }))
                  count++
                  if (count == 2) {
                    resolve(res)
                    count = 0
                  }
                },
                null,
                () => {
                  dispatch(SearchListActions.getPatentList({ ...res, ...data }))
                  count++
                  if (count == 2) {
                    resolve(res)
                    count = 0
                  }
                }
              )
            } else {
              dispatch(SearchListActions.getPatentList({ ...res, ...data }))
              count++
              resolve(res)
            }
            // return res
          })

          return res
        },
        (_res) => {
          // 接口error 404 的处理
          dispatch(
            SearchListActions.getPatentList({
              ErrorCode: '-2',
              code: '-2',
            })
          )
        }
      )
    },
    getIntellectualViewList: (data) => {
      return getIntellectualViewList(data).then((res) => {
        dispatch(SearchListActions.getIntellectualViewList({ ...res, ...data }))
        return res
      })
    },
    clearIntellectualList: (data) => {
      return dispatch(SearchListActions.clearIntellectualFilter({ ...data }))
    },
    setGlobalSearch: (_data) => {
      return dispatch(HomeActions.setGlobalSearch({ globalSearchReloadCurrent: true })) // 设置顶部search组件搜索时刷新当前路由
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntelluctalSearch)
