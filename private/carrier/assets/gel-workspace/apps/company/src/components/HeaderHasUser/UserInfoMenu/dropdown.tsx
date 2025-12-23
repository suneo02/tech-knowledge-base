import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Dropdown, Menu } from '@wind/wind-ui'
import React, { useMemo } from 'react'
import { gotoLogin } from '@/lib/logout'
import { isEn } from 'gel-util/intl'

/**
 * 用户菜单项。
 * @typedef {Object} UserMenu
 * @property {number} id - 菜单项的唯一标识符。 及语言 id ！！！ 不能随意修改
 * @property {string} zh - 菜单项的中文名称。
 * @property {string} [url] - 菜单项对应的URL路径。部分 menu item 无链接
 */
const UserMenusRaw = [
  {
    id: 20977,
    zh: '我的账户',
    url: 'index.html#/customer?type=myaccounts',
  },
  {
    id: 14896,
    zh: '我的收藏',
    url: 'index.html#/companyDynamic?keyMenu=1&nosearch=1',
  },
  {
    id: 141995,
    zh: '我的数据',
    url: 'index.html#/customer?type=mylist',
  },
  {
    id: 153389,
    zh: '我的订单',
    url: 'index.html#/customer?type=myorders',
  },
  {
    id: 452995,
    zh: '用户协议',
    url: 'index.html#/customer?type=usernote',
  },
  {
    id: 26588,
    zh: '联系我们',
    url: 'index.html#/customer?type=contact',
  },
  {
    // FIXME 多语言中新增
    id: -1,
    zh: '绑定手机',
    en: 'Bind Account',
  },
  {
    onlyTerminal: true,
    id: '',
    zh: isEn() ? 'Help Center' : '帮助中心',
    url: '//UnitedWebServer/helpcenter/helpCenter/redirect/document?id=30',
  },
  {
    id: 21828,
    zh: '退出登录',
    url: 'windLogin.html',
  },
]

const useUserMenus = () => {
  const isDevDebugger = wftCommon.isDevDebugger()
  const usedInClient = wftCommon.usedInClient()
  const lanxin_terminal = window.localStorage.getItem('lanxin_terminal')
  return useMemo(() => {
    return UserMenusRaw.filter((item) => {
      if (usedInClient || isDevDebugger) {
        // 终端中 或者 开发模式不展示退出登录
        if (String(item.id) == '21828') return false
      }
      if (usedInClient) {
        // 终端中不展示绑定手机号
        if (item.id == -1) return false
      }
      if (!usedInClient && item.onlyTerminal) {
        // web端 不显示
        return false
      }
      if (lanxin_terminal) {
        // 蓝信终端不展示退出登录
        if (String(item.id) == '21828') return false
      }
      return true
    })
  }, [UserMenusRaw])
}
/**
 * @abstract 首页 header 中用户中心下拉菜单
 * @param accountCss 一个css类名
 * @param {Function} 打开modal
 * @returns
 */
export const UserInfoDropdown = ({ accountCss, openUpdateContactModal }) => {
  const userMenus = useUserMenus()
  /**
   *
   * @param {Object} t
   * @returns
   */
  const onMenuClick = (t) => {
    switch (t.id) {
      case 21828: {
        gotoLogin()
        return
      }
      // FIXME
      case -1: {
        openUpdateContactModal()
        return
      }
      default: {
        wftCommon.jumpJqueryPage(t.url)
      }
    }
  }

  return (
    <Dropdown
      // @ts-ignore
      theme="light"
      overlay={
        // @ts-ignore
        <Menu className="user-menus" data-uc-id="9mujLfE_2LT" data-uc-ct="menu">
          {userMenus.map((m) => (
            // @ts-ignore
            <Menu.Item key={m.id} data-uc-id="jyvooQRo9lL" data-uc-ct="menu" data-uc-x={m.id}>
              <a
                onClick={() => {
                  onMenuClick(m)
                }}
                data-uc-id="rUzlQ_jKj8T"
                data-uc-ct="a"
              >
                {/* 此处做了特殊处理 有一项没有多语言 */}
                {m.id === -1 ? (window.en_access_config ? m.en : m.zh) : intl(m.id, m.zh)}
              </a>
            </Menu.Item>
          ))}
        </Menu>
      }
      placement="bottomCenter"
      data-uc-id="CZQkOdyjMWy"
      data-uc-ct="dropdown"
    >
      <span className={accountCss}>{intl(210156, '用户中心')}</span>
    </Dropdown>
  )
}
