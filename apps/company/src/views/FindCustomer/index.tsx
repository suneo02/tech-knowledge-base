import { hashParams } from '@/utils/links'
import { CloseO } from '@wind/icons'
import { Breadcrumb, Button, Card, Col, List, message, Modal, Row } from '@wind/wind-ui'
import { checkIfCDESearchFilter } from 'gel-ui'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import * as FindCustomerActions from '../../actions/findCustomer'
import * as globalActions from '../../actions/global'
import { namelistAdd, namelistDelete, namelistEdit } from '../../api/collect&namelist'
import { pointBuried, pointBuriedGel } from '../../api/configApi'
import { getCustomerSubList } from '../../api/findCustomer'
import Subscribe from '../../components/Subscribe'
import RestructFilter from '../../components/restructFilter/RestructFilter'
import { setPageTitle } from '../../handle/siteTitle'
import global from '../../lib/global'
import { getVipInfo } from '../../lib/utils'
import { connectZustand } from '../../store'
import { useConditionFilterStore } from '../../store/cde/useConditionFilterStore'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { getMenuKeyFromUrl } from './handle'
import './index.less'

export const ShowAllSubModelDiv = (props) => {
  const subEmail = props.subEmail
  const [mySusList, setMySusList] = useState(props.mySusList)

  useEffect(() => {
    setMySusList(Object.assign([], props.mySusList))
  }, [props.mySusList])

  return (
    <>
      {mySusList && mySusList.length ? (
        mySusList.map((t, idx) => {
          t.subEmail = subEmail
          return (
            <div key={'showAllSubModelDiv' + idx} className="allsub-item">
              <div className="allsubtitle-div">
                <span className="allsubtitle-span">{t.subName}</span>
                <div className="allsubtitle-btn">
                  <Button
                    onClick={() => {
                      if (!t.subPush) {
                        store.dispatch(globalActions.clearGolbalModal())
                      }
                      props.openOrClosePush(t, idx, mySusList, setMySusList)
                    }}
                    data-uc-id="2PZdFd7bba"
                    data-uc-ct="button"
                  >
                    {' '}
                    {subEmail && t.subPush ? '取消推送' : '推送'}{' '}
                  </Button>
                  <Button
                    onClick={() =>
                      props.delSubMsg(t, idx, mySusList, (res) => {
                        if (res.code == global.SUCCESS) {
                          // 删除成功
                          props.mySusList.splice(idx, 1)
                          const newdata = Object.assign([], mySusList)
                          setMySusList(newdata)
                        }
                      })
                    }
                    data-uc-id="N0E03Xu55s"
                    data-uc-ct="button"
                  >
                    {intl('19853', '删除')}
                  </Button>
                  <Button
                    onClick={() => {
                      props.parentself.setState(
                        {
                          subInfo: {
                            subEmail: t.subEmail,
                            subName: t.subName,
                            subPush: t.subPush,
                            fromAdd: false,
                            id: t.id,
                            superQueryLogic: t.superQueryLogic,
                          },
                        },
                        () => {
                          store.dispatch(globalActions.clearGolbalModal())
                          props.changeSubscribeVisible()
                        }
                      )
                    }}
                    data-uc-id="K1MHIDcSvb"
                    data-uc-ct="button"
                  >
                    {intl('174265', '编辑')}
                  </Button>
                  <Button
                    onClick={() => {
                      store.dispatch(globalActions.clearGolbalModal())
                      props.gotoFilterRes(t, 1)
                    }}
                    data-uc-id="ffVBiMviR5"
                    data-uc-ct="button"
                  >
                    {intl('16576', '应用')}
                  </Button>
                </div>
              </div>
              <div>{props.getFilterContent(t, 100)}</div>
            </div>
          )
        })
      ) : (
        <div style={{ textAlign: 'center', lineHeight: '600px' }}> 暂无订阅内容 </div>
      )}
    </>
  )
}

