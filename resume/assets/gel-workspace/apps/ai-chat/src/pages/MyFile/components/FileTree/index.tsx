import React, { useState } from 'react'
import { Tree } from '@wind/wind-ui'
import './index.less'
import { FolderIcon } from '@/assets/icon'
import { useLocation } from 'react-router-dom'
import { fileStructure, convertToTreeData, ACTIVE_FOLDER_KEY, isHashRouter } from '../../constants/fileStructure'
import { t } from 'gel-util/intl'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'

const PREFIX = 'file-tree'

interface FileTreeProps {
  onFolderSelect: (folder: string) => void
  activeFolder: string | null
}

const STRINGS = {
  FILE_TREE_TITLE: t('464147', '文件管理'),
}

// 将原始数据转换为 Tree 组件需要的数据结构
const treeData = convertToTreeData(fileStructure)

export const FileTree: React.FC<FileTreeProps> = ({ onFolderSelect, activeFolder }) => {
  // 默认展开所有顶层节点
  const [expandedKeys, setExpandedKeys] = useState<string[]>(fileStructure.map((item) => item.id))
  const navigate = useNavigateWithLangSource()
  const location = useLocation()

  // 处理选择节点
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = (selectedKeys: any) => {
    if (selectedKeys.length > 0) {
      const selectedFolder = selectedKeys[0]
      onFolderSelect(selectedFolder)

      // 更新 URL 参数
      // 对于 hash 路由，我们需要特殊处理
      if (isHashRouter()) {
        // 从当前 hash 中提取出基本路径部分
        const hashPath = location.pathname
        const hashSearch = `?folder=${selectedFolder}`

        // console.log('更新 URL (Hash 路由):', { hashPath, hashSearch })
        navigate(`${hashPath}${hashSearch}`, { replace: true })
      } else {
        // 普通路由正常处理
        const searchParams = new URLSearchParams(location.search)
        searchParams.set('folder', selectedFolder)
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
      }

      // 保存到本地存储
      localStorage.setItem(ACTIVE_FOLDER_KEY, selectedFolder)
      // console.log('选择的文件夹已保存到本地存储:', selectedFolder)
    }
  }

  // 处理展开/折叠节点
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys)
  }

  // 自定义图标渲染
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderIcon = (nodeProps: any) => {
    const { isFolder } = nodeProps.data || {}

    if (isFolder) {
      return <FolderIcon />
    }

    return <FolderIcon />
  }

  return (
    <div className={`${PREFIX}-container`}>
      <div className={`${PREFIX}-header`}>{STRINGS.FILE_TREE_TITLE}</div>
      <div className={`${PREFIX}-content`}>
        <Tree
          size="large"
          treeData={treeData}
          expandedKeys={expandedKeys}
          selectedKeys={activeFolder ? [activeFolder] : []}
          onSelect={handleSelect}
          onExpand={handleExpand}
          icon={renderIcon}
          showIcon
        />
      </div>
    </div>
  )
}

export default FileTree
