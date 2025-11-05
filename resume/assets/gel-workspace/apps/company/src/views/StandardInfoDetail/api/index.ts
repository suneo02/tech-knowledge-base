import { useRequest } from 'ahooks'
import { useEffect, useMemo } from 'react'
import axios from '../../../api'

import queryString from 'qs'

export const useGetStandardDetailSearchParam = () => {
  const location = window.location
  const param = queryString.parse(location.search, { ignoreQueryPrefix: true })
  const entityNumber = param['entityNumber']
  const standardLevelCode = param['standardLevelCode']
  const type = param['type']
  return { entityNumber, standardLevelCode, type }
}

export const getStandardDetail = ({ entityNumber, standardLevelCode }) => {
  return axios.request({
    method: 'post',
    params: {
      standardLevelCode,
    },
    cmd: `detail/stdinfo/standardInfoDetail/${entityNumber}`,
  })
}

/**
 *
 * @returns {{standardData: StandardDetail, draft: *, filingsInfo, loading: *, execute: *}}
 */
export const useApiGetStandardDetail = () => {
  const { data, loading, run } = useRequest(getStandardDetail)

  const { entityNumber, standardLevelCode } = useGetStandardDetailSearchParam()

  const standardData = useMemo(() => {
    try {
      if (!(!data || data['ErrorCode'] !== '0')) {
        return data.Data
      }
    } catch (e) {
      console.error(e)
    }
  }, [data])

  const draft = useMemo(
    () => ({
      data: {
        method: 'post',
        params: {
          standardLevelCode,
        },
        cmd: `detail/stdinfo/standardInfoDraftingUnit/${entityNumber}`,
      },
    }),
    [entityNumber, standardLevelCode]
  )

  const filingsInfo = useMemo(
    () => ({
      filingDate: standardData?.filingDate,
      filingNo: standardData?.filingNo,
    }),
    [standardData]
  )

  useEffect(() => {
    run({ entityNumber, standardLevelCode })
  }, [entityNumber, standardLevelCode])

  return { standardData, filingsInfo, draft, loading }
}
