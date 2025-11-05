import { CorpMenuNum } from '@/components/company/detail/comp/CorpNum.tsx'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { TCorpArea } from '@/handle/corp/corpArea.ts'
import intl from '@/utils/intl'
import { corpDetailBaseMenuNumHide } from '@/views/Company/menu/menus.ts'
import { ICorpMenuCfg, ICorpMenuModuleCfg } from '@/views/Company/menu/type.ts'
import React, { ReactNode } from 'react'
import { ICorpBasicNumFront } from '../../../handle/corp/basicNum/type.ts'

/**
 * @author suneo
 * 老旧逻辑，作者只是拆分出来
 * @param menus
 * @param nums
 * @param corpArea
 */
export const handleCorpDetailMenu = (menus: ICorpMenuCfg, nums: ICorpBasicNumFront, corpArea: TCorpArea) => {
  const allMenu = []
  const allMenuData = []
  const allMenuDataObj = {}
  for (const k in menus) {
    const menuModule: ICorpMenuModuleCfg = menus[k]
    if (menuModule.hide) continue
    const menu = {
      key: k,
      title: menuModule.title,
      children: [],
    }
    const menuRoot = {
      key: k,
      title: menuModule.title, // 一级menu
    }
    allMenuData.push(menuRoot)
    allMenuDataObj[k] = menuRoot
    menuModule.showList.forEach((menuKey, idx) => {
      // 只有 日本和卢森堡 展示变更历史
      if (menuKey === 'showHistoryChange' && corpArea !== 'japan' && corpArea !== 'lux') {
        return
      }
      const modelNum = getCorpModuleNum(menuModule.numArr[idx], nums)

      if (!(modelNum === true || (typeof modelNum === 'number' && modelNum > 0))) {
        // 不展示 该 menu
        return
      }
      let str: ReactNode
      if (corpDetailBaseMenuNumHide.includes(menuModule.showList[idx])) {
        str = ''
      } else {
        str = <CorpMenuNum modelNum={modelNum} />
      }
      if (menuKey === 'historylegalperson' && (corpArea === 'england' || corpArea === 'nzl')) {
        // 英国 新西兰， 模块名称变更 => 历史主要人员
        menuModule.showName[idx] = intl('138503', ' 主要人员 ')
      }
      const menuItem = {
        key: menuKey,
        title: menuModule.showName[idx] ? (
          <>
            {menuModule.showName[idx]}
            {str}{' '}
          </>
        ) : (
          menuKey
        ),
        titleStr: menuModule.showName[idx] ? menuModule.showName[idx] : menuKey,
        titleNum: str,
        parentMenuKey: k,
      }
      menu.children.push(menuItem)
      allMenuData.push(menuItem)
      allMenuDataObj[menuKey] = allMenuData[allMenuData.length - 1]
    })
    if (menu.children.length > 0) {
      allMenu.push(menu)
    }
  }
  return {
    allMenuData,
    allMenu,
    allMenuDataObj,
  }
}
