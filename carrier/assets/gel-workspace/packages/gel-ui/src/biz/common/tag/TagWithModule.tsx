import { Tag } from '@wind/wind-ui'
import cn from 'classnames'
import { getTagConfig, TagCfgByModule, TagsModule } from 'gel-util/biz'
import { isNil } from 'lodash-es'
import { CSSProperties, FC, ReactNode, useMemo } from 'react'
import { CorpDetailDynamicEventTypeTag, CorpDetailPublicSentimentTag } from './DynamicEventTypeTag'
import styleModule from './TagWithModule.module.less'

export type TagWithModuleProps = {
  module: TagsModule
  children?: ReactNode
  className?: string
  styles?: CSSProperties
  value?: string
  onClick?: (e) => void
  intl?: (key: string, defaultValue: string) => string
}

export const useTagConfigByModule = (module: TagsModule) => {
  return useMemo<TagCfgByModule>(() => {
    const config = getTagConfig(module)
    if (!config) {
      console.error(`TagWithModule: module ${module} not found`)
      return {
        color: 'color-2',
        type: 'primary',
        size: 'default',
        content: '',
      }
    }
    return config
  }, [module])
}
export const TagWithModule: FC<TagWithModuleProps> = ({
  module,
  children,
  className,
  styles,
  onClick,
  value,
  intl,
  ...options
}) => {
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
  const config = useTagConfigByModule(module)

  const { color, type, size } = config
  let contentByConfig = 'content' in config ? config.content : undefined
  if ('contentIntl' in config && intl) {
    contentByConfig = intl(config.contentIntl, config.content || '')
  }

  if (!contentByConfig && !children) {
    return null
  }
  return (
    <Tag
      className={cn(className, styleModule['tag-widh-module'])}
      style={styles}
      color={color}
      type={type as 'primary' | 'secondary'}
      size={size}
      onClick={onClick}
      value={value}
    >
      {contentByConfig || children}
    </Tag>
  )
}
