import { Tag } from 'antd'
import React from 'react'

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
            data-uc-id="tEwDw0cCxL"
            data-uc-ct="tag"
            data-uc-x={index}
          >
            {res}
          </Tag>
        )
      })}
    </>
  )
}

export default Highlight
