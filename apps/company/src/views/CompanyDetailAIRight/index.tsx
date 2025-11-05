import { useHashParams } from '@/hook/useHashParams'
import React, { useState } from 'react'
import styles from './index.module.less'
import { LayoutHeader, Left } from './Left'
import { Right } from './Right'
import { useSelector } from 'react-redux'
import { isFromF9 } from 'gel-util/env'

export const PREFIX = 'layout-detail-ai'

export const LayoutDemo: React.FC = () => {
  // 从 Redux 获取公司基本信息和收藏状态
  const companyState = useSelector((state: any) => state.company)
  const { corp_name } = companyState?.baseInfo || {}

  //  F9，且屏幕宽度小于 1600px 时，右侧栏默认隐藏
  const isF9 = isFromF9()
  const isSmallScreen = window.innerWidth < 1600
  const [showRight, setShowRight] = useState<boolean>(!(isF9 && isSmallScreen))
  const [rightWidth, setRightWidth] = useState<'50%' | '25%'>('25%')

  useHashParams('isSeparate', '1')

  return (
    <div className={`${styles[`${PREFIX}-container`]}`}>
      <LayoutHeader onShowRight={setShowRight} showRight={showRight} />
      <div className={styles[`${PREFIX}-content`]}>
        <Left />
        <Right
          entityName={corp_name}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onShowRight={setShowRight}
          showRight={showRight}
        />
      </div>
    </div>
  )
}
export default LayoutDemo
