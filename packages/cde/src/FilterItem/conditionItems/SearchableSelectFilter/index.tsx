import { CDEDateFormat } from '@/config.ts'
import { FilterLabel } from '@/FilterItem/filterOptions/FilterLabel.tsx'
import { isMultiCDEFilterItemUser } from '@/types/filter.ts'
import { Empty, Select, Spin } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select/index'
import classNames from 'classnames'
import { CDELogicOptionValue, CDERankQueryFilterValue } from 'gel-api'
import { intl } from 'gel-util/intl'
import { useEffect, useState } from 'react'
import { LogicOption } from '../../filterOptions/LogicOption.tsx'
import wrapperStyles from '../style/conditionItem.module.less'
import { CDEFilterCompType } from '../type.ts'
import { SelectedItems } from './SelectedItems.tsx'
import styles from './style/inputWithSearch.module.less'
import { useSearch } from './useSearch.ts'
import { formatSelectOptions, processSelectedOptions } from './utils.ts'
/**
 * A component that provides an input field with search functionality and multi-select capabilities.
 * It supports different types of searches including corporate lists, parks, and tracks.
 *
 * Features:
 * - Debounced search with remote data fetching
 * - Multi-select with custom rendering
 * - Support for date range selection
 * - Support for year selection
 * - Logic operation selection (AND/OR)
 */
export const SearchableSelectFilter: CDEFilterCompType = ({
  item,
  getBFSD,
  getBFYQ,
  updateFilter,
  getCorpListPresearch,
  filter,
}) => {
  const { itemName, logicOption, itemId, itemType, itemOption, hoverHint, itemField } = item
  console.log('🚀 ~ 啊是的啊是的啊是的啊是item:', getCorpListPresearch)

  const isCorpLists = itemType === '91' // Flag to identify if the component is used for corporate lists

  // Type validation to ensure filter is multi-value
  if (filter && !isMultiCDEFilterItemUser(filter)) {
    console.error('filter not multi', itemId, filter)
    return null
  }

  // State for selected items and logic
  const [selectedItems, setSelectedItems] = useState<CDERankQueryFilterValue[]>([])
  const [logic, setLogic] = useState<CDELogicOptionValue>(filter && filter.logic ? filter.logic : 'any')

  // Determine if width should be auto-adjusted based on item field
  const widthAuto = itemField === 'park_id' || itemField === 'track_id' || isCorpLists

  // Custom hook for search functionality
  const { options, fetching, loadInitialOptions, debouncedFetchOptions } = useSearch(
    itemType,
    itemOption,
    getBFSD,
    getBFYQ,
    getCorpListPresearch
  )

  // Initialize selected items from filter when component mounts or filter changes
  useEffect(() => {
    if (filter) {
      if (filter.value && filter.value.length) {
        const items = filter.value.map((item: any) => ({
          label: item.objectName,
          value: item.objectId,
          ...item,
        }))
        setSelectedItems(items)
      } else if (filter.search && filter.search.length) {
        if (Array.isArray(filter.search)) {
          const items = filter.search.map((item: any) => ({
            label: item.objectName,
            value: item.objectId,
            ...item,
          }))
          setSelectedItems(items)
        }
      }
    } else {
      setSelectedItems([])
    }
  }, [filter])

  // Load initial options for corporate lists
  useEffect(() => {
    loadInitialOptions()
  }, [isCorpLists, itemOption])

  /**
   * Handles changes in selection
   * Enforces maximum selection limit and updates the filter context
   */
  const handleChange: SelectProps['onChange'] = (values, options) => {
    const selectedOptions = processSelectedOptions(values, options)

    if (!selectedOptions) {
      return
    }

    setSelectedItems(selectedOptions)

    if (itemType === '9') {
      // 榜单名录搜索类型
      // Call the update filter callback
      updateFilter({
        filter: item,
        search: selectedOptions,
        logic: logicOption,
      })
    } else {
      // 其他类型
      updateFilter({
        filter: item,
        value: selectedOptions,
        logic: logicOption,
      })
    }
  }

  /**
   * Updates the logic operator (AND/OR) for the filter
   */
  const handleLogicChange = (logicValue: CDELogicOptionValue) => {
    setLogic(logicValue)
    if (filter) {
      updateFilter({
        filter: item,
        logic: logicValue,
        value: filter.value,
      })
    }
  }

  /**
   * Handles date range selection for corporate list items
   */
  const handleDateChange = (dates: any, selectedItem: CDERankQueryFilterValue) => {
    const value = dates?.map((d: any) => d?.format(CDEDateFormat)).join('-')
    const updatedItem = { ...selectedItem, objectDate: value }

    const updatedItems = selectedItems.map((item) => (item.value === updatedItem.value ? updatedItem : item))

    setSelectedItems(updatedItems)

    updateFilter({
      filter: item,
      logic,
      value: updatedItems,
    })
  }

  /**
   * Handles year selection for corporate list items
   */
  const handleYearChange = (yearValue: string, selectedItem: CDERankQueryFilterValue) => {
    const updatedItem = { ...selectedItem, objectYear: yearValue }

    const updatedItems = selectedItems.map((item) => (item.value === updatedItem.value ? updatedItem : item))

    setSelectedItems(updatedItems)

    updateFilter({
      filter: item,
      logic,
      value: updatedItems,
    })
  }

  const handleRemoveItem = (itemToRemove: CDERankQueryFilterValue) => {
    const updatedItems = selectedItems.filter((item) => item.value !== itemToRemove.value)
    setSelectedItems(updatedItems)

    if (itemType === '9') {
      updateFilter({
        filter: item,
        search: updatedItems,
        logic: logicOption,
      })
    } else {
      updateFilter({
        filter: item,
        logic,
        value: updatedItems,
      })
    }
  }

  const combinedOptions = [...selectedItems]
  const selectedValues = new Set(selectedItems.map((item) => item.value))

  if (Array.isArray(options)) {
    options.forEach((option: any) => {
      if (!selectedValues.has(option.value)) {
        combinedOptions.push(option)
      }
    })
  }
  const selectOptions = formatSelectOptions(combinedOptions)

  return (
    <div className={classNames(wrapperStyles.conditionItem, styles.inputWithSearchWrapper)}>
      <FilterLabel filter={!!filter} itemName={itemName} hoverHint={hoverHint} />
      {isCorpLists && <LogicOption value={logic} onChange={handleLogicChange} />}
      {isCorpLists && (
        <SelectedItems
          selectedItems={selectedItems}
          handleDateChange={handleDateChange}
          handleYearChange={handleYearChange}
          onRemoveItem={handleRemoveItem}
        />
      )}
      <Select
        size="large"
        className={styles.select}
        dropdownClassName={styles.selectDropdown}
        placement={item.itemField === 'listing_tags_id' ? 'topLeft' : 'bottomLeft'}
        mode="multiple"
        labelInValue
        placeholder={widthAuto ? intl(297900, '请输入关键词') : intl('260419', '请输入榜单名称')}
        filterOption={false}
        onSearch={debouncedFetchOptions}
        value={formatSelectOptions(selectedItems)}
        onChange={handleChange}
        onDeselect={(option: any) => handleRemoveItem({ value: option.value } as any)}
        notFoundContent={
          fetching ? <Spin size="small" /> : <Empty description={intl('312173', '请更换关键词进行搜索')} />
        }
        options={selectOptions}
        maxTagCount="responsive"
      />
    </div>
  )
}
