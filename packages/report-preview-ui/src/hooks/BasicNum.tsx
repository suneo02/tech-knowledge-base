import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { createWFCRequestWithAxios, createWFCSecureRequestWithAxios, isTrademarkBasicNumData } from 'gel-api'
import { CorpBasicNumFront } from 'gel-types'
import { mergeCorpBasicNum } from 'gel-util/corp'
import { useEffect, useMemo, useState } from 'react'

export const useBasicNumRequest = (corpCode: string, axiosInstance: AxiosInstance) => {
  const [corpBasicNumFetchedRaw, setCorpBasicNumFetchedRaw] = useState(false)
  const [corpPatentBasicNumFetched, setCorpPatentBasicNumFetched] = useState(false)
  const [corpTrademarkBasicNumFetched, setCorpTrademarkBasicNumFetched] = useState(false)

  const corpBasicNumFunc = createWFCRequestWithAxios(axiosInstance, 'detail/company/getentbasicnum')
  const corpPatentBasicNumFunc = createWFCRequestWithAxios(axiosInstance, 'detail/company/patent_statistical_number')
  const wfcSecureFunc = createWFCSecureRequestWithAxios(axiosInstance)

  const { run: requestCorpBasicNum, data: corpBasicNumData } = useRequest<
    Awaited<ReturnType<typeof corpBasicNumFunc>>,
    Parameters<typeof corpBasicNumFunc>
  >(corpBasicNumFunc, {
    manual: true,
    onError: (error) => {
      console.error('requestCorpBasicNum error', error)
    },
    onFinally: () => {
      setCorpBasicNumFetchedRaw(true)
    },
  })

  const { run: requestCorpPatentBasicNum, data: corpPatentBasicNumData } = useRequest<
    Awaited<ReturnType<typeof corpPatentBasicNumFunc>>,
    Parameters<typeof corpPatentBasicNumFunc>
  >(corpPatentBasicNumFunc, {
    manual: true,
    onFinally: () => {
      setCorpPatentBasicNumFetched(true)
    },
  })

  const { run: requestCorpTrademarkBasicNum, data: corpTrademarkBasicNumData } = useRequest<
    Awaited<ReturnType<typeof wfcSecureFunc>>,
    Parameters<typeof wfcSecureFunc>
  >(wfcSecureFunc, {
    manual: true,
    onFinally: () => {
      setCorpTrademarkBasicNumFetched(true)
    },
  })

  useEffect(() => {
    requestCorpBasicNum(undefined, {
      appendUrl: corpCode,
    })

    requestCorpPatentBasicNum(undefined, {
      appendUrl: corpCode,
    })

    requestCorpTrademarkBasicNum(
      {
        cmd: 'getintellectual',
      },
      {
        type: 'trademark_sum_corp',
        companyType: 0,
        companycode: corpCode,
        pageNo: 0,
        pageSize: 1,
      }
    )
  }, [corpCode])

  const corpBasicNum = useMemo<Partial<CorpBasicNumFront>>(() => {
    if (isTrademarkBasicNumData(corpTrademarkBasicNumData?.Data)) {
      return mergeCorpBasicNum(corpBasicNumData?.Data, corpPatentBasicNumData?.Data, corpTrademarkBasicNumData.Data)
    }
    return mergeCorpBasicNum(corpBasicNumData?.Data, corpPatentBasicNumData?.Data, undefined)
  }, [corpBasicNumData, corpPatentBasicNumData, corpTrademarkBasicNumData])

  const corpBasicNumFetched = useMemo(() => {
    return corpBasicNumFetchedRaw && corpPatentBasicNumFetched && corpTrademarkBasicNumFetched
  }, [corpBasicNumFetchedRaw, corpPatentBasicNumFetched, corpTrademarkBasicNumFetched])

  return {
    corpBasicNum,
    corpBasicNumFetched,
  }
}
