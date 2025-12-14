import { Button, Menu, Space } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import { TaskIdentifier, useSheetTask } from '@/contexts/SuperChat/SheetTaskContext'

export const TestCaseRunner = () => {
  const { updateTasks, setActiveSheet, clearAllTasks, setFailureMode, destroySheet } = useSheetTask()

  const runTestCase = (key: string) => {
    clearAllTasks()
    console.log(`%c[TEST CASE] Running: ${key}`, 'color: blue; font-weight: bold;')

    const createTasks = (sheetId: string, count: number, prefix: string): TaskIdentifier[] =>
      Array.from({ length: count }, (_, i) => ({
        sheetId,
        columnId: `${prefix}-col-${i % 10}`,
        rowId: `${prefix}-row-${i}`,
        originalContent: `任务内容 ${prefix}-${i}`,
      }))

    switch (key) {
      case '1':
        setActiveSheet('1')
        updateTasks(createTasks('1', 5, 'A'))
        setTimeout(() => {
          console.log('[TEST CASE 1] Adding 3 more tasks...')
          updateTasks(createTasks('1', 3, 'F'))
        }, 3000)
        break
      case '2':
        setActiveSheet('1')
        updateTasks(createTasks('1', 2, 'A'))
        setTimeout(() => setActiveSheet('2'), 3000)
        setTimeout(() => updateTasks(createTasks('2', 3, 'C')), 6000)
        setTimeout(() => setActiveSheet('1'), 8000)
        break
      case '3':
        setActiveSheet('1')
        updateTasks(createTasks('1', 100, 'A'))
        break
      case '4':
        setActiveSheet('1')
        updateTasks(createTasks('1', 101, 'A'))
        break
      case '5':
        setActiveSheet('1')
        updateTasks(createTasks('1', 2, 'A'))
        break
      case '6':
        setActiveSheet('1')
        updateTasks(createTasks('1', 1, 'A'))
        updateTasks(createTasks('2', 1, 'B'))
        setTimeout(() => setActiveSheet('2'), 1000)
        setTimeout(() => setActiveSheet('1'), 2000)
        setTimeout(() => setActiveSheet('2'), 3000)
        break
      case '7':
        setActiveSheet('1')
        updateTasks(createTasks('1', 1000, 'A'))
        break
      case '8':
        setActiveSheet('1')
        updateTasks(createTasks('1', 2, 'A'))
        setTimeout(() => setFailureMode(true), 3000)
        setTimeout(() => setFailureMode(false), 15000)
        break
      case '9': {
        const task = { sheetId: '1', columnId: 'col-1', rowId: 'row-1', originalContent: 'repeat' }
        setTimeout(() => updateTasks([task]), 0)
        setTimeout(() => updateTasks([task]), 1000)
        setTimeout(() => updateTasks([task]), 2000)
        break
      }
      case '10':
        setActiveSheet('1')
        updateTasks(createTasks('1', 2, 'A'))
        setTimeout(() => destroySheet('1'), 3000)
        break
      default:
        break
    }
  }

  const menuItems = [
    {
      key: 'group1',
      label: '正常场景',
      type: 'group',
      children: [
        { key: '1', label: '1. 单Sheet内任务合并' },
        { key: '2', label: '2. 多Sheet切换轮询' },
      ],
    },
    {
      key: 'group2',
      label: '边界情况',
      type: 'group',
      children: [
        { key: '3', label: '3. 100个任务批量处理' },
        { key: '4', label: '4. 101个任务批量处理' },
        { key: '5', label: '5. 轮询前任务已完成 (手动)' },
      ],
    },
    {
      key: 'group3',
      label: '极端情况',
      type: 'group',
      children: [
        { key: '6', label: '6. 高频切换Sheet' },
        { key: '7', label: '7. 1000个任务批量处理' },
        { key: '8', label: '8. 接口调用失败/超时' },
        { key: '9', label: '9. 重复添加同一任务' },
        { key: '10', label: '10. 轮询期间销毁Sheet' },
      ],
    },
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Menu onClick={(e) => runTestCase(e.key)} items={menuItems as any} mode="inline" />
      <Button type="primary" danger icon={<ClearOutlined />} onClick={() => clearAllTasks()} style={{ width: '100%' }}>
        清空所有任务并重置
      </Button>
    </Space>
  )
}
