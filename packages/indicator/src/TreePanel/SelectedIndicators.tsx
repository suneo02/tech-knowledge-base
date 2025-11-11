import { Button, Radio, message } from '@wind/wind-ui'
import { IndicatorTreeIndicator } from 'gel-api'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CloseCircleF } from '@wind/icons'
import classNames from 'classnames'
import styles from './style/selectedIndicators.module.less'
import { t } from 'gel-util/intl'

const STRINGS = {
  SELECTED: t('465499', '已选'),
  SELECTED_NEW: t('465500', '本次新增'),
  COUNT_EXCEED_LIMIT: t('', '单次新增最多30个指标，请重新选择'),
}

export interface IndicatorSelectedIndicatorsRef {
  scrollToBottom: () => void
  // 检查指标数量是否超过限制的方法
  checkCountLimit: () => boolean
}

export const IndicatorSelectedIndicators = forwardRef<
  IndicatorSelectedIndicatorsRef,
  {
    className?: string
    // 新的 Map 数据结构，包含完整的指标信息
    checkedIndicators: Map<number, IndicatorTreeIndicator>
    // 兼容性：仍保留 getIndicatorName 方法，但可能不再使用
    getIndicatorName?: (key: number) => string
    handleIndicatorCheck: (key: number, checked: boolean) => void
    initialCheckedIndicators: Set<number>
  }
>((props, ref) => {
  const { className, checkedIndicators, getIndicatorName, handleIndicatorCheck, initialCheckedIndicators } = props

  // 内容区域的ref
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedType, setSelectedType] = useState<'selected' | 'new'>('selected')

  // 滚动到底部的方法
  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }

  // 检查指标数量是否超过限制
  const checkCountLimit = () => {
    const newCount = checkedIndicators.size
    if (newCount > 30) {
      message.error(STRINGS.COUNT_EXCEED_LIMIT)
      return false
    }
    return true
  }

  // 在指标数量变化时自动滚动到底部
  useEffect(() => {
    if (checkedIndicators.size > 0) {
      scrollToBottom()
    }
  }, [checkedIndicators.size])

  // 暴露方法给外部
  useImperativeHandle(ref, () => ({
    scrollToBottom,
    checkCountLimit,
  }))

  // 获取指标名称，优先从 map 中获取，其次使用 getIndicatorName 作为备用
  const getIndicatorDisplayName = (key: number, indicator?: IndicatorTreeIndicator) => {
    if (indicator) {
      return indicator.indicatorDisplayName
    }
    return getIndicatorName?.(key) || `指标 ${key}`
  }

  return (
    <div className={classNames(styles.selectedIndicators, className)}>
      <div className={styles.selectedIndicatorsTitle}>
        <Radio.Group
          name="indicatorType"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedType(e.target.value as 'selected' | 'new')}
          defaultValue="selected"
        >
          <Radio.Button value="selected">
            {STRINGS.SELECTED}({initialCheckedIndicators.size + checkedIndicators.size})
          </Radio.Button>
          <Radio.Button value="new">
            {STRINGS.SELECTED_NEW}({checkedIndicators.size})
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className={styles.selectedIndicatorsContent} ref={contentRef}>
        {selectedType === 'selected' && (
          <>
            {Array.from(initialCheckedIndicators).map((indicatorId) => (
              <div
                className={classNames(styles.selectedIndicatorsItem, styles.selectedIndicatorsItemInitial)}
                key={indicatorId}
              >
                <div className={styles.selectedIndicatorsItemText}>{getIndicatorDisplayName(indicatorId)}</div>
              </div>
            ))}
            {Array.from(checkedIndicators.entries()).map(([indicatorId, indicator]) => (
              <div className={styles.selectedIndicatorsItem} key={indicatorId}>
                <div className={styles.selectedIndicatorsItemText}>
                  {getIndicatorDisplayName(indicatorId, indicator)}
                </div>
                <div className={styles.selectedIndicatorsItemAction}>
                  <Button
                    type="text"
                    size="small"
                    // @ts-expect-error Wind UI 图标类型问题
                    icon={<CloseCircleF style={{ color: 'rgba(5, 150, 179, .3)' }} />}
                    onClick={() => handleIndicatorCheck(indicatorId, false)}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {selectedType === 'new' && (
          <>
            {Array.from(checkedIndicators.entries()).map(([indicatorId, indicator]) => (
              <div className={styles.selectedIndicatorsItem} key={indicatorId}>
                <div className={styles.selectedIndicatorsItemText}>
                  {getIndicatorDisplayName(indicatorId, indicator)}
                </div>
                <div className={styles.selectedIndicatorsItemAction}>
                  <Button
                    type="text"
                    size="small"
                    // @ts-expect-error Wind UI 图标类型问题
                    icon={<CloseCircleF style={{ color: 'rgba(5, 150, 179, .3)' }} />}
                    onClick={() => handleIndicatorCheck(indicatorId, false)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
})

IndicatorSelectedIndicators.displayName = 'IndicatorSelectedIndicators'
