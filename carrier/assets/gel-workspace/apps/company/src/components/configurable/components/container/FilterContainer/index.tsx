import React, { createContext, ReactNode, useContext, useState } from 'react'

export interface FilterContextType {
  filter: Record<string, any>
  updateFilter: (newFilter: Record<string, any>) => void
}

// 创建 FilterContext
const FilterContext = createContext<FilterContextType | undefined>(undefined)

// 提供者组件的属性接口
export interface FilterProviderProps {
  initialFilter: Record<string, any>
  children: ReactNode
}

// 提供者组件
export const FilterProvider: React.FC<FilterProviderProps> = ({ initialFilter, children }) => {
  const [filter, setFilter] = useState<Record<string, any>>(initialFilter)

  const updateFilter = (newFilter: Record<string, any>) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }))
  }

  return <FilterContext.Provider value={{ filter, updateFilter }}>{children}</FilterContext.Provider>
}

// 自定义 Hook
const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}

// FilterContainer 组件
interface FilterContainerProps {
  children: (props: {
    filter: Record<string, any>
    updateFilter: (newFilter: Record<string, any>) => void
  }) => ReactNode | ReactNode
}
const FilterContainer: React.FC<FilterContainerProps> = ({ children }) => {
  const { filter, updateFilter } = useFilter()

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({ filter, updateFilter })
    } else {
      return children
    }
  }
  return renderChildren()
}

export default FilterContainer
