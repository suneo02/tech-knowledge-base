import { BaiFenSites } from '@/handle/link'
import { Breadcrumb, message, Modal, Popconfirm, Spin } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React from 'react'
import { connect } from 'react-redux'
import * as FilterResActions from '../actions/filterRes'
import * as FindCustomerActions from '../actions/findCustomer'
import * as globalActions from '../actions/global'
import { namelistAdd, namelistBind, namelistDelete, namelistEdit, seensave } from '../api/collect&namelist'
import { getIndicator, pointBuried, pointBuriedGel } from '../api/configApi'
import { getContactByCropid, getCustomerSubList, measureSearch, search } from '../api/findCustomer'
import { postData } from '../api/settingApi'
import { templateQuery, templateShare } from '../api/templateApi'
import TreeTransfer from '../components/filterOptions/TreeTransfer'
import ApplyModal from '../components/filterRes/ApplyModal'
import Condition from '../components/filterRes/Condition'
import { MyIcon } from '../components/Icon'
import LimitNotice from '../components/LimitNotice'
import RestructFilterModal from '../components/restructFilter/RestructFilterModal'
import Subscribe from '../components/Subscribe'
import { GlobalContext } from '../context/GlobalContext'
import global from '../lib/global'
import { overVip, VipPopup } from '../lib/globalModal'
import { getGuid, getVipInfo, numberFormat, parseQueryString } from '../lib/utils'
import { connectZustand } from '../store'
import { useConditionFilterStore } from '../store/cde/useConditionFilterStore'
import store from '../store/store'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import './FilterRes.less'

function getColumnsWidth(key) {
  let defaultWidth = {
    'No.': 50,
    corp_name: 300,
    credit_code: 240,
    region: 160,
    industry_gb: 160,
    industry_code: 160,
    artificial_person: 100,
    govlevel: 100,
    established_time: 130,
    capital_amount: 160,
    capital_unit: 120,
    register_address: 300,
    office_address: 300,
    tel: 160,
    mail: 240,
    biz_scope: 300,
    brief: 300,
    corporation_tags: 160,
    corp_classify: 160,
    eng_name: 240,
    oper_period_end: 240,
    endowment_num: 100,
    ent_scale_num_indicator: 100,
    'count.patent_num': 100,
    'count.trademark_num': 100,
  }
  return defaultWidth[key] || 300
}

// 配合测试，丢失传参的情况
let state = {
  filters: [
    {
      itemId: 77,
      logic: 'any',
      value: ['存续'],
      title: '营业状态',
      info: {
        itemId: 77,
        itemName: '营业状态',
        itemEn: 'govlevel',
        itemField: 'govlevel',
        itemType: '3',
        selfDefine: 0,
        itemOption: [
          { name: '存续', value: '存续' },
          { name: '迁出', value: '迁出' },
          { name: '注销', value: '注销' },
          { name: '吊销，未注销', value: '吊销,未注销' },
          { name: '停业', value: '停业' },
          { name: '撤销', value: '撤销' },
          { name: '非正常户', value: '非正常户' },
          { name: '吊销，已注销', value: '吊销,已注销' },
        ],
        itemRemark: null,
        logicOption: 'any',
        hasExtra: false,
        parentId: 0,
        extraConfig: null,
        isVip: 0,
      },
      field: 'govlevel',
    },
    {
      itemId: 78,
      logic: 'any',
      value: ['298010000,298020000,298040000'],
      title: '机构类型',
      info: {
        itemId: 78,
        itemName: '机构类型',
        itemEn: 'data_from',
        itemField: 'data_from',
        itemType: '3',
        selfDefine: 0,
        itemOption: [
          { name: '境内企业', value: '298010000,298020000,298040000' },
          { name: '政府机构', value: '160300000' },
          { name: '社会组织', value: '160900000' },
          { name: '事业单位', value: '160307000' },
          { name: '律所', value: '912034101' },
        ],
        itemRemark: null,
        logicOption: 'any',
        hasExtra: false,
        parentId: 0,
        extraConfig: null,
        isVip: 0,
      },
      field: 'data_from',
    },
  ],
}
// state = {};

/**
 * FilterRes组件 - 查询结果页面的主要组件
 * 用于展示企业数据查询结果，并提供各种操作功能
 */
class FilterRes extends React.Component {
  // 使用GlobalContext获取全局上下文
  static contextType = GlobalContext

