import { getVipInfo } from '@/lib/utils'
import { wftCommon } from '@/utils/utils'
import { isEmpty } from 'lodash'
import { GelHashMap } from '../config'
import { LinksModule } from '../module'

/**
 * 检查链接权限，判断用户是否有权限访问该链接
 *
 * 此处逻辑待优化，是否应该放在 链接 生成的方法里
 * 例如 在 链接生成外部包装一层，判断权限，如果权限不足，则不生成链接
 * TODO: 待优化
 * @param url 链接URL
 * @param linkModule 可选，链接模块类型
 * @returns 返回是否有权限访问，true表示有权限，false表示无权限
 */

export const checkLinkPermission = (url: string, linkModule?: LinksModule): boolean => {
  if (!url || isEmpty(url)) {
    return false
  }

  // 如果没有提供linkModule，尝试从URL中解析
  let ifPersonLink = false
  if (!linkModule) {
    // 遍历所有模块Hash，检查URL是否包含对应Hash
    if (url.includes(GelHashMap[LinksModule.CHARACTER])) {
      ifPersonLink = true
    }
  }

  // 海外配置检查
  if (wftCommon.is_overseas_config) {
    // 如果是人物链接，且用户不是SVIP
    if (ifPersonLink) {
      const vipInfo = getVipInfo()
      if (!vipInfo.isSvip) {
        return false
      }
    }
  }

  return true
}
