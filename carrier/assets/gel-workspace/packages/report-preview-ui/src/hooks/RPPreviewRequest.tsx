import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { createWFCRequestWithAxios } from 'gel-api'
import { useEffect, useMemo, useState } from 'react'
import { useBasicNumRequest } from './BasicNum'

export const useRPPreviewRequest = (corpCode: string, axiosInstance: AxiosInstance) => {
  const { corpBasicNum, corpBasicNumFetched } = useBasicNumRequest(corpCode, axiosInstance)
  const [corpBasicInfoFetched, setCorpBasicInfoFetched] = useState(false)
  const [corpOtherInfoFetched, setCorpOtherInfoFetched] = useState(false)

  const corpBasicInfoFunc = createWFCRequestWithAxios(axiosInstance, 'detail/company/getcorpbasicinfo_basic')
  const corpOtherInfoFunc = createWFCRequestWithAxios(axiosInstance, 'operation/insert/getOtherInfo')

  const { run: requestCorpBasicInfo, data: corpBasicInfoData } = useRequest<
    Awaited<ReturnType<typeof corpBasicInfoFunc>>,
    Parameters<typeof corpBasicInfoFunc>
  >(corpBasicInfoFunc, {
    manual: true,
    onError: (error) => {
      console.error('requestCorpBasicInfo error', error)
    },
    onFinally: () => {
      setCorpBasicInfoFetched(true)
    },
  })

  const { run: requestCorpOtherInfo, data: corpOtherInfoData } = useRequest<
    Awaited<ReturnType<typeof corpOtherInfoFunc>>,
    Parameters<typeof corpOtherInfoFunc>
  >(corpOtherInfoFunc, {
    manual: true,
    onFinally: () => {
      setCorpOtherInfoFetched(true)
    },
    onError: (error) => {
      console.error('requestCorpOtherInfo error', error)
    },
  })

  useEffect(() => {
    requestCorpOtherInfo({
      companyCode: corpCode,
    })

    requestCorpBasicInfo(undefined, {
      appendUrl: corpCode,
    })
  }, [corpCode])

  const corpBasicInfo = useMemo(() => {
    return corpBasicInfoData?.Data
  }, [corpBasicInfoData])

  const corpOtherInfo = useMemo(() => {
    return corpOtherInfoData?.Data
  }, [corpOtherInfoData])

  return {
    corpBasicInfo,
    corpBasicNum,
    corpOtherInfo,
    corpBasicInfoFetched,
    corpBasicNumFetched,
    corpOtherInfoFetched,
  }
}
