import { localStorageManager } from '@/utils/storage'
import { Modal } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import * as globalActions from '../actions/global'
import * as HomeActions from '../actions/home'
import { getPayGoods, getUserPackageInfo } from '../api/homeApi'
import HeaderHasUser from '../components/HeaderHasUser/index'
import { VipPopupModal } from '../lib/globalModal'
import { parseQueryString } from '../lib/utils'
import store from '../store/store'
import { isTestSite } from '../utils/env'
import { wftCommon } from '../utils/utils'
import './Home.less'

interface HomeState {
  notoolbar: boolean
  needtoolbar: boolean
  nosearch: boolean
}

interface HomeProps {
  route: any
  routePathId: string
  getUserPackageInfo: (callback: (hidetoolbar: boolean) => void, localres?: any) => void
  home: any
}

// 内页公共部分，各功能页面是该页面下的二级路由
class Home extends React.Component<HomeProps, HomeState> {
  private isSeparate: string | number = ''

  constructor(props) {
    super(props)
    this.state = {
      notoolbar: false, // 导航是否展示
      needtoolbar: false,
      nosearch: true,
    }
    this.isSeparate = ''
  }

  componentDidMount = () => {
    const hrefUrl = window.location.href?.toLocaleLowerCase()
    const isSearchHome = hrefUrl.includes('searchhome')
    const isCustomer = hrefUrl.includes('customer')
    const isVersionPrice = hrefUrl.includes('versionPrice')
    this.setState({ nosearch: false }) // 初始设置true，再DidMount中统一置为false，以解决如果默认为false，通过porps控制true时，会出现看到搜索框一瞬后又消失的现象
    if (hrefUrl.indexOf('/bankingworkbench') > -1) {
      this.setState({ notoolbar: true })
    }
    if (hrefUrl.indexOf('/searchhome') > -1 && hrefUrl.indexOf('/searchhomelist') == -1) {
      this.setState({ nosearch: true })
    }
    const qs = parseQueryString()
    const linksource = qs.linksource
    if (linksource === 'rime') {
      // RIME
      document.querySelector('#root').classList.add('wind-gel-rime')
    }
    if (qs.notoolbar && !qs.needtoolbar) {
      this.setState({ notoolbar: true })
    }
    if (qs.needtoolbar) {
      this.setState({ needtoolbar: true })
    }
    if (qs.nosearch) {
      this.setState({ needtoolbar: true, nosearch: true })
    }
    if (qs.isSeparate) {
      this.isSeparate = 1
    }
    // 首页和用户中心及会员页面，走接口读实时权限
    if (window.is_terminal && !isSearchHome && !isCustomer && !isVersionPrice) {
      // 终端内，从localstorage先读userid
      const gelUserInfo = localStorageManager.get('globaluserinfo4gel')

      if (gelUserInfo && gelUserInfo == window.globaluserinfo4gel) {
        // 终端内拿到了用户信息，并且是同一个客户的信息，则userpackage直接从本地读取
        let userPackage = localStorageManager.get('globaluserpackage4gel')

        // 计算权限是否过期
        const expireDate = wftCommon.formatTime(userPackage?.expireDate)
        const expireDateStamp = new Date(expireDate).getTime()
        const todayTimestamp = new Date().setHours(0, 0, 0, 0)

        // 计算剩余天数
        const oneDayMs = 24 * 60 * 60 * 1000 // 1天
        const remainDays = (expireDateStamp - todayTimestamp - oneDayMs) / oneDayMs

        // 账号权限是否过期，true 过期 false 未过期
        const isExpired = remainDays < 0

        if (userPackage?.packageName && userPackage.packageName !== 'EQ_APL_GEL_BS' && !isExpired) {
          // 非免费用户，且权限到期时间在一天以上 则先从本地读权限
          this.props.getUserPackageInfo(
            (hidetoolbar) => {
              hidetoolbar && this.setState({ notoolbar: hidetoolbar, needtoolbar: false })
            },
            {
              data: userPackage,
              code: '0',
            }
          )
        } else {
          // 未拿到用户信息，直接从接口处读取
          this.props.getUserPackageInfo((hidetoolbar) => {
            hidetoolbar && this.setState({ notoolbar: hidetoolbar, needtoolbar: false })
          })
        }
      } else {
        if (window.globaluserinfo4gel) {
          localStorageManager.set('globaluserinfo4gel', window.globaluserinfo4gel)
        }
        // 未拿到用户信息，直接从接口处读取
        this.props.getUserPackageInfo((hidetoolbar) => {
          hidetoolbar && this.setState({ notoolbar: hidetoolbar, needtoolbar: false })
        })
      }
    } else {
      // 直接从接口处读取
      this.props.getUserPackageInfo((hidetoolbar) => {
        hidetoolbar && this.setState({ notoolbar: hidetoolbar, needtoolbar: false })
      })
    }
  }

