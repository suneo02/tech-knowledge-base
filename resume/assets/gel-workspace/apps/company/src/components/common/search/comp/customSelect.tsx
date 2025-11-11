import React, { FC, memo } from 'react'
import { CustomSelectBidProductWords } from '../custom/BidProductWords.tsx'
import { isNil } from 'lodash'
import { TOnSearchChange } from '../type.ts'
import { CustomSelectBidCompanySelf } from '../custom/BidCompanySelf.tsx'
import { ITableAggregationWithOption } from '@/handle/table/aggregation/type'

export const CustomSelectByOption = memo<{
  searchOption: ITableAggregationWithOption
  onSearchChange?: TOnSearchChange
  // eslint-disable-next-line react/prop-types
}>(({ searchOption, onSearchChange }) => {
  // eslint-disable-next-line react/prop-types
  switch (searchOption.customId) {
    case 'bidProductWord':
      return (
        <CustomSelectBidProductWords
          searchOption={searchOption}
          onSearchChange={onSearchChange}
          data-uc-id="EYgP9dlEkvE"
          data-uc-ct="customselectbidproductwords"
        />
      )
    case 'bidCompanySelf':
      return (
        <CustomSelectBidCompanySelf
          searchOption={searchOption}
          onSearchChange={onSearchChange}
          data-uc-id="HRnD2fBTQhg"
          data-uc-ct="customselectbidcompanyself"
        />
      )
    default:
      return null
  }
})
CustomSelectByOption.displayName = 'CustomSelectByOption'

export const CustomSelectByOptions: FC<{
  options: ITableAggregationWithOption[]
  onSearchChange?: TOnSearchChange
}> = ({ options, onSearchChange }) => {
  if (isNil(options)) {
    return null
  }
  return (
    <>
      {options.map((option) => (
        <CustomSelectByOption
          key={option.key}
          searchOption={option}
          onSearchChange={onSearchChange}
          data-uc-id="uW__QtflAPF"
          data-uc-ct="customselectbyoption"
          data-uc-x={option.key}
        />
      ))}
    </>
  )
}
