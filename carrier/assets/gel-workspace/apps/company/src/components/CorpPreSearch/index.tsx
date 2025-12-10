import React, { forwardRef } from 'react'
import { getPreCompanySearch } from '@/api/homeApi'
import { CorpPresearch as CorpPresearchUI, CorpPresearchRef, CorpPresearchProps } from 'gel-ui'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history'
import { request } from '@/api/request'
import { translateComplexHtmlData } from '@/utils/intl'

export const CorpPresearch = forwardRef<CorpPresearchRef, CorpPresearchProps>((props, ref) => {
  const requestDataCallback = (data: any) => {
    // 翻译处理
    return translateComplexHtmlData(data)
  }

  return (
    <CorpPresearchUI
      ref={ref}
      deleteSearchHistoryAll={request}
      addSearchHistory={addSearchHistory}
      getSearchHistoryAndSlice={getSearchHistoryAndSlice}
      requestAction={getPreCompanySearch}
      debounceTime={500}
      {...props}
      data-uc-id="jN76U15YLI"
      data-uc-ct="corppresearchui"
      requestDataCallback={requestDataCallback}
    />
  )
})
