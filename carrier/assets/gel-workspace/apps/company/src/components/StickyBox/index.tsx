import React from 'react'
import './index.less'

interface StickyBoxProps {
  children?: React.ReactNode
  offsetTop?: number
  zIndex?: number
  [key: string]: any
}

const StickyBox: React.FC<StickyBoxProps> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={props?.className ? `sticky-box-container ${props?.className}` : 'sticky-box-container'}
      style={
        props?.style
          ? { top: props?.offsetTop || 0, zIndex: props?.zIndex || 1, ...props?.style }
          : { top: props?.offsetTop || 0, zIndex: props?.zIndex || 1 }
      }
    >
      {children}
    </div>
  )
}

export default StickyBox
