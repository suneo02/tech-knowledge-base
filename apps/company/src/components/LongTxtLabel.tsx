import React, { useState } from 'react'
import styled from 'styled-components'
import intl from '../utils/intl'

const LongTxtLabel = (props) => {
  const [open, setOpen] = useState(true)
  const openFun = () => {
    setOpen(!open)
  }
  return (
    <Box>
      <span className={open ? 'long-txt-label-2' : ''}>{props.txt}</span>
      <span className="wi-btn-color" onClick={openFun}>
        {' '}
        {open ? intl('28912', '展开') : intl('119102', '收起')}{' '}
      </span>
    </Box>
  )
}

const Box = styled.div``

export default LongTxtLabel
