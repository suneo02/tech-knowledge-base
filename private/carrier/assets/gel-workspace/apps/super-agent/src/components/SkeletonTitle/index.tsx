import { Skeleton } from 'antd'
import React from 'react'

export interface SkeletonTitleProps {
  loading?: boolean
  children?: React.ReactNode
}

export const SkeletonTitle: React.FC<SkeletonTitleProps> = ({ loading, children }) => {
  if (loading) {
    return <Skeleton.Input active size="small" />
  }
  return <>{children}</>
}
