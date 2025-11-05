import { corpDetailTagJump, generateTagUrl, getInfoFromCompanyTag } from '@/components/company/intro/tag/handle.ts'
import { TagSafe } from '@/components/windUISafe/index.tsx'
import intl from '@/utils/intl'
import { Tooltip } from '@wind/wind-ui'
import { TagsModule, TagWithModule } from 'gel-ui'
import React, { FC, useMemo } from 'react'
import './styles/index.less'

export const CompanyCardTag: FC<{
  onClick?: () => void
  content: string
  color?: string
  size?: 'small' | 'large' | 'default' | 'mini'
}> = ({ color, onClick, content, size }) => (
  <TagSafe className={`cursor-pointer`} size={size} onClick={onClick} color={color ?? 'color-2'} type="primary">
    {content}
  </TagSafe>
)

/**
 * 企业的 tag 内部带跳转
 */
export const CompanyCommonTagWithJump: FC<{
  item?: string
  itemDestruct?: {
    type: string
    content: string
    id?: string
  }
  module: TagsModule
}> = ({ item, itemDestruct, module }) => {
  let type, content, id
  if (item) {
    ;({ type, content, id } = getInfoFromCompanyTag(item))
  } else if (itemDestruct) {
    ;({ type, content, id } = itemDestruct)
  } else if (typeof item === 'string') {
    content = item
  }

  const urlObj = useMemo(() => {
    return type && content ? generateTagUrl(type, content, id) : null
  }, [type, content, id])

  // 检查是否可以生成有效的跳转URL
  const canJump = !!urlObj?.url

  const tag = (
    <TagWithModule
      module={module}
      className={canJump ? 'cursor-pointer' : ''}
      onClick={canJump ? () => corpDetailTagJump(type, content, id) : undefined}
    >
      {content}
    </TagWithModule>
  )

  const isSmallMicroEnterprise = useMemo(() => content === '小微企业', [content])

  if (isSmallMicroEnterprise) {
    return (
      <Tooltip title={intl('361294', '依据国家市场监督管理总局公布的小微企业库，结合万得大数据模型进行判定。')}>
        {/* 使用span包裹，避免Tooltip的样式影响 */}
        <span style={{ display: 'inline-block' }}>{tag}</span>
      </Tooltip>
    )
  }

  return tag
}
