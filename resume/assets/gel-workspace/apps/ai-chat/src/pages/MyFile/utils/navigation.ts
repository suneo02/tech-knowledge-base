import { NavigateFunction } from 'react-router-dom'

// 检测是否为 hash 路由模式
const isHashRouter = () => window.location.hash.includes('#/')

/**
 * 导航到文件管理页面的特定文件夹
 * @param navigate - React Router的navigate函数
 * @param folderId - 要跳转到的文件夹ID ('downloads'|'file'|'knowledge')
 */
export const navigateToFolder = (navigate: NavigateFunction, folderId: string) => {
  // 获取当前应用的基础路径
  let basePath = '/my-file'

  // 如果当前使用的是 hash 路由，则保留完整路径
  // 例如：/#/super/my-file
  if (isHashRouter()) {
    // 如果当前路径中包含 super，则保留该路径
    if (window.location.hash.includes('/super/')) {
      basePath = '/super/my-file'
    }
    // console.log('使用 Hash 路由导航:', { basePath, folderId })
  }

  navigate(`${basePath}?folder=${folderId}`)
}

// 预定义的文件夹ID常量
export const FOLDER_IDS = {
  DOWNLOADS: 'downloads',
  DEFAULT: 'file',
  KNOWLEDGE: 'knowledge',
} as const

export type FolderId = (typeof FOLDER_IDS)[keyof typeof FOLDER_IDS]
