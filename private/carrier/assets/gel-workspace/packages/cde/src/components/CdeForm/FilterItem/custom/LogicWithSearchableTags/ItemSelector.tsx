import React from 'react'
import { Select } from '@wind/wind-ui'
import BaseSelect from '../../basic/Select'
import { ItemOptionItem } from '../../../types'
import styles from './index.module.less'

const STRINGS = {
  PLACEHOLDER: '请选择',
  SELECT_PLACEHOLDER: '请输入关键词，上限5条',
}

const PREFIX = 'logic-with-searchable-tags'

interface ItemSelectorProps {
  logic: 'any' | 'notAny' | 'all'
  onLogicChange: (logic: 'any' | 'notAny' | 'all') => void
  onSelect: (value: string) => void
  availableOptions: ItemOptionItem[]
  disabled: boolean
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ logic, onLogicChange, onSelect, availableOptions, disabled }) => {
  return (
    <div className={styles[`${PREFIX}-select-container`]}>
      <BaseSelect
        style={{ width: 120 }}
        placeholder={STRINGS.PLACEHOLDER}
        options={[
          { label: '不含', value: 'notAny' },
          { label: '含任一', value: 'any' },
          { label: '含所有', value: 'all' },
        ]}
        value={{ value: Array.isArray(logic) ? logic : [logic] }}
        onChange={(val) => onLogicChange(val?.value as 'any' | 'notAny' | 'all')}
      />
      <Select
        value={''} // Always empty, acts as a trigger
        size="large"
        className={styles[`${PREFIX}-select`]}
        placeholder={STRINGS.SELECT_PLACEHOLDER}
        showSearch
        filterOption={false}
        maxTagCount="responsive"
        dropdownClassName={styles[`${PREFIX}-dropdown-container`]}
        // @ts-expect-error wind-ui
        onSelect={(value) => onSelect(value as string)}
        disabled={disabled}
      >
        {availableOptions?.map((item) => (
          <Select.Option value={item.id!} key={item.id!}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default ItemSelector
