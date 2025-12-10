// 文件结构数据和相关工具函数

// 文件节点数据结构
export interface FileNode {
  id: string
  name: string
  isFolder: boolean
  children?: FileNode[]
}

// 文件结构数据
export const fileStructure: FileNode[] = [
  { id: 'downloads', name: '我的下载', isFolder: true },
  // { id: 'file', name: '默认文件夹', isFolder: true },
  // { id: 'knowledge', name: '我的知识库', isFolder: true },
]

// 本地存储键名
export const ACTIVE_FOLDER_KEY = 'myFileActiveFolder'

// 通过ID查找文件夹的名称
export const getFolderNameById = (id: string): string => {
  // 递归查找函数
  const findName = (nodes: FileNode[]): string | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node.name
      }
      if (node.children) {
        const result = findName(node.children)
        if (result) return result
      }
    }
    return null
  }

  const result = findName(fileStructure)
  return result || id // 如果找不到，则返回原始ID
}

// 将原始数据转换为 Tree 组件需要的数据结构
export const convertToTreeData = (nodes: FileNode[]) => {
  return nodes.map((node) => ({
    key: node.id,
    title: node.name,
    isFolder: node.isFolder,
    children: node.children ? convertToTreeData(node.children) : undefined,
  }))
}

// 检测是否为 hash 路由模式
export const isHashRouter = () => window.location.hash.includes('#/')
