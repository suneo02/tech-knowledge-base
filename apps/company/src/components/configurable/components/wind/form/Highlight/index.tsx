import React from 'react'
import { Tag } from 'antd'

const Highlight = (props: { list: string[] }) => {
  return (
    <>
      {props.list?.map((res, index) => {
        return (
          <Tag
            key={index}
            closable
            onClose={(e) => {
              e.preventDefault()
            }}
          >
            {res}
          </Tag>
        )
      })}
    </>
  )
}

export default Highlight