// 找客户页面
class FindCustomer extends React.Component<any, any> {
  filterEl: any
  mail: string
  constructor(props) {
    super(props)
    this.state = {
      pageNum1: 1, // 订阅页码
      total1: 0, // 订阅条数
      pageNum2: 1,
      pageNum3: 1,
      isHoldUpRouter: true, // when的属性值，初始化必须为true，否则阻塞不了路由跳转。因为setState是异步操作
      pathUrl: '',
      pathState: null,
      isShowSavePromptModal: false,
      customerIndustryVisible: false,
      templateListVisible: false,
      userIndustries: [],
      rightChangeWidth: '350px',
      current_location: [],
      selectedMenuKeyFromUrl: undefined, // 从 URL 中获取的菜单键值

      subscribeVisible: false,
      title: '',
      subscribeId: '',
      subInfo: null,
    }
    // Filter节点
    this.filterEl = null
    console.log(this.props.location.state)
    if (this.props.location.state) {
      const { current_location = [] } = this.props.location.state
      // @ts-expect-error ttt
      this.state.current_location = current_location
    }

    this.mail = ''
  }

  componentDidMount = () => {
    setPageTitle('DataBrowserList')

    // 获取 URL 中的 menuKey 参数
    const menuKey = getMenuKeyFromUrl()
    if (menuKey !== undefined) {
      // 根据 menuKey 设置组件状态
      this.setState({ selectedMenuKeyFromUrl: menuKey })
    }

    // this.props.queryUserIndustries();
    this.props.resetData()
    // this.filterEl.getInitPromise().then(res => {

    this.props.getMySusList({}).then((res) => {
      if (res.code === global.SUCCESS) {
        this.setState({ total1: res.data.total })
      }
    })

    // this.props.getFellowList({ pageNum: 1, pageSize: 5 });
    // })
    window.addEventListener('resize', this.setSlideSize)
    sessionStorage.setItem('subscribeId', '') //清空filterRes的临时订阅状态
    // 设置地图页面带入的参数
    // if (this.props.location.state) {
    //   const { filters = [], geoFilter = [] } = this.props.location.state;
    //   Promise.all([this.filterEl.getInitPromise()]).then((res) => {
    //     filters.length > 0 && this.filterEl.setFilters(filters, geoFilter);
    //   });
    // }
    // 埋点
    // pointBuried({
    //   action: "922604570153",
    //   params: [
    //     { paramName: "Terminal_System", paramValue: browserRedirect() },
    //     { paramName: "Terminal_Resolution", paramValue: getScreenSize() },
    //   ],
    // });
    const type = wftCommon.getQueryString('type')
    const value = wftCommon.getQueryString('val')
    const valueName = wftCommon.getQueryString('valName')
    const itemId = wftCommon.getQueryString('itemId')
    let defaultParam = null
    // if (qs.corptype) {
    //     // 外部传入的部分参数
    //     defaultParam = {};
    //     defaultParam.type = qs.corptype;
    // }

    if (type && value) {
      defaultParam = { type: type, value: value, valueName, itemId } // 默认选中 存续
    }

    // defaultParam = {type:'名录',value: '2010100370,2010100699'  } // 名录 样例传参
    // defaultParam = {type:'榜单',value: "ffg", valueName: 'gg'  } // 榜单搜索 样例传参

    this.props.setDefaultFilters(defaultParam) // 默认选中设置

    if (defaultParam) {
      const { filters } = this.props.filters
      this.props.history.push('filterRes', {
        specialSQL: '',
        searchType: '',
        filters,
      })
    }

    pointBuriedGel('922602100875', '进入企业数据浏览器', 'cdeloading')
  }

  setSlideSize = () => {
    if (document.body.clientWidth < 1300) {
      this.setState({ rightChangeWidth: Math.max(250, 350 - (1300 - document.body.clientWidth)) + 'px' })
    } else {
      this.setState({ rightChangeWidth: '350px' })
    }
  }

