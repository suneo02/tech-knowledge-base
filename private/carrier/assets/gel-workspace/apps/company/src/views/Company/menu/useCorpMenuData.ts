/**
 * 【第三层：数据过滤 + 渲染准备】企业详情菜单数据管理 Hook
 *
 * ## 职责：根据统计数据过滤子菜单项，生成可渲染的菜单树
 *
 * ### 数据过滤层级总览：
 *
 * ```
 * 第一层 (createCorpDetailMenus)
 *   ↓ 过滤：企业类型、特殊模块
 *   ↓ 输出：一级菜单模块配置 (CorpMenuCfg)
 *
 * 第二层 (useCorpMenuByType)
 *   ↓ 缓存：useMemo 优化
 *   ↓ 输出：缓存的菜单配置
 *
 * 第三层 (useCorpMenuData) ← 当前层
 *   ↓ 过滤：基于统计数据过滤子菜单项
 *   ↓ 输出：可渲染的菜单树 (三种数据结构)
 * ```
 *
 * ### 本层过滤逻辑：
 *
 * #### 1. 两阶段构建策略
 *
 * **第一阶段：简化菜单（basicNum < 5 个字段）**
 * - 目的：快速渲染，避免首屏白屏
 * - 内容：只显示一级菜单 + overview 第一个子菜单
 * - 特点：不过滤、不显示统计数字
 *
 * **第二阶段：完整菜单（basicNum ≥ 5 个字段）**
 * - 目的：显示完整数据
 * - 过滤规则：
 *   - 保留所有配置项，基于统计数据标记 `disabled/hasData`
 *   - 可点击/可搜索列表仅包含 `hasData === true` 的节点
 * - 特点：添加统计数字；无数据时显示 0 且灰态；禁用节点不可搜索/点击
 *
 * #### 2. 生成三种数据结构
 *
 * 使用 useMemo 一次性生成三种数据结构，避免重复计算：
 *
 * | 数据结构         | 类型                          | 用途                           |
 * | ---------------- | ----------------------------- | ------------------------------ |
 * | treeDatas        | CorpMenuData[]                | 菜单树渲染、层级判断           |
 * | allTreeDataObj   | Record<string, CorpMenuData>  | 快速查找、滚动同步、埋点       |
 *
 * ### 数据流示例：
 *
 * ```typescript
 * // 输入：currentMenus (来自 useCorpMenuByType)
 * {
 *   overview: { title: '工商信息', children: [
 *     { showModule: 'showCompanyInfo', countKey: 'companyInfo', showName: '工商信息' },
 *     { showModule: 'showShareHolder', countKey: 'shareholder_num', showName: '股东信息' }
 *   ]},
 *   financing: { title: '金融行为', children: [...] }
 * }
 *
 * // 输入：basicNum
 * { shareholder_num: 5, ... } // 有股东数据
 *
 * // 输出：treeDatas (过滤后的树形结构)
 * [
 *   {
 *     key: 'overview',
 *     title: '工商信息',
 *     children: [
 *       { key: 'showCompanyInfo', title: '工商信息', titleNum: '' },
 *       { key: 'showShareHolder', title: '股东信息 (5)', titleNum: <CorpMenuNum /> }
 *     ]
 *   },
 *   { key: 'financing', title: '金融行为', children: [...] }
 * ]
 * ```
 *
 * ### 性能优化：
 * - useMemo 缓存菜单数据生成结果
 * - 只在 currentMenus 或 basicNum 变化时重新计算
 * - 一次遍历同时生成三种数据结构
 *
 * @see apps/company/src/views/Company/menu/handleCorpDetailMenu.tsx - buildCompleteMenuTree 实现
 * @see apps/company/src/views/Company/menu/menus.ts - createCorpDetailMenus (第一层过滤)
 * @see apps/company/src/views/Company/menu/useCorpMenuByType.ts - useCorpMenuByType (第二层缓存)
 */

import { CorpBasicNumFront } from '@/types/corpDetail'
import { CorpMenuCfg } from '@/types/corpDetail/menu'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildCorpAllMenuDataObj } from './handleCorpDetailMenu'
import { CorpMenuSimpleData } from './type'

