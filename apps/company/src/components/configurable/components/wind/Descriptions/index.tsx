import { Descriptions, theme } from 'antd'
import useDescriptions from './useDescriptions'
import './index.scss'
import { DescriptionsProps } from 'antd/lib'
import React from 'react'
export type WindDescriptionsProps = Omit<DescriptionsProps, 'items'> & {
  dataSource: any
  columns: any
}

const WindDescriptions = (props: WindDescriptionsProps) => {
  console.log('🚀 ~ props:', props)
  const { items } = useDescriptions(props)
  const { token } = theme.useToken()

  console.log(items)

  return (
    <Descriptions
      className="simple-descriptions"
      style={
        {
          color: token?.colorText,
          '--paddingBlock': `${token?.Table?.cellPaddingBlockSM}px`,
          '--paddingInline': `${token?.Table?.cellPaddingInlineSM}px`,
          '--oddBg': (token?.Table as any)?.rowEvenBg,
          '--evenBg': (token?.Table as any)?.rowOddBg,
        } as any
      }
      size="small"
      items={items}
      bordered
      column={props.column}
    />
  )
}

export default WindDescriptions
