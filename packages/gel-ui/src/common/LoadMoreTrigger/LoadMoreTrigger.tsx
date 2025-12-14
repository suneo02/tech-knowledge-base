import { Spin } from '@wind/wind-ui'
import { createIntersectionObserver } from 'gel-util/common'
import React, { useEffect, useRef } from 'react'
import './LoadMoreTrigger.less'

interface LoadMoreTriggerProps {
  onLoadMore: () => void
  loading: boolean
}

export const LoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({ onLoadMore, loading }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { observable } = createIntersectionObserver(onLoadMore, undefined, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    })

    const currentRef = ref.current
    if (currentRef) {
      observable.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observable.unobserve(currentRef)
      }
      observable.disconnect()
    }
  }, [onLoadMore])

  return (
    <div ref={ref} className="load-more-trigger">
      {loading ? <Spin spinning={true} /> : null}
    </div>
  )
}
