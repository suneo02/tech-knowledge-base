import { Col, Menu, Row, Tooltip } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { getVipInfo } from '../../lib/utils'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import '../Header.less'
import MySearch from '../Search'
import { UserInfoDropdown } from './UserInfoMenu/dropdown'

import * as HomeActions from '@/actions/home'
import { getHeaderAllFuncMenus } from '@/components/Home/AllMenus/HeaderDropdown.ts'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import store from '@/store/store'
import { isEn, switchLocaleInWeb } from 'gel-util/intl'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { IFuncMenuItem } from '../Home/AllMenus/type'
import { MenuSafe } from '../windUISafe'
import { HeaderHasUserActionModal } from './ActionModal'

interface HeaderHasUserProps extends RouteComponentProps {
  home?: {
    userPackageinfo?: any
    bindPhoneModal?: '' | 'bindContact' | 'updateContact'
  }
  settings?: any
  isSeparate?: boolean
  nosearch?: boolean
  history: RouteComponentProps['history']
}

interface HeaderHasUserState {
  isRename: boolean
  inputValue: string
  userInfo: any
  noticeVisible: boolean
  noticeCount: number
  exitModal: boolean
  menuShow: boolean
  isFocused: boolean
  hasHistoryList: boolean
  searchResults: any[]
  isSvip: boolean
  isVip: boolean
  actionModal: '' | 'bindContact' | 'updateContact'
}

// 登录后的页面头部
class HeaderHasUser extends React.Component<HeaderHasUserProps, HeaderHasUserState> {
  constructor(props: HeaderHasUserProps) {
    super(props)
    this.state = {
      isRename: false,
      inputValue: '',
      userInfo: null,
      noticeVisible: false,
      noticeCount: 0,
      exitModal: false,
      menuShow: false,
      isFocused: false,
      hasHistoryList: false,
      searchResults: [],
      isSvip: false,
      isVip: false,
      actionModal: '',
    }
  }

  shouldComponentUpdate = (nextProps: HeaderHasUserProps, nextState: HeaderHasUserState) => {
    if (nextProps.home && nextProps.home.userPackageinfo) {
      if (nextProps.home.userPackageinfo !== this.props.home?.userPackageinfo) {
        return true
      }
      if (!wftCommon.usedInClient()) {
        if (nextProps.home.bindPhoneModal !== this.props.home?.bindPhoneModal) {
          // 同步更新 actionModal
          this.setState({
            actionModal: nextProps.home.bindPhoneModal || '',
          })
          return true
        }
      } else if (nextState == this.state) {
        return false
      }
    }
    return true
  }

  redirectUrl = (t: Partial<IFuncMenuItem>) => {
    if (t.buryFunc) {
      t.buryFunc()
    }
    wftCommon.jumpJqueryPage(t.url)
  }

  setActionModal = (actionModal: '' | 'bindContact' | 'updateContact') => {
    store.dispatch(HomeActions.setBindPhoneModal(actionModal))
  }

