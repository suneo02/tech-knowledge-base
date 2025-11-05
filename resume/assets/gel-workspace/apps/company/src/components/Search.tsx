import { getPreCompanySearch, getPreGroupSearch } from '@/api/homeApi'
import { request } from '@/api/request'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { isDeveloper } from '@/utils/common.ts'
import { DeleteO } from '@wind/icons'
import { Input } from '@wind/wind-ui'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import * as searchListAction from '../actions/searchList'
import { parseQueryString } from '../lib/utils'
import intl from '../utils/intl'
import { debounce, wftCommon } from '../utils/utils'
import './Header.less'
import InnerHtml from './InnerHtml'

const Search = Input.Search
//再次封装防抖函数
const debounceSearch = debounce((key, fn) => {
  getPreCompanySearch({
    queryText: key,
    // pageNo: 1,
    // pageSize: 5,
  }).then((res) => {
    return fn(res?.Data?.search)
  })
}, 300)
const debounceSearchGroup = debounce((key, fn) => {
  getPreGroupSearch({
    key,
    pageNo: 0,
    pageSize: 5,
  }).then((res) => {
    return fn(res?.Data?.list || [])
  })
}, 300)

// 自定义图标
function MySearch(props) {
  const qsParam = parseQueryString()
  let urlSearch = qsParam['keyword'] || ''
  urlSearch = window.decodeURIComponent(urlSearch)
  const [isFocused, setIsFocused] = useState(false)
  const [hasHistoryList, setHasHistoryList] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchGroupResults, setSearchGroupResults] = useState([])
  const [searchValue, setSearchValue] = useState(urlSearch)
  const [searchBtnShow, setSearchBtnShow] = useState(true)
  const [, setIsHovering] = useState(false)
  const [historyKeys, setHistoryKeys] = useState<any>(0)
  const [historyComs, setHistoryComs] = useState<string[]>([])

  const SearchRef = useRef()
  const currentSearchRef = useRef('')

  useEffect(() => {
    keyDown()
  }, [])
  const keyDown = useCallback(() => {
    window.addEventListener('keydown', onKeyDown)
  }, [hasHistoryList, historyKeys])
  //发送查公司请求
  const gotoComList = (key) => {
    currentSearchRef.current = key
    debounceSearch(key, (results) => {
      if (currentSearchRef.current === key) {
        setSearchResults(results)
      }
    })
  }
  //发送查集团请求
  const gotoGroupList = (key) => {
    currentSearchRef.current = key
    debounceSearchGroup(key, (results) => {
      if (currentSearchRef.current === key) {
        setSearchGroupResults(results)
      }
    })
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }
  //保存历史搜索
  const saveSearchHistory = (val: string) => {
    if (!val) return
    addSearchHistory('HOME_HEADER_SEARCH', val)
  }

  useEffect(() => {
    if (props.companyName) {
      setSearchValue(props.companyName)
    }
    // 00sdaw
  }, [props.companyName])

  const SearchRow: FC<{
    showMatchType: boolean
    id: string
    name: string
    corpNameEng?: string
    aiTransFlag?: boolean
    matchType?: string
    highLightName?: string
  }> = ({ showMatchType, id, name, corpNameEng, aiTransFlag, matchType, highLightName }) => {
    return (
      <div
        className="searchRow"
        onClick={() => {
          if (isDeveloper && window.location.hash.includes('companyDetailAIRight')) {
            return window.open(
              getUrlByLinkModule(LinksModule.CompanyDetailAI, {
                params: {
                  companyCode: id,
                },
              })
            )
          }
          if (showMatchType) {
            wftCommon.linkCompany('Bu3', id, '', '', '')
          } else {
            window.open(
              getUrlByLinkModule(LinksModule.GROUP, {
                id,
              })
            )
          }
        }}
      >
        {showMatchType ? (
          window.en_access_config ? (
            <div className="resultList ">
              <InnerHtml className="name zhName" html={highLightName} />
              <p
                className="name enName"
                title={corpNameEng + '   ' + ((aiTransFlag && intl('362293', '该翻译由AI提供')) || '')}
              >
                <InnerHtml html={corpNameEng}></InnerHtml>
                {aiTransFlag && corpNameEng && <span className="foot">{intl('362293', '该翻译由AI提供')}</span>}
              </p>
            </div>
          ) : (
            <InnerHtml className="resultList" html={highLightName}></InnerHtml>
          )
        ) : (
          <div className="resultList">{name}</div>
        )}
        {showMatchType && matchType ? <div className="comIntro">{matchType}</div> : ''}
      </div>
    )
  }

  //搜索列表下拉展示
  const searchList = () => {
    // console.log("useMemorender");

    const renderSearchRow = () => {
      if (searchBtnShow) {
        return searchResults.map((i, index) => {
          return (
            <SearchRow
              key={index}
              showMatchType={searchBtnShow}
              id={i?.corpId}
              name={i?.corpName.replace(/<.*?>/g, '')}
              corpNameEng={i?.corpNameEng}
              aiTransFlag={i?.aiTransFlag}
              matchType={i?.highlight?.[0]?.label}
              highLightName={i?.corpName}
            ></SearchRow>
          )
        })
      }
      return searchGroupResults.map((i, index) => {
        return (
          <SearchRow
            key={index}
            showMatchType={searchBtnShow}
            id={i?.groupsystem_id}
            name={i?.groupsystem_name.replace(/<.*?>/g, '')}
          ></SearchRow>
        )
      })
    }
    return (
      <>
        <div className="btnHeader">
          <div
            className={`searchBtn ${searchBtnShow ? 'borderBotm' : ''}`}
            onClick={() => {
              // @ts-expect-error ttt
              SearchRef.current?.input?.focus()
              setSearchBtnShow(true)
              gotoComList(searchValue)
              setTimeout(() => {
                setIsFocused(true)
              }, 300)
            }}
          >
            {intl('437304', '查公司')}
          </div>
          <div
            className={`searchBtn ${searchBtnShow ? '' : 'borderBotm'}`}
            onClick={() => {
              // @ts-expect-error ttt
              SearchRef.current?.input?.focus()
              setSearchBtnShow(false)
              gotoGroupList(searchValue)
              setTimeout(() => {
                setIsFocused(true)
              }, 300)
            }}
          >
            {intl('247482', '查集团')}
          </div>
        </div>
        {renderSearchRow()}
      </>
    )
  }

  //搜索框组件
  const searchComplete = () => {
    return (
      <Search
        ref={SearchRef}
        placeholder={intl('417525', '输入公司、人名、企业特征等关键词搜索')}
        className="searchInput"
        style={{ width: 400 }}
        value={searchValue}
        onChange={(e) => {
          let val = e.target.value || ''
          val = val.replace(/\\|↵|<|>/g, '')
          // 注：这里必须先设置searchValue，否则在部分输入法如微软拼音输入法下，输入不了中文
          setSearchValue(val)
          if (val) {
            val = val.trimStart()
            val = val.trimEnd()
          }
          setIsFocused(true)
          setHasHistoryList(false)
          if (val !== searchValue && val?.length > 0) {
            searchBtnShow ? gotoComList(val) : gotoGroupList(val)
          }
        }}
        onFocus={async () => {
          setIsFocused(true)
          if (searchValue) {
            setHasHistoryList(false)
          } else {
            setSearchResults([])
            setSearchGroupResults([])
            setSearchBtnShow(true)
            const history = await getSearchHistoryAndSlice('HOME_HEADER_SEARCH')
            if (history?.length > 0) {
              setHistoryComs(history.map((h) => h.name))
              setHasHistoryList(true)
            } else {
              setIsFocused(false)
            }
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false)
          }, 300)
        }}
        onPressEnter={(e) => {
          props.setGlobalSearchKeyWord22(searchValue)
          window.localStorage.setItem('searchValue', searchValue)
          if (!props.globalSearchReloadCurrent) {
            let hash = window.location.hash || ''
            hash = hash?.split('?')[0]
            const isGlobalSearch = hash === '#/globalSearch'
            wftCommon.jumpJqueryPage('index.html#/globalSearch?keyword=' + searchValue, isGlobalSearch ? true : false)
          }
          // @ts-expect-error ttt
          saveSearchHistory(e.target.value)

          setTimeout(() => {
            setIsFocused(false)
          }, 200)
        }}
        onSearch={() => {
          // todo 需要向redux发出一个动作
          props.setGlobalSearchKeyWord22(searchValue)
          window.localStorage.setItem('searchValue', searchValue)
          saveSearchHistory(searchValue)
          if (!props.globalSearchReloadCurrent) {
            let hash = window.location.hash || ''
            hash = hash?.split('?')[0]
            const isGlobalSearch = hash === '#/globalSearch'
            wftCommon.jumpJqueryPage('index.html#/globalSearch?keyword=' + searchValue, isGlobalSearch ? true : false) // 如果当前是搜索页面，当前页面进行跳转
          }
          setTimeout(() => {
            setIsFocused(false)
          }, 200)
        }}
        // allowClear
      />
    )
  }
  //上下键触发搜索框选择
  const onKeyDown = (e) => {
    const historyLength = historyComs.length

    if (hasHistoryList) {
      for (let i = 0; i < historyLength; i++) {
        window.document.getElementById(`historyKey${i}`).style.backgroundColor = '#fff'
      }
      if (historyKeys > -1 && historyKeys < historyLength) {
        if (e.keyCode === 38) {
          window.document.getElementById(`historyKey${historyKeys}`).style.backgroundColor = '#eee'
          setHistoryKeys(historyKeys - 1)
        } else if (e.keyCode === 40) {
          window.document.getElementById(`historyKey${historyKeys}`).style.backgroundColor = '#eee'
          setHistoryKeys(historyKeys + 1)
        }
      } else {
        if (e.keyCode === 38) {
          // @ts-expect-error ttt
          setHistoryKeys()
        } else if (e.keyCode === 40) {
          // @ts-expect-error ttt
          setHistoryKeys()
        }
      }
    }
  }
  return (
    <div className="block" style={{ visibility: props.hidden ? 'hidden' : 'initial' }}>
      {searchComplete()}
      <div className="historyList">
        {isFocused ? (
          hasHistoryList ? (
            <>
              <div className="historyTitle">
                <span> {intl('437396', '历史搜索')} </span>
                <span
                  onClick={async () => {
                    try {
                      await request('operation/delete/searchhistorydeleteall', {
                        params: {
                          type: 'HOME_HEADER_SEARCH',
                        },
                      })
                      setHasHistoryList(false)
                      setHistoryComs([])
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                >
                  <DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  {intl('19853', '删除')}
                </span>
              </div>
              {historyComs.map((item, index) => {
                return (
                  <div
                    className={'history' + (historyKeys === index ? ' hoverH' : '')}
                    id={'historyKey' + index}
                    key={index}
                    onClick={() => {
                      setSearchValue(item)
                      props.setGlobalSearchKeyWord22(item)
                      wftCommon.jumpJqueryPage(`index.html#/globalSearch?keyword=${item}`)
                    }}
                    onMouseOut={handleMouseOut}
                  >
                    {item}
                  </div>
                )
              })}
            </>
          ) : searchResults?.length > 0 || searchGroupResults?.length > 0 ? (
            searchList()
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    searchKeyWord: state.companySearchList.searchKeyWord,
    companyName: state.company.baseInfo.corp_name,
    globalSearchReloadCurrent: state.home.globalSearchReloadCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGlobalSearchKeyWord22: (data) => {
      dispatch(searchListAction.setGlobalSearchKeyWord(data))
    },
    //   setSearchKeyWord: data => {
    //     console.log(data);
    //   dispatch( searchListAction.setGlobalSearchKeyWord(data) )
    // },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySearch)
