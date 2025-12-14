import { Links } from '@/components/common/links'
import { LinksModule, UserLinkEnum } from '@/handle/link'
import React from 'react'
import styles from './index.module.less'
import { SourceTypeEnum } from './sourceTypeEnum'
import { SupportedLocale } from 'gel-util/intl'

export const getPrivacyPolicyLinkBySource = (source: SourceTypeEnum, locale: SupportedLocale) => {
  const title = locale === 'zh-CN' ? '《全球企业库隐私政策》' : 'Global Enterprise Library Privacy Policy'
  if (source === SourceTypeEnum.WINDZX) {
    return (
      <Links
        url={'https://gel.wind.com.cn/web/gelapp/gelprivacyplatform.html'}
        className={styles.userNoteLink}
        title={title}
      />
    )
  }
  return (
    <Links
      className={styles.userNoteLink}
      title={title}
      module={LinksModule.USER}
      subModule={UserLinkEnum.UserPolicy}
    />
  )
}

export const getDisclaimerLinkBySource = (source: SourceTypeEnum, locale: SupportedLocale) => {
  const title = locale === 'zh-CN' ? '《全球企业库免责声明》' : 'Global Enterprise Library Disclaimer'
  if (source === SourceTypeEnum.WINDZX) {
    return (
      <Links
        url={'https://www.windzx.com/contact.html?content=disclaimer'}
        className={styles.userNoteLink}
        title={title}
      />
    )
  }
  return (
    <Links
      className={styles.userNoteLink}
      title={title}
      module={LinksModule.USER}
      subModule={UserLinkEnum.Exceptions}
    />
  )
}