  getFilterContent = (item, long) => {
    try {
      const { getPreItemInfo } = this.props

      const txtLength = long ? long : 14
      let filters
      try {
        filters = item.superQueryLogic ? JSON.parse(item.superQueryLogic).filters : ''
      } catch (error) {
        console.log(error, 'error')
      }
      try {
        filters = filters || []
        const geoFilter = item.condition?.geoFilter || []
        const strArr = filters.map((filter) => {
          const { logic, title, value, itemId, field } = filter
          // 包含已删除的筛选项
          if (!getPreItemInfo(itemId)) {
            console.log(`包含已删除的筛选项: ${title}, 模板名称：${item.templateName}`)
            return
          }
          const itemOption = getPreItemInfo(itemId)?.itemOption
          let str = ''
          switch (logic) {
            case 'prefix':
              // 地区/行业

              // str = `${title} - ${value.map(a => a.split('|')[0]).join('/')}`;
              str = `${title} - ${value.map((a) => this.props.codeMap[a]).join('/')}`
              break
            case 'bool':
              if (itemOption?.length > 0) {
                itemOption.forEach((item) => {
                  if (item.value === value[0]) {
                    str = `${title} - ${item.name}`
                  }
                })
              } else {
                // 测试
                str = `${title} - ${value[0] ? '有' : '无'}`
              }
              break
            default:
              let range
              switch (field) {
                case 'register_capital':
                  const values = value.map((value) => {
                    range = value.split('-')
                    if (!range[0]) {
                      str = `0至${range[1]}万`
                    } else if (!range[1]) {
                      str = `${range[0]}万以上`
                    } else {
                      str = `${range[0]}至${range[1]}万`
                    }
                    return str
                  })
                  str = `${title} - ${values.join('/')}`
                  break
                case 'endowment_num':
                  range = value[0].split('-')
                  if (!range[0]) {
                    str = `0至${range[1]}人`
                  } else if (!range[1]) {
                    str = `${range[0]}人以上`
                  } else {
                    str = `${range[0]}至${range[1]}人`
                  }
                  str = `${title} - ${str}`
                  break
                case 'established_time':
                  if (value[0] === '30') {
                    str = '一个月内'
                  } else if (value[0] === '180') {
                    str = '六个月内'
                  } else {
                    str = `${value[0]}`
                  }
                  str = `${title} - ${str}`
                  break
                default:
                  if (checkIfCDESearchFilter(filter)) {
                    const values = filter.search
                    values.map((t) => {
                      str = str ? t.objectName : '、' + t.objectName
                    })
                    str = `${title} - ${str}`
                    return str
                  }
                  if (logic === 'range' && value[0].indexOf('-') >= 0) {
                    const values = value.map((value) => {
                      range = value.split('-')
                      if (!range[0]) {
                        str = `0至${range[1]}个`
                      } else if (!range[1]) {
                        str = `${range[0]}个以上`
                      } else {
                        str = `${range[0]}至${range[1]}个`
                      }
                      return str
                    })
                    str = `${title} - ${values.join('/')}`
                  } else if (itemOption?.length > 0) {
                    const values = value.map((value) => {
                      itemOption.forEach((item) => {
                        if (item.value === value) {
                          str = `${item.name}`
                        }
                      })
                      return str
                    })
                    str = `${title} - ${values.join('/')}`
                  } else {
                    str = `${title} - ${value.join('/')}`
                  }
                  break
              }
          }
          return str.length > txtLength ? `${str.substring(0, txtLength)}...` : str
        })
        // 添加位置信息
        const geoStrArr = geoFilter.map((item) => {
          const str = item.territoryName
          return str.length > txtLength ? `${str.substring(0, txtLength)}...` : str
        })
        ;[].unshift.apply(strArr, geoStrArr)
        return strArr.join(' · ')
      } catch (error) {
        console.error(error, item, filters)
        return ''
      }
    } catch (error) {
      console.error(error, item)
      return ''
    }
  }

