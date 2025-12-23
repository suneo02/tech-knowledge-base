import { DeleteO, SearchO } from '@wind/icons'
import { AutoComplete, Input, Select } from '@wind/wind-ui'
import { isEn, t } from 'gel-util/intl'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo } from 'react'
import { CorpPresearchModule } from './historyEnum'
import styles from './index.module.less'
import { CorpSearchRow } from './item'
import { CorpPresearchProps, CorpPresearchRef } from './type'
import { useCorpPresearch } from './useCorpPresearch'
const Option = AutoComplete.Option

export const CorpPresearch = forwardRef<CorpPresearchRef, CorpPresearchProps>(
  (
    {
      initialValue,
      placeholder = t('272142', '请输入企业名称'),
      debounceTime = 500,
      onChange,
      withSearch = true,
      withClear = true,
      widthAuto = false,
      placement = 'bottomLeft',
      requestAction,
      minWidth = 400,
      onClickItem,
      onClickHistory,
      onSelectChange,
      needHistory = false,
      searchMode = 'auto',
      module = CorpPresearchModule.DEFAULT,
      deleteSearchHistoryAll,
      addSearchHistory,
      getSearchHistoryAndSlice,
      requestDataCallback,
      initialSelectedValues = [],
    },
    ref
  ) => {
    // 使用自定义 hooks 管理状态
    const {
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

      // 设置函数
      setSearchOptions,
      setSelectedOption,
      setShowClear,
      setIsFocused,
      setDropdownClassName,
      setInputValue,
      setRealInputValue,
      setSelectedValues,
      setSearchInputValue,
      setSelectedHistoryList,
      setSelectedOptionsMap,

      // 引用
      inputValueRef,

      debouncedSearch,
      getSearchHistory,
      saveSearchHistory,
      deleteSearchHistory,
      clearSelection,
      getSelectedValues,
      getSelectedOptions,
    } = useCorpPresearch({
      initialValue,
      debounceTime,
      onChange,
      requestAction,
      needHistory,
      searchMode,
      module,
      deleteSearchHistoryAll,
      addSearchHistory,
      getSearchHistoryAndSlice,
      requestDataCallback,
      initialSelectedValues,
    })

    // 暴露方法给父组件
    useImperativeHandle(
      ref,
      () => ({
        clearSelection,
        getSelectedValues,
        getSelectedOptions,
      }),
      [clearSelection, getSelectedValues, getSelectedOptions]
    )

    // initialValue 变化时同步 inputValue
    useEffect(() => {
      setInputValue(initialValue || '')

      // 初始化时设置 inputValueRef
      if (initialValue) {
        inputValueRef.current = initialValue
      }
    }, [initialValue])

    // 多选模式下，选中回调
    const handleChangeForSelect = useCallback(
      (value: any, option: any) => {
        // 多选模式下，value 是数组
        const selectedValues = Array.isArray(value) ? value : [value]
        setSelectedValues(selectedValues)

        // 取最后一个选中的值作为显示值
        const lastSelectedValue = selectedValues[selectedValues.length - 1] || ''

        // 清理已移除的选项
        if (selectedValues.length === 0) {
          setSelectedOptionsMap(new Map())
        } else {
          // 清理不在当前选中值中的选项
          setSelectedOptionsMap((prev) => {
            const newMap = new Map(prev)
            for (const [key] of newMap) {
              if (!selectedValues.includes(key)) {
                newMap.delete(key)
              }
            }
            return newMap
          })
        }

        // 处理option为空对象的情况
        if (!option || Object.keys(option).length === 0) {
          // 首先尝试从searchOptions中找到对应的选项
          const foundOption = searchOptions.find((opt) => opt.value === lastSelectedValue)
          if (foundOption) {
            // 保存到selectedOptionsMap中
            setSelectedOptionsMap((prev) => {
              const newMap = new Map(prev)
              newMap.set(lastSelectedValue, foundOption)
              return newMap
            })
          }
        } else {
          const historyMap = new Map() // 从历史搜索读取
          const searchMap = new Map() // 从搜索结果读取
          const foundHistoryOption = selectedHistoryList.find((opt: any) => opt?.value === lastSelectedValue)
          if (foundHistoryOption) {
            historyMap.set(lastSelectedValue, foundHistoryOption)
          }

          // 如果option不为空，保存到selectedOptionsMap中
          const foundOption = searchOptions.find((opt) => opt.value === lastSelectedValue)
          if (foundOption) {
            searchMap.set(lastSelectedValue, foundOption)
          }

          setSelectedOptionsMap((prev) => new Map([...prev, ...historyMap, ...searchMap]))
        }
      },
      [selectedOption, showClear, searchOptions, selectedOptionsMap, selectedHistoryList]
    )

    // 多选下拉选择  selectedOptionsMap 变化时回调
    useEffect(() => {
      if (searchMode !== 'select') {
        return
      }
      const selectedOpts = Array.from(selectedOptionsMap.values())
      onSelectChange?.(selectedValues, selectedOpts)
      if (!selectedOpts?.length) {
        setSearchOptions([])
        setSearchInputValue('') // 清空选项时，清空搜索输入值
      }
    }, [searchMode, selectedOptionsMap])

    // 普通auto模式下，选中回调
    const handleSelect = useCallback(
      (value: any, option: any) => {
        // 根据 value 找到对应的完整数据
        const selectedOptionByVal = searchOptions.find((opt) => opt.value === realInputValue)
        const selectedOptionByOption = searchOptions.find((opt) => opt.id === option?.key)
        const selectedOption = selectedOptionByOption || selectedOptionByVal

        if (selectedOption) {
          setSelectedOption(selectedOption)
          inputValueRef.current = selectedOption.value
          setShowClear(!!value)
          if (onChange) {
            onChange(selectedOption.data.corpId, selectedOption.value, selectedOption.data)
            debouncedSearch(selectedOption.value)
          }
        } else {
          setInputValue(realInputValue)
          inputValueRef.current = realInputValue
        }

        // 来自历史搜索的下拉列表选中，直接跳转
        if (option?.key?.includes('history-')) {
          gotoSearch(option?.value)
          setInputValue(option?.value)
          inputValueRef.current = option?.value
        }
      },
      [searchOptions, onChange, realInputValue]
    )

    // 处理聚焦事件
    const handleFocus = useCallback(async () => {
      setIsFocused(true)
      if (!historyList?.length) {
        getSearchHistory()
      }
      // 在 auto 模式下，如果输入框为空，应该显示历史搜索
      if (searchMode === 'auto' && (!inputValueRef.current || inputValueRef.current.trim() === '')) {
        // 确保清空搜索选项，显示历史搜索
        setSearchOptions([])
        return
      }
    }, [historyList, searchMode])

    // 处理失焦事件
    const handleBlur = useCallback(() => {
      setIsFocused(false)
    }, [])

    useEffect(() => {
      if (initialValue) {
        debouncedSearch(initialValue)
        inputValueRef.current = initialValue
        setRealInputValue(initialValue)
      }

      // 如果搜索模式为select，则初始先获取历史搜索记录
      if (searchMode === 'select') {
        getSearchHistory()
      }
    }, [initialValue, debouncedSearch])

    // 计算是否显示清除按钮
    const shouldShowClear = useMemo(() => {
      // 只有在聚焦状态下才显示清除按钮
      if (!isFocused) {
        return false
      }

      // 聚焦时，有输入值或有初始值就显示清除按钮
      return !!(inputValueRef.current || initialValue)
    }, [isFocused, initialValue])

    // 修改 handleChange 逻辑，保持 inputValue 受控
    const handleChange = useCallback(
      (value: any) => {
        const val = value.replace(/\\|↵|<|>/g, '') // 过滤非法字符
        setInputValue(val)
        setRealInputValue(val)
        // 只更新 ref，不触发重新渲染
        inputValueRef.current = val
        // 只在需要显示/隐藏清除按钮时才更新状态
        const shouldShowClear = !!val
        if (shouldShowClear !== showClear) {
          setShowClear(shouldShowClear)
        }
        // onChange?.(val, selectedOption?.data?.corpId, selectedOption?.data)
      },
      [selectedOption, showClear, onChange]
    )

    // 下拉数据渲染
    const children = useMemo(() => {
      // 1. 历史数据渲染
      // 1.1 普通模式
      if (searchMode !== 'select') {
        const historyOptions = historyList?.map((item: any, idx: number) => {
          const historyLabel = (
            <Option key={`history-${item?.corpId}-${idx}`} value={item?.corpName} data={item} label={item?.corpName}>
              <CorpSearchRow
                onClick={() => {
                  // onClickHistory?.(item?.corpName)
                }}
                item={{
                  corpName: item?.corpName,
                }}
                onlyLabel={true}
              />
            </Option>
          )
          if (!idx) {
            return (
              <>
                <Option key={-1} value={-1} data={-1} disabled>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      width: '100%',
                    }}
                  >
                    <span style={{ color: '#666' }}>{t('437396', '历史搜索')}</span>
                    <span
                      style={{ cursor: 'pointer', color: '#666' }}
                      onClick={() => {
                        deleteSearchHistory()
                      }}
                    >
                      {/* @ts-ignore */}
                      <DeleteO />
                      <span style={{ marginLeft: 4 }}>{t('232203', '删除')}</span>
                    </span>
                  </div>
                </Option>
                {historyLabel}
              </>
            )
          }
          return historyLabel
        })
        if (needHistory && !realInputValue?.trim?.() && historyOptions.length > 0) {
          setDropdownClassName('history-dropdown-select')
          return historyOptions
        }
      } else {
        // 1.2 多选模式
        if (needHistory && !realInputValue?.trim?.() && historyList?.length > 0) {
          if (searchMode === 'select') {
            // 在 select 模式下，使用 searchInputValue 来判断
            const hasSearchInput = searchInputValue?.trim() !== ''
            if (hasSearchInput) {
              setDropdownClassName('')
              // 在 select 模式下，如果输入框有值，则返回搜索结果
              return searchOptions
            } else {
              setDropdownClassName('history-dropdown-select')
              const historyLists = historyList.map((item: any, idx: number) => {
                return {
                  key: `history-${item?.corpId}-${idx}`,
                  value: item.corpName,
                  data: item,
                  label: item.corpName,
                }
              })
              // 插入历史记录固定文描
              const hisList: any = [
                {
                  key: 'history-delete',
                  value: t('437396', '历史搜索'),
                  data: t('437396', '历史搜索'),
                  label: t('437396', '历史搜索'),
                  disabled: true,
                },
                ...historyLists,
              ]
              setSelectedHistoryList(hisList)
              return hisList
            }
          }
        }
      }

      // 2. 搜索数据渲染
      setDropdownClassName('')
      const searchOptionLists = searchOptions.map((item) => {
        return (
          // @ts-ignore
          <Option key={item.id} value={item.value} data={item.data} label={item.data}>
            <CorpSearchRow
              item={item.data}
              onClick={() => {
                onClickItem?.(item.data)
                item?.value && debouncedSearch(item?.value)
              }}
            />
          </Option>
        )
      })

      if (searchMode === 'select') {
        // 在 select 模式下，确保返回的是searchOptions
        return searchOptions
      } else {
        // 普通输入模式下，返回searchOptionLists
        return searchOptionLists
      }
    }, [searchOptions, historyList, inputValueRef, searchMode, searchInputValue, realInputValue])

    // 监听搜索选项变化，动态设置下拉框宽度
    // 这里后续看如何优化，单纯通过组件和样式的调整无法实现，会导致先输入长文本、再输入短文本、再输入长文本时，宽度无法撑开
    useEffect(() => {
      if (searchOptions.length > 0) {
        // 延迟执行，确保 DOM 已经更新
        const timeoutId = setTimeout(() => {
          try {
            // 使用唯一标识符精确定位当前组件的下拉框
            const dropdown = document.querySelector(`.${componentId}-dropdown-auto`) as HTMLElement
            if (dropdown) {
              // 计算所有选项的最大宽度
              const options = dropdown.querySelectorAll('.w-select-item')
              let maxWidth = 0

              options.forEach((option) => {
                const optionContent = option.querySelector('.w-select-item-option-content') as HTMLElement
                if (optionContent) {
                  // 创建一个临时元素来测量真实宽度
                  const tempElement = optionContent.cloneNode(true) as HTMLElement
                  tempElement.style.position = 'absolute'
                  tempElement.style.visibility = 'hidden'
                  tempElement.style.width = 'auto'
                  tempElement.style.whiteSpace = 'nowrap'
                  tempElement.style.overflow = 'visible'
                  tempElement.style.padding = '0'
                  tempElement.style.margin = '0'

                  document.body.appendChild(tempElement)
                  const width = tempElement.scrollWidth
                  document.body.removeChild(tempElement)

                  maxWidth = Math.max(maxWidth, width)
                }
              })

              // 设置下拉框宽度，确保不小于输入框宽度
              const contentWidth = maxWidth + 48 // 48px 为左右padding和边框
              const finalWidth = typeof minWidth === 'number' ? Math.max(contentWidth, minWidth) : contentWidth

              // 使用 requestAnimationFrame 确保动画流畅
              requestAnimationFrame(() => {
                dropdown.style.width = `${finalWidth}px`
              })
            }
          } catch (error) {
            console.error('设置下拉框宽度时出错:', error)
          }
        }, 50) // 增加延迟时间，确保渲染完成

        // 清理函数
        return () => {
          clearTimeout(timeoutId)
        }
      }
    }, [searchOptions, componentId])

    // 回车事件 + 点击搜索图标事件
    const handleSearchEnter = (e) => {
      const val = inputValueRef?.current?.trim()
      if (val === '') {
        return
      }
      // 固定输入框的值
      setInputValue(inputValueRef.current)
      setRealInputValue(inputValueRef.current)
      gotoSearch(inputValueRef.current)
      e.preventDefault()
    }

    // 跳转搜索
    // 1. 需保存历史记录
    // 2. 可选，调用父组件的回调函数
    const gotoSearch = (val) => {
      if (val?.trim() === '') {
        return
      }
      // 通过键盘上下键选中后，状态赋值异步，直接读取获取不到val
      // 延时5ms后读取 inputValueRef.current 的值，然后执行后续动作
      setTimeout(() => {
        const currentValue = inputValueRef.current
        if (currentValue?.trim()) {
          saveSearchHistory(currentValue) // 插入历史搜索
          onClickHistory?.(currentValue)
          debouncedSearch(currentValue)
          setIsFocused(false)
        }
      }, 5)
    }

    return searchMode === 'auto' ? (
      <AutoComplete
        className={styles.corpPresearch}
        dataSource={children as any}
        value={inputValue}
        onSearch={debouncedSearch}
        onChange={handleChange}
        onSelect={handleSelect}
        defaultActiveFirstOption={false}
        dropdownClassName={
          widthAuto
            ? ` ${isEn() ? 'corp-pre-search-dropdown-en' : ''} corp-pre-search-dropdown-auto ${componentId}-dropdown-auto ${dropdownClassName}`
            : ` ${isEn() ? 'corp-pre-search-dropdown-en' : ''} corp-pre-search-dropdown ${componentId}-dropdown ${dropdownClassName}`
        }
        placement={placement}
        style={{ width: minWidth }}
        virtual={false}
      >
        <Input
          value={realInputValue}
          allowClear={withClear ? shouldShowClear : false}
          placeholder={placeholder}
          suffix={
            withSearch ? (
              // @ts-expect-error
              <SearchO
                onClick={(e) => {
                  handleSearchEnter(e)
                }}
              />
            ) : null
          }
          onPressEnter={(e) => {
            handleSearchEnter(e)
          }}
          // suffix={withSearch ? !inputValueRef.current || !shouldShowClear ? <SearchO /> : null : null}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // open={true}
        />
      </AutoComplete>
    ) : (
      <Select
        mode="multiple"
        className={styles.corpPresearch}
        onSearch={debouncedSearch}
        onChange={handleChangeForSelect}
        dropdownClassName={
          widthAuto
            ? ` ${isEn() ? 'corp-pre-search-dropdown-en' : ''} corp-pre-search-dropdown-auto corp-pre-search-dropdown-select ${componentId}-dropdown-auto ${dropdownClassName}`
            : ` ${isEn() ? 'corp-pre-search-dropdown-en' : ''} corp-pre-search-dropdown corp-pre-search-dropdown-select ${componentId}-dropdown ${dropdownClassName}`
        }
        placement={placement}
        style={{ width: minWidth }}
        showSearch
        allowClear
        filterOption={false}
        maxTagCount="responsive"
        options={children as any}
        optionLabelProp="value"
        value={selectedValues}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        virtual={false}
      ></Select>
    )
  }
)

CorpPresearch.displayName = 'CorpPresearch'
