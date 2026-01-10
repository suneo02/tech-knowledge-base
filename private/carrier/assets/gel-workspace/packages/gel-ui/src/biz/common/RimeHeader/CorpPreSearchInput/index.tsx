import { Input } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { createWFCRequestWithAxios } from 'gel-api'
import styles from './index.module.less'
import { AxiosInstance } from 'axios'

/** 搜索选项类型 */
interface SearchOption {
  /** 纯文本企业名称（用于选中后回填） */
  value: string
  /** 带高亮标签的企业名称（用于下拉显示） */
  highlightValue: string
  /** 企业ID */
  corpId: string
}

/**
 * 移除 HTML 标签，获取纯文本
 * @param html 带 HTML 标签的字符串
 * @returns 纯文本字符串
 */
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 解析带 <em> 标签的文本，返回 React 元素数组
 * @param text 带 <em> 标签的文本
 * @returns React 元素数组
 */
const parseHighlightText = (text: string): React.ReactNode => {
  // 匹配 <em>...</em> 或 <em>...</em/> (兼容错误格式)
  const parts = text.split(/(<em>.*?<\/em>|<em>.*?<em\/>)/g)

  return parts.map((part, index) => {
    // 检查是否是高亮部分
    const highlightMatch = part.match(/<em>(.*?)(<\/em>|<em\/>)/)
    if (highlightMatch) {
      return (
        <span key={index} className={styles.highlight}>
          {highlightMatch[1]}
        </span>
      )
    }
    return part
  })
}

/** 组件 Props */
export interface CorpPreSearchInputProps {
  /** axios实例 */
  axiosInstance: AxiosInstance
  /** 输入框占位符 */
  placeholder?: string
  /** 防抖延迟时间（毫秒） */
  debounceTime?: number
  /** 最小触发搜索的字符数 */
  minSearchLength?: number
  /** 最大展示结果数量 */
  maxResults?: number
  /** 选中企业回调 */
  onSelect?: (corpName: string, corpId: string) => void
}

/**
 * CorpPreSearchInput 企业预搜索输入框
 *
 * @description
 * 带有预搜索功能的企业搜索输入框，输入时自动调用接口获取企业列表建议。
 * 使用原生实现，不依赖 AutoComplete 组件。
 *
 * @component
 * @example
 * ```tsx
 * // 基础用法
 * <CorpPreSearchInput />
 *
 * // 自定义配置
 * <CorpPreSearchInput
 *   placeholder="请输入企业名称"
 *   debounceTime={500}
 *   minSearchLength={3}
 *   maxResults={10}
 *   onSelect={(corpName, corpId) => console.log(corpName, corpId)}
 * />
 * ```
 *
 * @param {string} [placeholder='搜索企业'] - 输入框占位符
 * @param {number} [debounceTime=300] - 防抖延迟时间（毫秒）
 * @param {number} [minSearchLength=2] - 最小触发搜索的字符数
 * @param {number} [maxResults=5] - 最大展示结果数量
 * @param {function} [onSelect] - 选中企业回调，参数为 (corpName, corpId)
 *
 * @returns {JSX.Element} 返回企业预搜索输入框组件
 *
 * @features
 * - 输入防抖，避免频繁调用接口
 * - 支持配置最小搜索字符数
 * - 支持配置最大展示结果数
 * - 搜索时显示 loading 状态
 * - 支持搜索关键词高亮显示（解析 `<em>` 标签）
 * - 支持键盘上下键选择、回车确认
 * - 点击外部自动关闭下拉列表
 *
 * @useCases
 * 1. 页面顶部导航栏的企业搜索
 * 2. 表单中的企业选择输入框
 * 3. 任何需要企业预搜索的场景
 *
 * @note
 * - 调用 wfcCorpGlobalPreSearchPath 接口获取数据
 * - 默认输入 >= 2 个字符时触发搜索
 */
const CorpPreSearchInput = ({
  axiosInstance,
  placeholder = t('', '搜索企业'),
  debounceTime = 300,
  minSearchLength = 2,
  maxResults = 5,
  onSelect,
}: CorpPreSearchInputProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const containerRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 调用预搜索接口
  const fetchSearchResults = useCallback(
    async (queryText: string) => {
      if (queryText.length < minSearchLength) {
        setSearchOptions([])
        setIsDropdownVisible(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await createWFCRequestWithAxios(
          axiosInstance,
          'search/company/getGlobalCompanyPreSearch'
        )({ queryText, version: 1 })

        if (response?.Data?.search) {
          // 只取指定数量的结果
          const options = response.Data.search.slice(0, maxResults).map((item) => ({
            // 纯文本名称（用于选中后回填输入框）
            value: stripHtmlTags(item.corpName),
            // 带高亮标签的名称（用于下拉列表显示）
            highlightValue: item.corpName,
            corpId: item.corpId,
          }))
          setSearchOptions(options)
          setIsDropdownVisible(options.length > 0)
          setActiveIndex(-1)
        } else {
          setSearchOptions([])
          setIsDropdownVisible(false)
        }
      } catch (error) {
        console.error('预搜索失败:', error)
        setSearchOptions([])
        setIsDropdownVisible(false)
      } finally {
        setIsSearching(false)
      }
    },
    [minSearchLength, maxResults]
  )

  // 防抖搜索
  const debouncedSearch = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        fetchSearchResults(value)
      }, debounceTime)
    },
    [fetchSearchResults, debounceTime]
  )

  // 处理输入变化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  // 处理选择
  const handleSelectOption = useCallback(
    (option: SearchOption) => {
      setSearchValue(option.value)
      setIsDropdownVisible(false)
      setActiveIndex(-1)
      onSelect?.(option.value, option.corpId)
    },
    [onSelect]
  )

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isDropdownVisible || searchOptions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < searchOptions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : searchOptions.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (activeIndex >= 0 && activeIndex < searchOptions.length) {
            handleSelectOption(searchOptions[activeIndex])
          }
          break
        case 'Escape':
          setIsDropdownVisible(false)
          setActiveIndex(-1)
          break
      }
    },
    [isDropdownVisible, searchOptions, activeIndex, handleSelectOption]
  )

  // 处理聚焦
  const handleFocus = useCallback(() => {
    if (searchOptions.length > 0) {
      setIsDropdownVisible(true)
    }
  }, [searchOptions])

  return (
    <div className={styles.corpPreSearchInput} ref={containerRef}>
      <Input.Search
        value={searchValue}
        placeholder={placeholder}
        size="large"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
      {isDropdownVisible && searchOptions.length > 0 && (
        <div className={styles.dropdown}>
          {searchOptions.map((option, index) => (
            <div
              key={option.corpId}
              className={`${styles.dropdownItem} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {parseHighlightText(option.highlightValue)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CorpPreSearchInput