  onLoadMore1 = async () => {
    // let { pageNum1 } = this.state;
    // this.setState({ pageNum1: pageNum1 + 1 });
    // this.props.getMySusList({ pageNum: pageNum1 + 1, pageSize: 3, })
    this.showAllSubModel()
  }
  // 处理路由拦截
  handleRouterHoldUp = (location) => {
    // let fliters = this.filterEl.getCheckFilterItems();
    const fliters = this.props.filters
    if (fliters.length === 0) {
      return
    }
    // 只选了默认项，营业状态-存续
    if (
      fliters.length === 2 &&
      fliters[0].itemId === 77 &&
      JSON.stringify(fliters[0].value) === '["存续"]' &&
      fliters[1].itemId === 78 &&
      JSON.stringify(fliters[1].value) === '["298010000,298020000,298040000"]'
    ) {
      return
    }
    // console.log(location)
    const pathUrl = location.pathname + location.search // // location 携带的路径,即将要跳转的路径
    this.setState({
      pathUrl: pathUrl, // 存储即将要跳转的pathUrl
      pathState: location.state,
    })
    if (
      location.pathname !== '/filterRes' &&
      location.pathname !== '/introduction' &&
      location.pathname !== '/findCustomer'
    ) {
      // 信息未保存，阻塞路由跳转，并弹出自定义提示弹窗
      this.setState({
        isShowSavePromptModal: true,
      })
    } else {
      this.setState(
        {
          // 释放路由跳转权限
          isHoldUpRouter: false,
        },
        () => {
          this.props.history.push(pathUrl, this.state.pathState) // 手动跳转，如果是手动跳转，必须放在这里执行，因为setState是异步的，如果不放回调里执行手动跳转，会陷入Prompt组件的死循环
          this.setState({
            // 内部路由变化，当跳转之后，还需要重新关闭路由跳转权限，实现下一次跳转路由的拦截(如果所在页面的组件已经完全销毁，则不需要重新关闭路由跳转权限)
            isHoldUpRouter: true,
          })
        }
      )
    }
    return false
  }

  // 处理保存信息提示弹窗的确认事件
  handleSaveModelOK = () => {
    this.setState(
      {
        isShowSavePromptModal: false, // 关闭自定义提示窗
        isHoldUpRouter: false, // 释放路由跳转权限
      },
      () => {
        this.props.history.push(this.state.pathUrl, this.state.pathState) // 手动跳转，如果是手动跳转，必须放在这里执行，因为setState是异步的，如果不放回调里执行手动跳转，会陷入Prompt组件的死循环
        this.setState({
          // 内部路由变化，当跳转之后，还需要重新关闭路由跳转权限，实现下一次跳转路由的拦截(如果所在页面的组件已经完全销毁，则不需要重新关闭路由跳转权限)
          isHoldUpRouter: true,
        })
      }
    )
  }

  // 处理保存信息提示弹窗的取消事件
  handleSaveModelCancel = () => {
    this.setState({
      isShowSavePromptModal: false, // 关闭自定义提示窗
    })
  }

  gotoFilterRes = (item, from) => {
    // 判断是否提示vip
    if (item.vipFlag) {
      const { isSvip } = getVipInfo()
      if (!isSvip) {
        // window.alert('this is only for svip!');
        // level === 0 && from === 1 && tryVip("此名单中包含了仅限VIP使用的高级筛选项！您已获得一次免费试用机会，是否立即开通试用，解锁30余项VIP权益！", intl);
        // level === 1 && from === 1 && buyVip("此名单中包含了仅限VIP使用的高级筛选项！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        // level === 2 && from === 1 && buyVip("此名单中包含了仅限VIP使用的高级筛选项！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        // level === 0 && from === 2 && tryVip("此模板中包含了仅限VIP使用的高级筛选项！您已获得一次免费试用机会，是否立即开通试用，解锁30余项VIP权益！", intl);
        // level === 1 && from === 2 && buyVip("此模板中包含了仅限VIP使用的高级筛选项！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        // level === 2 && from === 2 && buyVip("此模板中包含了仅限VIP使用的高级筛选项！您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", intl);
        return
      }
    }
    // if (item.condition.filters && item.condition.filters.length > 0) {
    //   // 添加info信息
    //   item.condition.filters.map(filter => {
    //     const filtersInfo = this.filterEl?.defaultValues;
    //     filter.info = filtersInfo[filter.itemId].info;
    //   });
    // }
    let nameList: any = {}
    if (from === 1) {
      // 订阅名单
      nameList = {
        specialSQL: { words: item.subName },
        filters: JSON.parse(item.superQueryLogic).filters,
        ...item.condition,
        // current_location: item.condition.geoFilter,
        id: item.id,
        subscribeId: item.id, //因为数据返回只有订阅结果，故直接用名单id
        // subscribeId: item.subscribeId,
      }
    } else if (from === 2) {
      // 同行再看，模板
      nameList = {
        specialSQL: { words: item.templateName },
        // filters: item.condition.filters,
        ...item.condition,
        templateId: item.id,
        searchType: 'demo',
      }
    }
    const { history, setFilters, setGeoFilters } = this.props

    if (nameList.geoFilter) {
      setGeoFilters(nameList.geoFilter)
    }
    if (nameList.filters) {
      setFilters(nameList.filters)
    }

    // 带推送id跳转
    if (from && item.id) {
      history.push('/filterRes?subscribeid=' + item.id, nameList)
    } else {
      history.push('/filterRes', nameList)
    }
  }

