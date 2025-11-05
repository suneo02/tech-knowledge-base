/** @format */

import { hashParams } from '../utils/links'
import axios from './index'

/**
 * 暂时取这个名字，未来写成通用
 * @param {String} url
 * @param {Object} data
 * @param {Boolean} noExtra // 这个参数取决于url是否需要extra参数
 * @returns
 */
export const getGroupDataApi = async (url, data, noExtra) => {
  try {
    const { getAllParams } = hashParams()
    if (url == null) {
      console.error('🚀 ~ getGroupDataApi ~ url:', url)
      return
    }
    const params = Object.assign({}, data, getAllParams())

    if (url.indexOf('/') > -1) {
      // company未来需要改造的接口
      if (url.indexOf('getcorpactcontrol_calc') > -1) {
        params.companyid = 'ginfvm993g'
      }
      /** group的特殊处理 */
      url = `/Wind.WFC.Enterprise.Web/Enterprise/gel/${url}${noExtra ? '' : `/${params?.id || params?.companycode || params?.companyCode || params?.CompanyCode}`}`
    } else {
      url = `/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=${url}`
    }
    return await axios.request({
      url,
      method: 'post',
      data: { ...params },
      group: true,
    })
  } catch (e) {
    console.error(e)
    return null
  }
}
