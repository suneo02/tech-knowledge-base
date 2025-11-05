import React from 'react'
import { Divider } from 'antd'
import { renderComponent } from './renderComponent'
import { renderIntegration } from './renderIntegration'

export const renderChildren = ({ list, parentId, ...rest }: any) => {
  return list.map((res: any, index: number) => {
    const uniqueKey = res.id || res.key || `${parentId ? `${parentId}-` : ''}${index}`
    return (
      <div key={uniqueKey} data-id={uniqueKey} style={res.level > 2 && index ? { marginBlockStart: 12 } : {}}>
        <>
          {res.level === 2 && index ? <Divider dashed></Divider> : null}
          {res.children
            ? renderIntegration(
                { ...res, filter: rest?.filter, updateFilter: rest?.updateFilter, updateParams: rest?.updateParams },
                uniqueKey
              )
            : renderComponent({
                ...res,
                filter: rest?.filter,
                updateFilter: rest?.updateFilter,
                updateParams: rest?.updateParams,
              })}
        </>
      </div>
    )
  })
}