  // 打开模板库，如未设置行业，先设置行业
  onFellowClick = () => {
    const { industryList } = this.props.findCustomer
    console.log(this.props)
    pointBuried({
      action: '922604570157',
      params: [],
    })
    if (industryList.length > 0) {
      this.setState({
        templateListVisible: !this.state.templateListVisible,
      })
    } else {
      !this.state.templateListVisible && this.setState({ customerIndustryVisible: true })
    }
  }

  customerIndustrySuccess = () => {
    this.setState({
      customerIndustryVisible: false,
      templateListVisible: true,
    })
    this.props.queryUserIndustries()
    // this.props.getFellowList({ pageNum: 1, pageSize: 5 });
  }

  customerIndustryCancel = () => {
    this.setState({
      customerIndustryVisible: false,
    })
  }

  backCDE = () => {
    pointBuriedGel('922602100836', '数据浏览器', 'cdeBacktoOld')
    setTimeout(() => {
      wftCommon.jumpJqueryPage('SearchBidV2.html')
    }, 100)
  }

  changeSubscribeVisible = () => {
    this.setState({
      subscribeVisible: !this.state.subscribeVisible,
    })
  }

  setTitle = (title) => {
    // @ts-expect-error ttt
    this.state.title = title
    if (this.state.subscribeVisible) {
      if (this.state.subscribeId || this.props.subscribeId) {
        const params = {
          id: this.state.subscribeId || this.props.subscribeId,
          name: title,
        }
        namelistEdit(params)
      }
    } else if (this.mail) {
      // @ts-expect-error ttt
      this.emailBinding({ emailNotice: true, email: this.mail })
    } else {
      this.changeSubscribeVisible()
    }
  }

  generFilterJson = (values) => {
    const tmpData = []
    const _filters = JSON.parse(JSON.stringify(values))
    _filters.map((filter) => {
      delete filter.info
    })
    _filters.forEach((el) => {
      const itemList = []
      const keysList = Object.keys(el).sort()
      keysList.forEach((kl) => {
        itemList.push(el[kl])
      })
      tmpData.push(itemList)
    })
    return JSON.stringify(tmpData)
  }

