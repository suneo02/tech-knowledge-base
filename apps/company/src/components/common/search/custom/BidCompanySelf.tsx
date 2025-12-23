import React, { FC, useMemo } from 'react'
import { TOnSearchChange } from '@/components/common/search/type.ts'
import intl from '@/utils/intl'
import { Checkbox } from '@wind/wind-ui'
import { ITableAggregationWithOption } from '@/handle/table/aggregation/type'

export const CustomSelectBidCompanySelf: FC<{
  searchOption: ITableAggregationWithOption
  onSearchChange?: TOnSearchChange
}> = ({ searchOption, onSearchChange }) => {
  const count = useMemo(() => {
    try {
      return searchOption.options.find((i) => i.key === '本企业中标' || i.value === '本企业中标')?.count
    } catch (e) {
      console.error(e)
    }
  }, [searchOption])

  const content =
    (window.en_access_config ? 'Bids current company won' : intl(0, '本企业中标')) +
    (count !== undefined ? ` (${count || 0})` : '')
  return (
    <Checkbox
      onChange={(e) => {
        onSearchChange({
          [searchOption.key]: e.target.checked ? 1 : 0,
        })
      }}
      style={{
        fontWeight: 'initial',
        display: 'flex',
        alignItems: 'center',
        marginRight: '0',
      }}
      data-uc-id="0H9tHo3cab"
      data-uc-ct="checkbox"
    >
      <span
        title={content}
        style={{
          maxWidth: '110px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          verticalAlign: 'bottom',
        }}
      >
        {content}
      </span>
    </Checkbox>
  )
}
