import { FormProps } from 'antd'
import React from 'react'
import { useFilterItemRenderer } from '../hooks/useFilterItemRenderer'
import { CDEFormConfigItem, CDEFormValues } from '../types'

export const FilterFormItem: React.FC<FormProps<CDEFormValues> & { config: CDEFormConfigItem[] }> = (props) => {
  const { config } = props

  const { renderFilterItemWithExtra } = useFilterItemRenderer()

  return <div>{config.map((item) => renderFilterItemWithExtra(item))}</div>
}

FilterFormItem.displayName = 'FilterFormItem'
