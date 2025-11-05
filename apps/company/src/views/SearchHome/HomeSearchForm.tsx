import React, { useMemo, useRef, useState } from 'react'
import { myWfcAjax } from '../../api/companyApi.ts'
import {
  pointClickComapnyHistory,
  pointClickComapnyPreSearch,
  pointClickCompanyTab,
  pointClickGroupPreSearch,
  pointClickPersionTab,
  pointClickRelationHistory,
  pointClickRelationTab,
  pointSearchComapny,
  pointSearchGroup,
  pointSearchPersion,
  pointSearchRelation,
} from '../../lib/pointBuriedGel.tsx'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils.tsx'

import { SearchFormMulti, SearchFormSingle } from '@/components/searchForm/index.tsx'
import {
  GELSearchParam,
  getUrlByLinkModule,
  handleJumpTerminalCompatibleAndCheckPermission,
  KGLinkEnum,
  LinksModule,
} from '@/handle/link'
import { COMPANY, GROUP, PEOPLE, RELATION } from '@/views/HomeAI/comp/SearchForm/config.tsx'
import { classifySearch } from '@/views/SearchHome/config.tsx'
import { pointBuriedByModule } from '../../api/pointBuried/bury.ts'
import { searchFormConfigs } from '../HomeAI/comp/SearchForm/searchFormConfig.ts'
import './HomeSearchForm.less'

/**
 * // 企业库首页用于判断当前选中的查询类型
 export const PEOPLE = 'people' // 查人物
 export const COMPANY = 'company' // 查公司
 export const GROUP = 'group' // 查集团
 export const RELATION = 'relation' // 查关系
 */
export const HomeSearchTabKeys = {
  Company: 'company',
  People: 'people',
  Group: 'group',
  Relation: 'relation',
}

