import { RPPrintComp } from '@/components/RPPreview'
import { useRPPreviewRequest } from '@/hooks'
import { getTForRPPreview } from '@/utils'
import { AxiosInstance } from 'axios'
import { getCreditRPConfig } from 'detail-page-config'
import { UserPackageInfo } from 'gel-types'
import { useIntl } from 'gel-ui'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import React from 'react'
import { getCreditRPLocale } from 'report-util/constants'
import { parseUserPackageInfo } from 'report-util/misc'

export const CreditRPPrintComp: React.FC<{
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

  const reportConfig = getCreditRPConfig(
    corpBasicInfo,
    corpBasicNum,
    corpOtherInfo,
    parseUserPackageInfo(props.packageInfo ?? undefined)
  )

  const handleCorpSwitch = (corpCode: string) => {
    if (!corpCode) {
      return
    }
    const url = generateUrlByModule({
      module: LinkModule.CREDIT_RP_PREVIEW,
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

  const { reportTitle = '' } = getCreditRPLocale(getTForRPPreview(t))

  return (
    <RPPrintComp
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
