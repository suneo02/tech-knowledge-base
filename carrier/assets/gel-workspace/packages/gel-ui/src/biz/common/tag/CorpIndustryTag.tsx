import { useIntl } from '@/common'
import { Tag, Tooltip } from '@wind/wind-ui'
import cn from 'classnames'
import { CorpTag } from 'gel-api'
import { TagsModule } from 'gel-util/biz'
import { CSSProperties, FC } from 'react'
import styleModule from './CorpIndustryTag.module.less'
import { TagWithModule, useTagConfigByModule } from './TagWithModule'

export const CorpIndustryTag: FC<{
  corpTag: CorpTag
  style?: CSSProperties
  className?: string
}> = ({ corpTag, style, className }) => {
  const t = useIntl()
  const config = useTagConfigByModule(TagsModule.CORP_INDUSTRY)
  const { color, type, size } = config
  if (corpTag.confidence === 1) {
    return (
      <TagWithModule
        module={TagsModule.CORP_INDUSTRY}
        key={corpTag.id}
        className={styleModule['corp-industry-tag']}
        value={corpTag.name}
      >
        {corpTag.name}
      </TagWithModule>
    )
  } else {
    return (
      <Tooltip title={t('449724', '* 表示基于企业库大数据计算的结果')} key={corpTag.id}>
        {/* TODO 单独处理 样式 */}
        <Tag
          value={corpTag.name}
          color={color}
          type={type}
          size={size}
          className={cn(styleModule['corp-industry-tag'], className)}
          style={style}
          onClick={() => {
            console.log(corpTag, 'corpTag')
          }}
          data-uc-id="53UtupxslKH"
          data-uc-ct="tag"
        >
          <span className="industry-tag-title">{corpTag.name}</span>
          <sup>*</sup>
        </Tag>
      </Tooltip>
    )
  }
}
