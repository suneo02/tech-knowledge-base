import { Tag } from '@wind/wind-ui'
import cn from 'classnames'
import { TagCfgByModuleMap, TagColors, TagSizes, TagsModule, TagTypes } from 'gel-util/misc'
import { isNil } from 'lodash'
import { CSSProperties, FC, ReactNode, useMemo } from 'react'
import styleModule from './comp.module.less'
import { CorpDetailDynamicEventTypeTag, CorpDetailPublicSentimentTag } from './DynamicEventTypeTag'

export const TagWithModule: FC<{
  module: TagsModule
  children?: ReactNode
  className?: string
  styles?: CSSProperties
  onClick?: () => void
}> = ({ module, children, className, styles, onClick, ...options }) => {
  if (isNil(module)) {
    return null
  }
  switch (module) {
    case TagsModule.TREND:
    case TagsModule.BUSINESS_OPPORTUNITY:
      return <CorpDetailDynamicEventTypeTag content={children} />
    case TagsModule.PUBLIC_SENTIMENT:
      return <CorpDetailPublicSentimentTag content={children} {...options} />
  }
  const { color, type, size, content } = useMemo<{
    color: TagColors
    type: TagTypes
    size?: TagSizes
    content?: string
  }>(() => {
    return (
      TagCfgByModuleMap[module] || {
        color: 'color-2',
        type: 'primary',
        size: 'default',
        content: '',
      }
    )
  }, [module])

  return (
    // @ts-expect-error ttt
    <Tag
      className={cn(className, styleModule['tag-widh-module'])}
      style={styles}
      color={color}
      type={type as 'primary' | 'secondary'}
      size={size}
      onClick={onClick}
    >
      {content || children}
    </Tag>
  )
}
