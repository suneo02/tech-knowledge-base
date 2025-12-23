import { Select, Spin } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { ErrorBoundary } from 'gel-ui'
import { t } from 'gel-util/intl'
import React, { useMemo } from 'react'
import { CustomComponentProps, FilterValue } from '../../../types'
import styles from './index.module.less'

const PREFIX = 'search'
const STRINGS = {
  PLACEHOLDER: t('', '请输入并选择，最多5项'),
}
const MAX_SELECTION_COUNT = 5

/**
 * TODO: 需要调用真实api
 * 模拟远程API调用，用于获取搜索建议。
 * @param query - 当前的搜索关键词。
 * @param _currentSelection - 当前已选中的项目 (预留参数，可用于服务端去重)。
 * @returns 返回一个包含搜索结果的 Promise。
 * @deprecated
 */
const getOptions = (
  query: string,
  _currentSelection: (string | number)[]
): Promise<{ label: string; value: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([])
        return
      }
      resolve(
        Array.from({ length: 5 }).map((_, i) => {
          const resultValue = `${query} - result ${i + 1}`
          return { label: resultValue, value: resultValue }
        })
      )
    }, 300) // 模拟网络延迟
  })
}

/**
 * 一个支持远程搜索、多选、数量限制，并对选项进行分组展示的选择器组件。
 */
const Search: React.FC<CustomComponentProps> = ({ value, onChange, placeholder, ...restProps }) => {
  // --- State and Hooks ---

  const currentSelectedValues = (Array.isArray(value?.value) ? value.value : []) as (string | number)[]

  const {
    data: searchedOptions,
    run: runSearch,
    loading,
  } = useRequest(getOptions, {
    debounceWait: 300,
    manual: true,
  })

  // --- Handlers ---

  /**
   * 处理用户输入，触发带防抖的搜索请求。
   */
  const handleSearch = (query: string) => {
    runSearch(query, currentSelectedValues)
  }

  /**
   * 处理选项变更，并强制限制最大选择数量。
   */
  const handleChange = (newValue: any, _option: any) => {
    let finalValue = Array.isArray(newValue) ? newValue : [newValue]

    if (finalValue.length > MAX_SELECTION_COUNT) {
      console.warn(`最多只能选择 ${MAX_SELECTION_COUNT} 项。`)
      finalValue = finalValue.slice(0, MAX_SELECTION_COUNT)
    }

    onChange?.({ value: finalValue } as FilterValue)
  }

  // --- Memos (Derived State) ---

  /**
   * 使用 useMemo 来计算最终要展示的分组选项，以优化性能。
   * 结构:
   * 1. "搜索结果"组: 展示 API 返回的全部结果。
   * 2. "已选中"组: 展示那些不在当前搜索结果中的已选项，避免重复。
   */
  const groupedOptions = useMemo(() => {
    const groups: { label: string; options: { label: string; value: string | number }[] }[] = []

    const searchResultOptions = searchedOptions || []
    const searchResultValues = searchResultOptions.map((opt) => String(opt.value))

    // 分组1: 搜索结果
    if (searchResultOptions.length > 0) {
      groups.push({
        label: '搜索结果',
        options: searchResultOptions,
      })
    }

    // 分组2: 不在当前搜索结果里的已选项
    const orphanedSelectedOptions = currentSelectedValues
      .filter((selectedValue) => !searchResultValues.includes(String(selectedValue)))
      .map((val) => ({ label: String(val), value: val }))

    if (orphanedSelectedOptions.length > 0) {
      groups.push({
        label: '已选中',
        options: orphanedSelectedOptions,
      })
    }

    return groups
  }, [searchedOptions, currentSelectedValues])

  // --- Render ---

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <ErrorBoundary fallback={<div></div>}>
        <Select
          size="large"
          className={styles[`${PREFIX}-select`]}
          mode="multiple"
          showSearch
          value={currentSelectedValues}
          placeholder={placeholder || STRINGS.PLACEHOLDER}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={loading ? <Spin size="small" /> : undefined}
          filterOption={false}
          maxTagCount="responsive"
          dropdownClassName={styles[`${PREFIX}-dropdown-container`]}
          {...restProps}
        >
          {groupedOptions.map((group) => (
            <Select.OptGroup label={group.label} key={group.label}>
              {group.options.map((option) => (
                <Select.Option value={option.value} key={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </ErrorBoundary>
    </div>
  )
}

export default Search
