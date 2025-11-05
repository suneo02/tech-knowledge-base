// Mock FilterPanel module
jest.mock('@/FilterPanel', () => ({
  CDELogicDefault: 'any',
}))

import { CDEFilterItemUser } from '@/types'
import type { CDEFilterItem, CDESuperQueryLogic } from 'gel-api'
import { getCDEFiltersTextUtil } from '../filterText'

describe('getCDEFiltersTextUtil', () => {
  // Mock filter item configuration
  const mockFilterItem = {
    itemId: 1,
    itemName: '企业名称',
    itemType: '1',
    itemField: 'corp_name',
    itemOption: [
      { value: '1', name: '选项1' },
      { value: '2', name: '选项2' },
    ],
  } satisfies CDEFilterItem

  // Mock code map
  const mockCodeMap: Record<string, string> = {
    '1': '代码1',
    '2': '代码2',
  }

  // Mock getFilterItemById function
  const mockGetFilterItemById = (itemId: CDEFilterItem['itemId']) => {
    return itemId === 1 ? mockFilterItem : undefined
  }

  it('should handle empty filters array', () => {
    const filters: CDEFilterItemUser[] = []
    const result = getCDEFiltersTextUtil(filters, mockGetFilterItemById, mockCodeMap)
    expect(result).toBe('')
  })

  it('should handle invalid filter item (missing filter config)', () => {
    const filters: CDEFilterItemUser[] = [
      {
        title: '企业名称',
        itemId: 1,
        logic: 'any',
        field: 'corp_name',
        value: ['小米'],
      },
    ]
    const result = getCDEFiltersTextUtil(
      filters,
      () => ({
        itemType: '1',
        itemEn: 'corp_name',
        selfDefine: 0,
        itemOption: [],
        hasExtra: false,
        parentId: 0,
        isVip: 0,
        itemId: 1,
        itemName: '企业名称',
        itemField: 'corp_name',
        logicOption: 'any,notAny,all',
      }),
      mockCodeMap
    )
    expect(result).toBe('企业名称 - 小米')
  })

  it('should format single filter with "bool" logic correctly', () => {
    const filters: CDEFilterItemUser[] = [
      {
        itemId: 44,
        title: '有无网站(ICP备案)',
        field: 'count.domain_num',
        value: ['true'],
        logic: 'bool',
      },
    ]
    debugger
    const result = getCDEFiltersTextUtil(
      filters,
      () => ({
        itemType: '5',
        extraConfig: [
          {
            itemType: '6',
            selfDefine: 0,
            itemOption: [],
            hasExtra: false,
            parentId: 44,
            isVip: 1,
            itemId: 45,
            itemName: '网站数量',
            itemField: 'count.domain_num',
            logicOption: 'range',
          },
        ],
        selfDefine: 0,
        itemOption: [
          {
            name: '有网站备案',
            value: 'true',
          },
          {
            name: '无网站备案',
            value: 'false',
          },
        ],
        hasExtra: true,
        parentId: 0,
        isVip: 0,
        itemId: 44,
        itemName: '有无网站(ICP备案)',
        itemField: 'count.domain_num',
        logicOption: 'bool',
      }),
      mockCodeMap
    )
    expect(result).toBe('有无网站(ICP备案) - 有')
  })

  it('should format single filter with "any" logic correctly', () => {
    const filters: CDEFilterItemUser[] = [
      {
        itemId: 1,
        title: '企业名称',
        field: 'corp_name',
        value: ['1'],
        logic: 'any',
      },
    ]
    const result = getCDEFiltersTextUtil(filters, mockGetFilterItemById, mockCodeMap)
    expect(result).toBe('企业名称 - 选项1')
  })

  it('should format multiple filters with separator', () => {
    const mockFilterItem2 = {
      itemId: 2,
      itemName: '注册资本',
      itemType: '1',
      itemField: 'register_capital',
    } satisfies CDEFilterItem

    const getFilterItemByIdWithMultiple = (itemId: CDEFilterItem['itemId']) => {
      debugger // 调试点 2：检查 getFilterItemById 的调用
      if (itemId === 1) return mockFilterItem
      if (itemId === 2) return mockFilterItem2
      return undefined
    }

    const filters: CDESuperQueryLogic['filters'] = [
      {
        itemId: 1,
        title: '企业名称',
        field: 'corp_name',
        value: ['1'],
        logic: 'any',
      },
      {
        itemId: 2,
        title: '注册资本',
        field: 'register_capital',
        value: ['0-100'],
        logic: 'any',
      },
    ]

    debugger // 调试点 3：检查调用参数
    const result = getCDEFiltersTextUtil(filters, getFilterItemByIdWithMultiple, mockCodeMap)
    debugger // 调试点 4：检查返回结果
    expect(result).toBe('企业名称 - 选项1 · 注册资本 - 0至100万')
  })

  it('should handle errors gracefully', () => {
    const filters = null as any
    const result = getCDEFiltersTextUtil(filters, mockGetFilterItemById, mockCodeMap)
    expect(result).toBe('')
  })
})
