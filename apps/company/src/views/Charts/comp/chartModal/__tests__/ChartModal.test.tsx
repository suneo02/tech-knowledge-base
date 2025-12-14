import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChartModal } from '../index'

// Mock dependencies
jest.mock('@wind/wind-ui', () => ({
  Modal: ({ children, visible, onCancel, footer }: any) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">
          {footer?.map((btn: any, index: number) => (
            <button key={index} onClick={btn.props.onClick}>
              {btn.props.children}
            </button>
          ))}
        </div>
      </div>
    ) : null,
  Input: {
    TextArea: ({ value, onChange, placeholder }: any) => (
      <textarea data-testid="textarea" value={value} onChange={onChange} placeholder={placeholder} />
    ),
  },
  Button: ({ children, onClick, disabled }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

jest.mock('../../../AICharts/comp/AiChartsUpload', () => ({
  __esModule: true,
  default: ({ onUpload }: any) => (
    <div data-testid="upload-component">
      <button onClick={() => onUpload('test-task-id', [{ name: 'test.xlsx' }])}>模拟上传</button>
    </div>
  ),
}))

jest.mock('@/utils/storage', () => ({
  localStorageManager: {
    set: jest.fn(),
  },
}))

jest.mock('@/api/ai-graph', () => ({
  markdownGraph: jest.fn().mockResolvedValue({
    data: { taskId: 'markdown-task-id' },
  }),
}))

describe('ChartModal', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    chatId: 'test-chat-id',
    initialTabKey: 'markdown',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('应该正确渲染弹窗', () => {
    render(<ChartModal {...defaultProps} />)

    expect(screen.getByTestId('modal')).toBeTruthy()
    expect(screen.getByTestId('modal-content')).toBeTruthy()
  })

  it('应该显示 Markdown 标签页内容', () => {
    render(<ChartModal {...defaultProps} />)

    expect(screen.getByTestId('textarea')).toBeTruthy()
    expect(screen.getByText('您可以直接在输入框内粘贴您的MarkDown文本')).toBeTruthy()
  })

  it('应该能够切换标签页', () => {
    render(<ChartModal {...defaultProps} />)

    // 点击 Excel 标签页
    const excelTab = screen.getByText('文件导入')
    fireEvent.click(excelTab)

    expect(screen.getByTestId('upload-component')).toBeTruthy()
  })

  it('应该能够处理取消操作', () => {
    render(<ChartModal {...defaultProps} />)

    const cancelButton = screen.getByText('取消')
    fireEvent.click(cancelButton)

    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('应该能够处理 Markdown 确认操作', async () => {
    render(<ChartModal {...defaultProps} />)

    const textarea = screen.getByTestId('textarea')
    fireEvent.change(textarea, { target: { value: '# Test Markdown' } })

    const confirmButton = screen.getByText('确定')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith({
        type: 'markdown',
        markdownText: '# Test Markdown',
        markdownTaskId: 'markdown-task-id',
        markdownTitle: '# T...',
      })
    })
  })

  it('应该能够处理 Excel 上传确认操作', async () => {
    render(<ChartModal {...defaultProps} initialTabKey="excel" />)

    // 切换到 Excel 标签页
    const excelTab = screen.getByText('文件导入')
    fireEvent.click(excelTab)

    // 模拟上传
    const uploadButton = screen.getByText('模拟上传')
    fireEvent.click(uploadButton)

    // 点击确认
    const confirmButton = screen.getByText('确定')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith({
        type: 'excel',
        taskId: 'test-task-id',
        fileList: [{ name: 'test.xlsx' }],
      })
    })
  })

  it('当没有内容时应该禁用确认按钮', () => {
    render(<ChartModal {...defaultProps} />)

    const confirmButton = screen.getByText('确定')
    expect(confirmButton).toBeTruthy()
  })
})
