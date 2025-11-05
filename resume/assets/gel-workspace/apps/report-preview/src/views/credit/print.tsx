import { axiosInstance } from '@/api/axios'
import { apiTranslateWithLoading } from '@/api/services/translateWithLoading'
import { fetchPackageInfo, selectUserPackage, useAppDispatch, useAppSelector } from '@/store'
import { selectUserPackageFetched } from '@/store/user'
import { getWsid, isDev } from '@/utils'
import { useTitle } from 'ahooks'
import { generatePageTitle } from 'gel-util/misc'
import React, { useEffect } from 'react'
import { CreditRPPrintComp } from 'report-preview-ui'
import { getUrlParamCorpCode } from 'report-util/url'

export const CreditRPPrint: React.FC = () => {
  const dispatch = useAppDispatch()

  const packageInfo = useAppSelector(selectUserPackage)

  const isPackageInfoFetched = useAppSelector(selectUserPackageFetched)
  useTitle(generatePageTitle('CreditRPPreview'))
  useEffect(() => {
    dispatch(fetchPackageInfo())
  }, [])

  return (
    <CreditRPPrintComp
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

export default CreditRPPrint
