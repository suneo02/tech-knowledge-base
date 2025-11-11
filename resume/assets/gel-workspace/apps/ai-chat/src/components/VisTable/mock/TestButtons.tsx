import { Button } from 'antd'
import { useTableActions } from '../hooks/useTableActions'
import { mockTableData, mockColumns } from './index'

/**
 * 测试按钮组件，仅用于开发测试，生产环境将移除
 */
export const TestButtons = () => {
  const {
    setRecords,
    addRecord,
    addRecords,
    deleteRecords,
    updateRecords,
    refresh,
    refreshWithRecreateCells,
    setCellValue,
    updateColumns,
    selectCell,
    clearSelection,
    scrollToCell,
  } = useTableActions()

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button
        onClick={() => {
          // console.log('设置数据')
          setRecords(mockTableData.records)
        }}
      >
        设置数据
      </Button>

      <Button
        onClick={() => {
          // console.log('添加单条')
          // @ts-expect-error
          addRecord({ '1': 'test', '2': 'test' }, 24)
        }}
      >
        添加单条
      </Button>

      <Button
        onClick={() => {
          // console.log('添加多条')
          addRecords([
            { '1': 'batch1', '2': 'batch1' },
            { '1': 'batch2', '2': 'batch2' },
          ])
        }}
      >
        添加多条
      </Button>

      <Button
        onClick={() => {
          // console.log('删除记录')
          deleteRecords([0, 1]) // 删除前两条记录
        }}
      >
        删除记录
      </Button>

      <Button
        onClick={() => {
          // console.log('更新记录')
          updateRecords(
            [
              { '1_wtFss5DlTsLY': 'updated1', '2_wtFss5DlTsLY': 'updated1' },
              { '1_wtFss5DlTsLY': 'updated2', '2_wtFss5DlTsLY': 'updated2' },
            ],
            [0, 1]
          ) // 更新前两条记录
        }}
      >
        更新记录
      </Button>

      <Button
        onClick={() => {
          // console.log('刷新表格')
          refresh()
        }}
      >
        刷新表格
      </Button>

      <Button
        onClick={() => {
          // console.log('重建单元格')
          refreshWithRecreateCells()
        }}
      >
        重建单元格
      </Button>

      <Button
        onClick={() => {
          // console.log('设置单元格值')
          setCellValue(0, 0, 'new value') // 设置第一个单元格的值
        }}
      >
        设置单元格值
      </Button>

      <Button
        onClick={() => {
          // console.log('更新列定义')
          updateColumns(mockColumns)
        }}
      >
        更新列定义
      </Button>

      <Button
        onClick={() => {
          // console.log('选择单元格')
          selectCell(10, 0) // 选择第一个单元格
        }}
      >
        选择单元格
      </Button>

      <Button
        onClick={() => {
          // console.log('清除选择')
          clearSelection()
        }}
      >
        清除选择
      </Button>

      <Button
        onClick={() => {
          // console.log('滚动到单元格')
          scrollToCell(0, 0) // 滚动到第一个单元格
        }}
      >
        滚动到单元格
      </Button>
      {/* <Button
        onClick={() => {
          // console.log('滚动到单元格')
          scrollToCell(0, 0) // 滚动到第一个单元格
        }}
      >
        找企业
      </Button>
      <Button
        onClick={() => {
          // console.log('滚动到单元格')
          scrollToCell(0, 0) // 滚动到第一个单元格
        }}
      >
        列指标
      </Button> */}
    </div>
  )
}
