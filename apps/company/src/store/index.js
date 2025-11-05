import React from "react"
import { shallow } from 'zustand/shallow'

// 提供给类组件连接zustand
export const connectZustand = (useStore, selector) => {
  return (Component) =>
    React.forwardRef((props, ref) => <Component ref={ref} {...props} {...useStore(selector, shallow)} />)
}