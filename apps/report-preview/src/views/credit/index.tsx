import { axiosInstance } from '@/api/axios'
import { apiTranslateWithLoading } from '@/api/services/translateWithLoading'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPackageInfo, selectUserPackage, selectUserPackageFetched } from '@/store/user'
import { getWsid, isDev } from '@/utils'
import { useTitle } from 'ahooks'
import { generatePageTitle } from 'gel-util/misc'
import React, { useEffect } from 'react'
import { CreditRPPreviewComp } from 'report-preview-ui'
import { getUrlParamCorpCode } from 'report-util/url'

export const CreditRPPreview: React.FC = () => {
  const dispatch = useAppDispatch()

  const packageInfo = useAppSelector(selectUserPackage)

  const isPackageInfoFetched = useAppSelector(selectUserPackageFetched)
  useTitle(generatePageTitle('CreditRPPreview'))
  useEffect(() => {
    dispatch(fetchPackageInfo())
  }, [])

  return (
    <CreditRPPreviewComp
      corpCode={getUrlParamCorpCode()}
      axiosInstance={axiosInstance}
      isDev={isDev}
      getWsid={getWsid}
      packageInfo={packageInfo || undefined}
      isPackageInfoFetched={isPackageInfoFetched}
      apiTranslate={apiTranslateWithLoading}
    />
  )
}

export default CreditRPPreview
