import intl from '../../../../utils/intl'
import React from 'react'

export const patentPdfRows = [
  {
    title: '',
    dataIndex: '',
    width: '4%',
    render: (txt, record, index) => {
      return index + 1
    },
  },
  {
    title: intl('31717', '文件名称'),
    dataIndex: 'name',
    render: (txt, record, index) => {
      const url = record.url
      if (!url) return txt
      return (
        <a href={url} target="_blank" rel="noreferrer">
          {txt || '--'}
        </a>
      )
    },
  },
  {
    title: intl('265656', '文件状态'),
    dataIndex: 'status',
  },
]