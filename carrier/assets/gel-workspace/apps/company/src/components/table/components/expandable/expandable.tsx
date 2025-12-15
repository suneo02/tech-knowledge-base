import { DownO } from '@wind/icons'
import './expandable.less'
import intl from '@/utils/intl'
import React from 'react'

/**
 * 针对展开收起的通用功能
 * @param { expandedRowKeys, setExpandedRowKeys } props
 * @returns
 */
export const useTableExpandable = ({ expandedRowKeys, setExpandedRowKeys }) => {
  const handleClick = (record) => {
    const expandKeys = [...expandedRowKeys]
    if (expandKeys.includes(record.key)) {
      setExpandedRowKeys([])
    } else {
      setExpandedRowKeys([record.key])
    }
  }

  const defaultExpandedColumns = {
    title: intl('36348', '操作'),
    align: 'center',
    width: '60px',
    render: (_, record) => {
      const expand = expandedRowKeys.includes(record.key)
      return (
        <div
          className={`expandable-contianer${expand ? ' active' : ''}`}
          onClick={() => handleClick(record)}
          data-uc-id="JEF4Z7SGXY"
          data-uc-ct="div"
        >
          {expand ? intl('119102', '收起') : intl('40513', '详情')}
          <DownO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="JenMCh1uGt"
            data-uc-ct="downo"
          />
        </div>
      )
    },
  }

  return {
    defaultExpandedColumns,
  }
}
