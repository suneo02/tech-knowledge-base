import React from 'react'
import FilterContainer, { FilterContextType, FilterProvider } from '../../../../container/FilterContainer'

const FilterContainerChecker = (props: FilterContextType & any) => {
  const { children, updateFilter, filterParams, ...rest } = props
  if (props?.search || props?.filterParams || props?.list?.some((res: any) => res.filterParams)) {
    if (updateFilter) {
      return (
        <FilterContainer {...props} initialFilter={props?.filter}>
          {({ filter, updateFilter }) => {
            return children({ ...rest, filterParams, filter, updateFilter })
          }}
        </FilterContainer>
      )
    } else {
      return (
        <FilterProvider initialFilter={props?.filter}>
          <FilterContainer {...props} initialFilter={props?.filter}>
            {({ filter, updateFilter }) => {
              return children({ ...rest, filterParams, filter, updateFilter })
            }}
          </FilterContainer>
        </FilterProvider>
      )
    }
  } else {
    return children({ ...rest })
  }
}

export default FilterContainerChecker
