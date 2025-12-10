import { getAllUrlSearch, getUrlSearchValue } from 'gel-util/common'

/**
 * @author: 陆一新<yxlu.calvin@wind.com.cn>
 * 解析URL中的参数，包括查询参数和哈希参数。
 * 返回一个对象，包含两个方法：
 * - getAllParams: 返回一个包含所有参数的对象。
 * - getParamValue: 返回指定参数的值。
 * @returns { getAllParams: () => ParamsMap, getParamValue: (param: string) => string | undefined }
 */
export const hashParams = () => {
  const getAllParams = getAllUrlSearch

  const getParamValue = getUrlSearchValue

  return {
    getAllParams,
    getParamValue,
  } as const // 使用 as const 增加类型安全性
}