  render() {
    const { route } = this.props
    return (
      <React.Fragment>
        <div className={this.state.notoolbar ? ' home home-no-toolbar ' : ' home '}>
          {!this.state.notoolbar || this.state.needtoolbar ? (
            <HeaderHasUser nosearch={this.state.nosearch} isSeparate={this.isSeparate} />
          ) : null}
          <div className="main-container">
            <div className="page-container">
              {renderRoutes(route.children, { routePathId: this.props.routePathId })}
            </div>
          </div>
        </div>
        <VipPopupModal {...this.props.home.globalVipModalProps}></VipPopupModal>
        <Modal
          {...this.props.home.globalModalProps}
          transitionName={''}
          visible={this.props.home.globalModalProps && this.props.home.globalModalProps.visible ? true : false}
        >
          {this.props.home.globalModalProps && this.props.home.globalModalProps.content}
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    home: state.home,
    userpackageinfo: state.home.userPackageinfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserPackageInfo: (callback, localres) => {
      /**
       *
       * @param {Object} res  用户信息
       */
      const userPackinfoCall = (res) => {
        if (!localres) {
          let dataDeled = res.data
          // 精简用户信息
          delete dataDeled.packageNameList
          localStorageManager.set('globaluserpackage4gel', dataDeled)
        }
        wftCommon.userPackageConfigSet(res.data.packageName, res.data.expireDate, res.data)
        if (
          !res.data.packageName ||
          ['EQ_APL_GEL_FORTRAIL', 'EQ_APL_GEL_SVIP', 'EQ_APL_GEL_FORSTAFF'].indexOf(res.data.packageName) == -1
        ) {
          // 获取可以购买的套餐
          // paygoods
          getPayGoods().then((res) => {
            res && res.data && dispatch(HomeActions.getPayGoods({ ...res }))
            res && res.data && wftCommon.payGoodsSet(res.data)
          })
        }
        console.warn(`ISB`, wftCommon.isBaiFenTerminalOrWeb(res.data.terminalType))
        if (wftCommon.isBaiFenTerminalOrWeb(res.data.terminalType)) {
          //用于百分企业，由柴荣臻负责
          var script = window.document.createElement('script')
          const isOrNotTestSite = isTestSite()
          script.setAttribute(
            'src',
            `https://${isOrNotTestSite ? 'test' : 'wx'}.wind.com.cn/govpublic/dashboard/dashboard.js`
          )
          if (window.external && 'undefined' != typeof window.external.ClientFunc) {
            script.setAttribute('src', 'https://GOVWebSite/govpublic/dashboard/dashboard.js')
          }

          if (!window.defaultOpen && !window.bfqyjsInvoked) {
            window.document.head.appendChild(script)
            window.bfqyjsInvoked = true
          }
          callback(true)
        }
        dispatch(HomeActions.getUserPackageInfo({ ...res }))
      }

      if (localres && localres.data) {
        return userPackinfoCall(localres)
      }

      getUserPackageInfo()
        .then((res) => {
          if (res && res.Data) {
            userPackinfoCall(res)
          }
        })
        .finally(() => {
          dispatch(HomeActions.setUserPackageLoaded(true))
        })

      window.addEventListener('message', (e) => {
        if (e && e.data == 'wind.gp.app.close') {
          setTimeout(function () {
            store.dispatch(globalActions.clearGolbalModal())
          }, 200)
        }
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
