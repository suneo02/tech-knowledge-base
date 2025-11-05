import React from 'react'
import { Breadcrumb as WindBreadcrumb } from '@wind/wind-ui'
import './index.less'
import { getFolderNameById } from '../../constants/fileStructure'

interface BreadcrumbProps {
  items: string[]
  onItemClick: (index: number) => void
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onItemClick }) => {
  return (
    <WindBreadcrumb className="my-file-breadcrumb">
      <WindBreadcrumb.Item>
        <span className={items.length === 0 ? 'my-file-breadcrumb-active' : ''} style={{ cursor: 'pointer' }}>
          全部文件
        </span>
      </WindBreadcrumb.Item>

      {items.map((item, index) => (
        <WindBreadcrumb.Item key={`folder-${index}`}>
          <span
            onClick={() => onItemClick(index)}
            className={index === items.length - 1 ? 'my-file-breadcrumb-active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {getFolderNameById(item)}
          </span>
        </WindBreadcrumb.Item>
      ))}
    </WindBreadcrumb>
  )
}

export default Breadcrumb
