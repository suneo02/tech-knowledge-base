import { ThemeF } from '@wind/icons'
import React from 'react'
import { useHomeEntryList } from './config/domestic'
import { SearchHomeItemData } from './config/type'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

const intlMsg = {
  recommendFunc: t('422016', '推荐功能'),
}

// 分组函数
function groupByTypeFunc(items: SearchHomeItemData[]) {
  const groups: Record<string, SearchHomeItemData[]> = {}
  items.forEach((item) => {
    if (item.typeFunc) {
      if (!groups[item.typeFunc]) groups[item.typeFunc] = []
      groups[item.typeFunc].push(item)
    }
  })
  return groups
}

/**
 * RecommendFunc component displays recommended functions in a grid layout
 * with expand/collapse functionality. Initially shows 10 items, 5 per row.
 */
export const HomeRecommendFunc: React.FC = () => {
  const functions = useHomeEntryList()
  const grouped = groupByTypeFunc(functions)
  console.log('🚀 ~ grouped:', functions, grouped)

  const handleItemClick = (item: SearchHomeItemData) => {
    if (item.url) {
      window.open(item.url)
    }
  }

  return (
    <div className={styles['recommend-func']}>
      <div className={styles['recommend-func-title']}>
        <ThemeF
          onPointerLeaveCapture={() => {}}
          onPointerEnterCapture={() => {}}
          style={{ fontSize: '24px' }}
          data-uc-id="Ubz_WTfix"
          data-uc-ct="themef"
        />
        <span className={styles['recommend-func-text']}>{intlMsg.recommendFunc}</span>
      </div>
      <div className={styles['group-list']}>
        {Object.entries(grouped).map(([type, items]) => (
          <div className={styles['group-row']} key={type}>
            <div className={styles['group-title']}>{type}</div>
            <div className={styles['group-items']}>
              {items.map((func) => (
                <div
                  key={func.key}
                  className={styles['group-item']}
                  onClick={() => handleItemClick(func)}
                  title={func.title}
                  data-uc-id="eWZGaY8xnI"
                  data-uc-ct="div"
                  data-uc-x={func.key}
                >
                  <span className={styles['icon-bg']} dangerouslySetInnerHTML={{ __html: func.fIcon }}></span>
                  <span className={styles['item-title']}>{func.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
