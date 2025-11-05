import { IConfigDetailApiJSON } from '../../../../types/configDetail/common'
import { useAsync } from '../../../../utils/api'
import { getServerApiByConfig } from '@/api/serverApi.ts'
import { useEffect, useMemo } from 'react'
import { handleUniApi } from './custom/GroupCorpListStatus.js'

export const useGetApiData = ({
  api,
  apiExtra,
  params,
}: Pick<IConfigDetailApiJSON, 'api' | 'apiExtra'> & { params: any }) => {
  const [execute, response, loading] = useAsync<any, any>(getServerApiByConfig)

  useEffect(() => {
    execute({
      api: api,
      apiExtra: apiExtra,
      params: params,
    })
  }, [params])

  const data = useMemo(() => {
    try {
      if (response?.Data?.list) {
        return handleUniApi(response.Data.list, api, response?.Data?.total)
      } else if (response?.Data) {
        if (response?.Data?.submission) {
          response.Data.submission = response.Data.submission.map((res) => ({
            key: res.area,
            doc_count: res.num,
          }))
        }
        if (response?.Data?.invite) {
          response.Data.invite = response.Data.invite.map((res) => ({
            key: res.area,
            doc_count: res.num,
          }))
        }

        return handleUniApi(response.Data, api, response?.Data?.total)
      }
      return null
    } catch (e) {
      console.error(e)
      return null
    }
  }, [response])

  return { data, loading }
}
