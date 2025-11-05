import React from 'react'
import styles from './index.module.less'
export const WIcon = ({
  children,
  active,
  icon,
}: {
  children?: React.ReactNode
  active?: boolean
  icon?: React.ReactNode
}) => {
  // 如果有提供childClassName，则克隆children并添加类名
  const element = icon || children
  if (!React.isValidElement(element)) {
    return element
  }

  const childrenWithClass = React.cloneElement(element as React.ReactElement<any>, {
    className: `${styles.wicon} ${active ? styles.wiconActive : ''}`,
  })
  return childrenWithClass
}
