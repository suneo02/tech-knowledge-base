import { getHomePageMAinMenus } from '@/components/Home/AllMenus/HomePage'
import { IFuncMenuItem } from '@/components/Home/AllMenus/type'
import { MyIcon } from '@/components/Icon'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import React from 'react'
import styles from './index.module.less'

const functions = getHomePageMAinMenus()

/**
 * MainFunc component displays the main functions in a 2x2 grid layout
 * Shows exactly 4 main function items
 */
export const HomeMainFunc: React.FC = () => {
  const handleItemClick = (item: IFuncMenuItem) => {
    if (item.url) {
      if (item.navigate) {
        item.navigate(item)
      } else {
        handleJumpTerminalCompatibleAndCheckPermission(item.url)
      }
    }
    if (item.buryFunc) {
      item.buryFunc()
    }
  }

  return (
    <div className={styles.mainFunc}>
      <div className={styles.functionGrid}>
        {functions.map((func) => (
          <div
            key={func.id}
            className={`${styles.functionItem} ${func.css ? func.css : ''}`}
            onClick={() => handleItemClick(func)}
          >
            <div className={styles.title}>
              <div className={styles.titleIcon}>
                <MyIcon name={func.icon} />
              </div>
              <span>{func.zh}</span>
            </div>
            <div className={styles.desc}>{func.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
