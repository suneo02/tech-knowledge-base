
import { handleCorpDetailScrollMenuChanged } from '../scroll'

describe('handleCorpDetailScrollMenuChanged', () => {
  test('skips menu updates when module is not searchable (e.g., disabled)', () => {
    const setSelectedKeys = jest.fn()
    const setExpandedKeys = jest.fn()
    handleCorpDetailScrollMenuChanged('no-data-module', {
      setSelectedKeys,
      setExpandedKeys,
      expandedKeys: [],
      allTreeDataObj: {},
    })
    expect(setSelectedKeys).not.toHaveBeenCalled()
    expect(setExpandedKeys).not.toHaveBeenCalled()
  })

  test('expands parent and selects menu when module exists', () => {
    const setSelectedKeys = jest.fn()
    const setExpandedKeys = jest.fn()
    const expandedKeys: string[] = []

    handleCorpDetailScrollMenuChanged('child-module', {
      setSelectedKeys,
      setExpandedKeys,
      expandedKeys,
      allTreeDataObj: {
        'child-module': { key: 'child-module', parentMenuKey: 'overview' } as any,
      },
    })

    expect(setSelectedKeys).toHaveBeenCalledWith(['child-module'])
    expect(setExpandedKeys).toHaveBeenCalledWith(['overview'])
  })
})
