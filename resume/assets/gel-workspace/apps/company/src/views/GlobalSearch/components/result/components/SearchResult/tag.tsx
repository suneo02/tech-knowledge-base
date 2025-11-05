import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { getCompanyStateColor } from '@/views/SearchFunc/state'
import { Tag } from '@wind/wind-ui'
import React from 'react'

const SearchResultTag = <T extends Record<string, any>>(props: T & { type: GSTabsEnum }) => {
  return (
    <div className="global_state">
      {props?.statusAfter ? (
        // @ts-expect-error ttt
        <Tag type="primary" color={getCompanyStateColor(props.statusAfter)}>
          {props.statusAfter}
        </Tag>
      ) : null}
      {Array.isArray(props?.corporationTags3) && props?.corporationTags3?.length ? (
        props.corporationTags3.map((item, index) => (
          // @ts-expect-error ttt
          <Tag key={index} type="primary" color="color-2" style={{ marginBlockEnd: 8 }}>
            {item.title}
          </Tag>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}

export default SearchResultTag
