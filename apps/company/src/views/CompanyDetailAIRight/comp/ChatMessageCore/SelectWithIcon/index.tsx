// components/SelectWithIcon/index.tsx

import React from 'react'

import { Select, Tooltip } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select'
import styles from './index.module.less'

export interface SelectOption {
  value: string | number
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
  desc?: string
}

interface SelectWithIconProps extends Omit<SelectProps, 'options'> {
  options: SelectOption[]
}

/**
 * 带图标的上拉选择组件（图标仅在选中后显示于输入框内，列表中不展示图标）
 * @author 刘兴华<xhliu.liuxh@wind.com.cn>
 * @param props SelectWithIconProps
 * @returns JSX.Element
 */
export const SelectWithIcon: React.FC<SelectWithIconProps> = ({
  options,

  ...selectProps
}) => {
  return (
    <Select
      {...selectProps}
      className={styles.selectWithIcon}
      // 使用 Option 的 label 作为选中后在输入框中的展示
      optionLabelProp="label"
    >
      {options.map((option) => (
        <Select.Option
          key={option.value}
          value={option.value}
          // 自定义选中后的展示：左侧图标 + 文本
          label={
            <Tooltip title={option.tooltip} placement="right" mouseEnterDelay={0.5}>
              <div className={styles.optionContent}>
                {option.icon}

                <span className={styles.label}>{option.label}</span>
              </div>
            </Tooltip>
          }
        >
          <div className={styles.optionContent}>
            <span className={styles.label}>{option.label}</span>
          </div>
          <div className={styles.optionContent}>
            <span className={styles.desc}>{option.desc}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  )
}
