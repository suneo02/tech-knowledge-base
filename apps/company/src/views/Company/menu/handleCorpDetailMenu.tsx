import { CorpMenuNum } from '@/components/company/detail/comp/CorpNum.tsx'
import { getCorpModuleNum } from '@/handle/corp/basicNum/handle.tsx'
import { CorpBasicNumFront, CorpMenuModuleCfg } from '@/types/corpDetail'
import { CorpMenuCfg } from '@/types/corpDetail/menu'
import { ReactNode } from 'react'
import { CorpMenuChild, CorpMenuData, CorpMenuSimpleData } from './type'

/**
 * 构建完整的企业详情菜单树
 *
 * 根据菜单配置和企业统计数据，生成三种数据结构的完整菜单树：
 * 1. 树形结构（用于菜单渲染）
 * 2. 扁平数组（用于菜单搜索）
 * 3. 键值映射（用于快速查找）
 *
 * 核心功能：
 * - 保留无数据菜单项并标记禁用态（disabled = true）
 * - 为每个菜单项添加统计数字显示（无数据时展示 0 且灰态）
 * - 一次遍历同时生成三种数据结构（性能优化，可点击节点与完整树分离）
 *
 * @param menus - 菜单配置对象，包含所有菜单模块的定义
 * @param nums - 企业统计数据，用于判断菜单项是否有数据
 * @param corpArea - 企业所属地区（已废弃，保留用于向后兼容）
 *
 * @returns 返回三个数据结构：
 *   - allMenu: 树形菜单结构（用于左侧菜单树渲染，包含禁用节点）
 *   - allMenuData: 可点击菜单项数组（用于菜单搜索）
 *   - allMenuDataObj: 可点击菜单项映射（用于快速查找与滚动联动）
 *
 * @author suneo
 */
// 已将子菜单构建逻辑内联到各个导出函数中

/**
 * 获取菜单项的数据状态
 */
const getCorpMenuDataStatus = (child: CorpMenuChild, nums: CorpBasicNumFront) => {
  const { countKey } = child
  const modelNum = getCorpModuleNum(countKey, nums)
  const hasNumericNum = typeof modelNum === 'number'
  const hasData = modelNum === true || (hasNumericNum && modelNum > 0)
  return { modelNum, hasNumericNum, hasData }
}

/**
 * 构建单个子菜单项
 */
const createCorpMenuItem = (child: CorpMenuChild, parentKey: string, nums: CorpBasicNumFront): CorpMenuData => {
  const { showModule, showName, hideMenuNum } = child
  const { modelNum, hasNumericNum, hasData } = getCorpMenuDataStatus(child, nums)
  const disabled = !hasData

  const shouldShowMenuNum = !hideMenuNum && hasNumericNum
  let str: ReactNode = ''
  if (shouldShowMenuNum) {
    str = <CorpMenuNum modelNum={modelNum} />
  }

  return {
    key: showModule,
    title: showName ? (
      <span className={disabled ? 'menu-disabled' : undefined}>
        {showName}
        {str}{' '}
      </span>
    ) : (
      showModule
    ),
    titleStr: showName || showModule,
    titleNum: str,
    parentMenuKey: parentKey,
    disabled,
    hasData,
  }
}

/**
 * 构建父级菜单节点
 */
export const buildCorpMenuRoot = (key: string, menuModule: CorpMenuModuleCfg, children: CorpMenuData[]) => {
  const hasChildWithData = children.some((child) => child.hasData)
  const root: CorpMenuData = {
    key,
    title: <span className={!hasChildWithData ? 'menu-disabled' : undefined}>{menuModule.title}</span>,
    children,
    disabled: !hasChildWithData,
    hasData: hasChildWithData,
    titleStr: menuModule.title,
  }

  const clickableRoot = hasChildWithData
    ? {
        key,
        title: menuModule.title,
        disabled: !hasChildWithData,
        hasData: hasChildWithData,
        titleStr: menuModule.title,
      }
    : null

  return { root, clickableRoot }
}

/**
 * 处理单个菜单模块，生成子菜单和根节点
 */
const processCorpMenuModule = (key: string, menuModule: CorpMenuModuleCfg, nums: CorpBasicNumFront) => {
  const children: CorpMenuData[] = []
  menuModule.children.forEach((child) => {
    children.push(createCorpMenuItem(child, key, nums))
  })
  const { root, clickableRoot } = buildCorpMenuRoot(key, menuModule, children)
  return { children, root, clickableRoot }
}

/**
 * 汇总构建完整菜单树
 */
export const buildCorpAllMenu = (menus: CorpMenuCfg, nums: CorpBasicNumFront): CorpMenuData[] => {
  const allMenu: CorpMenuData[] = []
  for (const k in menus) {
    const menuModule = menus[k]
    if (!menuModule) continue
    const { root } = processCorpMenuModule(k, menuModule, nums)
    allMenu.push(root)
  }
  return allMenu
}

export const buildCorpAllMenuData = (menus: CorpMenuCfg, nums: CorpBasicNumFront): CorpMenuData[] => {
  const clickableMenuData: CorpMenuData[] = []
  for (const k in menus) {
    const menuModule = menus[k]
    if (!menuModule) continue
    const { children, clickableRoot } = processCorpMenuModule(k, menuModule, nums)
    children.forEach((item) => {
      if (item.hasData) {
        clickableMenuData.push(item)
      }
    })
    if (clickableRoot) {
      clickableMenuData.push(clickableRoot)
    }
  }
  return clickableMenuData
}

export const buildCorpAllMenuDataObj = (
  menus: CorpMenuCfg,
  nums: CorpBasicNumFront
): Record<string, CorpMenuSimpleData> => {
  const clickableMenuDataObj: Record<string, CorpMenuSimpleData> = {}
  for (const k in menus) {
    const menuModule: CorpMenuModuleCfg = menus[k]
    if (!menuModule) continue

    menuModule.children.forEach((child) => {
      const { hasData } = getCorpMenuDataStatus(child, nums)

      if (hasData) {
        clickableMenuDataObj[child.showModule] = {
          ...child,
          parentMenuKey: k,
        }
      }
    })
  }
  return clickableMenuDataObj
}

/**
 * 生成简化菜单（basicNum 未就绪时用作骨架）
 */
export const buildSimplifiedCorpMenu = (currentMenus: CorpMenuCfg): CorpMenuData[] => {
  const simplifiedMenu: CorpMenuData[] = []

  for (const moduleKey in currentMenus) {
    const moduleConfig = currentMenus[moduleKey]

    const menuItem: CorpMenuData = {
      key: moduleKey,
      title: moduleConfig.title,
      titleStr: moduleConfig.title,
      children: [],
      disabled: false,
      hasData: true,
    }

    if (moduleKey === 'overview') {
      const firstChild = moduleConfig.children[0]
      if (firstChild) {
        menuItem.children.push({
          key: firstChild.showModule,
          title: firstChild.showName,
          titleStr: firstChild.showName,
          titleNum: '',
          parentMenuKey: moduleKey,
          disabled: false,
          hasData: true,
        })
      }
    }

    if (!moduleConfig.hide) {
      simplifiedMenu.push(menuItem)
    }
  }

  return simplifiedMenu
}
