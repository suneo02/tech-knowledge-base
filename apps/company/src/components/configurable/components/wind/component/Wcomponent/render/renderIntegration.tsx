import ApiContainerChecker from '../ApiContainerChecker'
import FilterContainerChecker from '../FilterContainerChecker'
import LayoutSwitcher from '../LayoutSwitcher'
import React from 'react'

export const renderIntegration = (component: any, parentId?: React.Key) => {
  if (component?.children) component.list = component.children
  Object.freeze(component)
  return (
    <FilterContainerChecker {...component}>
      {(props: any) => {
        return (
          <ApiContainerChecker {...props}>
            {(res: any) => {
              return <LayoutSwitcher {...res} parentId={parentId} />
            }}
          </ApiContainerChecker>
        )
      }}
    </FilterContainerChecker>
  )
}
