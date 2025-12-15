import React, { useState } from 'react'
import FileTree from './components/FileTree'
import FileContent from './components/FileContent'
import './index.less'
import { useLocation } from 'react-router-dom'
const PREFIX = 'my-file'

const MyFilePage: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<string | null>('downloads')
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['downloads'])
  const location = useLocation()

  useEffect(() => {
    const folder = location.search.split('=')[1]
    if (folder) {
      setActiveFolder(folder)
      setBreadcrumbs([folder])
    }
  }, [location.search])

  const handleFolderSelect = (folder: string) => {
    setActiveFolder(folder)
    setBreadcrumbs([folder])
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // 点击"全部文件"
      setActiveFolder(null)
      setBreadcrumbs([])
    } else {
      // 点击特定面包屑
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
      setBreadcrumbs(newBreadcrumbs)
      setActiveFolder(newBreadcrumbs[newBreadcrumbs.length - 1])
    }
  }

  return (
    <div className={`${PREFIX}-container`}>
      {/* 左侧文件树 */}
      {/* <div className={`${PREFIX}-sidebar`}>
        <FileTree onFolderSelect={handleFolderSelect} activeFolder={activeFolder} />
      </div> */}

      {/* 右侧内容区 */}
      <div className={`${PREFIX}-content`}>
        <FileContent activeFolder={activeFolder} breadcrumbs={breadcrumbs} onBreadcrumbClick={handleBreadcrumbClick} />
      </div>
    </div>
  )
}

export default MyFilePage
