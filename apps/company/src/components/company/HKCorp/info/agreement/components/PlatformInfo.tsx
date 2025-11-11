import classNames from 'classnames'
import React from 'react'
import { Platform } from '../types'
import styles from './styles.module.less'

interface Props {
  platform: Platform
}

export const PlatformInfo: React.FC<Props> = ({ platform }) => {
  return (
    <div className={styles.platform}>
      <h3 className={styles.title}>附：委托查询企业信用信息平台清单</h3>
      <div className={styles.content}>
        <p>
          <span className={classNames(styles.label, styles.bold)}>平台名称：</span>
          <span>{platform.name}</span>
        </p>
        <p>
          <span className={classNames(styles.label, styles.bold)}>信息查询链接地址：</span>
          <a href={platform.queryUrl} target="_blank" rel="noopener noreferrer" data-uc-id="xbCINkNJ06" data-uc-ct="a">
            {platform.queryUrl}
          </a>
        </p>
        <p>
          <span className={classNames(styles.label, styles.bold)}>平台用户协议或隐私政策链接地址：</span>
          <a
            href={platform.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-uc-id="FNTPz5BQMu"
            data-uc-ct="a"
          >
            {platform.privacyUrl}
          </a>
        </p>
        <div className={styles.restrictions}>
          <p className={classNames(styles.label, styles.bold)}>平台约定的信息使用限制：</p>
          {platform.restrictions.map((restriction, index) => (
            <p key={index} className={styles.restriction}>
              {restriction}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
