import React, { useEffect } from 'react'
import { Breadcrumb as WindBreadcrumb } from '@wind/wind-ui'
import './index.less'
// import { getFolderNameById } from '../../constants/fileStructure'
import { t } from 'gel-util/intl'
import { postPointBuried } from '@/utils/common/bury'

interface BreadcrumbProps {
  items: string[]
  onItemClick: (index: number) => void
}

const STRINGS = {
  MY_FILE: t('464132', '我的下载'),
  SUPER_LIST: t('464234', '一句话找企业'),
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onItemClick }) => {
  useEffect(() => {
    document.title = `${STRINGS.SUPER_LIST} - ${STRINGS.MY_FILE}`
    postPointBuried('922604570302')
  }, [])
  return (
    <WindBreadcrumb className="my-file-breadcrumb">
      <WindBreadcrumb.Item>
        <span className={items.length === 0 ? 'my-file-breadcrumb-active' : ''} style={{ cursor: 'pointer' }}>
          {/* 全部文件 */}
          {STRINGS.MY_FILE}
        </span>
      </WindBreadcrumb.Item>

      {/* {items.map((item, index) => (
        <WindBreadcrumb.Item key={`folder-${index}`}>
          <span
            onClick={() => onItemClick(index)}
            className={index === items.length - 1 ? 'my-file-breadcrumb-active' : ''}
            style={{ cursor: 'pointer' }}
          >
            {getFolderNameById(item)}
          </span>
        </WindBreadcrumb.Item>
      ))} */}
    </WindBreadcrumb>
  )
}

export default Breadcrumb
