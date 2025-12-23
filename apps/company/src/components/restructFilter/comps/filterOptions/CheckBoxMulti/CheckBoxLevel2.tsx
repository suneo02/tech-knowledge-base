import { Checkbox } from '@wind/wind-ui'
import { getCDEItemOptionLabel, getCheckBoxItemValue, getOptionsByItem, hasGrandChildren } from 'cde'
import { CDEFilterOption } from 'gel-api'
import React, { FC } from 'react'
import ConditionTitle from '../ConditionTitle'
import { CheckBoxNode } from './CheckBoxNode'
import { useSelectionContext } from './ctx'

export const CheckBoxLevel2: FC<{
  item: CDEFilterOption
}> = ({ item }) => {
  const { handleGroupChange, getGroupValue } = useSelectionContext()
  if (!item.itemOption?.length) {
    return null
  }

  const hasGrandChildrenCheck = hasGrandChildren(item)

  return (
    <>
      <ConditionTitle itemName={getCDEItemOptionLabel(item)} />
      {hasGrandChildrenCheck ? (
        <div>
          {item.itemOption.map((subItem) => (
            <CheckBoxNode key={String(subItem.value)} item={subItem} level={3} />
          ))}
        </div>
      ) : (
        <Checkbox.Group
          style={{ display: 'block' }}
          options={getOptionsByItem(item)}
          value={getGroupValue(getCheckBoxItemValue(item))}
          onChange={(newlySelected) => {
            handleGroupChange(newlySelected.map(String), getCheckBoxItemValue(item))
          }}
          data-uc-id="zHpDyKRst"
          data-uc-ct="checkbox"
        />
      )}
    </>
  )
}
