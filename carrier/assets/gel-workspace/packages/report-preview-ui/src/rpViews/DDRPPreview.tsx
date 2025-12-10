import { RPPreviewComp } from '@/components/RPPreview'
import { useRPPreviewRequest } from '@/hooks'
import { getTForRPPreview } from '@/utils'
import { AxiosInstance } from 'axios'
import { getDDRPConfig } from 'detail-page-config'
import { UserPackageInfo } from 'gel-types'
import { useIntl } from 'gel-ui'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { useMemo } from 'react'
import { getDDRPLocale } from 'report-util/constants'
import { parseUserPackageInfo } from 'report-util/misc'

export const DDRPPreviewComp: React.FC<{
  corpCode: string | undefined
  packageInfo: UserPackageInfo | undefined
  isPackageInfoFetched: boolean
  axiosInstance: AxiosInstance
  apiTranslate: (data: any) => Promise<any>
  isDev: boolean
  getWsid: () => string
}> = (props) => {
  const t = useIntl()
  const {
    corpBasicNum,
    corpOtherInfo,
    corpBasicInfo,
    corpBasicInfoFetched,
    corpBasicNumFetched,
    corpOtherInfoFetched,
  } = useRPPreviewRequest(props.corpCode ?? '', props.axiosInstance)

  const reportConfig = useMemo(() => {
    return getDDRPConfig(
      corpBasicInfo,
      corpBasicNum,
      corpOtherInfo,
      parseUserPackageInfo(props.packageInfo ?? undefined)
    )
  }, [corpBasicInfo, corpBasicNum, corpOtherInfo, props.packageInfo])

  const handleCorpSwitch = (corpCode: string) => {
    if (!corpCode) {
      return
    }
    const url = generateUrlByModule({
      module: LinkModule.DDRP_PREVIEW,
      params: {
        companyCode: corpCode,
      },
      isDev: props.isDev,
    })
    if (!url) {
      return
    }
    window.location.href = url
  }

  const { reportTitle = '' } = getDDRPLocale(getTForRPPreview(t))

  return (
    <RPPreviewComp
      {...props}
      corpBasicNum={corpBasicNum}
      corpOtherInfo={corpOtherInfo}
      corpBasicInfo={corpBasicInfo}
      corpBasicInfoFetched={corpBasicInfoFetched}
      corpBasicNumFetched={corpBasicNumFetched}
      corpOtherInfoFetched={corpOtherInfoFetched}
      reportConfig={reportConfig}
      onCorpSwitch={handleCorpSwitch}
      reportTitle={reportTitle}
    />
  )
}
