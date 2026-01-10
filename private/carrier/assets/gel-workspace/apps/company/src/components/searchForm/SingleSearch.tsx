import classNames from 'classnames'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { outCompanyParam } from '../../handle/searchConfig'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import { useRecentView } from '../../hooks/useRecentView'
import intl from '../../utils/intl'
import { HistoryAndRecentView, ResultList } from './searchList'
import { SearchFormBaseProps } from './type'
import { Input } from '@wind/wind-ui'

let searchtimer = null

const MODAL_CLASS_NAME = '.wind-modal' // 弹窗类名,当有弹窗打开时，不收起下拉列表
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

  onFetchHistory,
  onClearHistory,
  onAddHistoryItem,
  onDeleteHistoryItem,
  recentViewList: externalRecentViewList, // 外部传入的最近浏览列表数据
  onRecentViewItemClick,
  onFetchRecentView,
  onAddRecentViewItem,
  onClearRecentView,
  onDeleteRecentViewItem,
  withLogo = false, // 是否显示logo
}) => {
  const { historyList, showHistory, setShowHistory, fetchHistory, addHistoryItem, clearHistory, deleteHistoryItem } =
    useSearchHistory({
      onFetchHistory,
      onAddHistoryItem,
      onClearHistory,
      onDeleteHistoryItem,
    })

  const {
    recentViewList: internalRecentViewList,
    fetchRecentView,
    deleteRecentViewItem,
    clearRecentView,
    addRecentViewItem,
  } = useRecentView({
    onFetchRecentView,
    onAddRecentViewItem,
    onClearRecentView,
    onDeleteRecentViewItem,
  })

  // 优先使用外部传入的最近浏览数据，如果没有则使用内部管理的数据
  const recentViewList = externalRecentViewList || internalRecentViewList

  const didMountRef = useRef(null) // 用于标记组件是否已挂载，防止useEffect在首次渲染时执行

  const [suggestions, setSuggestions] = useState([]) // 下拉列表（搜索建议或历史记录）展示的数据
  const [listFlag, setListFlag] = useState(false) // 控制下拉列表的显示与隐藏
  const [selectCountry, setSelectCountry] = useState({ name: intl('138649', '不限'), value: '' }) // 当前选中的国家
  const [countryListFlag, setCountryListFlag] = useState(false) // 控制国家选择下拉列表的显示与隐藏

  const [searchValue, setSearchValue] = useState('') // 搜索输入框的值
  const mouseDownInsideListRef = useRef(false)

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const insideList = !!target.closest('.input-toolbar-search-list') || !!target.closest('.history-recent-container')
      mouseDownInsideListRef.current = insideList
    }
    document.addEventListener('mousedown', handleDocumentMouseDown, true)
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown, true)
  }, [])

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
  const focusHandle = (searchValue) => {
    setListFlag(true) // 显示下拉列表
    // 当输入框内容为空时，才尝试显示历史记录和最近浏览
    if (searchValue.length === 0) {
      setShowHistory(true)
      if (onFetchHistory) {
        fetchHistory() // 获取历史记录
      }
      // 如果没有外部传入最近浏览数据，则自动获取
      if (!externalRecentViewList) {
        fetchRecentView() // 获取最近浏览
      }
    }

    // 聚焦时若已有输入内容，则重新触发搜索
    if (searchValue.length > 1) {
      changeHandle(searchValue)
    }
  }

  /**
   * 输入框失焦事件处理
   */
  const blurHandle = (e: any) => {
    // 如果正在点击列表区域或容器，阻止关闭
    if (mouseDownInsideListRef.current) {
      // 在下一轮事件循环后重置标记
      setTimeout(() => {
        mouseDownInsideListRef.current = false
      }, 0)
      return
    }
    // 延迟隐藏下拉列表，以确保下拉列表中的点击事件能被触发
    setTimeout(() => {
      // 若有弹窗（Modal）打开，保持列表可见，避免因焦点转移到弹窗而收起
      const hasOpenModal = document.querySelector(MODAL_CLASS_NAME) !== null
      if (hasOpenModal) return

      setListFlag(false)
    }, 150)
  }

  // 已移除未使用的 clearHandle 以消除未使用变量的 lint 报错

  /**
   * 输入框内容变化事件处理 (使用setTimeout进行防抖)
   * 1. 字符数 > 1: 进行搜索
   * 2. 字符数 = 1: 隐藏下拉列表
   * 3. 字符数 = 0: 显示历史记录
   */
  const changeHandle = useCallback(
    (val) => {
      console.log('changeHandle - val:', val)
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
          focusHandle(value) // 触发聚焦逻辑以显示历史记录
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
   * 最近浏览项点击事件处理
   * @param item 被点击的最近浏览项
   */
  const recentViewItemClickHandle = (item) => {
    // 调用外部回调，如果有的话,添加最近浏览记录
    if (onRecentViewItemClick) {
      onRecentViewItemClick(item)
      addRecentViewItem(item.entityId, item.parameter)
    } else {
      // 如果没有外部回调，回填搜索框的值并隐藏下拉列表

      setSearchValue(item.entityName)
      setListFlag(false) // 隐藏下拉列表
    }
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
  const searchSubmit = (searchValue) => {
    if (searchValue.length === 0) {
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
            <div className="search-sel-val" onClick={() => selectBtnHandle()} data-uc-id="rR9q57K93K" data-uc-ct="div">
              <span className="search-selcoutry-name">{selectCountry.name}</span>
              <i></i>
            </div>
            {countryListFlag && (
              <div className="search-sel-drop">
                <h3>{intl('478637', '选择国家或地区')}</h3>
                <div className="search-sel-list">
                  {outCompanyParam
                    .map((i) => ({
                      value: i.param,
                      name: intl(i.typeid, i.type),
                    }))
                    .map((item) => {
                      return (
                        <span
                          key={item.value}
                          className="item-search-list"
                          onClick={() => changeCountry(item)}
                          data-uc-id="CaLRchZ2fg"
                          data-uc-ct="span"
                          data-uc-x={item.value}
                        >
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
        <Input.Search
          type="text"
          className={'txt_search' + (showSelect ? ' show_select_txt_search' : '')}
          placeholder={placeHolder}
          allowClear
          onChange={(e) => {
            changeHandle(e.target.value)
          }}
          onFocus={(e) => {
            focusHandle((e.target as HTMLInputElement)?.value)
          }}
          onBlur={(e) => blurHandle(e)}
          onSearch={(value) => searchSubmit(value)}
          value={searchValue}
          data-uc-id="gyeky0d2Hv"
          data-uc-ct="input"
        />
        {/* 展示下拉框列表 */}
        {showHistory ? (
          <HistoryAndRecentView
            historyList={historyList}
            onHistoryItemClick={itemClickHandle}
            onClearHistory={clearHistory}
            onDeleteHistoryItem={deleteHistoryItem}
            recentViewList={recentViewList}
            onRecentViewItemClick={recentViewItemClickHandle}
            onClearRecentView={clearRecentView}
            onDeleteRecentViewItem={deleteRecentViewItem}
            listFlag={listFlag}
            data-uc-id="vs1tQsQS0d"
            data-uc-ct="historyAndRecentView"
          />
        ) : (
          <ResultList
            list={suggestions}
            onItemClick={itemClickHandle}
            listFlag={listFlag}
            withLogo={withLogo}
            data-uc-id="vs1tQsQS0d"
            data-uc-ct="resultlist"
          />
        )}
      </div>
    </div>
  )
}

export default SingleSearch
