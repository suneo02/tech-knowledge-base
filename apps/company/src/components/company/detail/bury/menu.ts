import { pointBuriedGel } from '@/api/configApi'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { isArray } from 'lodash'

import { CorpMenuData } from '@/views/Company/menu/type.ts'

function hasMatchingChildKey(allMenu: CorpMenuData[], targetKey: string) {
  return allMenu.some((menuLevel1) => {
    if (!(menuLevel1.children && menuLevel1.children.length > 0)) {
      return false
    }
    // 递归搜索所有子菜单
    return menuLevel1.children.some((item) => item.key === targetKey)
  })
}

export const handleBuryInCorpDetailMenu = async (
  selectedKeys: any,
  corpId: string,
  allTreeDataObj: any,
  allMenu: CorpMenuData[]
) => {
  try {
    if (!selectedKeys || !isArray(selectedKeys)) {
      return
    }

    let menuStr: any = selectedKeys.toString()
    const menuTitle = menuStr
    if (allTreeDataObj && allTreeDataObj[menuStr]) {
      menuStr = allTreeDataObj[menuStr]
    }
    if (selectedKeys.indexOf('gettechscore') !== -1) {
      pointBuriedByModule(922602101126, {
        company_id: corpId,
      })
    }
    if (hasMatchingChildKey(allMenu, selectedKeys[0])) {
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
    pointBuriedGel('922602100639', menuStr.titleStr ? menuStr.titleStr : menuTitle, 'listQY')
  } catch (e) {
    console.error(e)
  }
}
