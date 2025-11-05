import classNames from 'classnames'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { outCompanyParam } from '../../handle/searchConfig'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import intl from '../../utils/intl'
import SearchList from './searchList'
import { SearchFormBaseProps } from './type'

let searchtimer = null

/**
 * 单一搜索框组件
 * @param props 组件属性
 * @returns
 */
const SingleSearch: FC<SearchFormBaseProps> = ({
  searchList, // 外部传入的搜索建议列表
  placeHolder, // 输入框的提示信息
  searchRequest, // 搜索请求的方法
  goSearchListDetail, // 点击搜索结果或搜素按钮跳转列表页的方法
  showSelect, // 是否显示国家/地区选择器
  historyAddTiming, // 历史记录存储时机，'click'表示点击时存储
  className, // 自定义容器类名
  searchText, // 搜索按钮的文本
  searchBtnClassName, // 搜索按钮的自定义类名
  onFetchHistory,
  onClearHistory,
  onAddHistoryItem,
}) => {
  const { historyList, showHistory, setShowHistory, fetchHistory, addHistoryItem, clearHistory } = useSearchHistory({
    onFetchHistory,
    onAddHistoryItem,
    onClearHistory,
  })

  const didMountRef = useRef(null) // 用于标记组件是否已挂载，防止useEffect在首次渲染时执行
  const inputRef = useRef(null) // 对input元素的引用
  const [clearIcon, setClearIcon] = useState(false) // 是否显示输入框的清除按钮
  const [searchValue, setSearchValue] = useState('') // 搜索输入框的值
  const [suggestions, setSuggestions] = useState([]) // 下拉列表（搜索建议或历史记录）展示的数据
  const [listFlag, setListFlag] = useState(false) // 控制下拉列表的显示与隐藏
  const [selectCountry, setSelectCountry] = useState({ name: intl('138649', '不限'), value: '' }) // 当前选中的国家
  const [countryListFlag, setCountryListFlag] = useState(false) // 控制国家选择下拉列表的显示与隐藏

  useEffect(() => {
    // 根据输入框内容判断是否显示清除按钮
    if (searchValue.length > 0) {
      setClearIcon(true)
    } else {
      setClearIcon(false)
    }
  }, [searchValue])

  useEffect(() => {
    // 当外部传入的搜索建议列表`searchList`更新时，同步更新到组件内部的`list`
    if (didMountRef.current) {
      setShowHistory(false) // 有搜索建议时，不显示历史记录
      setSuggestions(searchList)
    } else {
      didMountRef.current = true
    }
  }, [searchList])

  /**
   * 输入框聚焦事件处理
   */
  const focusHandle = () => {
    setListFlag(true) // 显示下拉列表
    // 当输入框内容为空时，才尝试显示历史记录
    if (onFetchHistory && searchValue.length === 0) {
      setShowHistory(true)
      fetchHistory() // 可按需在聚焦时重新获取历史记录
    }

    // 聚焦时若已有输入内容，则重新触发搜索
    if (searchValue.length > 1) {
      changeHandle(searchValue)
    }
  }

  /**
   * 输入框失焦事件处理
   */
  const blurHandle = () => {
    // 延迟隐藏下拉列表，以确保下拉列表中的点击事件能被触发
    setTimeout(() => {
      setListFlag(false)
    }, 200)
  }

  /**
   * 点击清除按钮事件处理
   */
  const clearHandle = () => {
    setSearchValue('')
    setListFlag(false)
    setShowHistory(true)
    fetchHistory()
  }

  /**
   * 输入框内容变化事件处理 (使用setTimeout进行防抖)
   * 1. 字符数 > 1: 进行搜索
   * 2. 字符数 = 1: 隐藏下拉列表
   * 3. 字符数 = 0: 显示历史记录
   */
  const changeHandle = useCallback(
    (val) => {
      let value = val || ''
      value = value.replace(/\\|↵|<|>/g, '') // 过滤非法字符
      // 注：这里必须先设置searchValue，否则在部分输入法如微软拼音输入法下，输入不了中文
      setSearchValue(value)
      if (value) {
        value = value.trimStart()
        value = value.trimEnd()
      }
      setListFlag(true)
      clearTimeout(searchtimer)
      searchtimer = setTimeout(() => {
        if (value.length > 1) {
          setShowHistory(false)
          searchRequest?.({
            key: value,
            country: selectCountry.value,
            callback: (data) => {
              if (data.length > 0 && historyAddTiming !== 'click') {
                addHistoryItem(value)
              }
            },
          })
        } else if (value.length === 1) {
          setListFlag(false)
        } else {
          setSuggestions([])
          focusHandle() // 触发聚焦逻辑以显示历史记录
        }
      }, 500)
    },
    [historyAddTiming, searchRequest, selectCountry.value]
  )

  /**
   * 下拉列表项（搜索建议或历史记录）点击事件处理
   * @param item 被点击的项
   */
  const itemClickHandle = (item) => {
    if (historyAddTiming === 'click') {
      const key = (item.name || item.corp_name || item.corpName)?.replace(/(<([^>]+)>)/gi, '')
      const value = item.value
      addHistoryItem(key, value)
    }
    goSearchListDetail({ ...item, country: selectCountry.value, searchFlag: showHistory ? 'history' : '' })
  }

  /**
   * 展开/关闭国家选择器
   */
  const selectBtnHandle = () => {
    setCountryListFlag(!countryListFlag)
  }

  /**
   * 切换国家
   * @param item 选中的国家对象
   */
  const changeCountry = (item) => {
    setSelectCountry(item)
    setCountryListFlag(false)
  }

  /**
   * 提交搜索（点击按钮或按回车）
   * @param e 事件对象
   */
  const searchSubmit = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') {
      return
    }
    if (searchValue.length === 0) {
      inputRef.current.focus()
      return
    }

    if (historyAddTiming === 'click') {
      addHistoryItem(searchValue.replace(/(<([^>]+)>)/gi, ''), '')
    }

    goSearchListDetail({ name: searchValue, country: selectCountry.value, searchFlag: 'btn' })
  }

  return (
    <div className={classNames('search-area', className)}>
      <div className={showSelect ? 'search-inputarea search-select-inputarea' : 'search-inputarea'}>
        {showSelect && (
          <div className="search-sel-country">
            <div className="search-sel-val" onClick={() => selectBtnHandle()}>
              <span className="search-selcoutry-name">{selectCountry.name}</span>
              <i></i>
            </div>
            {countryListFlag && (
              <div className="search-sel-drop">
                <h3>{intl('209760', '选择国家或地区')}</h3>
                <div className="search-sel-list">
                  {outCompanyParam
                    .map((i) => ({
                      value: i.param,
                      name: intl(i.typeid, i.type),
                    }))
                    .map((item) => {
                      return (
                        <span key={item.value} className="item-search-list" onClick={() => changeCountry(item)}>
                          {item.name}
                        </span>
                      )
                    })}
                </div>
                <div style={{ color: '#aaa' }}>
                  {window.en_access_config
                    ? 'Chinese companies, please search in " Company " '
                    : '中国企业请在"查企业"中进行搜索'}{' '}
                </div>
              </div>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          className="txt_search"
          placeholder={placeHolder}
          onChange={(e) => changeHandle(e.target.value)}
          onFocus={() => focusHandle()}
          onBlur={() => blurHandle()}
          onKeyDown={(e) => searchSubmit(e)}
        />
        {/* 展示下拉框列表 */}
        <SearchList
          list={showHistory ? historyList : suggestions}
          onItemClick={itemClickHandle}
          listFlag={listFlag}
          showSearchHistoryFlag={showHistory}
          onClearHistory={clearHistory}
        />
        <a
          className={classNames('btn_search', 'btn-default-primary', searchBtnClassName)}
          onClick={() => searchSubmit()}
        >
          {searchText || intl('121124', '搜一下')}
        </a>
        {clearIcon && (
          <span className="input-toolbar-clear-btn" onClick={() => clearHandle()}>
            &zwj;
          </span>
        )}
      </div>
    </div>
  )
}

export default SingleSearch
