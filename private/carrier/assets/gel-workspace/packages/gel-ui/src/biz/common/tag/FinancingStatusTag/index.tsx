import { CorpTag } from 'gel-api'
import { TagsModule } from 'gel-util/biz'
import { CSSProperties, FC } from 'react'
import { TagWithModule } from '../TagWithModule'

export const FinancingStatusTag: FC<{
  corpTag: CorpTag
  style?: CSSProperties
  className?: string
}> = ({ corpTag, style, className }) => {
  return (
    <TagWithModule
      module={TagsModule.COMPANY}
      key={corpTag.id}
      className={className}
      value={corpTag.name}
      styles={style}
    >
      {corpTag.name}
    </TagWithModule>
  )
}
