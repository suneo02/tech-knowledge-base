import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { SearchHistoryType } from 'gel-api'
import { CorpPresearchModule } from './historyEnum'
import { CorpPresearchProps, SelectOption } from './type'
import { CorpSearchRow } from './item'

export const useCorpPresearch = (props: CorpPresearchProps) => {
  const {
    initialValue,
    debounceTime = 300,
    onChange,
    requestAction,
    needHistory = false,
    searchMode = 'auto',
    deleteSearchHistoryAll,
    addSearchHistory,
    getSearchHistoryAndSlice,
    module = CorpPresearchModule.DEFAULT,
    requestDataCallback,
    initialSelectedValues = [],
  } = props

  // 为每个组件实例生成唯一标识符
  const componentId = useMemo(() => `corp-presearch-${Math.random().toString(36).substr(2, 9)}`, [])

  // 基础状态
  const [searchOptions, setSearchOptions] = useState<SelectOption[]>([])
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)
  const [showClear, setShowClear] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [dropdownClassName, setDropdownClassName] = useState('')

  // 输入值状态
  const [inputValue, setInputValue] = useState(initialValue || '')
  const [realInputValue, setRealInputValue] = useState(initialValue || '')
  const inputValueRef = useRef<string>('')

  // select 模式相关状态
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState('')
  const [selectedHistoryList, setSelectedHistoryList] = useState([])
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Map<string, SelectOption>>(new Map())

  // 使用 JSON.stringify 进行深度比较，避免数组引用变化导致的死循环
  const initialSelectedValuesString = useMemo(() => {
    return JSON.stringify(initialSelectedValues || [])
  }, [initialSelectedValues])

  useEffect(() => {
    if (initialSelectedValues && initialSelectedValues.length > 0) {
      setSelectedValues([...initialSelectedValues])
    } else {
      // 如果传入空数组或undefined，清空选中状态
      setSelectedValues([])
    }
  }, [initialSelectedValuesString])

  // 模块配置
  const moduleConfig = useMemo(() => {
    const configs = {
      [CorpPresearchModule.DEFAULT]: {
        historyKey: 'HOME_HEADER_SEARCH' as SearchHistoryType,
      },
      [CorpPresearchModule.JOB]: {
        historyKey: 'RECRUITMENT_SEARCH_COMPANY' as SearchHistoryType,
      },
      [CorpPresearchModule.BID_SEARCH_PARTICIPATING_UNIT]: {
        historyKey: 'BID_SEARCH_PARTICIPATING_UNIT' as SearchHistoryType,
      },
      [CorpPresearchModule.BID_SEARCH_PURCHASING_UNIT]: {
        historyKey: 'BID_SEARCH_PURCHASING_UNIT' as SearchHistoryType,
      },
      [CorpPresearchModule.BID_SEARCH_BID_WINNER]: {
        historyKey: 'BID_SEARCH_BID_WINNER' as SearchHistoryType,
      },
    }
    return configs[module]
  }, [module])

  // 搜索处理函数
  const handleSearch = useCallback(
    async (searchText: string) => {
      if (!searchText || searchText.trim() === '') {
        setSearchOptions([])
        return
      }
      if (!requestAction) {
        setSearchOptions([])
        return
      }

      try {
        const response = await requestAction({
          queryText: searchText,
        })
        if (response?.Data?.search) {
          let preSearchData: any[] = []
          if (requestDataCallback) {
            // 此处添加参数支持对接口返回数据进行格式处理等其他操作，如进行AI翻译等
            preSearchData = await requestDataCallback(response.Data.search)
            response?.Data?.search?.map((item, index) => {
              preSearchData[index].corpName = item?.corpName
            })
          } else {
            preSearchData = response.Data.search
          }
          const options = preSearchData?.map((item, index) => ({
            id: item?.corpId,
            key: `${item?.corpId}-${index}`,
            label: <CorpSearchRow item={item} />,
            value: item?.corpName?.replace(/<[^>]*>?/g, ''),
            data: item,
          }))
          if (searchMode === 'select') {
            setSearchOptions(options || [])
          } else {
            setSearchOptions(options)
          }
        } else {
          setSearchOptions([])
        }
      } catch (error) {
        console.error('CorpPresearch error:', error)
        setSearchOptions([])
      }
    },
    [searchMode, requestAction]
  )

  // 防抖搜索
  const debouncedSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return (searchText: string) => {
      if (searchMode === 'select') {
        inputValueRef.current = searchText
        setSearchInputValue(searchText)

        if (!searchText || searchText.trim() === '') {
          setSearchOptions([])
          return
        }
      }

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        if (searchText?.trim()?.length > 1) {
          handleSearch(searchText)
        } else if (searchMode === 'select' && (!searchText || searchText.trim() === '')) {
          setSearchOptions([])
        }
      }, debounceTime)
    }
  }, [debounceTime, handleSearch, searchMode])

  // 获取历史搜索记录
  const getSearchHistory = useCallback(async () => {
    console.log('getSearchHistoryAndSlice', getSearchHistoryAndSlice)
    if (!getSearchHistoryAndSlice) {
      return
    }
    const history = await getSearchHistoryAndSlice(moduleConfig?.historyKey)
    if (history?.length > 0) {
      const hisList = history.map((h) => {
        if (h?.entityId?.includes('|')) {
          const [corpName, corpId] = h?.entityId?.split('|')
          h.entityId = corpId
          h.searchKey = corpName
        }
        return {
          ...h,
          corpId: h?.entityId,
          corpName: h?.searchKey,
        }
      })

      // 根据 corpId 去重
      const uniqueHistory = hisList.reduce((acc, current) => {
        const existingIndex = acc.findIndex((item) => item.corpId === current.corpId)
        if (existingIndex === -1) {
          acc.push(current)
        }
        return acc
      }, [])

      setHistoryList(uniqueHistory)
    }
  }, [moduleConfig?.historyKey])

  // 保存历史搜索
  const saveSearchHistory = useCallback(
    (val: string) => {
      console.log('addSearchHistory', addSearchHistory)
      if (!val || val?.trim() === '') return
      if (addSearchHistory) {
        addSearchHistory(moduleConfig?.historyKey || ('HOME_HEADER_SEARCH' as SearchHistoryType), val)
      }
    },
    [moduleConfig?.historyKey]
  )

  // 删除历史搜索
  const deleteSearchHistory = useCallback(() => {
    // request('operation/delete/searchhistorydeleteall', {
    //   params: {
    //     type: moduleConfig?.historyKey || ('HOME_HEADER_SEARCH' as SearchHistoryType),
    //   },
    // })
    if (deleteSearchHistoryAll) {
      deleteSearchHistoryAll({
        params: {
          type: moduleConfig?.historyKey || ('HOME_HEADER_SEARCH' as SearchHistoryType),
        },
      })
    }

    setHistoryList([])
  }, [moduleConfig?.historyKey])

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedValues([])
    setSelectedOptionsMap(new Map())
    setInputValue('')
    setRealInputValue('')
    setSearchInputValue('')
    inputValueRef.current = ''
    setShowClear(false)
    setSelectedOption(null)
    setSearchOptions([])
  }, [])

  // 获取选中的值
  const getSelectedValues = useCallback(() => selectedValues, [selectedValues])

  // 获取选中的选项
  const getSelectedOptions = useCallback(() => Array.from(selectedOptionsMap.values()), [selectedOptionsMap])

  return {
    // 状态
    searchOptions,
    selectedOption,
    showClear,
    isFocused,
    historyList,
    dropdownClassName,
    inputValue,
    realInputValue,
    selectedValues,
    searchInputValue,
    selectedHistoryList,
    selectedOptionsMap,
    componentId,
    moduleConfig,

    // 设置函数
    setSearchOptions,
    setSelectedOption,
    setShowClear,
    setIsFocused,
    setHistoryList,
    setDropdownClassName,
    setInputValue,
    setRealInputValue,
    setSelectedValues,
    setSearchInputValue,
    setSelectedHistoryList,
    setSelectedOptionsMap,

    // 引用
    inputValueRef,

    // 方法
    handleSearch,
    debouncedSearch,
    getSearchHistory,
    saveSearchHistory,
    deleteSearchHistory,
    clearSelection,
    getSelectedValues,
    getSelectedOptions,
  }
}