export const shouldUseCompleteMenu = (basicNum: CorpBasicNumFront, currentMenus: CorpMenuCfg | null) => {
  return Object.entries(basicNum).length >= 5 && !!currentMenus && Object.keys(currentMenus).length > 0
}

export interface UseCorpMenuDataReturn {
  // 菜单数据
  allTreeDataObj: Record<string, CorpMenuSimpleData> // 可点击节点的映射（用于滚动/埋点）

  // 菜单展开/选中状态
  expandedKeys: string[]
  selectedKeys: string[]
  autoExpandParent: boolean

  // 状态更新方法
  setExpandedKeys: (keys: string[]) => void
  setSelectedKeys: (keys: string[]) => void

  // 菜单操作方法
  onExpand: (expandedKeys: string[]) => void
}

/**
 * 企业详情菜单数据管理 Hook
 *
 * @param currentMenus 菜单配置（来自 useCorpMenuByType，已完成第一层过滤）
 * @param basicNum 企业统计数据（用于第三层过滤：过滤无数据的子菜单项）
 * @param onMenuReady 菜单数据构建完成后的回调（可选，用于触发初始化逻辑）
 * @returns 菜单数据和控制方法
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const currentMenus = useCorpMenuByType(corpInfo, basicNum)
 *
 *   const {
 *     treeDatas,        // 树形结构：用于菜单渲染
 *     allTreeDataObj,   // 键值映射：用于快速查找
 *     expandedKeys,
 *     selectedKeys,
 *     onExpand,
 *   } = useCorpMenuData(currentMenus, basicNum, () => {
 *     // 菜单构建完成后的回调
 *     console.log('菜单已就绪')
 *   })
 *
 *   return <MenuTree data={treeDatas} />
 * }
 * ```
 */
export function useCorpMenuData(
  currentMenus: CorpMenuCfg | null,
  basicNum: CorpBasicNumFront,
  onMenuReady?: () => void
): UseCorpMenuDataReturn {
  // 菜单展开/选中状态
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['showCompanyInfo'])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  // 判断是否应该使用完整菜单（统计数据已就绪）
  const isCompleteMenuReady = useMemo(() => shouldUseCompleteMenu(basicNum, currentMenus), [basicNum, currentMenus])

  /**
   * 生成菜单数据（使用 useMemo 避免重复计算）
   *
   * 根据 basicNum 是否就绪，决定使用简化菜单还是完整菜单：
   * - basicNum 不足 5 个字段：使用简化菜单（快速渲染）
   * - basicNum 已就绪：使用完整菜单（包含统计数字和过滤）
   */
  const menuData = useMemo(() => {
    if (!currentMenus || Object.keys(currentMenus).length === 0) {
      return {
        allTreeDataObj: {},
      }
    }

    // 第二阶段：统计数据就绪，生成完整菜单
    if (isCompleteMenuReady) {
      const allMenuDataObj = buildCorpAllMenuDataObj(currentMenus, basicNum)
      return {
        allTreeDataObj: allMenuDataObj,
      }
    }

    return {
      allTreeDataObj: {}, // 简化菜单不需要映射对象
    }
  }, [currentMenus, basicNum, isCompleteMenuReady])

  // 当完整菜单生成后，自动展开 overview 并触发回调（只执行一次）
  useEffect(() => {
    if (isCompleteMenuReady) {
      // 自动展开 overview 菜单
      setExpandedKeys(['overview'])

      // 延迟执行回调，等待 DOM 更新
      if (onMenuReady) {
        const timer = setTimeout(() => {
          onMenuReady()
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [isCompleteMenuReady])

  // 菜单展开回调
  const onExpand = useCallback((keys: string[]) => {
    setExpandedKeys(keys)
    setAutoExpandParent(false)
  }, [])

  return {
    allTreeDataObj: menuData.allTreeDataObj,
    expandedKeys,
    selectedKeys,
    autoExpandParent,
    setExpandedKeys,
    setSelectedKeys,
    onExpand,
  }
}
