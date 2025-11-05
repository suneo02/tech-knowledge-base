import React, { FC } from 'react'
import { Tag, Tooltip } from '@wind/wind-ui'
import intl from '@/utils/intl'

const STRINGS = {
  TOOLTIP_TITLE: intl('449724', '* 表示基于企业库大数据计算的结果'),
}
export const IndustryTag: FC<{
  tags: [{ title: string; id: string; confidence: number }]
}> = ({ tags }) => {
  return (
    tags?.map((item) => {
      if (item.confidence === 1) {
        return (
          // @ts-expect-error 类型错误
          <Tag color="color-8" type="primary" key={item.id} className="company-card-tag-item" value={item.title}>
            {item.title}
          </Tag>
        )
      } else {
        return (
          <Tooltip title={STRINGS.TOOLTIP_TITLE} key={item.id}>
            {/* @ts-expect-error 类型错误 */}
            <Tag
              value={item.title}
              color="color-8"
              type="primary"
              className="company-card-tag-item"
              onClick={() => {
                console.log(item, 'item')
              }}
            >
              <span className="industry-tag-title">{item.title}</span>
              <sup>*</sup>
            </Tag>
          </Tooltip>
        )
      }
    }) || null
  )
}
