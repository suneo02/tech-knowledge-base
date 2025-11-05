import React, { FC, useEffect, useState } from 'react'
import Products, { ProductsProps } from '../../../selectbleTag/index'
import { TOnSearchChange } from '@/components/common/search/type.ts'
import { isNil } from 'lodash'
import { ITableAggregationWithOption } from '@/handle/table/aggregation/type'

export const CustomSelectBidProductWords: FC<{
  searchOption: ITableAggregationWithOption
  onSearchChange?: TOnSearchChange
}> = ({ searchOption, onSearchChange }) => {
  const [checkedItem, setCheckedItem] = useState<React.Key | undefined>()
  const handleChange: ProductsProps['onChange'] = (item, checked) => {
    if (isNil(item)) {
      return
    }
    if (checked) {
      if (checkedItem !== item.key) {
        setCheckedItem(item.key)
      } else {
        return
      }
    } else {
      if (checkedItem === item.key) {
        setCheckedItem(undefined)
      } else {
        return
      }
    }
  }
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange({
        [searchOption.key]: checkedItem,
      })
    }
  }, [checkedItem])

  return <Products data={searchOption.options} onChange={handleChange} type={'filter'} selectedTags={[checkedItem]} />
}
