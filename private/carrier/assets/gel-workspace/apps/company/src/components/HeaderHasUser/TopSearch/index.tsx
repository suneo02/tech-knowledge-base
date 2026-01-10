import React from 'react'
import { getPreCompanySearch } from '@/api/homeApi'
import { CorpPresearch } from '../../CorpPreSearch'
import styles from './index.module.less'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import { EIsSeparate, generateUrlByModule, LinkModule } from 'gel-util/link'
import { wftCommon } from '@/utils/utils'
import { connect } from 'react-redux'
import * as searchListAction from '../../../actions/searchList'
import { parseQueryString } from '../../../lib/utils'
import { isDev } from '@/utils/env'

const TopSearch = ({
  hidden = false,
  setGlobalSearchKeyWordToRedux,
  setGlobalSearchTimeStampToRedux,
  companyName,
  globalSearchReloadCurrent,
}: {
  hidden: boolean
  setGlobalSearchKeyWordToRedux: (data: string) => void
  setGlobalSearchTimeStampToRedux: (data: number) => void
  companyName: string
  globalSearchReloadCurrent: boolean
}) => {
  let keyword = ''
  let lastSearchKeyword = ''

  try {
    const qsParam = parseQueryString()
    keyword = window.decodeURIComponent(qsParam['keyword'] || '')
    lastSearchKeyword = keyword
  } catch (error) {
    console.log(error)
  }

  return (
    <div className={styles.topSearch} style={hidden ? { visibility: 'hidden', flex: '1 1' } : {}}>
      <CorpPresearch
        initialValue={keyword || companyName}
        widthAuto={true}
        requestAction={getPreCompanySearch}
        onClickItem={(item) => {
          return handleJumpTerminalCompatibleAndCheckPermission(
            generateUrlByModule({
              module: LinkModule.COMPANY_DETAIL,
              params: {
                companycode: item?.corpId,
                isSeparate: EIsSeparate.True,
              },
              isDev,
            })
          )
        }}
        onClickHistory={(item) => {
          // 添加时间戳，用于两次输入相同字符时，强制执行当前页面的搜索
          const timeStamp = Date.now()
          // 检查本次搜索词是否与上一次一致
          if (item === lastSearchKeyword) {
            setGlobalSearchTimeStampToRedux(timeStamp)
          }
          // 更新上一次搜索的关键词
          lastSearchKeyword = item
          setGlobalSearchKeyWordToRedux(item)
          if (!globalSearchReloadCurrent) {
            let hash = window.location.hash || ''
            hash = hash?.split('?')[0]
            const isGlobalSearch = hash === '#/globalSearch'
            // 对搜索关键词进行URL编码,避免特殊字符导致的问题
            const encodedKeyword = encodeURIComponent(item)
            const url = generateUrlByModule({
              module: LinkModule.SEARCH,
              params: {
                keyword: encodedKeyword,
              },
              isDev: isDev,
            })
            if (isGlobalSearch) {
              wftCommon.jumpJqueryPage(
                'index.html#/globalSearch?keyword=' + encodedKeyword,
                isGlobalSearch ? true : false
              )
            } else {
              window.open(url, isGlobalSearch ? '_self' : '_blank')
            }
          }
        }}
        needHistory={true}
        data-uc-id="-5mwt-C5QyG"
        data-uc-ct="corppresearch"
      ></CorpPresearch>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    companyName: state.company.baseInfo.corp_name,
    globalSearchReloadCurrent: state.home.globalSearchReloadCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGlobalSearchKeyWordToRedux: (data) => {
      dispatch(searchListAction.setGlobalSearchKeyWord(data))
    },
    setGlobalSearchTimeStampToRedux: (data) => {
      dispatch(searchListAction.setGlobalSearchTimeStamp(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopSearch)
