// @ts-nocheck
import { LoadingO } from '@wind/icons'
import React, { useEffect, forwardRef, useState } from 'react'
import intl from '@/utils/intl'

const More = forwardRef(
  (
    {
      enable,
      onLoading,
      message,
    }: {
      enable: boolean
      onLoading: () => Promise<void>
      message?: string
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (!enable) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log(entry)
          if (entry.isIntersecting && !loading) {
            setLoading(true)
            onLoading().then(() => {
              setTimeout(() => {
                setLoading(false)
              }, 0)
            })
          }
        },
        { threshold: 1.0 }
      )

      if (ref?.current) {
        observer.observe(ref.current)
      }

      return () => {
        if (ref?.current) {
          observer.unobserve(ref.current)
        }
      }
    }, [enable, loading, ref])

    return (
      <div ref={ref} style={{ textAlign: 'center' }}>
        {loading ? (
          <>
            <LoadingO size="small" style={{ marginRight: 8 }} data-uc-id="7m11nk0Vp-" data-uc-ct="loadingo" />
            {intl('428450', '加载中...')}
          </>
        ) : (
          message || (enable ? intl('416954', '上拉加载更多') : intl('416942', '我是有底线的'))
        )}
      </div>
    )
  }
)

export default More
