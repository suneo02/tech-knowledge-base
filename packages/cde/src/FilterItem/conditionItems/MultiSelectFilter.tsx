import { isMultiCDEFilterItemUser } from '@/types/filter.ts'
import { CheckBoxOption } from '../filterOptions/CheckBox/CheckBoxOption.tsx'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import styles from './style/conditionItem.module.less'
import { CDEFilterCompType } from './type.ts'
import { Checkbox } from '@wind/wind-ui'
import { useMemo, useState, useEffect } from 'react'

export const MultiSelectFilter: CDEFilterCompType = ({ item, updateFilter, filter }) => {
  const { itemName, itemId, itemOption, hoverHint, logicOption, selfDefine, multiCbx } = item

  // 验证过滤器类型，确保是多值过滤器
  if (filter && !isMultiCDEFilterItemUser(filter)) {
    console.error('filter not multi', itemId, filter)
    return null
  }

  // 获取所有选项的值列表
  const allOptionValues = useMemo<string[]>(() => {
    return (itemOption ?? []).map((option) => String(option.value))
  }, [itemOption])

  // 全选状态
  const [checkAllState, setCheckAllState] = useState({
    checked: false,
    indeterminate: false,
  })

  // 当前选中值变化时，更新全选状态
  useEffect(() => {
    const selectedValues = filter?.value ?? []
    const isAllSelected = selectedValues.length === allOptionValues.length && allOptionValues.length > 0
    const isPartiallySelected = selectedValues.length > 0 && selectedValues.length < allOptionValues.length

    setCheckAllState({
      checked: isAllSelected,
      indeterminate: isPartiallySelected,
    })
  }, [filter?.value, allOptionValues])

  // 处理选项变更
  const handleChange = (value: string[]) => {
    updateFilter({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  // 处理全选变更
  const handleCheckAllChange = (e: any) => {
    const checked = e.target.checked
    handleChange(checked ? allOptionValues : [])
  }

  // 判断是否显示全选按钮
  const showCheckAll = !selfDefine && !multiCbx

  return (
    <div className={styles.conditionItem}>
      <div className={styles['title-container']}>
        <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />

        {/* 全选复选框 - 条件判断显示 */}
        {showCheckAll && (
          <Checkbox
            className={styles.checkAllBox}
            indeterminate={checkAllState.indeterminate}
            checked={checkAllState.checked}
            onChange={handleCheckAllChange}
          >
            全选
          </Checkbox>
        )}
      </div>
      <CheckBoxOption
        itemOption={itemOption ?? []}
        info={item}
        value={filter?.value ?? []}
        onChange={handleChange}
        multiCbx={multiCbx}
      />
    </div>
  )
}
