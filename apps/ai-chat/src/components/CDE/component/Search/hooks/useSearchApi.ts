import { getCDEFilterResPayload, QueryFilter } from 'gel-api'
import { createSuperlistRequestFcs } from '@/api'
import { useRequest } from 'ahooks'

const DEFAULT_CONFIG: getCDEFilterResPayload = {
  pageNum: 1,
  pageSize: 10,
  superQueryLogic: {
    filters: [],
    measures: [
      {
        field: 'corp_id',
        title: '企业id',
      },
      {
        field: 'corp_name',
        title: '企业名称',
      },
    ],
  },
  order: null,
  largeSearch: false,
  fromTemplate: false,
}
export const useSearchApi = () => {
  const func = createSuperlistRequestFcs('company/getcrossfilter2')
  const { run, loading, data, cancel } = useRequest(func, {
    manual: true,
    onError: console.error,
    debounceWait: 200,
    loadingDelay: 300,
  })

  const fetch = (filters: QueryFilter[]) => {
    cancel()
    const config: getCDEFilterResPayload = DEFAULT_CONFIG
    if (filters?.length) {
      config.superQueryLogic.filters = filters
    }
    run(config)
  }
  return {
    fetch,
    loading,
    data,
    cancel,
  }
}
