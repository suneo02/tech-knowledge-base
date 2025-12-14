import { getCDEFilterComp } from '@/FilterItem/conditionItems'
import { CDEFilterItemApi } from '@/FilterItem/conditionItems/type'
import { CDEFilterItemFront } from '@/types'
import { CDEFilterCategory } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import React from 'react'
import { UseFilterOperationsReturn } from '../FilterList/useFilterOperations'

export const FilterItemComp: React.FC<
  {
    item: CDEFilterItemFront
    parent: CDEFilterCategory
  } & Pick<UseFilterOperationsReturn, 'updateFilter' | 'getFilterById' | 'removeFilter'> &
    CDEFilterItemApi
> = ({ item, getFilterById, ...props }) => {
  const Component = getCDEFilterComp(item.itemType)
  if (!Component) {
    console.error(`Component ${item.itemType} does not exist`)
    return null
  }
  return (
    <ErrorBoundary>
      <Component item={item} getFilterById={getFilterById} filter={getFilterById(item.itemId)} {...props} />
    </ErrorBoundary>
  )
}