  render() {
    const { isSeparate } = this.props
    const { actionModal } = this.state

    let accountCss = ''

    if (this.props.home?.userPackageinfo) {
      const userVipInfo = getVipInfo()
      if (userVipInfo.isSvip) {
        accountCss = 'account-tips-svip'
      } else if (userVipInfo.isVip) {
        accountCss = 'account-tips-vip'
      }
    }

    const allMenus = getHeaderAllFuncMenus()

    const isDevDebugger = wftCommon.isDevDebugger()
    const usedInClient = wftCommon.usedInClient()
    const lanxin_terminal = window.localStorage.getItem('lanxin_terminal')

    return (
      <div className="header headerHasUser">
        <div className={isSeparate ? 'header-box isSeparate' : 'header-box'}>
          <a
            onClick={() => {
              pointBuriedByModule(922602101029)
              if (wftCommon.isDevDebugger()) {
                return window.open('index.html#/searchHome')
              }
              this.redirectUrl({ url: 'SearchHome.html' })
            }}
          >
            <div className="logo"></div>
          </a>

          <MySearch hidden={this.props.nosearch} />

          <div className="userinfo">
            <MenuSafe mode="horizontal" className="toolbar-menu">
              <Menu.Item key="271837">
                <a
                  onClick={() => {
                    if (wftCommon.isDevDebugger()) {
                      return window.open('#/findCustomer')
                    }
                    this.redirectUrl({ url: 'AdvancedSearch04.html' })
                  }}
                >
                  {intl('259750', '企业数据浏览器')}
                </a>
              </Menu.Item>

              <Menu.Item
                key="259016"
                onMouseEnter={() => {
                  pointBuriedByModule(922602101028)
                  this.setState({ menuShow: true })
                }}
                onMouseLeave={() => {
                  this.setState({ menuShow: false })
                }}
              >
                <a>{intl(437311, '全部功能')}</a>
              </Menu.Item>

              {wftCommon.is_overseas_config || window.en_access_config || (!isDevDebugger && !usedInClient) ? null : (
                <Menu.Item key="259758">
                  <a
                    onClick={() => {
                      const url = `//wx.wind.com.cn/wind.ent.openapi/index.html`
                      window.open(url)
                    }}
                  >
                    {intl(259758, '数据API')}
                  </a>
                </Menu.Item>
              )}

              {window.en_access_config || !usedInClient ? null : (
                <Menu.Item key="|" className="toolbar-menu-line">
                  <a onClick={() => {}}>{' | '}</a>
                </Menu.Item>
              )}
              {/*  vip */}
              <Menu.Item key="222403">
                <a
                  onClick={() => {
                    // 终端中 或者 海外版 都走 react 页面
                    window.open(getUrlByLinkModule(LinksModule.VIP))
                  }}
                >
                  {wftCommon.is_overseas_config ? intl('245502', '权限说明') : intl(222403, 'VIP服务')}
                </a>
              </Menu.Item>
              <Menu.Item key="210156">
                <UserInfoDropdown
                  accountCss={accountCss}
                  openUpdateContactModal={() => this.setActionModal('updateContact')}
                />
              </Menu.Item>
            </MenuSafe>
          </div>
          {usedInClient || isSeparate || lanxin_terminal ? null : (
            <div className="tool-switch-lan" onClick={switchLocaleInWeb}>
              {isEn() ? '中文' : 'English'}
            </div>
          )}

          <Row
            className={!this.state.menuShow ? 'tool-top-home tool-top-home-hide' : 'tool-top-home'}
            // @ts-expect-error ttt
            onMouseEnter={() => {
              this.setState({ menuShow: true })
            }}
            onMouseLeave={() => {
              this.setState({ menuShow: false })
            }}
          >
            <div className="header-container">
              <Row type="flex" justify="center">
                {allMenus.map((menuGroup, theid) => {
                  return (
                    <Col span={4} className="toolbar-list-ul" key={theid}>
                      <span
                        className="toobar-second-title second-t1"
                        onDoubleClick={() =>
                          window.open(
                            `${window.location.host}/#/bgroup?companycode=${new URLSearchParams(window.location.search).get('companycode')}`
                          )
                        }
                      >
                        <i>{intl(menuGroup.id, menuGroup.zh)}</i>
                      </span>
                      <div className="uitlFunc">
                        {menuGroup.list.map((menuItem, oid) => {
                          return (
                            <div key={oid}>
                              <div key={oid}>
                                {menuItem.icon ? (
                                  <span className={`icon ${menuItem.icon}`} style={{ marginInlineEnd: 6 }}></span>
                                ) : null}
                                <Tooltip>
                                  <span
                                    className="show-item-span"
                                    data-url={menuItem.url}
                                    onClick={() => {
                                      pointBuriedByModule(922602101029)
                                      if (menuItem.navigate) {
                                        menuItem.navigate(menuItem)
                                      } else {
                                        this.redirectUrl(menuItem)
                                      }
                                    }}
                                  >
                                    {intl(menuItem.id, menuItem.zh)}
                                  </span>
                                </Tooltip>

                                {menuItem.new ? (
                                  <span className="icon new" style={{ marginInlineStart: 6, width: 30, height: 18 }} />
                                ) : null}
                                {menuItem.hot ? (
                                  <span className="icon hot" style={{ marginInlineStart: 6, width: 30, height: 18 }} />
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </div>
          </Row>
        </div>
        <HeaderHasUserActionModal setActionModal={this.setActionModal} modalType={actionModal} />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    settings: state.settings,
    home: state.home,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderHasUser))
