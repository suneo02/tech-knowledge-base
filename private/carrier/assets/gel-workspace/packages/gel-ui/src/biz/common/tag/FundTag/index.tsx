import { Tooltip } from '@wind/wind-ui'
import { CorpTag } from 'gel-api'
import { TagsModule } from 'gel-util/biz'
import { t } from 'gel-util/intl'
import { CSSProperties, FC, useMemo } from 'react'
import { TagWithModule } from '../TagWithModule'
import styleModule from './index.module.less'

export const FundTag: FC<{
  corpTag: CorpTag
  style?: CSSProperties
  className?: string
}> = ({ corpTag, style, className }) => {
  const tooltipContent = useMemo(() => {
    const type = corpTag.type as string
    switch (type) {
      case 'FUND_AMAC':
        return t('fund_amac_tooltip', '备案为私募基金管理人基金产品')
      case 'FUND_NON_AMAC':
        return t('fund_non_amac_tooltip', '未备案为私募基金管理人基金产品')
      case 'LIMITED_PARTNER':
        return t('limited_partner_tooltip', '在私募股权基金中以 LP 身份直接出资')
      default:
        return null
    }
  }, [corpTag.type])

  const tagNode = (
    <TagWithModule
      module={TagsModule.COMPANY}
      key={corpTag.id}
      className={className || styleModule['fund-tag']}
      value={corpTag.name}
      styles={style}
    >
      {corpTag.name}
    </TagWithModule>
  )

  if (tooltipContent) {
    return (
      <Tooltip title={tooltipContent} key={corpTag.id}>
        <span className={styleModule['fund-tag-wrapper']}>{tagNode}</span>
      </Tooltip>
    )
  }

  return tagNode
}
