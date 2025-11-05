import { Button, Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { IndicatorTreeClassification } from 'gel-api'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { findIndicatorName } from './handle'
import { useIndicatorTreeOverall } from './hooks'
import { IndicatorTreePanelInnerRef } from './hooks/useIndicatorTreePanelScroll'
import { IndicatorLeftMenu } from './LeftMenu'
import { IndicatorTreeOverall } from './overall'
import { IndicatorSelectedIndicators } from './SelectedIndicators'
import styles from './style/treePanelScroll.module.less'

export const IndicatorTreePanelScroll = forwardRef<
  IndicatorTreePanelInnerRef,
  {
    className?: string
    close?: () => void
    indicatorTree: IndicatorTreeClassification[]
    loading: boolean
    onConfirm?: (checkedIndicators: Set<number>) => void
    confirmLoading?: boolean
  }
>(({ onConfirm, close, indicatorTree, loading, confirmLoading, className }, ref) => {
  const [checkedIndicators, setCheckedIndicators] = useState<Set<number>>(new Set())
  const [initialCheckedIndicators, setInitialCheckedIndicators] = useState<Set<number>>(new Set())
  const [currentVisibleClassification, setCurrentVisibleClassification] = useState<string | null>(null)

  const indicatorTreeRef = useIndicatorTreeOverall()

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        indicatorTreeRef.resetCheckedIndicators()
      },
      setSelectedIndicators: (indicators) => {
        setInitialCheckedIndicators(indicators)
        // indicatorTreeRef.setCheckedIndicators(indicators)
      },
    }),
    [indicatorTreeRef]
  )

  return (
    <div
      className={classNames(
        styles.panel,
        {
          [styles['panel--loading']]: loading,
        },
        className
      )}
    >
      {loading && <Spin />}
      <div className={styles.sider}>
        <IndicatorLeftMenu
          selectedFirstLevel={String(currentVisibleClassification)}
          setSelectedFirstLevel={indicatorTreeRef.scrollToClassification}
          data={indicatorTree}
        />
      </div>
      <div className={styles.content}>
        <IndicatorTreeOverall
          indicatorTree={indicatorTree}
          ref={indicatorTreeRef.getTreeRef()}
          onIndicatorCheckChange={setCheckedIndicators}
          onVisibleClassificationChange={setCurrentVisibleClassification}
          initialCheckedIndicators={initialCheckedIndicators}
        />
      </div>
      <div className={styles.right}>
        <IndicatorSelectedIndicators
          className={styles.rightSelectedIndicators}
          checkedIndicators={checkedIndicators}
          getIndicatorName={(key) => findIndicatorName(indicatorTree, key) || ''}
          handleIndicatorCheck={indicatorTreeRef.handleIndicatorCheck}
          initialCheckedIndicators={initialCheckedIndicators}
        />
        <div className={styles.rightFooter}>
          <div className={styles.rightFooterButtons}>
            <Button onClick={close}>取消</Button>
            <Button
              type="primary"
              loading={confirmLoading}
              disabled={checkedIndicators.size === 0}
              onClick={() => onConfirm?.(indicatorTreeRef.getCheckedIndicators())}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})
