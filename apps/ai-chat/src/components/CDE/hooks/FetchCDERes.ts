import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { useRequest } from 'ahooks'
import { CDEFilterItemUser, CDELogicDefault, isValidUserFilterItem } from 'cde'
import { CDEMeasureItem, CDESuperQueryLogic } from 'gel-api'
import { filter, isArray, isNil } from 'lodash'

export const useFetchCDERes = (filters: CDEFilterItemUser[] | undefined, measures: CDEMeasureItem[]) => {
  const func = createSuperlistRequestFcs('company/getcrossfilter2')
  const {
    run: runFetch,
    loading,
    data: res,
    cancel,
  } = useRequest<Awaited<ReturnType<typeof func>>, Parameters<typeof func>>(func, {
    manual: true,
    onError: console.error,
    debounceWait: 500,
    refreshDeps: ['superQueryLogic'],
  })
  const data = useMemo(() => {
    if (res && res.Data) {
      return res.Data.list
    }
  }, [res])

  const page = useMemo(() => {
    if (res && res.Data) {
      return res.Data.page
    }
  }, [res])

  const fetch = async () => {
    if (!filters || filters.length === 0) {
      return
    }
    const filtersQuery: CDESuperQueryLogic['filters'] = filters
      .map((item) => {
        // 用户没有输入值，那么不进行查询，不论是否进行了逻辑选择
        if (!isValidUserFilterItem(item)) {
          if (item.logic === CDELogicDefault || isNil(item.logic)) {
            console.error('filter value and logic is empty or default', item)
          }
          return null
        }

        const valueArray = isArray(item.value) ? item.value : [item.value]
        const value = valueArray.filter((v) => !isNil(v)) as CDESuperQueryLogic['filters'][number]['value']

        return {
          ...item,
          field: item.field,
          value,
          title: item.title || '', // Ensure title is always a string
        }
      })
      .filter((item) => !isNil(item))
    await runFetch({
      pageNum: 1,
      // TODO 替换为真实的 数据量获取接口
      pageSize: 10,
      superQueryLogic: {
        filters: filtersQuery,
        measures,
      },
      fromTemplate: false,
      largeSearch: false,
      order: null,// @ts-expect-error ttt
      orderBy: 'count_domain_num',
      orderType: 0,
    })
  }

  return {
    fetch,
    data,
    page,
    loading,
    cancel,
  }
}
