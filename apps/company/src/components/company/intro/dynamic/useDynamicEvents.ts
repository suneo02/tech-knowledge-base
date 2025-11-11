import { getMyCorpEventListNew } from '@/api/corp/event'
import { ICorpEvent } from '@/api/corp/eventTypes'
import { wftCommon } from '@/utils/utils'
import { useRequest } from 'ahooks'
import { isEn } from 'gel-util/intl'
import { isNil } from 'lodash'
import { useCallback, useRef } from 'react'

/**
 * 动态事件数据获取 Hook
 * @author 张文浩<suneo@wind.com.cn>
 * @param companycode 公司代码
 * @returns 动态事件列表和获取函数
 */
export const useDynamicEvents = (companycode: string) => {
  const hasLoadedRef = useRef(false)

  const fullDate = (n: number): string => {
    if (Number(n) < 10) {
      return '0' + String(n)
    } else {
      return String(n)
    }
  }

  const getFullDate = (date: Date): string => {
    const year = Number(date.getFullYear())
    const month = fullDate(date.getMonth() + 1)
    const day = fullDate(date.getDate())
    return String(year) + String(month) + String(day)
  }

  const addEventListeners = useCallback(() => {
    setTimeout(() => {
      try {
        document.querySelector('.r-dynamic-event') &&
          document.querySelectorAll('.r-dynamic-event').forEach((t) => {
            if (isNil(t)) {
              return
            }
            t.addEventListener('mouseenter', function (e) {
              //  @ts-expect-error ttt
              let tt = e.target.querySelector('.dynamic-event-abstract')
              if (!tt) {
                //  @ts-expect-error ttt
                tt = e.target.querySelector('.wi-link-color')
              }
              if (!tt) {
                return
              }
              if (!tt.hasAttribute('title')) {
                const txt = tt.innerText || ''
                if (txt) {
                  tt.setAttribute('title', txt)
                }
              }
            })
          })
      } catch (error) {
        console.error(error)
      }
    }, 100)
  }, [])

  const translateContent = useCallback(() => {
    if (isEn()) {
      setTimeout(() => {
        wftCommon.translateDivHtml('.dynamic-table', window.$('.dynamic-table'))
      }, 300)
    }
  }, [])

  // 使用 useRequest 管理异步请求
  const { data, loading, error, runAsync } = useRequest(
    async () => {
      if (!companycode) {
        throw new Error('Company code is required')
      }

      const today = new Date()
      const res = await getMyCorpEventListNew({
        companyCode: companycode,
        endDate: getFullDate(today),
        type: 1,
      })

      if (res && Number(res.ErrorCode) === 0 && res.Data && res.Data.length) {
        // 处理成功后的副作用
        setTimeout(() => {
          addEventListeners()
          translateContent()
        }, 0)
        return res.Data as ICorpEvent[]
      } else {
        return []
      }
    },
    {
      manual: true,
      onError: (err) => {
        console.error('Failed to fetch dynamic events:', err)
      },
    }
  )

  const mycorpeventlist = data || []
  const hasLoaded = hasLoadedRef.current
  const hasData = mycorpeventlist && mycorpeventlist.length > 0

  const fetchDynamicEvents = useCallback(async () => {
    if (!companycode || hasLoadedRef.current) {
      return []
    }
    hasLoadedRef.current = true // 在请求开始时就标记为已加载

    try {
      const result = await runAsync()
      return result || []
    } catch (error) {
      console.error('Failed to fetch dynamic events:', error)
      return []
    }
  }, [companycode, runAsync])

  return {
    mycorpeventlist,
    loading,
    hasLoaded,
    hasData,
    fetchDynamicEvents,
    error,
  }
}
