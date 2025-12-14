import { Input, message } from '@wind/wind-ui'
import classNames from 'classnames'
import { CorpGlobalPreSearchResultV1Parsed, SearchHistoryParsed } from 'gel-api/*'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import { useRecentView } from '../../hooks/useRecentView'
import intl from '../../utils/intl'
import { HistoryAndRecentView, ResultList } from './searchList'
import { SearchFormProps } from './type'
import { decryptSearchHistory, encryptSearchHistory } from './util'

let serachtimer = null
const COMPANYONE = 'comapnyOne' // 用于判断输入框
const COMPANYTWO = 'comapnyTwo' // 用于判断输入框

function MultiSearch(props: SearchFormProps) {
  const {
    searchList,
    placeHolder,
    searchRequest,
    goSearchListDetail, // 点击搜索结果或者搜素按钮跳转列表页的方法
    historyAddTiming, // 用于判断存储历史记录的操作，是change的时候还是click的时候，默认chagnge
    className,
    // searchBtnClassName,
    searchRelationIconClassName,
    onFetchHistory,
    onAddHistoryItem,
    onClearHistory,
    onDeleteHistoryItem,
    recentViewList: externalRecentViewList = [], // 最近浏览列表数据
    onRecentViewItemClick,
    onFetchRecentView,
    onAddRecentViewItem,
    onClearRecentView,
    onDeleteRecentViewItem,
  } = props

  const { historyList, showHistory, setShowHistory, addHistoryItem, clearHistory, fetchHistory, deleteHistoryItem } =
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
  } = useRecentView({
    onFetchRecentView,
    onAddRecentViewItem,
    onClearRecentView,
    onDeleteRecentViewItem,
  })

  // 优先使用外部传入的最近浏览数据，如果没有则使用内部管理的数据
  const recentViewList = externalRecentViewList.length > 0 ? externalRecentViewList : internalRecentViewList

  const didMountRef = useRef(null)
  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchRelationValue, setSearchRelationValue] = useState('')
  const [suggestions, setSuggestions] = useState([]) // 下拉列表展示的list
  const [listFlag, setListFlag] = useState(false) // 隐藏或者展示下拉列表的list
  const [inputType, setInputType] = useState('') // 用于判断多input输入框
  const [clickActiveInfo, setClickActiveInfo] = useState<CorpGlobalPreSearchResultV1Parsed>(null) // 记录选中公司的所有信息
  const [clickActiveRelationInfo, setClickActiveRelationInfo] = useState<CorpGlobalPreSearchResultV1Parsed>(null) // 记录选中关联公司的所有信息
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
    if (didMountRef.current) {
      setListFlag(true)
      setShowHistory(false)
      setSuggestions(searchList)
    } else {
      didMountRef.current = true
    }
  }, [searchList])

  // 聚焦
  const focusHandle = (flag = '') => {
    let value = ''
    if (flag === COMPANYONE) {
      value = searchValue
      setInputType(COMPANYONE)
    } else if (flag === COMPANYTWO) {
      value = searchRelationValue
      setInputType(COMPANYTWO)
    }
    setListFlag(true)
    setSuggestions([])
    // input值长度等于0才显示历史记录和最近浏览
    if (!searchValue && !searchRelationValue) {
      setShowHistory(true)
      if (onFetchHistory) {
        fetchHistory()
      }
      // 如果没有外部传入最近浏览数据，则自动获取
      if (externalRecentViewList.length === 0) {
        fetchRecentView()
      }
    }

    // 聚焦时如果有输入值则重新发起请求
    if (value && value.length > 1) {
      changeRequest(value)
    }
  }

  // 失焦
  const blurHandle = (e: any) => {
    if (mouseDownInsideListRef.current) {
      setTimeout(() => {
        mouseDownInsideListRef.current = false
      }, 0)
      return
    }
    const hasOpenModal = document.querySelector('.ant-modal-root, .ant-modal-wrap, .wind-modal, .gel-modal') !== null
    if (hasOpenModal) return
    setTimeout(() => {
      const related = (e && (e as any).relatedTarget) as HTMLElement | null
      if (related) {
        const insideList =
          !!related.closest('.input-toolbar-search-list') || !!related.closest('.history-recent-container')
        if (insideList) return
      }
      setListFlag(false)
    }, 100)
  }

  /**
   * input值数量：
   * 1.大于两个搜索
   * 2.一个隐藏下拉框
   * 3.空展示历史记录
   *
   */
  const changeHandle = (value) => {
    if (inputType === COMPANYTWO) {
      setSearchRelationValue(value)
    } else {
      setSearchValue(value)
    }
    clearTimeout(serachtimer)
    if (value.length > 1) {
      serachtimer = setTimeout(function () {
        changeRequest(value)
      }, 500)
    } else if (value.length === 1) {
      setListFlag(false)
    } else {
      setSuggestions([])
      // value is empty here. Check the other input to decide if we should show history.
      const otherInputIsEmpty = inputType === COMPANYONE ? !searchRelationValue : !searchValue
      if (onFetchHistory && otherInputIsEmpty) {
        setShowHistory(true)
        fetchHistory()
      }
    }
  }

  // 输入框的请求
  const changeRequest = (value) => {
    setShowHistory(false)
    searchRequest({
      key: value,
      callback: (data) => {
        if (data.length > 0 && historyAddTiming !== 'click') {
          addHistoryItem(value)
        }
      },
    })
  }

  // 搜索列表和历史记录的单击事件
  const itemClickHanle = (item: CorpGlobalPreSearchResultV1Parsed | SearchHistoryParsed[number]) => {
    if (!item) {
      console.error('itemClickHanle', item)
      return
    }
    if (showHistory) {
      const searchHistory = item as SearchHistoryParsed[number]
      const { nameFirst, nameSecond, valueFirst, valueSecond } = decryptSearchHistory(
        searchHistory.name,
        searchHistory.value
      )
      const clickActiveInfo = { corpNameTxt: nameFirst, corpId: valueFirst } as CorpGlobalPreSearchResultV1Parsed
      const clickActiveRelationInfo = {
        corpNameTxt: nameSecond,
        corpId: valueSecond,
      } as CorpGlobalPreSearchResultV1Parsed
      setClickActiveInfo(clickActiveInfo)
      setClickActiveRelationInfo(clickActiveRelationInfo)
      setSearchValue(clickActiveInfo.corpNameTxt)
      setSearchRelationValue(clickActiveRelationInfo.corpNameTxt)
      serachSubmit(searchHistory, 'history')
    } else if ('corpNameTxt' in item) {
      if (inputType === COMPANYTWO) {
        setSearchRelationValue(item.corpNameTxt)
        setClickActiveRelationInfo(item)
      } else {
        setSearchValue(item.corpNameTxt)
        setClickActiveInfo(item)
      }
    } else {
      console.error('itemClickHanle', item)
    }
  }

  // 最近浏览项点击事件处理
  const recentViewItemClickHandle = (item) => {
    // 在MultiSearch中，我们暂时只是调用外部回调
    // 因为MultiSearch需要两个公司信息，而最近浏览只有一个
    if (onRecentViewItemClick) {
      onRecentViewItemClick(item)
    } else {
      // 如果没有外部回调，隐藏列表
      setListFlag(false)
    }
  }

  // 点击搜索按钮
  const serachSubmit: (data?: any, flag?: 'btn' | 'history') => void = (data?, flag = 'btn') => {
    message.destroy()
    if (!data && (searchValue.length === 0 || searchRelationValue.length === 0)) {
      message.info(intl('417182', '请选择双方企业'))
      return
    }

    if (!data) {
      const { name, value } = encryptSearchHistory({
        nameFirst: clickActiveInfo?.corpNameTxt,
        nameSecond: clickActiveRelationInfo?.corpNameTxt,
        valueFirst: clickActiveInfo?.corpId,
        valueSecond: clickActiveRelationInfo?.corpId,
      })
      addHistoryItem(name, value)
    }

    const companyInfo = data?.clickActiveInfo || clickActiveInfo
    const companyRelationInfo = data?.clickActiveRelationInfo || clickActiveRelationInfo
    goSearchListDetail({ clickActiveInfo: companyInfo, clickActiveRelationInfo: companyRelationInfo, searchFlag: flag })
  }

  return (
    <React.Fragment>
      <div className={classNames('multi-search-area', className)}>
        <div className="search-relation-from-wrap">
          <div className="search-relation-from">
            <Input.Search
              ref={inputRef}
              type="text"
              value={searchValue}
              className="txt_search hide-search-icon"
              placeholder={placeHolder}
              onChange={(e) => changeHandle(e.target.value)}
              onFocus={() => focusHandle(COMPANYONE)}
              onBlur={(e) => blurHandle(e)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') serachSubmit()
              }}
              data-uc-id="rtdSzkG5h"
              data-uc-ct="input"
            />
            {!showHistory && inputType === COMPANYONE && (
              <ResultList
                list={suggestions}
                onItemClick={itemClickHanle}
                listFlag={listFlag}
                showTag={true}
                data-uc-id="Ak6Qbur-zy"
                data-uc-ct="resultlist"
              />
            )}
          </div>
          <span className={classNames('icon-search-relation', searchRelationIconClassName)}></span>
          <div className="search-relation-from">
            <Input.Search
              type="text"
              value={searchRelationValue}
              className="txt_search"
              placeholder={placeHolder}
              onChange={(e) => changeHandle(e.target.value)}
              onFocus={() => focusHandle(COMPANYTWO)}
              onBlur={(e) => blurHandle(e)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') serachSubmit()
              }}
              onSearch={(value) => serachSubmit(value)}
              data-uc-id="oPQnXyir-y"
              data-uc-ct="input"
            />
            {!showHistory && inputType === COMPANYTWO && (
              <ResultList
                list={suggestions}
                onItemClick={itemClickHanle}
                listFlag={listFlag}
                showTag={true}
                data-uc-id="WWm302GaN0"
                data-uc-ct="resultlist"
              />
            )}
          </div>
          {/* <a
            className={classNames('btn_search', 'btn-default-primary', searchBtnClassName)}
            onClick={() => serachSubmit()}
          >
            {intl('425436', '查询')}
          </a> */}
          {showHistory && (
            <HistoryAndRecentView
              historyList={historyList}
              onHistoryItemClick={itemClickHanle}
              onClearHistory={clearHistory}
              onDeleteHistoryItem={deleteHistoryItem}
              recentViewList={recentViewList}
              onRecentViewItemClick={recentViewItemClickHandle}
              onClearRecentView={clearRecentView}
              onDeleteRecentViewItem={deleteRecentViewItem}
              listFlag={listFlag}
              data-uc-id="lj5bKzhj0R"
              data-uc-ct="historyAndRecentView"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default MultiSearch
