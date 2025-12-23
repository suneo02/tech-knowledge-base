import React from 'react'
import { Spin, SpinProps } from 'antd'
import styles from './index.module.less'

export interface LoadingProps extends SpinProps {
  title?: string
}

/**
 * 渲染一个加载中的动画组件
 *
 * 该组件使用了 Ant Design 的 Spin 组件来显示一个旋转的加载动画
 * 它会在页面中居中显示，并占据整个屏幕的宽度
 *
 * @returns 返回一个包含加载动画的组件
 */
export const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <div className={styles.loadingContainer}>
      <Spin {...props} tip={props.title || props.tip} />
    </div>
  )
}

export default Loading
