import { Tag } from '@wind/wind-ui'
import type { CellRenderer } from '@/components/CellRegistry'
import { t } from 'gel-util/intl'

export const TagRenderer: CellRenderer = ({ value }) => {
  const strVal = String(value || '')
  let color: string | undefined
  if (strVal === t('482219', '超级推荐')) {
    color = 'color-5'
  } else if (strVal === t('482237', '强烈推荐')) {
    color = 'color-3'
  } else if (strVal === t('271634', '推荐')) {
    color = 'color-1'
  }
  return (
    // @ts-expect-error windUI types issue
    <Tag type="primary" color={color} style={{ marginRight: 0 }}>
      {strVal}
    </Tag>
  )
}
