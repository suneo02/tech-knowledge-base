import { CorpBasicNumFront } from '@/types/corpDetail'
import { CorpMenuCfg } from '@/types/corpDetail/menu'
import intl from '@/utils/intl'
import { Select } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select'
import { useControllableValue } from 'ahooks'
import React, { FC, useMemo } from 'react'
import { buildCorpAllMenuData, CorpMenuData } from '../../menu'
import { shouldUseCompleteMenu } from '../../menu/useCorpMenuData'

export const MenuSearch: FC<{
  value?: string
  onChange?: (value: string) => void
  menuConfig: CorpMenuCfg | null
  basicNum: CorpBasicNumFront
  treeMenuClick: (keys: React.Key[], options: { selected: boolean }) => void
  setExpandedKeys: (keys: string[]) => void
}> = (props) => {
  const { menuConfig, basicNum, treeMenuClick, setExpandedKeys } = props
  const [inputValue, setInputValue] = useControllableValue<string | null>(props)

  const handleResultClick: SelectProps['onChange'] = (key) => {
    if (key) {
      treeMenuClick([String(key)], { selected: true })
    }
    setInputValue(null)
  }

  const handleSearch = (val: string) => {
    setInputValue(val)
    if (!val || !val.trim()) {
      setExpandedKeys(['overview'])
    }
  }

  const searchableMenus = useMemo<CorpMenuData[]>(() => {
    if (!menuConfig || Object.keys(menuConfig).length === 0) {
      return []
    }
    if (!shouldUseCompleteMenu(basicNum, menuConfig)) {
      return []
    }
    return buildCorpAllMenuData(menuConfig, basicNum)
  }, [menuConfig, basicNum])

  const searchedOptions = useMemo(() => {
    try {
      if (!inputValue) {
        return []
      }
      return searchableMenus
        .filter((item) => {
          if (item.disabled) {
            return false
          }
          const titleSource = (item.titleStr || item.title || '') as string
          const title = typeof titleSource === 'string' ? titleSource : String(titleSource)
          return title && inputValue && title.toUpperCase().includes(inputValue.toUpperCase())
        })
        .map((item) => {
          const titleSource = (item.titleStr || item.title || '') as string
          const title = typeof titleSource === 'string' ? titleSource : String(titleSource)
          const index = title.toUpperCase().indexOf(inputValue.toUpperCase())
          const beforeStr = title.substring(0, index)
          const matched = title.substring(index, index + inputValue.length)
          const afterStr = title.substring(index + inputValue.length)

          let displayBeforeStr = beforeStr
          if (item.parentMenuKey === 'history' && !title.startsWith('历史')) {
            displayBeforeStr = '历史' + beforeStr
          }

          return {
            label: (
              <span>
                {displayBeforeStr}
                <span style={{ color: '#00AEC7' }}>{matched}</span>
                {afterStr}
                {item.titleNum}
              </span>
            ),
            value: item.key,
          }
        })
    } catch (error) {
      console.error(error)
      return []
    }
  }, [inputValue, searchableMenus])

  return (
    <Select
      showSearch
      placeholder={intl('222764', '搜索菜单')}
      value={inputValue}
      onSearch={handleSearch}
      onChange={handleResultClick}
      style={{ width: '100%' }}
      options={searchedOptions}
      filterOption={false}
      defaultActiveFirstOption={false}
      data-uc-id="xpCOK5NHm1"
      data-uc-ct="select"
    />
  )
}
