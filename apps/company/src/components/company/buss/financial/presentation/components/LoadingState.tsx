/**
 * 加载占位组件：用于页面或区域数据加载的统一骨架。
 * @author yxlu.calvin
 * @example
 * <LoadingState />
 * @remarks
 * - 高度：默认 320px，用于表格或区域占位，可按需调整
 */
import React from 'react'
import { Spin } from '@wind/wind-ui'

export const LoadingState: React.FC = () => {
  return (
    <Spin>
      <div style={{ height: 320 }}></div>
    </Spin>
  )
}