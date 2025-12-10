import React, { useMemo } from 'react'
import cn from 'classnames'
import styles from './index.module.less'

interface OptionItem {
  name?: string
  label?: string
  value: string | string[] | undefined
  itemOption?: OptionItem[]
}

interface HierarchicalDisplayProps {
  options: OptionItem[]
  value?: string | string[]
}

const PREFIX = 'hierarchical-display'

export const HierarchicalDisplay: React.FC<HierarchicalDisplayProps> = ({ options, value }) => {
  // 将value转换为数组格式便于处理
  const selectedValues = useMemo(() => {
    if (!value) return []
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    }
    return Array.isArray(value) ? value : []
  }, [value])

  // 检查选项是否被选中
  const isOptionSelected = (option: OptionItem): boolean => {
    if (!option.value) return false

    const optionValue = Array.isArray(option.value) ? option.value.join(',') : String(option.value)

    // 如果option没有子选项，直接匹配完整值
    if (!option.itemOption || option.itemOption.length === 0) {
      return selectedValues.includes(optionValue)
    }

    // 如果option有子选项，检查其value中的各个子值是否都在selectedValues中
    const subValues = optionValue
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
    // 只要有任意一个子值被选中，就认为这个父级选项被选中
    return subValues.some((subValue) => selectedValues.includes(subValue))
  }

  // 获取选中的子选项
  const getSelectedSubOptions = (option: OptionItem): OptionItem[] => {
    if (!option.itemOption) return []

    return option.itemOption.filter((subOption) => {
      const subValue = Array.isArray(subOption.value) ? subOption.value.join(',') : String(subOption.value)

      // 处理子选项的value可能包含逗号分隔的多个值的情况（如"其他商业银行"）
      if (subValue.includes(',')) {
        const subValues = subValue
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
        return subValues.every((val) => selectedValues.includes(val))
      } else {
        // 单个值直接匹配
        return selectedValues.includes(subValue)
      }
    })
  }

  // 获取所有选中的组（只包含有子选项的组）
  const selectedGroups = useMemo(() => {
    return options
      .filter((option) => isOptionSelected(option))
      .map((option) => ({
        ...option,
        selectedSubOptions: getSelectedSubOptions(option),
      }))
      .filter((group) => group.selectedSubOptions.length > 0) // 只显示有子选项的组
  }, [options, selectedValues])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {/* 父级选项 - 采用和 CheckboxRadioDisplay 相同的样式 */}
      <div className={styles[`${PREFIX}-parent-container`]}>
        {options.map((option, index) => {
          const isSelected = isOptionSelected(option)
          return (
            <div
              key={`${option.name || option.label || index}-${index}`}
              className={cn(styles[`${PREFIX}-parent-item`], {
                [styles[`${PREFIX}-parent-item-active`]]: isSelected,
              })}
            >
              {option.name}
            </div>
          )
        })}
      </div>

      {/* 选中组的子选项展示 - 统一大卡片 */}
      {selectedGroups.length > 0 && (
        <div className={styles[`${PREFIX}-selected-card`]}>
          {selectedGroups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`}>
              {groupIndex > 0 && <div className={styles[`${PREFIX}-divider`]} />}

              <div className={styles[`${PREFIX}-group`]}>
                <div className={styles[`${PREFIX}-group-title`]}>
                  {group.name} 包含 {group.selectedSubOptions.length} 个子项：
                </div>
                <div className={styles[`${PREFIX}-group-children`]}>
                  {group.selectedSubOptions.map((subOption, subIndex) => (
                    <span key={`${subOption.value}-${subIndex}`} className={styles[`${PREFIX}-child-tag`]}>
                      {subOption.name || subOption.label || '未知子选项'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
