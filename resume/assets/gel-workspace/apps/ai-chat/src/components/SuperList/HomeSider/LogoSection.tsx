import classNames from 'classnames'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoIcon } from '@/assets/icon'
import styles from './style/logo-section.module.less'

// 使用type代替空接口
type LogoSectionProps = Record<string, never>

export const SuperLogoSection: React.FC<LogoSectionProps> = () => {
  const navigate = useNavigate()
  // 添加状态来控制动画的重新播放
  const [animationKey, setAnimationKey] = useState(0)

  const handleLogoClick = () => {
    // 导航
    navigate('/super')
    // 重置动画键值，触发动画重新播放
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div className={classNames(styles['logo-container'])}>
      <div className={styles['logo-clickable']} onClick={handleLogoClick}>
        <LogoIcon className={styles['logo-icon']} key={animationKey} />
        <span className={styles['logo-text']}>超级名单</span>
      </div>
    </div>
  )
}
