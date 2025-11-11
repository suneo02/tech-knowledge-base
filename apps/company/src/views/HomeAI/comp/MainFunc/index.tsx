import { MyIcon } from '@/components/Icon'
import React, { useMemo, useState } from 'react'
import styles from './index.module.less'
import { getHomeEntryList } from '../RecommendFunc/config'
import { wftCommon } from '@/utils/utils'
import { handleSearchHomeNavigation } from '@/components/hotItems/handle/searchHomeNavigation'
import { SearchHomeItemData } from '../RecommendFunc/config/type'
import Icon from '@ant-design/icons'
import { CountDataType } from '../..'

// 创建 SVG 图标组件 需要动态改path颜色 MyIcon不支持
const PrepageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.3125,3.4109375 L11.3125,2.203125 C11.3125,2.0984375 11.1921875,2.040625 11.1109375,2.1046875 L4.0671875,7.60625 C3.8109375,7.80625 3.8109375,8.1921875 4.0671875,8.3921875 L11.1109375,13.89375 C11.19375,13.9578125 11.3125,13.9 11.3125,13.7953125 L11.3125,12.5875 C11.3125,12.5109375 11.2765625,12.4375 11.2171875,12.390625 L5.5921875,8 L11.2171875,3.6078125 C11.2765625,3.5609375 11.3125,3.4875 11.3125,3.4109375 Z"
      fill="currentColor"
    />
  </svg>
)

const NextpageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.9640625,7.60625 L4.9203125,2.1046875 C4.8375,2.040625 4.71875,2.0984375 4.71875,2.203125 L4.71875,3.4109375 C4.71875,3.4875 4.7546875,3.5609375 4.8140625,3.6078125 L10.4390625,8 L4.8140625,12.3921875 C4.753125,12.4390625 4.71875,12.5125 4.71875,12.5890625 L4.71875,13.796875 C4.71875,13.9015625 4.8390625,13.959375 4.9203125,13.8953125 L11.9640625,8.39375 C12.2203125,8.19375 12.2203125,7.80625 11.9640625,7.60625 Z"
      fill="currentColor"
    />
  </svg>
)

/**
 * MainFunc component displays the main functions in a 2x2 grid layout
 * Shows exactly 4 main function items with left/right navigation
 */
export const HomeMainFunc: React.FC<{ countData?: CountDataType }> = ({ countData }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const homeEntryList = useMemo(() => {
    return getHomeEntryList(countData)
  }, [wftCommon.is_overseas_config, countData])

  // 计算总页数，每页4个卡片
  const totalPages = Math.ceil(homeEntryList.length / 4)

  // 获取当前页的4个卡片
  const currentPageItems = useMemo(() => {
    const startIndex = currentPage * 4
    return homeEntryList.slice(startIndex, startIndex + 4)
  }, [homeEntryList, currentPage])

  const handleItemClick = (item: SearchHomeItemData) => {
    handleSearchHomeNavigation(item.key, item.url)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => {
      if (prev === 0) {
        return totalPages - 1 // 如果是第一页，滚到最后一页
      }
      return prev - 1
    })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => {
      if (prev === totalPages - 1) {
        return 0 // 如果是最后一页，滚回第一页
      }
      return prev + 1
    })
  }

  // 如果数据不足4个，不显示分页，但保持网格布局
  if (homeEntryList.length <= 4) {
    return (
      <div className={styles['main-func']}>
        <div className={styles['function-grid']}>
          {homeEntryList.map((func) => (
            <div
              key={func.key}
              className={`${styles['function-item']} `}
              onClick={() => handleItemClick(func)}
              data-uc-id="0JwXe_QZGG"
              data-uc-ct="div"
              data-uc-x={func.key}
            >
              <div className={styles.icon}>
                <MyIcon name={func.fIcon} />
              </div>
              <div className={styles.title} title={func.title}>
                <span>{func.title}</span>
              </div>
              <div className={styles.desc} title={func.desc}>
                {func.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={styles['main-func']}>
      <div className={styles['function-container']}>
        {/* 左切换按钮 */}
        <button
          className={`${styles['nav-button']} ${styles['prev-button']}`}
          onClick={handlePrevPage}
          data-uc-id="hOULcGvzbP"
          data-uc-ct="button"
        >
          <Icon component={PrepageIcon} data-uc-id="awV2haq_TC" data-uc-ct="icon" />
        </button>

        {/* 功能卡片网格 */}
        <div className={styles['function-grid']}>
          {currentPageItems.map((func) => (
            <div
              key={func.key}
              className={`${styles['function-item']} `}
              onClick={() => handleItemClick(func)}
              data-uc-id="7_TMhCxqIW"
              data-uc-ct="div"
              data-uc-x={func.key}
            >
              <div className={styles.icon}>
                <MyIcon name={func.fIcon} />
              </div>
              <div className={styles.title}>
                <span>{func.title}</span>
              </div>
              <div className={styles.desc}>{func.desc}</div>
            </div>
          ))}
        </div>

        {/* 右切换按钮 */}
        <button
          className={`${styles['nav-button']} ${styles['next-button']}`}
          onClick={handleNextPage}
          data-uc-id="OBzToRPx5G"
          data-uc-ct="button"
        >
          <Icon component={NextpageIcon} data-uc-id="-IoFTS_3gT" data-uc-ct="icon" />
        </button>
      </div>
      {/* 分页指示器 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              key={index}
              className={`${styles['pagination-dot']} ${index === currentPage ? styles.active : ''}`}
              onClick={() => setCurrentPage(index)}
              data-uc-id="dLVEdZ4vw6"
              data-uc-ct="div"
              data-uc-x={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
