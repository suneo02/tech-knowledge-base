import { pointBuriedGel } from '@/api/configApi'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { CorpMenuCfg } from '@/types/corpDetail/menu'

export const handleBuryInCorpDetailMenu = async (
  selectedKeys: string | string[],
  corpId: string,
  currentMenus: CorpMenuCfg
) => {
  try {
    if (!selectedKeys) {
      return
    }

    const key = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys
    if (!key) return

    let titleStr = key
    let isChild = false

    // 遍历 currentMenus 查找对应的菜单项名称和层级
    for (const moduleKey in currentMenus) {
      const moduleCfg = currentMenus[moduleKey]
      if (!moduleCfg) continue

      // 检查是否是一级菜单
      if (moduleKey === key) {
        titleStr = moduleCfg.title
        break
      }

      // 检查是否是二级菜单
      const child = moduleCfg.children?.find((c) => c.showModule === key)
      if (child) {
        titleStr = child.showName || child.showModule
        isChild = true
        break
      }
    }

    if (key.indexOf('gettechscore') !== -1) {
      pointBuriedByModule(922602101126, {
        company_id: corpId,
      })
    }
    if (isChild) {
      // 是二级菜单
      pointBuriedByModule(922602100292, {
        currentPage: 'company',
        currentId: corpId,
        opId: corpId,
      })
    }
    /**
     * 之前的埋点逻辑很奇怪
     */
    pointBuriedGel('922602100639', titleStr, 'listQY')
  } catch (e) {
    console.error(e)
  }
}
