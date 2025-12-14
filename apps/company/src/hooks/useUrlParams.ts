import { useLocation } from 'react-router-dom'

/**
 * @author 陆一新<yxlu@wind.com.cn>
 * @description 获取 URL 查询参数的 hook
 * @param paramName 参数名称
 * @param defaultValue 默认值
 * @returns 参数值
 */
export const useUrlParams = (paramName: string, defaultValue: string = '') => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  return searchParams.get(paramName) || defaultValue
}
