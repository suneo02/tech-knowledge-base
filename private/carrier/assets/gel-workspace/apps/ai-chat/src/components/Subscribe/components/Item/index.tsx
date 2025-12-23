import React, { useState, useEffect } from 'react'
import { QueryFilter } from 'gel-api'
import { formatFilterDisplayArray, type FilterDisplayItem } from '@/pages/SuperChat/CDE/utils/formatFilterDisplayString'
import { CDEFormBizValues } from 'cde'
import styles from './index.module.less'
import { Tag, Popover } from '@wind/wind-ui'

const PREFIX = 'subscribe-item'

interface SubscribeItemProps {
  filters: QueryFilter[]
}

const SubscribeItem: React.FC<SubscribeItemProps> = ({ filters }) => {
  const [items, setItems] = useState<FilterDisplayItem[]>([])

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ filters:', filters)
    // 将QueryFilter转换为CDEFormBizValues并处理filters
    // console.log('🚀 ~ useEffect ~ filters:', filters)
    const formattedItems = formatFilterDisplayArray(filters as CDEFormBizValues[])
    console.log('🚀 ~ useEffect ~ formattedItems:', formattedItems)
    setItems(formattedItems)
  }, [filters])

  if (!items.length) {
    return (
      <div className={styles[`${PREFIX}-container`]}>
        <div className={styles[`${PREFIX}-empty`]}>暂无筛选条件</div>
      </div>
    )
  }

  const renderTagsWithLimit = (values: string[]) => {
    const maxDisplayCount = 3
    const shouldShowMore = values.length > 4

    if (shouldShowMore) {
      const displayValues = values.slice(0, maxDisplayCount)
      const remainingCount = values.length - maxDisplayCount

      return (
        <>
          {displayValues.map((value, i) => (
            <Tag
              key={i}
              size="large"
              className={styles[`${PREFIX}-item-tag`]}
              title={value}
              color="color-3"
              type="primary"
            >
              {value}
            </Tag>
          ))}
          <Popover
            content={
              <div className={styles[`${PREFIX}-popover-container`]}>
                {values.slice(maxDisplayCount).map((value, i) => (
                  // @ts-expect-error wind-ui tag 类型错误
                  <div key={i} size="large" title={value} color="color-3" type="primary">
                    {value}
                  </div>
                ))}
              </div>
            }
            trigger="hover"
          >
            <Tag
              key="more"
              size="large"
              className={styles[`${PREFIX}-item-tag-more`]}
              title={`还有${remainingCount}个条件`}
              color="color-3"
              type="primary"
            >
              +{remainingCount}
            </Tag>
          </Popover>
        </>
      )
    }

    return values.map((value, i) => (
      <Tag key={i} className={styles[`${PREFIX}-item-tag`]} title={value} color="color-3" type="primary" size="large">
        {value}
      </Tag>
    ))
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {items.map((item, index) => (
        <div key={index} className={styles[`${PREFIX}-item`]}>
          <div className={styles[`${PREFIX}-item-title`]}>{item.title}</div>
          <div className={styles[`${PREFIX}-item-tags`]}>{renderTagsWithLimit(item.values)}</div>
        </div>
      ))}
    </div>
  )
}

export default SubscribeItem
