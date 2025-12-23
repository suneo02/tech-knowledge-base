import { Spin, message } from '@wind/wind-ui'
import classNames from 'classnames'
import {
  CustomerPointCountByColumnIndicatorRequest,
  IndicatorTreeClassification,
  IndicatorTreeIndicator,
} from 'gel-api'
import { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import { findIndicatorName } from './handle'
import { useIndicatorTreeOverall } from './hooks'
import { IndicatorTreePanelInnerRef } from './hooks/useIndicatorTreePanelScroll'
import { IndicatorLeftMenu } from './LeftMenu'
import { IndicatorTreeOverall } from './overall'
import { IndicatorSelectedIndicators, IndicatorSelectedIndicatorsRef } from './SelectedIndicators'
import styles from './style/treePanelScroll.module.less'
import { ActionButtons } from './components/ActionButtons'
import { convertIndicatorKeysToClassificationList } from './util'
import { CreditsDisplay } from './components/CreditsDisplay'
import { t } from 'gel-util/intl'

const STRINGS = {
  OK: t('464142', '提取'),
  ESTIMATE: t('464142', '确认提取'),
}

export const IndicatorTreePanelScroll = forwardRef<
  IndicatorTreePanelInnerRef,
  {
    className?: string
    close?: () => void
    indicatorTree: IndicatorTreeClassification[]
    loading: boolean
    onConfirm?: (checkedIndicators: Set<number>) => void
    confirmLoading?: boolean
    onPrecheck?: (props: CustomerPointCountByColumnIndicatorRequest['classificationList']) => Promise<number>
    rowLength?: number
  }
>(({ onConfirm, close, indicatorTree, loading, className, onPrecheck, rowLength = 0, confirmLoading }, ref) => {
  const [checkedIndicators, setCheckedIndicators] = useState<Set<number>>(new Set())
  const [checkedIndicatorsMap, setCheckedIndicatorsMap] = useState<Map<number, IndicatorTreeIndicator>>(new Map())
  const [initialCheckedIndicators, setInitialCheckedIndicators] = useState<Set<number>>(new Set())
  const [currentVisibleClassification, setCurrentVisibleClassification] = useState<string | null>(null)
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [unitCredits, setUnitCredits] = useState<number>(0)
  const [precheckLoading, setPrecheckLoading] = useState(false)

  const indicatorTreeRef = useIndicatorTreeOverall()
  const selectedIndicatorsRef = useRef<IndicatorSelectedIndicatorsRef>(null)

  const areSetsEqual = (a: Set<number>, b: Set<number>) => {
    if (a.size !== b.size) return false
    for (const v of a) {
      if (!b.has(v)) return false
    }
    return true
  }

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        indicatorTreeRef.resetCheckedIndicators()
        setTotalPoints(null)
      },
      setSelectedIndicators: (indicators) => {
        setInitialCheckedIndicators(indicators)
      },
    }),
    [indicatorTreeRef]
  )

  const handleIndicatorCheckChange = (checkedIds: Set<number>) => {
    // 仅在“集合真实变化”时才重置展示，避免重复回调导致服务器返回值被清空
    if (areSetsEqual(checkedIndicators, checkedIds)) {
      return
    }
    setTotalPoints(null)
    setCheckedIndicators(checkedIds)
    const indicatorsMap = indicatorTreeRef.getCheckedIndicatorsMap()
    setCheckedIndicatorsMap(indicatorsMap)
    // 计算实时单价积分（所有当前选中的指标 points 之和）
    let sum = 0
    indicatorsMap.forEach((indicator) => {
      sum += indicator.points || 0
    })
    setUnitCredits(sum)
  }

  const handleConfirm = async () => {
    if (!selectedIndicatorsRef.current?.checkCountLimit()) {
      return
    }

    if (totalPoints) {
      onConfirm?.(indicatorTreeRef.getCheckedIndicators())
      return
    }

    try {
      if (onPrecheck) {
        setPrecheckLoading(true)
        const points = await onPrecheck(
          convertIndicatorKeysToClassificationList(indicatorTree, checkedIndicators)
        ).finally(() => {
          setPrecheckLoading(false)
        })
        const estimate = unitCredits * rowLength
        if (points === estimate) {
          onConfirm?.(indicatorTreeRef.getCheckedIndicators())
        } else {
          message.warning('预估消耗与实际消耗不一致，已更新消耗积分。')
          setTotalPoints(points)
        }
      } else {
        onConfirm?.(indicatorTreeRef.getCheckedIndicators())
      }
    } catch (error) {
      message.error('预检失败，请稍后重试。')
      console.error('预检失败', error)
    }
  }

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
      {loading && (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
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
          onIndicatorCheckChange={handleIndicatorCheckChange}
          onVisibleClassificationChange={setCurrentVisibleClassification}
          initialCheckedIndicators={initialCheckedIndicators}
        />
      </div>
      <div className={styles.right}>
        <IndicatorSelectedIndicators
          ref={selectedIndicatorsRef}
          className={styles.rightSelectedIndicators}
          checkedIndicators={checkedIndicatorsMap}
          getIndicatorName={(key) => findIndicatorName(indicatorTree, key) || ''}
          handleIndicatorCheck={indicatorTreeRef.handleIndicatorCheck}
          initialCheckedIndicators={initialCheckedIndicators}
        />
        <div className={styles.rightFooter}>
          <CreditsDisplay unitCredits={unitCredits} rowLength={rowLength} displayCredits={totalPoints} />
          <ActionButtons
            loading={precheckLoading || loading || confirmLoading}
            onClose={close!}
            onConfirm={handleConfirm}
            disabled={checkedIndicators.size === 0}
            okText={totalPoints ? STRINGS.ESTIMATE : STRINGS.OK}
          />
        </div>
      </div>
    </div>
  )
})

IndicatorTreePanelScroll.displayName = 'IndicatorTreePanelScroll'
