import { CorpMenuCfg } from '@/types/corpDetail/menu'
import { buildCorpAllMenu, buildCorpAllMenuData, buildCorpAllMenuDataObj } from '../handleCorpDetailMenu'

describe('corp menu builders', () => {
  const menus: CorpMenuCfg = {
    overview: {
      title: '工商信息',
      children: [
        { showModule: 'showCompanyInfo', showName: '工商信息', countKey: 'companyInfo' as any, hideMenuNum: false },
        { showModule: 'showShareholder', showName: '股东信息', countKey: 'shareholder_num' as any, hideMenuNum: false },
      ],
    },
  }

  test('keeps zero-count nodes as disabled while retaining them in the tree', () => {
    const nums = { companyInfo: 0, shareholder_num: 5 } as any
    const allMenu = buildCorpAllMenu(menus, nums)
    const allMenuData = buildCorpAllMenuData(menus, nums)
    const allMenuDataObj = buildCorpAllMenuDataObj(menus, nums)
    const overviewChildren = allMenu[0].children || []
    const baseInfo = overviewChildren.find((item) => item.key === 'showCompanyInfo')
    const shareholder = overviewChildren.find((item) => item.key === 'showShareholder')

    expect(baseInfo?.disabled).toBe(true)
    expect(baseInfo?.hasData).toBe(false)
    expect(baseInfo?.titleNum).toBeTruthy() // 显示禁用态数字（0）
    expect(allMenuDataObj['showCompanyInfo']).toBeUndefined()

    expect(shareholder?.disabled).toBe(false)
    expect(shareholder?.hasData).toBe(true)
    expect(allMenuDataObj['showShareholder']).toBeTruthy()
    // 可点击列表包含父节点与有数据的子节点
    expect(allMenuData.map((item) => item.key)).toEqual(['overview', 'showShareholder'])
  })

  test('disables parent when all children are missing data', () => {
    const nums = { companyInfo: 0, shareholder_num: 0 } as any
    const allMenu = buildCorpAllMenu(menus, nums)
    const allMenuData = buildCorpAllMenuData(menus, nums)
    const allMenuDataObj = buildCorpAllMenuDataObj(menus, nums)
    const overviewChildren = allMenu[0].children || []

    expect(allMenu[0].disabled).toBe(true)
    expect(overviewChildren.every((child) => child?.disabled)).toBe(true)
    expect(allMenuData.length).toBe(0)
    expect(Object.keys(allMenuDataObj)).toHaveLength(0)
  })
})