function HomeSearchForm() {
  const tabKeyInQuery = useMemo(() => {
    const query = new URLSearchParams(window.location.search)
    const key = query.get('type')
    if (Object.values(HomeSearchTabKeys).includes(key)) {
      return key
    }
    return HomeSearchTabKeys.Company // 默认是company
    // 此处监听实际无作用，待优化
  }, [window.location])
  const [searchList, setSearchList] = useState([]) // 搜素结果
  const [activeTab, setActiveTab] = useState(tabKeyInQuery) // tab选中

  // 切换tab查询类型
  const tabClickHandle = (item) => {
    if (item.url) {
      window.open(item.url)
      return
    }

    // 埋点
    if (item.key === PEOPLE) {
      pointClickPersionTab()
    } else if (item.key === RELATION) {
      pointClickRelationTab()
      pointBuriedByModule(922602101022)
    } else if (item.key === COMPANY) {
      pointClickCompanyTab()
    } else if (item.key === GROUP) {
      pointBuriedByModule(922602101021)
    }

    setActiveTab(item.key)
  }
  const abortControllerRef = useRef(0)
  // 获取搜索结果
  const searchRequestList = ({ key, callback }) => {
    let newCorpParams = {}
    let cmd = ''
    if (activeTab === GROUP) {
      newCorpParams = {
        queryText: key,
        pageno: 0,
        pageSize: 5,
      }
      cmd = 'search/group/getgroupsystempresearch'
    } else if (activeTab === COMPANY || activeTab === RELATION) {
      newCorpParams = {
        queryText: key,
        // !后续删除
        version: 1,
      }
      cmd = '/search/company/getGlobalCompanyPreSearch'
    } else {
      newCorpParams = {
        key: key,
        queryText: key,
        hasBid: 1,
        pageSize: 5,
      }
      cmd = '/search/company/presearch'
    }
    const currentRequestId = ++abortControllerRef.current
    myWfcAjax(cmd, newCorpParams)
      .then((res) => {
        if (currentRequestId !== abortControllerRef.current) return
        if (Number(res.ErrorCode) === 0) {
          if (activeTab === GROUP) {
            const list = []
            res?.Data?.list.map((item) => {
              list.push({
                ...item,
                name: item.groupsystem_name,
                value: item.groupsystem_id,
              })
            })
            setSearchList(list)
          } else if (activeTab === PEOPLE) {
            callback([1]) // 用于记录到历史记录
          } else if (activeTab === RELATION) {
            res?.Data?.search.map((item) => {
              const engName = window.en_access_config
                ? item.corpNameEng
                  ? item.corpNameEng
                  : item.corpName
                : item.corpName

              item.corpNameTxtCn = item.corpName?.replace(/<em>|<\/em>/g, '')
              item.corpNameTxt = window.en_access_config ? engName?.replace(/<em>|<\/em>/g, '') : item.corpNameTxtCn
            })
            callback(res?.Data?.search)
            setSearchList(res?.Data?.search)
          } else if (activeTab === COMPANY) {
            pointSearchComapny()
            callback(res?.Data?.search)
            setSearchList(res?.Data?.search)
          } else {
            // 查公司 && 差关系
            // 搜索成功埋点
            pointSearchComapny()
            callback(res?.Data?.corplist)
            setSearchList(res?.Data?.corplist)
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  // 点击搜一下按钮或者搜索结果
  const goSearchListDetail = (item) => {
    let word = item.name || item.corp_name || ''
    word = word?.replace(/\\|↵/i, '')
    let keyword = encodeURIComponent(word)
    switch (activeTab) {
      case COMPANY:
        // 点击预搜索
        if (item.searchFlag === '') {
          pointClickComapnyPreSearch()
        } else if (item.searchFlag === 'history') {
          pointClickComapnyHistory()
        }

        // 点击查公司搜索结果
        if (item.searchFlag === 'btn' || item.searchFlag === 'history') {
          wftCommon.jumpJqueryPage(`index.html#/globalSearch?keyword=${keyword}`)
        } else {
          wftCommon.linkCompany('Bu3', item.id || item.corp_id || item.corpId, null, null, null)
        }
        break
      case PEOPLE:
        if (item.searchFlag === 'btn') {
          pointSearchPersion()
        }

        // 点击查人物搜索结果
        if (item.searchFlag === 'btn' || item.searchFlag === 'history') {
          wftCommon.jumpJqueryPage(`SearchHomeList.html#/personSearchList?&keyword=${keyword}`)
        }
        break
      case GROUP:
        // 点击预搜索
        if (item.searchFlag === '') {
          pointClickGroupPreSearch()
        } else if (item.searchFlag === 'btn') {
          pointSearchGroup()
        }

        // 点击查集团跳转：点击搜索结果和点击搜一下按钮
        if (item.searchFlag === 'btn') {
          wftCommon.jumpJqueryPage(`SearchHomeList.html#/groupSearchList?keyword=${keyword}`)
        } else {
          window.open(
            getUrlByLinkModule(LinksModule.GROUP, {
              id: item.value,
            })
          )
        }
        break
      case RELATION: {
        if (item.searchFlag === 'history') {
          pointClickRelationHistory()
        } else if (item.searchFlag === 'btn') {
          pointSearchRelation()
        }

        // 点击查关系搜索结果
        const clickActiveInfo = item.clickActiveInfo
        const clickActiveRelationInfo = item.clickActiveRelationInfo
        if (!clickActiveInfo || !clickActiveRelationInfo) {
          break
        }
        handleJumpTerminalCompatibleAndCheckPermission(
          getUrlByLinkModule(LinksModule.KG, {
            subModule: KGLinkEnum.chart_cgx,
            params: {
              [GELSearchParam.NoSearch]: 1,
              lc: clickActiveInfo.corpId || clickActiveInfo.corp_id,
              rc: clickActiveRelationInfo.corpId || clickActiveRelationInfo.corp_id,
              lcn: clickActiveInfo.corpNameTxt || clickActiveInfo.corp_name,
              rcn: clickActiveRelationInfo.corpNameTxt || clickActiveRelationInfo.corp_name,
            },
          })
        )
        break
      }
    }
  }

  return (
    <React.Fragment>
      {/* tab */}
      <div className="home-search-form">
        <div className="classify-search">
          {classifySearch.map((item) => {
            if (wftCommon.is_overseas_config) {
              if (item.key === 'people' || item.key === 'risk') return null
            }
            return (
              <a key={item.key} className={activeTab === item.key ? 'active' : ''} onClick={() => tabClickHandle(item)}>
                <span>{item.value}</span>
              </a>
            )
          })}
        </div>

        {/* 查公司 */}
        {activeTab === COMPANY && (
          <SearchFormSingle
            placeHolder={intl('437305', '请输入公司、人名、品牌、企业特征等关键词')}
            searchList={searchList}
            searchRequest={searchRequestList}
            goSearchListDetail={goSearchListDetail}
            historyAddTiming={searchFormConfigs[COMPANY].historyAddTiming}
            pageFlag={searchFormConfigs[COMPANY].pageFlag}
            onFetchHistory={searchFormConfigs[COMPANY].onFetchHistory}
            onAddHistoryItem={searchFormConfigs[COMPANY].onAddHistoryItem}
            onClearHistory={searchFormConfigs[COMPANY].onClearHistory}
          />
        )}

        {/* 查人物 */}
        {activeTab === PEOPLE && (
          <SearchFormSingle
            placeHolder={intl('437322', '请输入法定代表人、股东或高管的完整姓名')}
            goSearchListDetail={goSearchListDetail}
            historyAddTiming={searchFormConfigs[PEOPLE].historyAddTiming}
            pageFlag={searchFormConfigs[PEOPLE].pageFlag}
            onFetchHistory={searchFormConfigs[PEOPLE].onFetchHistory}
            onAddHistoryItem={searchFormConfigs[PEOPLE].onAddHistoryItem}
            onClearHistory={searchFormConfigs[PEOPLE].onClearHistory}
          />
        )}

        {/* 查集团 */}
        {activeTab === GROUP && (
          <SearchFormSingle
            placeHolder={intl('437323', '请输入集团系、公司、人名、品牌等关键词')}
            searchList={searchList}
            searchRequest={searchRequestList}
            goSearchListDetail={goSearchListDetail}
          />
        )}

        {/* 查关系 */}
        {activeTab === RELATION && (
          <SearchFormMulti
            placeHolder={intl('225183', '请输入公司名称')}
            searchList={searchList}
            searchRequest={searchRequestList}
            goSearchListDetail={goSearchListDetail}
            historyAddTiming={searchFormConfigs[RELATION].historyAddTiming}
            onFetchHistory={searchFormConfigs[RELATION].onFetchHistory}
            onAddHistoryItem={searchFormConfigs[RELATION].onAddHistoryItem}
            onClearHistory={searchFormConfigs[RELATION].onClearHistory}
          />
        )}
      </div>
    </React.Fragment>
  )
}

export default HomeSearchForm
