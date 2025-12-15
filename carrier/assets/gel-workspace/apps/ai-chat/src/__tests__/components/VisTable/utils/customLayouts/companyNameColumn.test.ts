import { buildCompanyNameColumn } from '@/components/VisTable/utils/customLayouts/companyNameColumn'

jest.mock('@visactor/vtable', () => ({
  VGroup: () => null,
  VText: () => null,
}))

describe('buildCompanyNameColumn', () => {
  it('should return a column with custom layout and flags', () => {
    const defaultColumn = {
      field: 'companyName',
      title: '企业名称',
    } as any

    const result = buildCompanyNameColumn(defaultColumn)
    expect(result).toBeTruthy()
    expect(result.isCompanyNameColumn).toBe(true)
    expect(typeof result.customLayout).toBe('function')
    expect(result.width).toBe(300)
  })
})
