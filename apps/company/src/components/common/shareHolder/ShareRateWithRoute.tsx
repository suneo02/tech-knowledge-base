import React from 'react'

interface ShareRateWithRouteProps {
  value: string
  hasRoute: boolean
  onRouteClick: () => void
  /** 值的容器样式，默认 flex: 1 */
  valueStyle?: React.CSSProperties
}

/**
 * 股权比例展示组件（带股权路径查看按钮）
 */
export const ShareRateWithRoute: React.FC<ShareRateWithRouteProps> = ({
  value,
  hasRoute,
  onRouteClick,
  valueStyle,
}) => {
  if (!hasRoute) {
    return <>{value}</>
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={valueStyle || { flex: 1 }}>{value}</div>
      <div className="share-route" onClick={onRouteClick} />
    </div>
  )
}
