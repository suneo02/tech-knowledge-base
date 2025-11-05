import * as useTableInitialization from '@/components/MultiTable/hooks/useTableInitialization'
import { render, waitFor } from '@testing-library/react'
import MultiTable from '..'

// 模拟依赖
jest.mock('@/pages/Demo/hooks/useTableInitialization', () => ({
  useTableInitialization: jest.fn(),
}))

// 模拟 VTable
jest.mock('@visactor/vtable', () => ({
  ListTable: jest.fn().mockImplementation(() => ({
    // 模拟 VTable 的方法
    dataSource: null,
  })),
  data: {
    CachedDataSource: jest.fn().mockImplementation(() => ({})),
  },
}))

describe('MultiTable 组件', () => {
  // 在每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks()

    // 模拟 useTableInitialization 钩子的返回值
    ;(useTableInitialization.useTableInitialization as jest.Mock).mockReturnValue({
      getSheetInfo: jest.fn().mockResolvedValue({}),
    })
  })

  it('应该正确渲染组件', () => {
    const handleRecordOperation = jest.fn()

    render(<MultiTable id="test-table" handleRecordOperation={handleRecordOperation} />)

    // 验证容器元素是否存在
    const container = document.querySelector('div')
    expect(container).toBeInTheDocument()

    // 验证样式是否正确
    expect(container).toHaveStyle({
      width: '100%',
      height: 'calc(100vh - 124px)',
    })
  })

  it('应该在挂载时调用 getSheetInfo', async () => {
    const handleRecordOperation = jest.fn()
    const getSheetInfoMock = jest.fn().mockResolvedValue({})

    ;(useTableInitialization.useTableInitialization as jest.Mock).mockReturnValue({
      getSheetInfo: getSheetInfoMock,
    })

    render(<MultiTable id="test-table" handleRecordOperation={handleRecordOperation} />)

    // 验证 getSheetInfo 是否被调用
    await waitFor(() => {
      expect(getSheetInfoMock).toHaveBeenCalled()
    })
  })

  it('应该正确传递参数给 useTableInitialization', () => {
    const handleRecordOperation = jest.fn()

    render(<MultiTable id="test-table" handleRecordOperation={handleRecordOperation} />)

    // 验证传递给 useTableInitialization 的参数
    expect(useTableInitialization.useTableInitialization).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-table',
        handleRecordOperation,
        tableInstance: expect.any(Object),
        containerRef: expect.any(Object),
        loadedData: expect.any(Object),
      })
    )
  })
})
