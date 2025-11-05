import { handleWebLogout } from '@/handle/user/login'
import { wftCommon } from '@/utils/utils'
import { Button } from '@wind/wind-ui'
import classNames from 'classnames'
import React from 'react'
import styles from './styles.module.less'

interface PrivacyPolicyIframeProps {
  className?: string
  style?: React.CSSProperties
}

export const privacyPolicyUrl = 'wind.ent.web/gel/gelapp/gelprivacyplatform.html'

/**
 * 如果不是 终端，显示 撤销同意隐私政策并退出登录 按钮
 */
export const PrivacyPolicyIframe: React.FC<PrivacyPolicyIframeProps> = ({ className, style }) => {
  const usedInClient = wftCommon.usedInClient()
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  const baseDomain = isTestEnvironment ? 'test' : 'gel'
  const url = `https://${baseDomain}.wind.com.cn/${privacyPolicyUrl}`
  return (
    <div className={styles.container}>
      <iframe src={url} className={classNames(styles.iframe, className)} style={style} />
      {!usedInClient && (
        <Button className={styles.logoutButton} onClick={handleWebLogout}>
          撤销同意隐私政策并退出登录
        </Button>
      )}
    </div>
  )
}
