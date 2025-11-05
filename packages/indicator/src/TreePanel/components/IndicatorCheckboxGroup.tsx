import { Checkbox } from '@wind/wind-ui'
import type { IndicatorTreeClassification, IndicatorTreeIndicator } from 'gel-api'
import React, { useMemo, useState } from 'react'
import { UseIndicatorCheckResult } from '../hooks/useIndicatorCheck'
import styles from '../style/checkBoxGroup.module.less'
import { CoinsO } from '@/assets'
import classNames from 'classnames'

const { Group: CheckboxGroup } = Checkbox

/**
 * 将指标数组转换为 Checkbox.Group 所需的选项格式
 */
const getIndicatorOptions = (indicators: IndicatorTreeIndicator[] = []) => {
  return indicators.map((indicator) => ({
    label: indicator.indicatorDisplayName,
    value: indicator.spId,
    points: indicator.points,
  }))
}

interface IndicatorCheckboxGroupProps
  extends Pick<UseIndicatorCheckResult, 'checkedIndicators' | 'handleIndicatorCheck'> {
  classification: IndicatorTreeClassification
  showCoins?: boolean
  initialCheckedIndicators?: Set<number>
}

export const IndicatorCheckboxGroup: React.FC<IndicatorCheckboxGroupProps> = ({
  classification,
  checkedIndicators,
  handleIndicatorCheck,
  showCoins,
  initialCheckedIndicators,
}) => {
  // 缓存指标选项
  const indicatorOptions = useMemo(() => getIndicatorOptions(classification.indicators), [classification.indicators])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // 如果没有指标，不渲染任何内容
  if (!classification.indicators || classification.indicators.length === 0) {
    return null
  }

  // 获取当前分类下已选中的指标
  const checkedValues = useMemo(() => {
    const combinedFromProps = new Set<number>(checkedIndicators)
    if (initialCheckedIndicators) {
      initialCheckedIndicators.forEach((key) => combinedFromProps.add(key))
    }
    return Array.from(combinedFromProps).filter((key) =>
      classification.indicators?.some((indicator) => indicator.spId === key)
    )
  }, [checkedIndicators, initialCheckedIndicators, classification.indicators])

  // 处理点击div时的选中逻辑
  const handleItemClick = (value: number) => {
    const isCurrentlyChecked = checkedValues.includes(value)
    handleIndicatorCheck(value, !isCurrentlyChecked)
  }

  return (
    // @ts-expect-error WindUI
    <CheckboxGroup
      className={styles.indicatorCheckboxGroup}
      // options={indicatorOptions}
      value={checkedValues}
      onChange={(newCheckedValues) => {
        // 找出变化的那个选项
        const changedValue =
          newCheckedValues.length > checkedValues.length
            ? newCheckedValues.find((value) => !checkedValues.includes(value as number)) // 新增的选项
            : checkedValues.find((value) => !newCheckedValues.includes(value)) // 移除的选项

        if (changedValue) {
          handleIndicatorCheck(changedValue as number, newCheckedValues.length > checkedValues.length)
        }
      }}
    >
      {indicatorOptions.map((option) => (
        <div
          key={option.value}
          className={checkedValues.includes(option.value) ? styles.checked : ''}
          onClick={(e: React.MouseEvent) => {
            // 阻止事件冒泡，避免触发两次
            e.stopPropagation()
            e.preventDefault()
            if (initialCheckedIndicators?.has(option.value)) {
              return
            }
            handleItemClick(option.value)
          }}
          onMouseEnter={() => setHoveredItem(option.value)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Checkbox key={option.value} value={option.value} disabled={initialCheckedIndicators?.has(option.value)}>
            <span className={styles.checkboxLabel}>{option.label}</span>
          </Checkbox>
          <div
            className={classNames(styles.coins, {
              [styles.visible]:
                showCoins || (!showCoins && hoveredItem === option.value) || checkedValues.includes(option.value),
              [styles.hasCoins]: option?.points > 0,
            })}
          >
            <CoinsO style={{ marginInlineEnd: 2 }} />
            <span className="coinsLabel">{option.points || 0}</span>
          </div>
        </div>
      ))}
    </CheckboxGroup>
  )
}