  // 开启订阅
  subscribe = ({ emailNotice, email }, data) => {
    const { measures, title } = this.state
    const { filters, geoFilter } = this.props
    if (!title) {
      message.error(intl(478575, '订阅名称不能为空'))
      return false
    }
    if (!data && filters.length === 0 && geoFilter.length === 0) {
      message.error(intl(286738, '"还未选择有效的过滤条件！"'))
      return false
    }
    const _filters = JSON.parse(JSON.stringify(filters))
    _filters.map((filter) => {
      delete filter.info
    })
    this.setState({
      subFilterJson: this.generFilterJson(_filters),
      subMsgVisible: false,
    })
    const param: any = {
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
      const param2: any = {
        superQueryLogic: data.superQueryLogic,
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

          this.props.findCustomer.mySusList.map((t) => {
            if (t.id == param2.id) {
              t.subPush = data.subPush
            }
          })
          const newdata = Object.assign([], this.props.findCustomer.mySusList)
          store.dispatch(
            FindCustomerActions.getMySusList({
              code: '0',
              data: {
                records: newdata,
                mail: param2.mail ? param2.mail : '',
              },
            })
          )
        }
        return res
      })
    }

    return namelistAdd(param).then((res) => {
      if (res.code === global.SUCCESS) {
        this.props.history.push('/filterRes?subscribeid=' + res.data.id, {
          specialSQL: '',
          searchType: '',
          _filters,
          geoFilter: geoFilter,
        })
      }
      return res
    })
  }

  // 开启订阅并绑定邮箱
  emailBinding = () => {
    return null
  }

  openOrClosePush = (t, idx, data, setData) => {
    if (!t.subPush) {
      this.setState(
        {
          subInfo: t,
        },
        () => {
          this.changeSubscribeVisible()
        }
      )
    } else {
      t.subPush = 0
      namelistEdit(t).then((res) => {
        if (res && res.code == global.SUCCESS) {
          data[idx].subPush = 0
          const newdata = Object.assign([], data)
          setData(newdata)
          message.success('操作成功')
        } else {
          message.error('操作失败，请稍后重试!')
        }
      })
    }
  }

  showAllSubModel = () => {
    const { mySusList, subEmail } = this.props.findCustomer
    const self = this

    store.dispatch(
      globalActions.setGolbalModal({
        className: 'showAllSubModelPage',
        width: 900,
        height: 720,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: '我的订阅',
        content: (
          <ShowAllSubModelDiv
            parentself={self}
            mySusList={mySusList}
            subEmail={subEmail}
            openOrClosePush={this.openOrClosePush}
            delSubMsg={this.delSubMsg}
            changeSubscribeVisible={this.changeSubscribeVisible}
            gotoFilterRes={this.gotoFilterRes}
            getFilterContent={this.getFilterContent}
            data-uc-id="iNQDtVVCH15"
            data-uc-ct="showallsubmodeldiv"
          ></ShowAllSubModelDiv>
        ),
        footer: null,
        // destroyOnClose: true,
        // forceRender: true,
      })
    )
  }

  showDelSubModel = (okCall) => {
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'showAllSubModelPage',
        width: 500,
        height: 180,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: '温馨提示',
        content: <div>是否删除订阅，确认将删除保存的条件以及不再收到推送邮件。</div>,
        footer: [
          <Button
            // @ts-expect-error ttt
            type="grey"
            onClick={() => store.dispatch(globalActions.clearGolbalModal())}
            data-uc-id="MVz2V8LcCI"
            data-uc-ct="button"
          >
            {intl('19405', '取消')}
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              // alert(2);
              okCall && okCall()
              store.dispatch(globalActions.clearGolbalModal())
            }}
            data-uc-id="kvIC-eJ8Jz"
            data-uc-ct="button"
          >
            {intl('138836', '确定')}
          </Button>,
        ],
      })
    )
  }

  // 取消订阅
  delSubMsg = (item, idx, list, callback) => {
    return this.props
      .delMySusItem(
        {
          id: item.id,
        },
        list,
        idx
      )
      .then((res) => {
        if (res && res.code == global.SUCCESS) {
          message.success('操作成功')
        } else {
          message.error('删除失败，请稍后重试')
        }
        callback && callback(res)
        return res
      })
  }

  render() {
    const { isShowSavePromptModal, rightChangeWidth, subscribeVisible, title } = this.state
    const { mySusList } = this.props.findCustomer
    const { location } = this.props
    const { getParamValue } = hashParams()
    const fromParam = getParamValue('from')
    const isRime = fromParam && fromParam.toLowerCase() === 'rime'

    const rightSusList = mySusList && mySusList.length && mySusList.length > 10 ? mySusList.slice(0, 10) : mySusList

    // fellowList = fellowList.map(obj => { obj.name = obj.templateName; return obj }).slice(0, 3)

    return (
      <React.Fragment>
        {!isRime && (
          <div className="breadcrumb-box">
            <Breadcrumb data-uc-id="uyBn5e1gFm" data-uc-ct="breadcrumb">
              <Breadcrumb.Item
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  wftCommon.jumpJqueryPage('SearchHome.html')
                }}
                data-uc-id="De92KQM9bP"
                data-uc-ct="breadcrumb"
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
                    data-uc-id="peI11ZLM7u"
                    data-uc-ct="breadcrumb"
                  >
                    {intl('259750', '企业数据浏览器')}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item data-uc-id="WLduuhtaei" data-uc-ct="breadcrumb">
                    结果列表
                  </Breadcrumb.Item>
                </React.Fragment>
              ) : (
                <Breadcrumb.Item data-uc-id="fDLVrPvW2r" data-uc-ct="breadcrumb">
                  {intl('259750', '企业数据浏览器')}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          </div>
        )}
        <div className="findCustomer">
          {/* 页面的任何地方加上Prompt组件都生效 */}

          <Modal
            title={intl(31041, '提示')}
            closable={false}
            visible={isShowSavePromptModal}
            onOk={this.handleSaveModelOK}
            onCancel={this.handleSaveModelCancel}
            footer={[
              <Button
                // @ts-expect-error ttt
                type="grey"
                onClick={this.handleSaveModelOK}
                data-uc-id="aHkOElm8ReE"
                data-uc-ct="button"
              >
                {intl(283270, '仍要离开')}
              </Button>,
              <Button type="primary" onClick={this.handleSaveModelCancel} data-uc-id="u4tl7XhSRzI" data-uc-ct="button">
                {intl(283271, '留在此页')}
              </Button>,
            ]}
            data-uc-id="SlHnbI7AYD7"
            data-uc-ct="modal"
          >
            <span style={{ marginLeft: '10px' }}>{intl(283272, '离开页面将丢失已选条件，是否仍要离开？')}</span>
          </Modal>
          <Row gutter={16}>
            <Col className="main_content">
              <RestructFilter
                isShow={true}
                hideHead={isRime}
                currentDefault={this.state.selectedMenuKeyFromUrl}
                changeSubscribeVisible={() => {
                  this.setState({ subInfo: { fromAdd: true } }, () => {
                    this.changeSubscribeVisible()
                  })
                }}
              />
            </Col>
            {rightSusList.length > 0 ? (
              <Col className="right_box" style={{ width: rightChangeWidth }}>
                <Card size="small" title={intl(272478, '我的订阅')} bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={rightSusList}
                    loadMore={
                      <span
                        className="loadMore"
                        onClick={(e) => {
                          this.onLoadMore1()
                          e.stopPropagation()
                        }}
                        data-uc-id="DUSTXREBY4e"
                        data-uc-ct="span"
                      >
                        {intl(138650, '查看全部')}
                      </span>
                    }
                    renderItem={(item: any, idx) => (
                      <List.Item onClick={() => this.gotoFilterRes(item, 1)} data-uc-id="dWIAhU2oXWQ" data-uc-ct="">
                        <List.Item.Meta
                          title={
                            <>
                              <span>{item.subName || intl(283404, '无标题')}</span>
                            </>
                          }
                          description={
                            <p className="">
                              {/* @ts-expect-error ttt */}
                              <span>{this.getFilterContent(item)}</span>
                            </p>
                          }
                          data-uc-id="9JV17RlK5W-"
                          data-uc-ct=""
                        />
                        <span
                          onClick={(e) => {
                            this.showDelSubModel(() => {
                              // @ts-expect-error ttt
                              this.delSubMsg(item, idx, this.props.findCustomer.mySusList)
                            })
                            e.stopPropagation()
                          }}
                          data-uc-id="fjP_uNSpMK1"
                          data-uc-ct="span"
                        >
                          <CloseO
                            className={'list-item-del'}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            data-uc-id="l7kyppciOTY"
                            data-uc-ct="closeo"
                          />
                        </span>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ) : null}
          </Row>
        </div>
        {/* 订阅 */}
        <Subscribe
          type={1}
          visible={subscribeVisible}
          changeVisible={this.changeSubscribeVisible}
          name={title}
          setTitle={this.setTitle}
          subscribe={this.subscribe}
          info={this.state.subInfo}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    findCustomer: state.findCustomer,
    userPackageinfo: state.home.userPackageinfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMySusList: (data) => {
      return getCustomerSubList(data).then((res) => {
        dispatch(FindCustomerActions.getMySusList({ ...res, ...data }))
        return res
      })
    },
    delMySusItem: (data, totalData, idx) => {
      return namelistDelete(data).then((res) => {
        if (res && res.code == global.SUCCESS) {
          totalData.splice(idx, 1)
          dispatch(
            FindCustomerActions.getMySusList({
              code: '0',
              data: {
                records: totalData,
              },
            })
          )
        }
        return res
      })
    },
    resetData: () => {
      dispatch({ type: 'RESET' })
    },
  }
}

export default connectZustand(useConditionFilterStore, (state) => {
  console.log(state)
  return {
    filters: state.filters,
    getPreItemInfo: state.getPreItemInfo,
    filterConfigList: state.filterConfigList,
    setFilters: state.setFilters,
    setGeoFilters: state.setGeoFilters,
    codeMap: state.codeMap,
    setDefaultFilters: state.setDefaultFilters,
    setSubEmail: state.setSubEmail,
    subEmail: state.subEmail,
  }
})(connect(mapStateToProps, mapDispatchToProps)(FindCustomer))
