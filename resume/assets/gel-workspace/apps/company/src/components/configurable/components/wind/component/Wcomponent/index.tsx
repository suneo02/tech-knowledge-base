import { Empty } from '@wind/wind-ui'
import React from 'react'
import { isArrayAndNotEmpty, isObjectAndNotEmpty } from '../../../../utils/common'
import { TreeConfigProps } from '../../../container/type'
import { renderChildren } from './render/renderChildren'

const WindComponent: React.FC<{ config: TreeConfigProps }> = ({ config }) => {
  console.log('🚀 ~ config:', config)
  if (isArrayAndNotEmpty(config)) {
    return renderChildren({ list: config })
  } else if (isObjectAndNotEmpty(config)) {
    return renderChildren({ list: [config] })
  } else {
    return <Empty />
  }
}

export default WindComponent
