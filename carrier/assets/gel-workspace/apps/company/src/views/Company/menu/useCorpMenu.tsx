import { CorpMenuNum } from '@/components/company/detail/comp/CorpNum.tsx'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { TCorpArea } from '@/handle/corp/corpArea.ts'
import intl from '@/utils/intl'
import { corpDetailBaseMenuNumHide } from '@/views/Company/menu/menus.ts'
import { ICorpMenuCfg, ICorpMenuModuleCfg } from '@/views/Company/menu/type.ts'
import React, { ReactNode } from 'react'
import { ICorpBasicNumFront } from '../../../handle/corp/basicNum/type.ts'

/**
 * 处理企业详情页菜单树结构
 *
 * 功能说明：
 * 1. 根据菜单配置和企业统计数据，生成可渲染的菜单树结构
 * 2. 过滤掉没有数据的菜单项（统计数字为0或false）
 * 3. 根据地区特殊处理某些菜单项（如日本、卢森堡、英国、新西兰）
 * 4. 为菜单项添加统计数字显示
 *
 * @param menus - 菜单配置对象，包含所有菜单模块的定义
 * @param nums - 企业统计数据，用于判断菜单项是否有数据
 * @param corpArea - 企业所属地区，用于地区特殊处理
 *
 * @returns 返回三个数据结构：
 *   - allMenu: 树形菜单结构（用于左侧菜单树渲染）
 *   - allMenuData: 扁平化的所有菜单项数组
 *   - allMenuDataObj: 以 menuKey 为键的菜单项对象映射
 *
 * @author suneo
 */
export const handleCorpDetailMenu = (menus: ICorpMenuCfg, nums: ICorpBasicNumFront, corpArea: TCorpArea) => {
  // 初始化返回数据结构
  const allMenu = [] // 树形菜单结构，包含父子关系
  const allMenuData = [] // 扁平化的所有菜单项
  const allMenuDataObj = {} // 菜单项的键值对映射，便于快速查找

  // 遍历所有菜单模块（如：基础信息、金融行为、经营状况等）
  for (const k in menus) {
    const menuModule: ICorpMenuModuleCfg = menus[k]

    // 跳过被隐藏的菜单模块（如基金数据、IPO数据等特殊模块）
    if (menuModule.hide) continue

    // 创建一级菜单项（父菜单）
    const menu = {
      key: k,
      title: menuModule.title,
      children: [], // 子菜单项列表
    }

    // 创建一级菜单的数据对象
    const menuRoot = {
      key: k,
      title: menuModule.title,
    }

    // 将一级菜单添加到数据结构中
    allMenuData.push(menuRoot)
    allMenuDataObj[k] = menuRoot

    // 遍历当前模块下的所有子菜单项
    menuModule.showList.forEach((menuKey, idx) => {
      // 特殊处理：只有日本和卢森堡地区才展示"变更历史"菜单
      if (menuKey === 'showHistoryChange' && corpArea !== 'japan' && corpArea !== 'lux') {
        return
      }

      // 获取该菜单项对应的统计数字
      // modelNum 可能是：
      // - true: 表示该菜单项存在但不显示数字
      // - number: 表示该菜单项的数据条数
      // - false/0: 表示该菜单项没有数据
      const modelNum = getCorpModuleNum(menuModule.numArr[idx], nums)

      // 如果菜单项没有数据（不是 true 且数字不大于0），则不显示该菜单项
      if (!(modelNum === true || (typeof modelNum === 'number' && modelNum > 0))) {
        return
      }

      // 处理菜单项的统计数字显示
      let str: ReactNode
      if (corpDetailBaseMenuNumHide.includes(menuModule.showList[idx])) {
        // 某些菜单项不显示统计数字（如：所属行业、股东信息等）
        str = ''
      } else {
        // 显示统计数字组件
        str = <CorpMenuNum modelNum={modelNum} />
      }

      // 特殊处理：英国和新西兰地区，"历史法人和高管"改名为"历史主要人员"
      if (menuKey === 'historylegalperson' && (corpArea === 'england' || corpArea === 'nzl')) {
        menuModule.showName[idx] = intl('138503', ' 主要人员 ')
      }

      // 创建子菜单项对象
      const menuItem = {
        key: menuKey, // 菜单项唯一标识
        title: menuModule.showName[idx] ? (
          <>
            {menuModule.showName[idx]}
            {str}{' '}
          </>
        ) : (
          menuKey
        ), // 菜单项显示内容（包含名称和统计数字）
        titleStr: menuModule.showName[idx] ? menuModule.showName[idx] : menuKey, // 纯文本标题
        titleNum: str, // 统计数字组件
        parentMenuKey: k, // 父菜单的 key
      }

      // 将子菜单项添加到父菜单的 children 中
      menu.children.push(menuItem)

      // 将子菜单项添加到扁平化数组和映射对象中
      allMenuData.push(menuItem)
      allMenuDataObj[menuKey] = allMenuData[allMenuData.length - 1]
    })

    // 将完整的菜单模块（包含子菜单）添加到菜单树中
    allMenu.push(menu)
  }

  // 返回三种数据结构，供不同场景使用
  return {
    allMenuData, // 扁平化数组：用于遍历所有菜单项
    allMenu, // 树形结构：用于渲染左侧菜单树
    allMenuDataObj, // 键值对映射：用于快速查找特定菜单项
  }
}
