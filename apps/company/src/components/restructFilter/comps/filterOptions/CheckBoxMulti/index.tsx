import { getCheckBoxItemValue } from 'cde'
import { CDEFilterItem } from 'gel-api'
import React from 'react'
import { CheckBoxLevel2 } from './CheckBoxLevel2'
import { CheckBoxComp } from './comp'
import { SelectionProvider, useSelectionContext } from './ctx'
import styles from './index.module.less'

const CheckBoxInner: React.FC = () => {
  const { calculateItemState, optionsFromConfig } = useSelectionContext()

  return (
    <div className={styles.checkboxMulti}>
      {/* 渲染一级选项 */}
      {optionsFromConfig.map((item) => {
        return <CheckBoxComp item={item} />
      })}

      {/* 渲染二级及以下选项 */}
      {optionsFromConfig.map((item) => {
        const { checked, indeterminate } = calculateItemState(getCheckBoxItemValue(item))
        // 当处于全选或半选状态时，才渲染其子选项
        if (!(indeterminate || checked) || !item.itemOption?.length) {
          return null
        }
        return <CheckBoxLevel2 key={String(item.value)} item={item} />
      })}
    </div>
  )
}

/**
 * 多级复选框组件
 * 支持多级联动选择，主要用于筛选条件的展示和选择
 * 特点：
 * 1. 支持全选/取消全选
 * 2. 支持多级联动
 * 3. 支持银行特殊处理逻辑
 */
export const CheckBoxMulti: React.FC<{
  optionsFromConfig: CDEFilterItem['itemOption'] // 配置项数据
  onChange: (value: string[]) => void // 值变化回调
  value: string[] // 当前选中的值
}> = ({ optionsFromConfig, onChange, value }) => {
  return (
    <SelectionProvider
      optionsFromConfig={optionsFromConfig}
      value={value}
      onChange={onChange}
      data-uc-id="yjblLco_5d"
      data-uc-ct="selectionprovider"
    >
      <CheckBoxInner />
    </SelectionProvider>
  )
}
