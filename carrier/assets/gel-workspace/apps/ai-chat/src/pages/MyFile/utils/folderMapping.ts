import { FOLDER_IDS, FolderId } from './navigation'

// 文件夹ID到名称的映射
const folderNameMap: Record<FolderId, string> = {
  [FOLDER_IDS.DOWNLOADS]: '我的下载',
  [FOLDER_IDS.DEFAULT]: '默认文件夹',
  [FOLDER_IDS.KNOWLEDGE]: '我的知识库',
}

/**
 * 根据文件夹ID获取文件夹名称
 * @param folderId 文件夹ID
 * @returns 文件夹名称，如果ID无效则返回ID本身
 */
export const getFolderName = (folderId: string): string => {
  return folderNameMap[folderId as FolderId] || folderId
}

/**
 * 根据文件夹ID获取面包屑导航文本
 * @param folderId 文件夹ID
 * @returns 面包屑导航文本数组
 */
export const getBreadcrumbsFromFolder = (folderId: string): string[] => {
  const folderName = getFolderName(folderId)
  return [folderName]
}

export default folderNameMap
