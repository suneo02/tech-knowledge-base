import React from 'react'
import Breadcrumb from '../Breadcrumb'
import FileTable from '../FileTable'
// import SearchBar from '../SearchBar'
import './index.less'
import { Result } from '@wind/wind-ui'
import User from '@/components/layout/Page/User'
const PREFIX = 'my-file-content'

interface FileContentProps {
  activeFolder: string | null
  breadcrumbs: string[]
  onBreadcrumbClick: (index: number) => void
}

export const FileContent: React.FC<FileContentProps> = ({ activeFolder, breadcrumbs, onBreadcrumbClick }) => {
  return (
    <div className={`${PREFIX}-container`}>
      {/* 头部区域 */}
      <div className={`${PREFIX}-header`}>
        <Breadcrumb items={breadcrumbs} onItemClick={onBreadcrumbClick} />
        <User showCoins from="my-file" />
      </div>

      {/* 内容区域 */}
      <div className={`${PREFIX}-body`}>
        {activeFolder ? (
          <>
            {/* <div className={`${PREFIX}-search`}>
              <SearchBar />
            </div> */}
            <FileTable folderId={activeFolder} />
          </>
        ) : (
          <div className={`${PREFIX}-empty`}>
            <Result status={'no-data'} subTitle="请选择左侧文件夹查看内容" />
          </div>
        )}
      </div>
    </div>
  )
}

export default FileContent
