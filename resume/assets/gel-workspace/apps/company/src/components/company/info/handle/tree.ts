interface IndustryItem {
  industryName: string
}

export interface TreeNode {
  title: string
  key: string
  children?: TreeNode[]
}

/**
 * 将字符串数组转换为树形结构
 * @param industries - 产业名称数组
 * @returns 树形结构数组
 */
const buildTreeFromArray = (industries: string[]): TreeNode[] => {
  if (industries.length === 0) return []

  const root: TreeNode = {
    title: industries[0],
    key: '0-0',
  }

  let currentNode = root
  for (let i = 1; i < industries.length; i++) {
    const newNode: TreeNode = {
      title: industries[i],
      key: `${currentNode.key}-0`,
    }
    currentNode.children = [newNode]
    currentNode = newNode
  }

  return [root]
}

/**
 * 将产业数据转换为树形结构
 * @param data - 产业数据（字符串或对象数组）
 * @returns 树形结构数组
 */
export const industryToTreeData = (data: IndustryItem[] | string): TreeNode[] => {
  if (typeof data === 'string') {
    const industries = data.split('-')
    return buildTreeFromArray(industries)
  }

  const industries = data.map((item) => item.industryName)
  return buildTreeFromArray(industries)
}
