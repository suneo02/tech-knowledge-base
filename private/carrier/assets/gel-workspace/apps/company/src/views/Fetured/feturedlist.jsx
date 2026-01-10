/**
 * page 榜单名录列表页
 * Created by xhliu.liuxh
 *
 * @format
 */
import { Breadcrumb, Col, Input, message, Radio, Row, Spin, Tree } from '@wind/wind-ui'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFeturedListStore } from '../../store/feturedlist'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import FeturedCard from './FeturedCard'
import FeturedTree from './feturedTree'
import './feturedlist.less'
import { formatUpdateTime, updatefreqMap } from './util'

import { GELSearchParam, getUrlByLinkModule, LinksModule } from '@/handle/link/index.ts'
import { SearchLinkEnum } from '@/handle/link/module/search.ts'
import { hashParams } from '@/utils/links/index.ts'
import { LoadingO } from '@wind/icons'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { CorpPresearch } from '../../components/CorpPreSearch'
import { usePageTitle } from '../../handle/siteTitle'
import { DefaultSearchType, DefaultSelectedKey, handleBuryFeatureCard } from './featuredList'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const Feturedlist = (props) => {
  const { getParamValue } = hashParams()
  const linksource = getParamValue('linksource')
  usePageTitle('RankList')
  const id = getParamValue('id') || DefaultSelectedKey
  const search = getParamValue('search') || ''
  const [searchedValue, setSearchedValue] = useState(search || '')
  const [searchKeyword, setSearchKeyword] = useState(search || '')
  const [searchType, setSearchType] = useState(DefaultSearchType)
  const [isShowListTip, setIsShowListTip] = useState(true) // 是否展示名录搜索结果 or 企业名称搜索结果
  const [searchCorp, setSearchCorp] = useState(null) // 企业名称搜索结果
  const [isSearching, setIsSearching] = useState(false) //是否是搜索后的页面
  const [isSearchEvent, setIsSearchEvent] = useState(false) // 当前是否是搜索事件
  const [isShowPreSearch, setIsShowPreSearch] = useState(false) // 是否显示搜索下拉框
  const isSearchEventRef = useRef()
  const pageNoRef = useRef(0)
  const observableRef = useRef()
  const searchValueRef = useRef(search)

  const [loading, setLoading] = useState(true)
  const [scrollLoading, setScrollLoading] = useState(false)

  const placeholderRef = useRef(null)

  const {
    selectedKeys,
    feturedTree,
    feturedTreeNum,
    feturedList,
    preSearchList,
    feturedInfoInit,
    setSelectedKeys,
    getFeturedList,
    addFeturedList,
    getCorplistpresearch,
    getCorpNamepresearch,
  } = useFeturedListStore()

  const [selectedKeysState, setSelectedKeysState] = useState(selectedKeys)

  const inCallback = async (entry) => {
    if (!scrollLoading) {
      return
    }
    let param = {
      keyword: searchValueRef.current,
      category: selectedKeys[0] || '',
      pageNo: pageNoRef.current + 1,
      pageSize: 16,
    }

    if (searchType !== DefaultSearchType) {
      delete param.keyword
      param.companyCode = searchCorp.corp_id
    }
    let res = await addFeturedList(param, searchType)
    if (!res?.length) {
      setScrollLoading((i) => false)

      observableRef.current && placeholderRef.current && observableRef.current.unobserve(placeholderRef.current)
      observableRef.current = null
    } else {
      pageNoRef.current += 1
      setScrollLoading((i) => true)
    }
  }

  const outCallback = () => {}

  const initIntersectionObserver = () => {
    let status = true

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    }

    const handleIntersection = (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        setTimeout(async () => {
          if (status) {
            status = false
            if (inCallback) await inCallback(entry)
            status = true
          }
        }, 500)
      } else {
        if (outCallback) outCallback()
      }
    }

    const observable = new IntersectionObserver(handleIntersection, options)
    observableRef.current = observable
    observableRef.current.observe(placeholderRef.current)
  }
  const init = async (key, isSearch) => {
    setIsSearching(isSearch ? true : false)
    isSearchEventRef.current = isSearch ? true : false
    setIsSearchEvent(isSearch ? true : false)

    setSelectedKeys(isSearch ? [] : [key || id])
    let res = await feturedInfoInit(isSearch)
    if (res.length >= 16) {
      setScrollLoading(true)
    } else {
      setScrollLoading(false)
    }
    setLoading(false)
  }
  useEffect(() => {
    init(null, search)
    pointBuriedByModule(922602100827)
  }, [])

  useEffect(() => {
    if (loading) return
    placeholderRef.current && initIntersectionObserver()
    return () => {
      observableRef.current && placeholderRef.current && observableRef.current.unobserve(placeholderRef.current)
      observableRef.current && placeholderRef.current && observableRef.current.disconnect(placeholderRef.current)
      observableRef.current = null
    }
  }, [loading, searchValueRef, scrollLoading, selectedKeys])

  // 搜索
  const handleSearch = (value) => {
    if (!value) {
      setSearchCorp(null)
      setSearchedValue(value)
      isSearchEventRef.current = false
      setIsSearchEvent(false)
      searchValueRef.current = value
      return init(DefaultSelectedKey)
    } else {
      if (searchType == 'company' && !searchCorp) {
        message.info(intl('416944', '请选择一个企业'))

        return
      }
      pointBuriedByModule()
      setSearchedValue(value)
      setSelectedKeys([])
      isSearchEventRef.current = true
      setIsSearchEvent(true)
    }
    setIsSearching(value)
    setIsShowListTip(true)
    setIsShowPreSearch(false)
    searchValueRef.current = value
    handleSelect(value ? [] : [DefaultSelectedKey])
    setSelectedKeysState([])
  }

  const onChange = useCallback(
    debounce((e) => {
      if (searchType == DefaultSearchType) {
        getCorplistpresearch(e.target.value)
      } else {
        getCorpNamepresearch(e.target.value)
      }
      setIsShowPreSearch(true)
    }, 500),
    [searchType]
  )

  // 菜单树选择
  const handleSelect = async (selectedKeys, corp_id) => {
    //切换菜单树时置顶
    let container = document.querySelector('.page-container')
    container && (container.scrollTop = 0)
    props.history.replace(`/feturedlist?id=${selectedKeys[0] || ''}`)
    // pageNo重置
    pageNoRef.current = 0

    setSelectedKeys(selectedKeys)
    setSelectedKeysState(selectedKeys)

    let param = {
      keyword: searchValueRef.current,
      category: selectedKeys[0] || '',
      pageNo: 0,
      pageSize: 16,
    }

    // 搜企业名称
    if (searchType !== DefaultSearchType) {
      if (!corp_id && !(searchCorp && searchCorp.corp_id)) {
        // return
      } else {
        param.companyCode = corp_id || (searchCorp && searchCorp.corp_id)
        delete param.keyword
      }
    }

    if (isSearchEventRef.current && searchValueRef.current) {
      param['category'] = ''
    }

    setLoading(true)
    let type = searchType
    if (!param.companyCode) {
      type = DefaultSearchType
    }
    let res = await getFeturedList(param, isSearchEventRef.current, type)
    setLoading(false)
    if (res?.length >= 16) {
      setScrollLoading(true)
    } else {
      setScrollLoading(false)
    }
    placeholderRef.current && observableRef.current && observableRef.current.observe(placeholderRef.current)
  }

  // 企业名称预搜索结果点击
  const handlePreSelectCorp = (i) => {
    if (!i) return
    let corp_id = i.corp_id?.length === 10 ? i.corp_id : i.corp_id?.slice(2, 12)
    setSearchCorp({
      corp_name: i.corp_name,
      corp_id: corp_id,
    })

    setIsShowListTip(false)
    let corpName = i.corp_name.replace(/<.+?>/g, '')
    searchValueRef.current = corpName
    setIsShowPreSearch(false)
    setSearchKeyword(corpName)
    setSearchedValue(corpName)
    isSearchEventRef.current = true
    setIsSearchEvent(true)
    setIsSearching(true)
    handleSelect(selectedKeys, corp_id)
    setSelectedKeys([])
    setSelectedKeysState([])
    // window.open(`#/feturedcompany?id=${i.corp_id}`)
  }

  const rendertreenode = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={<h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.title}</h3>}
            data-code={item.key}
            data-id={item.code}
            data-uc-id="rT9H0qNJRH"
            data-uc-ct="treenode"
            data-uc-x={item.key}
          >
            {rendertreenode(item.children)}
          </TreeNode>
        )
      }
      return (
        item.total && (
          <TreeNode
            key={item.key}
            disabled={!(isSearchEvent ? feturedTreeNum[item.currentCode] || 0 : item.total)}
            title={
              <p>
                {item.title}({isSearchEvent ? feturedTreeNum[item.currentCode] || 0 : item.total})
              </p>
            }
            data-uc-id="tp7MrhqONY"
            data-uc-ct="treenode"
            data-uc-x={item.key}
          />
        )
      )
    })

  // 预搜索下拉菜单
  const PreSearch = ({ data, name, id, onClick }) => {
    return (
      <>
        <p
          style={{
            color: '#333',
            fontWeight: 'bold',
            cursor: 'default',
          }}
        >
          {intl('56602', '搜索结果')}
        </p>
        {data.map((i) => (
          <p
            key={i[name]}
            dangerouslySetInnerHTML={{
              __html: i[name],
            }}
            onClick={() => {
              onClick(i)
            }}
            data-uc-id="3XM22nhqck"
            data-uc-ct="p"
            data-uc-x={i[name]}
          ></p>
        ))}
      </>
    )
  }

  return (
    <div className="feture-list-body">
      <div className="fetured-toolbar" id="fetured-toolbar">
        <div className="fetured-toolbar-content">
          <span>
            {!wftCommon.isBaiFenTerminalOrWeb() ? (
              <Breadcrumb data-uc-id="HIkPJDdqYh" data-uc-ct="breadcrumb">
                <Breadcrumb.Item data-uc-id="6La6z--Xu" data-uc-ct="breadcrumb">
                  <a
                    onClick={() => {
                      const url = getUrlByLinkModule(LinksModule.SEARCH, {
                        subModule: SearchLinkEnum.FeaturedFront,
                        params: { linksource, [GELSearchParam.NoSearch]: 1 },
                      })
                      window.location.href = url
                    }}
                    data-uc-id="AIyKXUA1hJ"
                    data-uc-ct="a"
                  >
                    {intl('252965', '企业榜单名录')}
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item data-uc-id="eNlMopYpO7" data-uc-ct="breadcrumb">
                  {intl('260423', '全部榜单名录')}
                </Breadcrumb.Item>
              </Breadcrumb>
            ) : null}
          </span>
          <span className="link-fetured">
            <RadioGroup
              onChange={(e) => {
                searchValueRef.current = ''
                setSearchCorp(null)
                getCorplistpresearch('')
                setSearchType(e.target.value)
              }}
              value={searchType}
              data-uc-id="iNWuLkievz"
              data-uc-ct="radiogroup"
            >
              <RadioButton value={DefaultSearchType} data-uc-id="VsvVCvm3x6" data-uc-ct="radiobutton">
                {intl('437880', '搜榜单名录')}
              </RadioButton>
              <RadioButton value="company" data-uc-id="uS7dw6Lk7N" data-uc-ct="radiobutton">
                {intl('437861', '搜企业名称')}
              </RadioButton>
            </RadioGroup>

            {/* TODO 封装preSearch组件 */}
            <div className="preSearch">
              {searchType == DefaultSearchType ? (
                <Search
                  value={searchKeyword}
                  className="tree_search"
                  style={{
                    width: window.en_access_config ? '310px' : '292px',
                  }}
                  placeholder={
                    searchType == DefaultSearchType
                      ? intl('437751', '请输入榜单名称')
                      : intl('272142', '请输入企业名称')
                  }
                  onSearch={handleSearch}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value)
                    debounce(onChange, 500)(e)
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsShowPreSearch(false)
                    }, 200)
                  }}
                  allowClear
                  onFocus={() => {
                    preSearchList?.length && setIsShowPreSearch(true)
                  }}
                  data-uc-id="WvO1FUff2j"
                  data-uc-ct="search"
                />
              ) : (
                <CorpPresearch
                  initialValue={searchKeyword}
                  placeholder={intl('272142', '请输入企业名称')}
                  onChange={(val) => {
                    if (!val?.trim()) {
                      getCorpNamepresearch('', true)
                    }
                  }}
                  onClickItem={(item) => {
                    const selectedItem = {
                      corp_id: item?.corpId,
                      corp_name: item?.corpName,
                    }
                    handlePreSelectCorp(selectedItem)
                  }}
                  widthAuto={true}
                  minWidth={window.en_access_config ? 310 : 292}
                  placement="bottomRight"
                  data-uc-id="lpqAkUB3Bi"
                  data-uc-ct="corppresearch"
                />
              )}

              {isShowPreSearch ? (
                <div className="search_box">
                  {searchType == DefaultSearchType ? (
                    <PreSearch
                      data={preSearchList}
                      name="objectName"
                      onClick={(i) => {
                        window.open(`#/feturedcompany?id=${i.objectId}`)
                      }}
                      data-uc-id="j9dNpb-L2g"
                      data-uc-ct="presearch"
                    ></PreSearch>
                  ) : (
                    <PreSearch
                      data={preSearchList}
                      name="corp_name"
                      onClick={handlePreSelectCorp}
                      data-uc-id="6LBeh7lgjx"
                      data-uc-ct="presearch"
                    ></PreSearch>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </span>
        </div>
      </div>
      <div className="search-fetured-result">
        <div className="search-fetured-category">
          <FeturedTree
            treeData={feturedTree}
            selectedKeys={selectedKeys}
            onSelect={(val) => {
              isSearchEventRef.current = false
              if (val.length) {
                handleSelect(val)
              }
            }}
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingBottom: '12px',
              maxHeight: 'calc(100vh - 120px)',
            }}
            data-uc-id="7of7DZLzjF"
            data-uc-ct="feturedtree"
          >
            {rendertreenode(feturedTree)}
          </FeturedTree>
        </div>

        <div className="search-fetured-list">
          {isSearching &&
            (isShowListTip ? (
              <div className="hint">
                {intl('478697', `包含"%"的榜单/名录有：`).replace('%', searchedValue.replace(/<.+?>/g, ''))}
              </div>
            ) : (
              <div className="hint">
                {intl('420050', `"%"上榜的榜单/名录有：`).replace('%', searchedValue.replace(/<.+?>/g, ''))}
              </div>
            ))}
          {loading ? (
            <>
              <div className="loadingBox">
                <Spin></Spin>
              </div>
            </>
          ) : (
            <div id="feturedList">
              <Row gutter={12}>
                {feturedList.map((i, index) => (
                  <Col span={12} key={index} data-index={index + 1}>
                    <FeturedCard
                      data={i}
                      onClick={() => {
                        handleBuryFeatureCard(i.objectName)
                        window.open(`#/feturedcompany?id=${i.objectId}`)
                      }}
                      data-uc-id="STqmkpS3LZ"
                      data-uc-ct="feturedcard"
                    >
                      {i.type == DefaultSearchType && (
                        <div className="rankCard">
                          <p>
                            {intl('308620', '统计来源') + '：'}
                            <span title={i.source}>{i.source}</span>
                          </p>
                          {/* <br /> */}
                          <p>
                            {intl('437815', '数据更新周期') + '：'}
                            <span>{updatefreqMap[i.updatefreq] || ''}</span>
                          </p>
                          {/* <br /> */}
                          <p>
                            {' '}
                            {intl('437847', '最近一期') + '：'}
                            <span>
                              {(i.updatefreq &&
                                i.bizDate &&
                                formatUpdateTime(wftCommon.formatTime(i.bizDate), i.updatefreq)) ||
                                ''}
                            </span>
                          </p>
                        </div>
                      )}
                    </FeturedCard>
                  </Col>
                ))}
              </Row>
              {!feturedList.length && (
                <>
                  <div className="loadingBox">{intl('132725', '暂无数据')}</div>
                </>
              )}
              {scrollLoading ? (
                <div className="loading-more" ref={placeholderRef}>
                  {intl('437730', '加载更多')}
                  &nbsp;
                  <LoadingO data-uc-id="PtZwaYlK7" data-uc-ct="loadingo" />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feturedlist
