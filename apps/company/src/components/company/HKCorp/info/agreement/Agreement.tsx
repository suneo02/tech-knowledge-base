import classNames from 'classnames'
import React from 'react'
import { AgreementSection } from './components/AgreementSection'
import { PlatformInfo } from './components/PlatformInfo'
import { meta, platforms, sections, specialTips } from './data'
import styles from './styles.module.less'

export const Agreement: React.FC = () => {
  return (
    <div className={styles.agreement}>
      <h2 className={styles.title}>企业信用信息查询委托协议</h2>
      <div className={styles.meta}>
        <p>本版更新时间：{meta.updateDate}</p>
        <p>本版生效时间：{meta.effectiveDate}</p>
      </div>
      <div className={styles.content}>
        <div className={styles.specialTips}>
          <p
            className={classNames({
              [styles.underline]: specialTips.underline,
              [styles.bold]: specialTips.bold,
            })}
          >
            特别提示：
          </p>
          <p
            className={classNames({
              [styles.underline]: specialTips.underline,
              [styles.bold]: specialTips.bold,
            })}
          >
            {specialTips.content}
          </p>
        </div>
        {sections.map((section, index) => (
          <AgreementSection key={index} section={section} />
        ))}
        {platforms.map((platform, index) => (
          <PlatformInfo key={index} platform={platform} />
        ))}
      </div>
    </div>
  )
}
