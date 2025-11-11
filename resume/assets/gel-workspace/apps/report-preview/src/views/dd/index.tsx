import { axiosInstance } from '@/api/axios'
import { apiTranslateWithLoading } from '@/api/services/translateWithLoading'
import { fetchPackageInfo, selectUserPackage, useAppDispatch, useAppSelector } from '@/store'
import { selectUserPackageFetched } from '@/store/user'
import { getWsid, isDev } from '@/utils'
import { useTitle } from 'ahooks'
import { useIntl } from 'gel-ui'
import { generatePageTitle } from 'gel-util/misc'
import React, { useEffect } from 'react'
import { DDRPPreviewComp } from 'report-preview-ui'
import { getUrlParamCorpCode } from 'report-util/url'

export const DDRPPreview: React.FC = () => {
  const t = useIntl()
  const dispatch = useAppDispatch()

  const packageInfo = useAppSelector(selectUserPackage)

  const isPackageInfoFetched = useAppSelector(selectUserPackageFetched)
  useTitle(generatePageTitle(t, 'DDRPPreview'))
  useEffect(() => {
    dispatch(fetchPackageInfo())
  }, [])

  return (
    <DDRPPreviewComp
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

export default DDRPPreview
