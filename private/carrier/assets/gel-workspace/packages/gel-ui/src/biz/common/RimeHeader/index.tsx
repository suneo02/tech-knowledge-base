import { UserO } from '@wind/icons'
import { Dropdown, Menu, Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React from 'react'
import ContactModalHost, { CONTACT_MODAL_EVENT } from './ContactModalHost'
import CorpPreSearchInput from './CorpPreSearchInput'
import styles from './index.module.less'

import { generateUrlByModule, handleJumpTerminalCompatible, isFromRimePEVC, LinkModule } from 'gel-util/link'
import { AxiosInstance } from 'axios'

const CONTACT_PATH = '#/contact'
const LOGOUT_PATH = '#/logout'

/**
 * 获取是否是测试站
 */
export const isTestSite = () => {
  return window.location.host.indexOf('8.173') > -1 || window.location.host.indexOf('test.wind.') > -1
}
/**
 * 获取来觅站点域名
 * @returns 根据环境返回对应的来觅站点域名
 */
const getRimeDomain = () => {
  return isTestSite() ? '//test.rimedata.com' : '//lite.rimedata.com'
}

const RimeHeader = ({ axiosInstance }: { axiosInstance: AxiosInstance }) => {
  const [isLogoutModalVisible, setLogoutModalVisible] = React.useState(false)

  const goHome = () => {
    window.location.href = `${getRimeDomain()}/`
  }

  /**
   * 处理菜单点击
   */
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === LOGOUT_PATH) {
      return setLogoutModalVisible(true)
    }

    if (key === CONTACT_PATH) {
      window.dispatchEvent(new CustomEvent(CONTACT_MODAL_EVENT))
      return
    }
    // 从企业库里面打开 跳转到来觅的用户中心页面
    if (isFromRimePEVC()) {
      return window.open(`${getRimeDomain()}${key}`, '_blank')
    }
  }
  const clearLoginCache = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('wind.sessionid')
    localStorage.removeItem('wind_token')

    // localStorage.clear()
  }

  const handleLogoutConfirm = () => {
    clearLoginCache()
    setLogoutModalVisible(false)
    window.location.href = `${getRimeDomain()}/#/login`
  }

  /**
   * 关闭退出登录弹窗
   */
  const handleCloseLogoutModal = () => {
    setLogoutModalVisible(false)
  }

  // 处理企业选择
  const handleCorpSelect = (corpName: string, corpId: string) => {
    console.log('选中企业:', corpName, 'corpId:', corpId)
    // 可以在这里添加跳转到企业详情页的逻辑
    const url = generateUrlByModule({
      module: LinkModule.COMPANY_DETAIL,
      params: {
        companycode: corpId,
      },
    })
    console.log('🚀 ~ handleCorpSelect ~ url:', url)

    handleJumpTerminalCompatible(url || '', false)
  }

  const dropdownMenu = (
    // @ts-expect-error - windui Menu 类型定义问题
    <Menu className={styles.profileMenu} onClick={handleMenuClick}>
      <Menu.Item key="#/user-center">账号信息</Menu.Item>
      <Menu.Item key="#/user-center/terms">服务条款</Menu.Item>
      <Menu.Item key="#/user-center/privacy">隐私政策</Menu.Item>
      <Menu.Item key="#/user-center/disclaimer">服务声明</Menu.Item>
      <Menu.Item key={CONTACT_PATH}>联系我们</Menu.Item>
      <Menu.Item key={LOGOUT_PATH}>退出登录</Menu.Item>
    </Menu>
  )

  return (
    <header className={styles.header}>
      <button type="button" className={styles.logo} onClick={goHome}>
        Rime PEVC
      </button>
      <div className={styles.nav}>
        <Menu mode="horizontal" selectedKeys={['3']}></Menu>
      </div>
      <div className={styles.actions}>
        <div className={styles.search}>
          <div className={styles.searchInput}>
            <CorpPreSearchInput axiosInstance={axiosInstance} onSelect={handleCorpSelect} />
          </div>
        </div>
        <Dropdown overlay={dropdownMenu} trigger={['hover']} align={{ offset: [0, 6] }}>
          <div className={styles.profileTrigger}>
            <UserO style={{ fontSize: '18px' }} onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
            <span className={styles.profileName}>{t('', '用户中心')}</span>
          </div>
        </Dropdown>
      </div>
      <Modal
        title={t('', '确认退出登录')}
        visible={isLogoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleCloseLogoutModal}
      >
        <p>{t('', '确认要退出当前账号吗？')}</p>
      </Modal>
      <ContactModalHost />
    </header>
  )
}
export { RimeHeader }
