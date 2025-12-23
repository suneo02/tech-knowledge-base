/** @format */

import { Tooltip } from 'antd'
import React from 'react'
import './expandableText.less'

const ExpandableText = ({ text, placement, maxWidth }) => {
  return (
    <Tooltip
      overlayStyle={{ maxWidth: maxWidth || '40vw' }}
      color="#fff"
      placement={placement || 'left'}
      title={<div className="tooltip-content">{text}</div>}
    >
      <div className="expand-container">
        <div>{text}</div>
      </div>
    </Tooltip>
  )
}

export default ExpandableText
