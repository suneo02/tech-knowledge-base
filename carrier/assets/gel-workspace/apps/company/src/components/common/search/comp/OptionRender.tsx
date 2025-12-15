import { intlNoIndex } from '@/utils/intl'
import React, { FC } from 'react'
import { ISearchOptionItem } from '../../../../types/configDetail/search.ts'

export const SearchSelectOptionRender: FC<{
  option: Pick<ISearchOptionItem, 'label' | 'labelId' | 'count'>
}> = ({ option }) => {
  const labelIntl = intlNoIndex(option.labelId, option.label)
  if (!option.count) {
    return labelIntl
  } else {
    return `${labelIntl}(${option.count})`
  }
}

export const convertSelectOptionByCount = (option?: ISearchOptionItem): ISearchOptionItem => {
  try {
    return {
      ...option,
      label: <SearchSelectOptionRender option={option} data-uc-id="9p1xmogr3N" data-uc-ct="searchselectoptionrender" />,
      disabled: option.count === 0,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
