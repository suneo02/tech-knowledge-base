import classNames from 'classnames'
import { AliceLogo, SuperListGradientText } from 'gel-ui'
import { t } from 'gel-util/intl'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import styles from './index.module.less'

/**
 * @interface LogoSectionProps
 * @property {boolean} [disabled] - 是否禁用点击事件
 * @property {'small' | 'large'} [size] - 组件的大小，控制内边距和字体大小
 * @property {boolean} [iconAnimation] - 是否启用图标的旋转动画
 */
export interface LogoSectionProps {
  disabled?: boolean
  size?: 'small' | 'large'
  iconAnimation?: boolean
}

const STRINGS = {
  TITLE: t('464234', '一句话找企业'),
}

/**
 * 超级名单的 Logo 组件
 *
 * @param {LogoSectionProps} props - 组件的属性
 * @returns {React.FC}
 */
export const SuperLogoSection: React.FC<LogoSectionProps> = ({ disabled, size = 'large', iconAnimation = true }) => {
  const navigate = useNavigateWithLangSource()
  // 动画 key，用于手动触发重新渲染以重置动画
  const [animationKey, setAnimationKey] = useState(0)
  // 控制组件是否处于“正在退出”的状态，以触发向左滑出的动画
  const [isExiting, setIsExiting] = useState(false)
  // 用于存储导航的后备计时器
  const navigationTimerRef = useRef<number | null>(null)

  // 在组件卸载时清除计时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current)
      }
    }
  }, [])

  /**
   * 执行导航并重置状态。
   * 使用 useCallback 保证函数引用稳定。
   * 通过检查 isExiting 状态来防止重复执行。
   */
  const handleNavigateAndReset = useCallback(() => {
    setIsExiting((currentIsExiting) => {
      // 如果不是退出状态，说明已经执行过跳转，直接返回
      if (!currentIsExiting) {
        return false
      }

      // 清除后备计时器
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current)
        navigationTimerRef.current = null
      }

      navigate('/super')
      setAnimationKey((prev) => prev + 1)
      // 返回 false 来更新状态，结束退出过程
      return false
    })
  }, [navigate])

  /**
   * 处理 Logo 点击事件
   * 如果组件未被禁用，则触发退出动画, 并设置一个后备计时器以确保在动画事件未触发时也能导航。
   */
  const handleLogoClick = () => {
    if (disabled || isExiting) return
    setIsExiting(true)

    // 设置一个后备计时器，以防 onAnimationEnd 由于某种原因（例如页面卡顿）没有被触发
    navigationTimerRef.current = window.setTimeout(handleNavigateAndReset, 700) // 动画时长为500ms, 设置一个稍长的时间作为容错
  }

  /**
   * 处理动画结束事件
   * 当退出动画正常结束时，执行导航和状态重置
   */
  const handleAnimationEnd = () => {
    if (isExiting) {
      handleNavigateAndReset()
    }
  }

  return (
    <div
      className={classNames(styles['logo-container'], styles[size], {
        [styles['slide-out']]: isExiting,
      })}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles['logo-clickable']} onClick={handleLogoClick}>
        <AliceLogo style={{ width: 28, height: 28 }} />
        <div className={styles['logo-title']}>
          <SuperListGradientText className={styles['logo-gradient']}>
            <span className={styles['logo-text']}>{STRINGS.TITLE}</span>
          </SuperListGradientText>
        </div>
        <div className={styles['logo-version']}>Beta</div>
      </div>
    </div>
  )
}