  /**
   * 构造函数
   * @param {Object} props - 组件属性
   */
  constructor(props) {
    super(props)

    // 从localStorage获取用户信息
    let userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {}
    this.sessionid = userInfo.sessionId
    this.mail = userInfo.mail

    // 初始化组件状态
    this.state = {
      targetKeys: [], // 指标树选择项
      selectedRowKeys: [], // 表格选中行的key
      selectedRows: [], // 表格选中的行数据
      transferVisible: false, // 指标选择弹窗是否可见
      filterVisible: false, // 过滤器是否可见
      subscribeVisible: false, // 订阅弹窗是否可见
      templateShareVisible: false, // 模板分享弹窗是否可见
      limitNoticeVisible: false, // 限制提醒是否可见
      measures: [
        // 默认度量指标
        { field: 'No.', title: intl(28846, '序号') },
        { field: 'corp_id', title: '企业ID' },
        { field: 'corp_name', title: intl(138677, '企业名称') },
        { title: intl('138808', '统一社会信用代码'), field: 'credit_code' },
        { field: 'govlevel', title: intl(261971, '营业状态') },
        { title: intl(149629, '成立日期'), field: 'established_time' },
        { title: intl('138185', '营业期限'), field: 'oper_period_end' },
        { title: intl(451220, '注册资本(万)'), field: 'capital_amount', align: 'right' },
        { field: 'artificial_person', title: intl(149509, '法定代表人') },
        { field: 'region', title: intl(257635, '地区') },
        { field: 'register_address', title: intl(35776, '注册地址') },
        { field: 'industry_gb_1', title: intl(257653, '行业') },
        { field: 'industry_gb_2', title: intl(257653, '行业') },
        { field: 'industry_gb', title: intl(257653, '行业') },
        { field: 'tel', title: intl(10057, '联系电话') },
      ],
      columns: [
        {
          title: <p>{intl(28846, '序号')}</p>,
          width: getColumnsWidth('No.'),
          dataIndex: 'No.',
          fixed: 'left',
          render: (_text, _record) => {
            return 1
          },
        },
        {
          title: <p>{intl(32914, '公司名称')}</p>,
          width: getColumnsWidth('corp_name'),
          dataIndex: 'corp_name',
          fixed: 'left',
          render: (text, record) => (
            <a
              onClick={() => {
                pointBuriedGel('922602100841', '数据浏览器', 'cdeGotoF9')
                record.corp_id && wftCommon.linkCompany('Bu3', record.corp_id)
                // window.open(getCompanyUrl(record.corp_id)); pointBuried({
                //   action: "922604570162",
                //   params: [{ paramName: "Company_Id", paramValue: record.corp_id }],
                // });
              }}
              rel="noreferrer"
            >
              {text}
            </a>
          ),
        },
      ],
      tableWidth: 300,
      checkColumns: [],
      // 左侧操作的item，打开对应的filter中的tab
      checkItem: null,
      title: '', // 头部标题
      sentence: '', // 一句话文案
      superQueryLogic: null, // 一句话条件
      filters: [], // 筛选条件
      sourceId: getGuid().replace(/-/g, ''),
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth,
      loading: false,
      searchBusy: false,
      // 最近看过和同行在看打开的，带 subscribeId templateId id
      subscribeId: null,
      templateId: null,
      id: null,
      // 打开时的json，如果变化，删除 templateId
      filtersJson: '',
      // 排序
      orderBy: '',
      orderType: '',

      // 是否弹出订阅msg提示框
      subMsgVisible: true,
      // 按钮开关
      subSwitch: true,
      // 订阅的条件
      subFilterJson: '',
      // 当筛选项过少，结果返回过多时弹出弹框
      dataRangeVisible: false,
      // 投稿包含定位信息
      geoTempVisible: false,
      overLimit: false,
      // 是否大数据量查询，serach接口中带参
      largeSearch: false,
      // 表格滚动位置，局部刷新新增指标列的数据
      tableSrollTop: 0,
      // 加载全部指标的页码，按20条分页
      allDataPageNum: {},
      // 正在加载指标的页码
      loadingPageNum: {},
      // 已选vip指标数量
      vipIndicatorCount: 0,

      filterModal: false,
      isRename: false,
      inputFirstValue: '',
      pageNum: 1,
      emptyNode: '  ', // 初始加载的占位

      subInfo: { fromAdd: true },
      subAddBtnDisabled: false,
      loadingTips: '',
    }
    this.pageSize = 20
    // // Filter的弹窗挂载的父级节点
    // this.modalParent = null;
    // // Filter节点
    // this.filterEl = null;
    // table节点
    this.tableEl = null
    this.queryConditionBySid = null
    // 页面初始化，没有则设置默认空值
    console.log(props.location.state)

    const qsParam = parseQueryString()
    const subscribeId = qsParam.subscribeid || qsParam.subscribeId
    if (props.location.state) {
      const {
        current_location = [],
        specialSQL,
        geoFilter = [],
        templateId,
        searchType = '',
        measures = [],
        subscribeId = null,
      } = this.props.location.state
      this.state.current_location = current_location
      this.state.geoFilter = geoFilter
      this.state.searchType = searchType
      this.state.measures = measures.length > 0 ? measures : this.state.measures
      this.state.subscribeId = subscribeId
      this.state.id = subscribeId
      this.state.title = specialSQL?.words || ''
      // console.log(this.state);
      // 模板使用计数
      templateId &&
        templateQuery({
          templateId: templateId,
        })
      // this.setState({
      //   ...this.state
      // })
    } else if (subscribeId) {
      props.location.state = {}

      this.queryConditionBySid = this.props.getMySusById({ id: subscribeId }).then((res) => {
        if (res.code == global.SUCCESS) {
          if (res.data && res.data.records && res.data.records.length) {
            const item = res.data.records[0]
            const mail = res.data.mail
            this.setState({
              subInfo: {
                id: this.subscribeId,
                subName: item.subName,
                subPush: item.subPush,
                superQueryLogic: item.superQueryLogic,
                subEmail: mail,
              },
              subAddBtnDisabled: true,
            })

            this.props.setFilters(JSON.parse(item.superQueryLogic).filters)
          }
        } else {
          this.setState({
            subInfo: {
              fromAdd: false,
              id: this.subscribeId,
              superQueryLogic: JSON.stringify({
                filters: this.props.filters,
              }),
            },
            subAddBtnDisabled: true,
          })
        }
        return res
      })
    } else {
      props.location.state = state
    }
    this.subscribeId = ''
    // getIndustries();
  }

  componentWillMount = () => {
    const qsParam = parseQueryString(this.props.history)
    const subscribeId = qsParam.subscribeid || qsParam.subscribeId
    this.subscribeId = subscribeId
    console.log(qsParam)
  }

  componentDidMount = () => {
    // this.props.getIndicator();
    Promise.all([this.props.getIndicator(), this.queryConditionBySid, this.props.getFilterConfigList]).then((_res) => {
      // console.log(res)
      console.log(this.props.location.state)
      this.setInitInfo({
        filters:
          this.props.filters && this.props.filters.length ? this.props.filters : this.props.location.state.filters,
        geoFilter: this.props.geoFilter,
      })
    })
    window.onresize = () => {
      this.setState({
        clientHeight: document.documentElement.clientHeight,
      })
    }

    if (this.subscribeId) {
      this.props.getMySusById({ id: this.subscribeId }).then((res) => {
        if (res.code == global.SUCCESS) {
          if (res.data && res.data.records && res.data.records.length) {
            const item = res.data.records[0]
            const mail = res.data.mail
            this.setState({
              subInfo: {
                id: this.subscribeId,
                subName: item.subName,
                subPush: item.subPush,
                superQueryLogic: item.superQueryLogic,
                subEmail: mail,
              },
              subAddBtnDisabled: true,
            })
          }
        } else {
          this.setState({
            subInfo: {
              fromAdd: false,
              id: this.subscribeId,
              superQueryLogic: JSON.stringify({
                filters: this.props.filters,
              }),
            },
            subAddBtnDisabled: true,
          })
        }
      })
    }

    // let tbody = this.tbody = this.tableEl.children[0].children[0].children[0].children[0].children[1];
    // tbody.onscroll = this.onScroll;
  }

  setFilterModal = (modal) => {
    if (modal) {
      pointBuriedGel('922602100838', '数据浏览器', 'cdeAddMoreFilter')
    }
    this.setState({
      filterModal: modal,
    })

    if (this.state.subInfo && !this.state.subInfo.fromAdd) {
      // 非首次保存订阅，需要检测是否有条件变更
      let subFilters = this.state.subInfo.superQueryLogic
      subFilters = subFilters ? JSON.parse(subFilters).filters : []

      let filters = this.props.filters
      filters = filters && filters.length ? filters : []

      if (!subFilters.length) {
        this.setState({
          subAddBtnDisabled: true,
        })
        return
      }

      if (subFilters.length == filters.length) {
        const str1 = JSON.stringify(subFilters)
        const str2 = JSON.stringify(filters)
        if (str1.length == str2.length) {
          this.setState({
            subAddBtnDisabled: true,
          })
        } else {
          this.setState({
            subAddBtnDisabled: false,
          })
        }
      } else {
        this.setState({
          subAddBtnDisabled: false,
        })
      }
    }
  }

  componentWillUnmount = () => {
    this.props.clearDatas()
  }

  onChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    this.setState({
      selectedRowKeys,
      selectedRows,
    })
  }

  onChangeFirst = (e) => {
    this.setState({
      inputFirstValue: e.target.value,
    })
  }

  generFilterJson = (values) => {
    let tmpData = []
    let _filters = JSON.parse(JSON.stringify(values))
    _filters.map((filter) => {
      delete filter.info
    })
    _filters.forEach((el) => {
      let itemList = []
      let keysList = Object.keys(el).sort()
      keysList.forEach((kl) => {
        itemList.push(el[kl])
      })
      tmpData.push(itemList)
    })
    return JSON.stringify(tmpData)
  }

  setInitInfo = async (prarms = {}) => {
    this.props.clearSubType()
    const { filters = [], geoFilter = [] } = prarms
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })

    this.setState({ subFilterJson: this.generFilterJson(_filters) })
    this.setFilters(prarms)
    if (filters.length === 0 && geoFilter.length === 0) {
      return
    }
    // 等待 setState 完成
    setTimeout(() => {
      // 设置表格指标
      let measures = []
      this.state.measures.forEach((measure) => measures.push(measure.field))
      ;(filters.length > 0 || geoFilter.length > 0) && this.handleChange(measures, true)
      // geoFilter解析定位及地盘数据
      // 未携带info信息，需要设置筛选项
      // this.filterEl.setFilters(filters, geoFilter);
      // this.preSearch(1, 40);
      this.search(this.state.pageNum, this.pageSize)
    }, 10)
  }

  setFilters = (prarms = {}) => {
    const { specialSQL = {}, filters = [], geoFilter = [], templateId, subscribeId, id } = prarms
    let { words = '', superQueryLogic } = specialSQL
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    let isChangeFilter = this.state.subFilterJson !== this.generFilterJson(_filters)
    this.state.searchType = isChangeFilter ? '' : this.state.searchType
    console.log(filters)
    this.setState({
      title: words || this.state.title, // 头部标题
      sentence: words || this.state.sentence, // 一句话文案
      superQueryLogic, // 一句话条件
      filters, // 筛选条件
      geoFilter,
      templateId: templateId || this.state.templateId || 0, // 模板id
      subscribeId: subscribeId || this.state.subscribeId,
      // id: id || this.state.id || getGuid().replace(/-/g, ''), // 名单id
      id: id || this.state.id || this.state.subscribeId, // 名单id
      filtersJson: !this.state.filtersJson && JSON.stringify(filters), // 筛选项
      // subMsgVisible: !(subscribeId || this.state.subscribeId),
      // subSwitch: true
    })

    // this.setState({ subMsgVisible: isChangeFilter })
  }

  // 条件查询
  search = (pageNum, pageSize = 20) => {
    if (pageNum === 1) {
      if (this.state.pageNum > 1) {
        this.setState({ loading: true, searchBusy: true, emptyNode: '  ' })
      } else {
        this.setState({ loading: true, searchBusy: true })
      }
      this.props.clearDatas()
    } else {
      this.setState({
        searchBusy: true,
        emptyNode: window.en_access_config ? intl('132725', '暂无数据') : Table.emptyNode,
      })
    }
    const { filters, geoFilter } = this.props
    const { measures, orderBy, orderType, overLimit, largeSearch, searchType } = this.state
    const { total } = this.props.filterRes
    if ((pageNum > Math.ceil(total / pageSize) || overLimit) && pageNum !== 1) {
      this.setState({ loading: false, searchBusy: false })
      return
    }

    if (filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      this.setState({ loading: false, searchBusy: false })
      return false
    }

    this.setState({ subscribeId: this.props.filterRes.subscribeId || this.state.subscribeId })
    let isChangeFilter = this.state.subFilterJson !== this.generFilterJson(filters)
    let filtersParam = []

    filters &&
      filters.length &&
      filters.map((t) => {
        if (t.itemType == '9') {
          t.search = t.search ? t.search : t.value
          delete t.value
        }
        filtersParam.push(t)
      })

    this.props
      .search(
        {
          pageNum,
          pageSize,
          superQueryLogic: {
            filters: filtersParam,
            measures,
            geoFilter,
          },
          order: orderBy
            ? {
                orderBy,
                orderType: orderType ? (orderType !== 'descend' ? 1 : 0) : '',
              }
            : null,
          largeSearch,
          fromTemplate: searchType === 'demo',
        },
        dataCall
      )
      .then((res) => {
        dataCall(res)
      })
      .catch((_error) => {
        this.setState({ loading: false, searchBusy: false })
      })

    const _this = this

    function dataCall(res, _loaded) {
      _this.setState({ loading: false, searchBusy: false })
      if (!res.Data || !res.Data.length) {
        _this.setState({
          emptyNode: window.en_access_config ? intl('132725', '暂无数据') : Table.emptyNode,
        })
      }
      if (res.code === global.SUCCESS) {
        let columns = Object.assign([], _this.state.columns)
        const total = res.data ? res.data.total : 0
        if (total > 0) {
          columns[1].title = <p>{`${intl(32914, '公司名称')}(${Number(total).toLocaleString()})`}</p>
        } else {
          columns[1].title = <p>{`${intl(32914, '公司名称')}`}</p>
        }
        _this.setState({
          columns: columns,
        })
      } else if ([global.USE_OUT_LIMIT, global.USE_OUT_LIMIT_GATEWAY].includes(res.code)) {
        // 超限提示
        _this.renderOverLimit()
      }
    }

    _this.setState({ subMsgVisible: isChangeFilter, subSwitch: true })
  }

  renderOverLimit = () => {
    let tip = !window.en_access_config ? (
      <span>
        该查询条件的数据浏览量已超限，请更换查询条件或联系客户经理咨询更多数据获取方式，或点击
        <a href={BaiFenSites().advancedFilter} target="_blank" rel="noreferrer">
          申请试用
        </a>
        百分企业，满足更多数据导出需求。
      </span>
    ) : (
      <span>该查询条件的数据浏览量已超限，请更换查询条件或联系客户经理咨询更多数据获取方式。</span>
    )

    store.dispatch(globalActions.clearGolbalModal())

    overVip(tip, 'baifen__modal')
    this.setState({
      pageNum: 1,
    })
  }

  // 处理分页和排序，暂无过滤
  handleTableChange = (pagination, _filters, sorter) => {
    console.log(pagination)
    // console.log(pagination, filters, sorter);
    let orderBy = null
    let orderType = null
    if (sorter.order) {
      orderBy = sorter.field
      //   orderType = sorter.sorter == 'descend' ? true : false ;
      orderType = sorter.sorter
    }
    if (!sorter.sortOrder) {
      // false 表示重置排序
      orderBy = ''
      orderType = ''
    }
    console.log(orderBy, orderType)
    this.setState({
      orderBy,
      orderType,
    })
    setTimeout(() => {
      this.search(this.state.pageNum, this.pageSize)
    }, 10)
  }

  // OptionViewport 中修改filters
  changeFilter = (filters) => {
    console.log(filters)
    let _filters = this.props.filters
    if (filters[0].value.length === 0) {
      // 删除
      console.log(filters[0].itemId)
      _filters = _filters.filter((item) => item.itemId !== filters[0].itemId)
    } else {
      let filterIndex = _filters.findIndex((item) => item.itemId === filters[0].itemId)
      _filters[filterIndex] = filters[0]
    }
    // this.filterEl.setFilters(filters, this.state.geoFilter);
    this.props.setFilters(_filters)

    const newFilter = JSON.stringify(_filters)
    this.setState({
      filters: newFilter, // 筛选条件
      filtersJson: !this.state.filtersJson && JSON.stringify(newFilter), // 筛选项
    })
    // this.search(1);
  }

  // OptionViewport 中修改 geoFilter
  changeGeoFilter = (geoFilter) => {
    console.log(geoFilter)
    this.props.setGeoFilters([...geoFilter])
    // this.search(1);
  }

  // 条件查询下载
  exportFile = (from, size, to, total) => {
    // const { filters, geoFilter, measures, title, orderBy, orderType, largeSearch } = this.state;
    const { geoFilter, measures, orderBy, orderType, largeSearch } = this.state
    const { filters } = this.props

    const _self = this
    if (filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })

    pointBuriedGel('922602100839', '数据浏览器', 'cdeExport')

    if (Math.ceil(total / this.pageSize) < to) {
      message.warn(`导出页码输入超出上限，请调整页码`)
      return
    }

    postData({
      to,
      from,
      size,
      total,
      name: `企业数据浏览器`,
      superQueryLogic: {
        filters: _filters,
        measures,
      },
      order: orderBy
        ? {
            orderBy,
            orderType: orderType ? (orderType !== 'descend' ? 1 : 0) : '',
          }
        : null,
      largeSearch,
      noWarning: true,
    }).then(successFun)

    function successFun(res) {
      if (res.code === global.SUCCESS && res.data && res.data.id) {
        _self.fileDownload(res.data.id)
        message.success('导出成功')
        _self.setState({
          limitNoticeVisible: !_self.state.limitNoticeVisible,
        })
      } else if ([global.USE_OUT_LIMIT, global.USE_OUT_LIMIT_GATEWAY].includes(res.code)) {
        // 超限提示
        _self.setState({
          limitNoticeVisible: !_self.state.limitNoticeVisible,
        })
        _self.renderOverLimit()
      } else {
        message.error(`导出失败${res.code}`)
      }
    }
  }

  // 投稿到模板库
  post = ({ industryList, areaCodes, templateBrief, templateName }) => {
    const { filters, geoFilter, measures } = this.state
    if (geoFilter.length > 0) {
      // 定位地盘信息暂不允许投稿
      this.setState({ geoTempVisible: true })
      return false
    }
    if (filters.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    // 投稿到模板库
    templateShare({
      condition: {
        filters: _filters,
        measures,
      },
      industryList,
      areaCodes,
      templateBrief,
      templateName,
    }).then((res) => {
      if (res.code === global.SUCCESS) {
        message.info(intl(286758, '提交成功，感谢您的投稿!'))
      }
    })
  }

  changeSubscribeVisible = () => {
    if (!this.state.subscribeVisible) {
      // 关闭订阅不记录功能点
      pointBuriedGel('922602100948', '数据浏览器订阅', 'browserSubscribe', {
        opActive: 'click',
        currentPage: 'browserSubscribe',
        opEntity: '数据浏览器订阅',
      })
    }
    this.setState({
      subscribeVisible: !this.state.subscribeVisible,
    })
  }

  fileDownload = (id) => {
    let name = '企业名单导出(企业数据浏览器)_' + wftCommon.formatDate(Date.now())
    wftCommon.downExcelfile(id, name)
  }

  changeTemplateShareVisible = () => {
    if (!this.state.templateShareVisible) {
    }
    this.setState({
      templateShareVisible: !this.state.templateShareVisible,
    })
  }

  changeLimitNoticeVisible = () => {
    const { isSvip } = getVipInfo()
    if (!isSvip) {
      VipPopup({ onlySvip: true })
      return
    }
    this.setState({
      limitNoticeVisible: !this.state.limitNoticeVisible,
    })
  }

  // 开启订阅
  subscribe = ({ emailNotice, email }, data) => {
    // if (this.state.subscribeId || this.props.subscribeId) {
    //   this.updataSub();
    //   return;
    // }
    const { measures, title } = this.state
    const { filters, geoFilter } = this.props
    console.log(filters, geoFilter)
    if (!title) {
      message.error(intl(237985, '订阅名称不能为空'))
      return false
    }
    if (filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    // if (this.props.filterRes.data.length === 0) {
    //   message.error(intl(286740, "无效的过滤条件！"));
    //   return false;
    // }
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    this.setState({
      subFilterJson: this.generFilterJson(_filters),
      //   subscribeId: this.props.filterRes.subscribeId,
      subMsgVisible: false,
    })

    const param = {
      superQueryLogic: JSON.stringify({
        filters: _filters,
        geoFilter,
        measures,
      }),
      subName: title,
      subPush: emailNotice ? 1 : 0,
    }
    if (emailNotice) {
      param.mail = email ? email : ''
    }

    if (data && data.id) {
      // 更新订阅操作
      const param2 = {
        superQueryLogic: param.superQueryLogic,
        id: data.id,
        subName: data.subName,
        subPush: data.subPush,
      }
      if (emailNotice) {
        param2.mail = email ? email : ''
      }
      return namelistEdit(param2).then((res) => {
        if (res.code === global.SUCCESS) {
          message.success('操作成功')
          this.setState({
            subInfo: {
              ...param2,
              fromAdd: false,
            },
            subAddBtnDisabled: true,
          })
        }
        return res
      })
    }

    return namelistAdd(param).then((res) => {
      if (res.code === global.SUCCESS) {
        if (res.data && res.data.id) {
          this.setState({
            subInfo: {
              fromAdd: false,
              id: res.data.id,
              subName: param.subName,
              mail: res.data.mail || '',
              subPush: res.data.subPush || false,
              superQueryLogic: param.superQueryLogic,
            },
            subAddBtnDisabled: true,
          })
        }
      }
      return res
    })

    // return this.props.namelistAdd({
    //   superQueryLogic: JSON.stringify({
    //     filters: _filters,
    //     geoFilter,
    //     measures,
    //   }),

    //   subName: title,
    //   subPush: 0,

    //   emailNotice,
    // //   id: this.props.filterRes.subscribeId || id,
    //   templateId: templateId || (this.props.location.state['templateId']) || 0,
    // }).then(res => {
    //   if (res && res.code === global.SUCCESS && res.data) {
    //     sessionStorage.setItem("subscribeId", res.data)
    //   }
    //   this.updateSearchAmount();
    //   return res;
    // });
  }

  // 开启订阅并绑定邮箱
  emailBinding = ({ emailNotice, email }) => {
    this.mail = email

    if (this.state.subscribeId || this.props.subscribeId) {
      this.updataSub()
      return
    }

    const { measures, title, id, templateId } = this.state
    const { filters, geoFilter } = this.props
    if (!title) {
      message.error(intl(286739, '名单名称不能为空！'))
      return false
    }
    if (filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    // 埋点
    pointBuried({
      action: '922604570008',
      params: [
        { paramName: 'bs_module', paramValue: '查询结果页' },
        { paramName: 'bs_id', paramValue: id },
        { paramName: 'bs_status', paramValue: '订阅' },
        { paramName: 'bs_filterItem', paramValue: JSON.stringify(_filters) },
        { paramName: 'bs_device', paramValue: 'web' },
      ],
    })
    this.setState({
      subFilterJson: this.generFilterJson(_filters),
      subscribeId: this.props.filterRes.subscribeId,
      subMsgVisible: false,
    })
    if (this.props.filterRes.subscribed) {
      return this.props
        .namelistBind({
          condition: {
            filters: _filters,
            geoFilter,
            measures,
          },
          name: title,
          emailNotice,
          email,
          // id: this.state.subscribeId || this.props.filterRes.subscribeId,
          id: this.props.location.state['subscribeId'],
          templateId: templateId || this.props.location.state['templateId'] || 0,
        })
        .then((res) => {
          if (res && res.code === global.SUCCESS && res.data) {
            sessionStorage.setItem('subscribeId', res.data)
          }
          this.updateSearchAmount()
          return res
        })
    } else {
      return this.props
        .namelistBind({
          condition: {
            filters: _filters,
            geoFilter,
            measures,
          },
          name: title,
          emailNotice,
          email,
          id: this.props.location.state['subscribeId'],
          templateId: templateId || this.props.location.state['templateId'] || 0,
        })
        .then((res) => {
          if (res && res.code === global.SUCCESS && res.data) {
            // 当用户进行状态更新时，将状态写到history，兼容在用户刷新网页时，状态一致问题
            // this.props.location.state = { ...this.props.location.state, subscribeId: res.data }
            sessionStorage.setItem('subscribeId', res.data)
          }
          this.updateSearchAmount()
          return res
        })
    }
  }

  updateSearchAmount = () => {
    let { total } = this.props.filterRes
    let subscribeId = this.state.subscribeId || this.props.subscribeId || sessionStorage.getItem('subscribeId')
    if (!subscribeId) {
    }
    // 未改动订阅时更新数量
    // !(this.state.subMsgVisible && this.state.subSwitch) && updateSearchAmount({
    //   id: subscribeId,
    //   searchAmount: total,
    // })
  }

  // 是否开启订阅
  toggleSubscribe = () => {
    // 订阅时无标题的提示
    // const { title } = this.state;
    // if (!title) {
    //   message.info("如需订阅，请先修改名单名称！");
    //   return;
    // }
    this.changeSubscribeVisible()
  }

  setTitle = (title) => {
    this.state.title = title
    if (this.state.subscribeVisible) {
      if (this.state.subscribeId || this.props.subscribeId) {
        let params = {
          id: this.state.subscribeId || this.props.subscribeId,
          name: title,
        }
        namelistEdit(params)
      }
    } else if (this.mail) {
      this.emailBinding({ emailNotice: true, email: this.mail })
    } else {
      this.changeSubscribeVisible()
    }
  }

  changeTransferVisible = () => {
    if (!this.state.transferVisible) {
      pointBuriedGel('922602100840', '数据浏览器', 'cdeAddTdShow')
    }
    if (!this.state.transferVisible) {
      //   pointBuried({
      //     action: "922604570166",
      //     params: [],
      //   });
    }
    this.setState({
      transferVisible: !this.state.transferVisible,
    })
  }

  changeFilterVisible = (info) => {
    if (info) {
      // console.log(info);
      this.setState({
        checkItem: info,
      })
    }
    this.setState({
      filterVisible: !this.state.filterVisible,
    })
  }

  handleChange = (targetKeys, noSearch) => {
    let width = 0
    const { filterRes } = this.props
    let { industryLevelMap } = this.props.config
    industryLevelMap = industryLevelMap || {}
    this.state.measures = [
      {
        field: 'corp_id',
        title: '企业id',
      },
      {
        field: 'corp_name',
        title: intl(138677, '企业名称'),
      },
    ]
    this.state.columns = [
      {
        key: 'No.',
        title: <p>{intl(28846, '序号')}</p>,
        width: getColumnsWidth('No.'),
        dataIndex: 'No.',
        fixed: 'left',
        render: (_text, _record, index) => {
          const pagenum = this.props.filterRes.pageNum || 0
          const pagesize = this.props.filterRes.pageSize || 10
          return index + (pagenum - 1) * pagesize + 1
        },
      },
      {
        key: 'corp_name',
        title: <p>{intl(32914, '公司名称')}</p>,
        width: getColumnsWidth('corp_name'),
        dataIndex: 'corp_name',
        fixed: 'left',
        render: (text, record) => (
          <a
            onClick={() => {
              pointBuriedGel('922602100841', '数据浏览器', 'cdeGotoF9')
              record.corp_id && wftCommon.linkCompany('Bu3', record.corp_id)
              // window.open(getCompanyUrl(record.corp_id)); pointBuried({
              //     action: "922604570162",
              //     params: [{ paramName: "Company_Id", paramValue: record.corp_id }],
              //   });
            }}
            rel="noreferrer"
          >
            {text}
          </a>
        ),
      },
    ]
    width += getColumnsWidth('corp_name')
    let vipIndicatorCount = 0
    // 获取对象
    targetKeys.forEach((item) => {
      this.props.filterRes.indicators.forEach((item2) => {
        if (item === item2.indicator) {
          if (item === 'established_time' || item === 'cancel_time') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <span onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </span>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              field: item,
              order: true,
              render: (text, _record) =>
                text ? (
                  <p>
                    {this.context.language === 'en'
                      ? text
                      : `${text.substring(0, 4)}${window.en_access_config ? '/' : '年'}${text.substring(4, 6)}${window.en_access_config ? '/' : '月'}${text.substring(6, 8)}${
                          window.en_access_config ? '/' : '日'
                        }`}
                  </p>
                ) : null,
            })
          } else if (item === 'oper_period_end') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <span onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </span>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              field: item,
              order: true,
              render: (_text, record) => <p>{this.operPeriodFormat(record)}</p>,
            })
          } else if (item === 'capital_amount') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <span onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </span>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              field: item,
              order: true,
              align: 'right',
              render: (text, _record) =>
                text !== null && !isNaN(Number(text)) ? (
                  <p className="number">{numberFormat(text, true, 2)}</p>
                ) : (
                  <p style={{ width: getColumnsWidth(item) }} title={text}>
                    {text || ''}
                  </p>
                ),
            })
          } else if (item === 'tel') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <p onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </p>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              render: (text, _record, _index) => (
                <p
                  className={text && text.indexOf('***') > 0 ? 'marginRight20' : ''}
                  onClick={() => {
                    //   this.showDetail(record.corp_id, "tel", index); pointBuried({
                    //     action: "922604570226",
                    //     params: [],
                    //   });
                  }}
                >
                  {text}
                </p>
              ),
            })
          } else if (item === 'mail') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <p onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </p>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              render: (text, _record, _index) => (
                <p
                  className={text && text.indexOf('***') > 0 ? 'marginRight20' : ''}
                  onClick={() => {
                    //   this.showDetail(record.corp_id, "mail", index); pointBuried({
                    //     action: "922604570226",
                    //     params: [],
                    //   });
                  }}
                >
                  {text}
                </p>
              ),
            })
          } else if (item === 'industry_gb') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <p onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </p>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              render: (text, _record) => {
                let name = (industryLevelMap[text] !== 2 ? text : '--') || '--'
                return <p title={name}>{name}</p>
              },
            })
          } else if (item === 'ent_scale_num_indicator') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <p onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </p>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              align: 'right',
              render: (text, _record) => <p className="number">{isNaN(Number(text)) ? '' : Number(text) || ''}</p>,
            })
          } else if (item === 'count.trademark_num' || item === 'count.patent_num') {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <span onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </span>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              field: item,
              order: true,
              align: 'right',
              render: (text, _record) => {
                if (text && text !== '0' && text !== '0.0') {
                  return <p className="number">{isNaN(Number(text)) ? '' : Number(text) || ''}</p>
                }
                if (text == 0) return 0
                return '--'
              },
            })
          } else {
            this.state.columns.push({
              key: item2.indicator,
              title: (
                <p onClick={(e) => this.checkColumn(item, e)}>
                  {item2.name}
                  {item2.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
                </p>
              ),
              width: getColumnsWidth(item),
              dataIndex: item2.indicator,
              info: item2,
              sorter: item2.can_sort,
              render: (text, _record) => <p title={text}>{text}</p>,
            })
          }
          item2.isVip && vipIndicatorCount++
          width += getColumnsWidth(item)
          this.state.measures.push({
            title: item2.name,
            field: item2.indicator,
          })
        }
      })
    })

    this.setState({ ...this.state, targetKeys, tableWidth: width, vipIndicatorCount, allDataPageNum: {} }, () => {
      !noSearch && this.measureSearch()
    })
  }

  measureSearch = () => {
    const { data } = this.props.filterRes
    const { tableSrollTop, allDataPageNum, loadingPageNum } = this.state
    // 行高不确定，一页20条记录，先查询第一行的行号
    const tableLines = document.getElementsByClassName('ant-table-row')
    let firstLineNum = 0
    let _height = 0
    for (let i = 0; i < tableLines.length - 1; i++) {
      _height += tableLines[i].clientHeight
      if (_height > tableSrollTop) {
        firstLineNum = i
        break
      }
    }
    const currPageNum = Math.floor(firstLineNum / 20)
    const startPageNum = Math.ceil(0, currPageNum - 1)
    let _data = JSON.parse(JSON.stringify(data))
    // 获取上一页至下一页的ids
    let refleshData = _data.splice(startPageNum * 20, 80)
    const endPageNum = startPageNum + Math.ceil(refleshData.length / 20)
    for (let i = startPageNum; i < endPageNum; i++) {
      !allDataPageNum[i] && !loadingPageNum[i] && this.getMoreByPageNum(i)
    }
  }

  getMoreByPageNum = (pageNum) => {
    // pageNum 从0开始
    // console.log(pageNum)
    const { data } = this.props.filterRes
    const { measures, vipIndicatorCount } = this.state
    // 判断列指标是否提示vip
    if (vipIndicatorCount > 0) {
      const { isSvip } = getVipInfo()
      if (!isSvip) {
        //   window.alert('this is only for svip!');
        // level === 0 && tryVip("您选择的列指标中包含了仅限VIP使用的高级列指标！您已获得一次免费试用机会，是否立即开通试用，解锁30余项VIP权益！", intl);
        // level === 1 && buyVip("您选择的列指标中包含了仅限VIP使用的高级列指标！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        // level === 2 && buyVip("您选择的列指标中包含了仅限VIP使用的高级列指标！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        return
      }
    }
    let _data = JSON.parse(JSON.stringify(data))
    let refleshData = _data.splice(pageNum * 20, 20)
    const ids = refleshData.map((item) => item.corp_id)
    // todo：刷新数据之前，添加数据校验，已有完整数据时不走请求
    // pageNum 只在前端做替换逻辑的标记
    this.state.loadingPageNum[pageNum] = true
    this.props.measureSearch({ ids, measures, pageNum }).then((res) => {
      this.state.loadingPageNum[pageNum] = false
      if (res.code === global.SUCCESS) {
        this.state.allDataPageNum[pageNum] = true
      }
    })
  }

  showDetail = (corpId, measureCode, index) => {
    this.props.getContactByCropid({
      corpId,
      measureCode,
      index,
    })
  }

  operPeriodFormat = (crop) => {
    let { oper_period_begin, oper_period_end, established_time } = crop
    let startTime = established_time

    if (!oper_period_begin && !oper_period_end && !startTime) {
      return '--'
    }
    if (oper_period_end == '长期') {
      return oper_period_end
    }
    if (oper_period_end == '99991231') {
      oper_period_end = '长期'
      return oper_period_end
    }
    if (!oper_period_begin) {
      oper_period_begin = startTime
    }
    return (
      (oper_period_begin
        ? this.context.language === 'en'
          ? oper_period_begin
          : `${oper_period_begin.substring(0, 4)}${window.en_access_config ? '/' : '年'}${oper_period_begin.substring(4, 6)}${
              window.en_access_config ? '/' : '月'
            }${oper_period_begin.substring(6, 8)}${window.en_access_config ? '/' : '日'}`
        : intl('271247', '无固定期限')) +
      ' ' +
      intl('271245', '至') +
      ' ' +
      (oper_period_end
        ? this.context.language === 'en'
          ? oper_period_begin
          : `${oper_period_end.substring(0, 4)}${window.en_access_config ? '/' : '年'}${oper_period_end.substring(4, 6)}${
              window.en_access_config ? '/' : '月'
            }${oper_period_end.substring(6, 8)}${window.en_access_config ? '/' : '日'} `
        : intl('271247', '无固定期限'))
    )
  }

  checkColumn = (name, e) => {
    let t = e.target
    if (t.classList.contains('checked')) {
      t.classList.remove('checked')
    } else {
      t.classList.add('checked')
    }
    if (this.state.checkColumns.includes(name)) {
      this.state.checkColumns.forEach((item, index) => {
        if (item === name) {
          this.state.checkColumns.splice(index, 1)
        }
      })
    } else {
      this.state.checkColumns.push(name)
    }
    this.setState({ checkColumns: this.state.checkColumns })
  }

  deleteColumn = () => {
    pointBuried({
      action: '922604570167',
      params: [],
    })
    let { targetKeys, checkColumns } = this.state
    checkColumns.forEach((check) => {
      targetKeys.forEach((key, index) => {
        if (check === key) {
          targetKeys.splice(index, 1)
        }
      })
    })
    checkColumns.splice(0, checkColumns.length)
    this.handleChange(targetKeys)
  }

  pageChange = (page) => {
    const { isSvip } = getVipInfo()
    if (!isSvip) {
      VipPopup({ onlySvip: true })
      return
    }
    this.setState({ pageNum: page })
    this.search(page, this.pageSize)
  }

  setRow = (record, index) => {
    console.log(record)
    return index % 2 === 1 ? 'grey' : ''
  }

  seenSave = () => {
    const { title, filters, subscribeId, templateId, id, filtersJson } = this.state
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    let params = {
      condition: { filters: _filters },
      id,
      name: title || filters.map((item) => item.title).join(','),
      sourceType: subscribeId ? 'subscribelist' : 'namelist',
    }
    subscribeId && Object.assign(params, { subscribeId })
    templateId && filtersJson === JSON.stringify(filters) && Object.assign(params, { templateId })
    seensave(params)
      .then((ret) => {
        // console.log('ret:', ret)
        if (ret.code === global.SUCCESS && ret.data) {
          console.log('seensave success', ret.data)
        } else {
          // message.error(ret.msg)
        }
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }

  onScroll = (e) => {
    // console.log(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight);
    if (this.state.searchBusy) {
      return
    }
    if (this.state.overLimit) {
      return
    }
    if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 300) {
      this.setState({ tableSrollTop: e.target.scrollTop })
      this.search(this.props.filterRes.pageNum + 1)
    }
  }

  // 关闭 订阅提示msg信息框
  closeChangeTipsMsg = () => {
    this.setState({
      subSwitch: false,
    })
  }

  // 更新订阅
  updataSub = () => {
    const { measures, title, id, templateId } = this.state
    const { filters, geoFilter } = this.props
    let userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {}
    let email = ''
    let emailNotice = false
    if (userInfo.mail) {
      email = userInfo.mail
      emailNotice = true
    }
    if (filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    // 删除info，不然传输body太大
    let _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    this.setState({ subFilterJson: this.generFilterJson(_filters), subscribeId: this.props.filterRes.subscribeId })
    this.setState({ subMsgVisible: false })
    if (emailNotice) {
      this.props
        .namelistBind({
          condition: {
            filters: _filters,
            geoFilter,
            measures,
          },
          name: title,
          emailNotice,
          email,
          id: this.props.filterRes.subscribeId || id,
          templateId: templateId || this.props.location.state['templateId'] || 0,
        })
        .then((res) => {
          if (res.code === global.SUCCESS) {
            message.info(intl(286742, '更新订阅成功！'))
            sessionStorage.setItem('subscribeId', res.data)
            this.updateSearchAmount()
          }
        })
    } else {
      this.props
        .namelistAdd({
          condition: {
            filters: _filters,
            geoFilter,
            measures,
          },
          name: title,
          emailNotice,
          id: this.props.filterRes.subscribeId || id,
          templateId: templateId || this.props.location.state['templateId'] || 0,
        })
        .then((res) => {
          if (res.code === global.SUCCESS) {
            message.info(intl(286742, '更新订阅成功！'))
            sessionStorage.setItem('subscribeId', res.data)
            this.updateSearchAmount()
          }
        })
    }

    this.closeChangeTipsMsg()
  }

  // 取消订阅
  delSubMsg = () => {
    this.props
      .dissubscribe({
        id: this.state.subscribeId || this.props.filterRes.subscribeId || sessionStorage.getItem('subscribeId'),
      })
      .then((_res) => {
        this.setState({ id: null })
      })
    // 埋点
    pointBuried({
      action: '922604570008',
      params: [
        { paramName: 'bs_module', paramValue: '查询结果页' },
        { paramName: 'bs_id', paramValue: this.state.subscribeId || this.props.filterRes.subscribeId },
        { paramName: 'bs_status', paramValue: '取消订阅' },
        { paramName: 'bs_filterItem', paramValue: '' },
        { paramName: 'bs_device', paramValue: 'web' },
      ],
    })
    // setTimeout(() => {
    //   this.setState({ subscribeId: this.props.filterRes.subscribeId });
    // }, 10);
    this.setState({ subscribeId: null })
    this.closeChangeTipsMsg()
    this.props.location.state['subscribeId'] = null
    sessionStorage.setItem('subscribeId', '')
  }

  saveFisrt = () => {
    const { sourceId } = this.props
    if (sourceId) {
      let params = {
        id: sourceId,
        name: this.state.inputFirstValue,
      }
      namelistEdit(params)
        .then((ret) => {
          console.log('ret:', ret)
          if (ret.code === global.SUCCESS) {
            this.setTitle(this.state.inputFirstValue)
            this.setState({
              isRename: false,
            })
          }
        })
        .catch((error) => {
          console.log('error: ', error)
        })
    } else {
      this.setTitle(this.state.inputFirstValue)
      this.setState({
        isRename: false,
      })
    }
  }

  cancelFirst = () => {
    this.setState({
      isRename: false,
    })
  }

  backCDE = () => {
    pointBuriedGel('922602100836', '数据浏览器', 'cdeBacktoOld')
    setTimeout(() => {
      wftCommon.jumpJqueryPage('SearchBidV2.html')
    }, 100)
  }

  rename = () => {
    console.log(453)
    const { title } = this.props
    let titleText = title ? title.substring(0, 30) : title
    this.setState({
      isRename: true,
      inputFirstValue: titleText,
    })
  }

  render() {
    const {
      title,
      targetKeys,
      transferVisible,
      filterVisible,
      columns,
      checkColumns,
      subscribeVisible,
      limitNoticeVisible,
      dataRangeVisible,
      geoTempVisible,
      filterModal,
      subInfo,
    } = this.state
    let { indicators, data, total, subscribed, subscribeId } = this.props.filterRes
    const { filters, geoFilter, hideEditTitle, location } = this.props
    // console.log(geoFilter);
    const { showEditTitle, sourceId } = this.props.location.state
    let locationSubId = null
    if (sessionStorage.getItem('subscribeId')) {
      locationSubId = sessionStorage.getItem('subscribeId')
    }
    console.log('------------', this.state.subscribeId, subscribed, subscribeId)
    if (this.state.subscribeId || locationSubId) {
      subscribed = true
      subscribeId = this.state.subscribeId || locationSubId
    }

    // 设置表格的多选逻辑

    let titleText = title ? title.substring(0, 30) : title

    let { isRename } = this.state

    const pageProps = {
      current: this.state.pageNum,
      pageSize: this.pageSize,
      total: total > 5000 ? 5000 : total,
      onChange: (page) => this.pageChange(page),
      hideOnSinglePage: false,
      showSizeChanger: false,
      showQuickJumper: true,
    }

    return (
      <React.Fragment>
        <div className="breadcrumb-box">
          <Breadcrumb>
            <Breadcrumb.Item
              style={{ cursor: 'pointer' }}
              onClick={() => {
                wftCommon.jumpJqueryPage('SearchHome.html')
              }}
            >
              {' '}
              {intl('19475', '首页')}{' '}
            </Breadcrumb.Item>

            {location.pathname == '/filterRes' ? (
              <React.Fragment>
                <Breadcrumb.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.props.history.push('/findCustomer?')
                  }}
                >
                  {intl('259750', '企业数据浏览器')}
                </Breadcrumb.Item>
                <Breadcrumb.Item>{window.en_access_config ? 'Results' : '结果列表'}</Breadcrumb.Item>
              </React.Fragment>
            ) : (
              <Breadcrumb.Item>{intl('259750', '企业数据浏览器')}</Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>

        <div
          className={filterVisible ? 'home modal-show' : 'home-filter-res'}
          ref={(el) => {
            this.modalParent = el
          }}
        >
          <div className="main-container filterRes">
            {/* 左侧条件 */}
            <Condition
              filters={filters}
              geoFilter={geoFilter}
              changeFilterVisible={() => this.setFilterModal(!filterModal)}
              changeGeoFilter={this.changeGeoFilter}
              changeFilter={this.changeFilter}
              toggleSubscribe={this.toggleSubscribe}
              search={() => this.search(this.state.pageNum, this.pageSize)}
              subscribeBtnDisabled={this.state.subAddBtnDisabled}
            />
            <div className="page-container">
              <div className="tools" style={{ display: 'flex' }}>
                <div className="tools-first">
                  {titleText !== undefined && !isRename ? (
                    <div className="title">
                      <span className="titleTxt">
                        {titleText
                          ? titleText
                          : subInfo && subInfo.subName
                            ? subInfo.subName
                            : intl('140237', '未命名')}
                      </span>
                      {!hideEditTitle && <MyIcon name="rename" onClick={this.toggleSubscribe} />}
                    </div>
                  ) : null}
                </div>

                <div>
                  <a disabled={filters.length === 0 && geoFilter.length === 0}>
                    <span
                      style={{ diaplay: 'none' }}
                      className={this.state.subAddBtnDisabled ? 'subscribe subscribe-disabled ' : 'subscribe'}
                      onClick={() => {
                        if (!this.state.subAddBtnDisabled) {
                          this.toggleSubscribe()
                        }
                      }}
                    >
                      {subInfo && !subInfo.fromAdd ? (
                        <>
                          {' '}
                          <MyIcon name="Alert_Fill" /> {intl(271629, '已订阅')}
                        </>
                      ) : (
                        <>
                          {' '}
                          <MyIcon name="alert" /> {intl(257659, '订阅')}
                        </>
                      )}
                    </span>
                  </a>

                  <a
                    disabled={(filters.length === 0 && geoFilter.length === 0) || (data && data.length === 0)}
                    onClick={this.changeLimitNoticeVisible}
                  >
                    {' '}
                    <MyIcon name="save" /> {intl(4698, '导出数据')}
                  </a>
                  <a className="grey-border" onClick={this.changeTransferVisible}>
                    {' '}
                    <MyIcon name="addColumn" /> {intl(257742, '新增列指标')}
                  </a>
                  <Popconfirm
                    className="tool"
                    title={intl(283407, '你确定要删除此列吗？此操作无法撤销，但可以通过“新增列指标”重新添加列。')}
                    onConfirm={this.deleteColumn}
                    okText={intl(272476, '确定')}
                    cancelText={intl(19405, '取消')}
                    disabled={checkColumns.length < 1}
                  >
                    <a disabled={checkColumns.length < 1}>
                      {' '}
                      <MyIcon name="deleteColumn" /> {intl(257652, '删除列')}
                    </a>
                  </Popconfirm>
                </div>
              </div>
              <div className="table-container">
                <Spin size="large" spinning={this.state.loading || this.state.searchBusy} tip={this.state.loadingTips}>
                  <Table
                    size="small"
                    ref={(el) => {
                      this.tableEl = el
                    }}
                    rowClassName={this.setRow}
                    rowKey="corp_id"
                    columns={columns}
                    dataSource={data}
                    pagination={pageProps}
                    onChange={this.handleTableChange}
                    empty={this.state.emptyNode}
                  />
                  {this.state.pageNum === Math.ceil(this.state.total / this.state.pageSize) && (
                    <p>{intl(286685, '没有更多了')}</p>
                  )}
                </Spin>
              </div>
            </div>
          </div>

          {/* 添加指标 */}
          {(targetKeys.length > 0 || transferVisible) && (
            <TreeTransfer
              visible={transferVisible}
              changeVisible={this.changeTransferVisible}
              dataSource={indicators}
              targetKeys={targetKeys}
              onChange={this.handleChange}
            />
          )}

          {/* filter */}
          <RestructFilterModal
            modal={filterModal}
            setModal={this.setFilterModal}
            onSearch={() => {
              this.setState(
                {
                  pageNum: 1,
                },
                () => {
                  this.search(this.state.pageNum, this.pageSize)
                }
              )
            }}
            //   leftCurrent = {1}
          />
          {/* 订阅 */}
          <Subscribe
            type={1}
            visible={subscribeVisible}
            changeVisible={this.changeSubscribeVisible}
            name={title}
            setTitle={this.setTitle}
            subscribe={this.subscribe}
            info={{ subName: title ? title : '', ...subInfo }}
          />
          {/* 下载超限提醒 */}
          <LimitNotice
            visible={limitNoticeVisible}
            changeVisible={this.changeLimitNoticeVisible}
            postFn={this.exportFile}
            total={total}
          />
          {/* 投稿模板 */}
          {/* <TemplateShare visible={templateShareVisible} changeVisible={this.changeTemplateShareVisible} postFn={this.post} /> */}
          {/* 海量数据提示 */}
          {dataRangeVisible && (
            <Modal
              title={intl(31041, '提示')}
              className="filterTooBig"
              maskClosable={false}
              closable={true}
              visible={dataRangeVisible}
              onOk={() => {
                this.setState({ dataRangeVisible: false })
                this.changeFilterVisible()
              }}
              onCancel={() => {
                this.search(this.state.pageNum, this.pageSize)
                this.setState({ dataRangeVisible: false })
              }}
              cancelText={intl(257729, '仍要查看')}
              okText={intl(257640, '添加条件')}
            >
              <span style={{ margin: '22px 0 24px 0', display: 'inline-block' }}>
                {intl(257740, '您要找的客户范围似乎太大了，是否添加更多筛选条件，让获客更精准！')}
              </span>
            </Modal>
          )}
          {/* 投稿时带地址信息提示 */}
          <Modal
            title={intl(286686, '注意')}
            className="filterTooBig"
            width={560}
            closable={true}
            visible={geoTempVisible}
            onOk={() => {
              this.setState({ geoTempVisible: false })
            }}
            onCancel={() => {
              this.setState({ geoTempVisible: false })
            }}
            cancelText={intl(286745, '放弃投稿')}
            okText={intl(286746, '修改地区')}
          >
            <span style={{ margin: '22px 0 24px 0', display: 'inline-block' }}>
              {intl(
                286747,
                '您投稿的模板中包含“我的地盘”或“当前定位”信息，属于个人信息，暂不支持投稿。请取消选中“我的地盘”或“当前定位”后再重新投稿。'
              )}
            </span>
          </Modal>

          {/** 百分试用弹窗 */}
          <ApplyModal />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filterRes: state.filterRes,
    config: state.config,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    search: (data, dataCall) => {
      return search(data).then((res) => {
        if (res.code == global.SUCCESS) {
          if (window.en_access_config) {
            if (res.data && res.data.data && res.data.data.length) {
              dispatch(FindCustomerActions.search({ ...res, ...data }))
              dataCall(res)
              return new Promise((resolve, _reject) => {
                wftCommon.zh2en(
                  res.data.data,
                  (endata) => {
                    delete res.data.data
                    res.data.data = endata
                    dispatch(FindCustomerActions.search({ ...res, ...data }))
                    resolve(res)
                  },
                  null,
                  () => {
                    dispatch(FindCustomerActions.search({ ...res, ...data }))
                    resolve(res)
                  }
                )
              })
            }
          }
        }

        dispatch(FindCustomerActions.search({ ...res, ...data }))
        return res
      })
    },
    measureSearch: (data) => {
      return measureSearch(data).then((res) => {
        dispatch(FindCustomerActions.measureSearch({ ...res, ...data }))
        return res
      })
    },
    getIndicator: (data) => {
      return getIndicator(data).then((res) => {
        dispatch(FindCustomerActions.getIndicator({ ...res, ...data }))
        return res.data
      })
    },
    namelistAdd: (data) => {
      return namelistAdd(data).then((res) => {
        dispatch(FilterResActions.subscribe(res))
        return res
      })
    },
    dissubscribe: (data) => {
      return namelistDelete(data).then((res) => {
        dispatch(FilterResActions.dissubscribe(res))
        return res
      })
    },
    namelistBind: (data) => {
      return namelistBind(data).then((res) => {
        dispatch(FilterResActions.subscribe(res))
        return res
      })
    },
    getContactByCropid: (data) => {
      getContactByCropid(data).then((res) => {
        dispatch(FilterResActions.getContactByCropid({ ...res, ...data }))
      })
    },
    clearDatas: () => {
      dispatch(FilterResActions.clearDatas())
    },
    clearSubType: () => {
      dispatch(FilterResActions.clearSubType())
    },
    getMySusById: (data) => {
      return getCustomerSubList(data).then((res) => {
        // dispatch(FindCustomerActions.getMySusList({ ...res, ...data }))
        return res
      })
    },
  }
}

export default connectZustand(useConditionFilterStore, (state) => ({
  setFilters: state.setFilters,
  setGeoFilters: state.setGeoFilters,
  filters: state.filters,
  geoFilter: state.geoFilters,
  updateFilters: state.updateFilters,
  getFilterConfigList: state.getFilterConfigList,
}))(connect(mapStateToProps, mapDispatchToProps)(FilterRes))
