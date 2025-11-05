import { AIIcon } from '@/assets/icon'
import { useMultiTableRef } from '@/components/MultiTable/context'
import { BugFilled, RedoOutlined } from '@ant-design/icons'
import { ColumnDefine } from '@visactor/vtable/es/ts-types'
import { Button, Flex, message } from 'antd'
import { FC, useState } from 'react'
import { ExtendedColumnDefine } from '../../utils/columnsUtils'
import SmartFillModal from '../modal/SmartFillModal'
import { useMultiTableRefMethods } from '../../hooks'

export const Toolbar: FC<{
  setActionModal: (modal: 'cde' | 'indicator' | 'monitor' | undefined) => void
}> = ({ setActionModal }) => {
  const [modal1Open, setModal1Open] = useState(false)
  // 使用 MultiTableRef context
  const { multiTableRef } = useMultiTableRef()

  const { addColumn } = useMultiTableRefMethods()

  const handleSmartFill = () => {
    setModal1Open(true)
  }

  // 将表格列转换为 ExtendedColumnDefine 类型
  const convertToExtendedColumns = (columns: ColumnDefine[] | undefined): ExtendedColumnDefine[] => {
    if (!columns) return []

    return columns.map((col) => {
      // 使用类型断言避免使用 any
      const extendedCol: ExtendedColumnDefine = {
        field: String(col.field), // 确保 field 是字符串类型
        title: String(col.title),
        width: typeof col.width === 'number' ? col.width : 100,
        // 仅复制兼容的属性
        editor: typeof col.editor === 'string' ? col.editor : undefined,
        cellType: typeof col.cellType === 'string' ? col.cellType : undefined,
      }

      return extendedCol
    })
  }

  return (
    <>
      <Flex align="center" gap={12}>
        <Button onClick={() => message.info('敬请期待')} icon={<BugFilled />}>
          插入表格数据
        </Button>
        <Button onClick={() => setActionModal('cde')} icon={<BugFilled />}>
          企业数据浏览器
        </Button>
        <Button onClick={() => setActionModal('indicator')} icon={<BugFilled />}>
          指标选择
        </Button>

        <Button
          icon={<RedoOutlined />}
          onClick={() => {
            const tableInstance = multiTableRef.current
            // 优先使用 context 中的引用，如果不存在则回退到传入的 listTableRef
            console.log(tableInstance.getAllColumnHeaderCells()[0])
          }}
        >
          获取表头
        </Button>
        <Button onClick={handleSmartFill} icon={<AIIcon />}>
          AI生成列
        </Button>
        <Button
          onClick={() => {
            console.log('我更新啦')
            addColumn({ field: 'newColumn', title: '新列', width: 200 }, 0)
          }}
          icon={<BugFilled />}
        >
          更新列
        </Button>
        {/* <Popover content={<HistoryPanel title="操作历史" history={operations} />}>
          <Button icon={<BugFilled />}>机器操作记录</Button>
        </Popover>
        <Popover content={<HistoryPanel title="操作历史" history={operationLogs} />}>
          <Button icon={<BugFilled />}>用户操作记录</Button>
        </Popover> */}
      </Flex>
      <SmartFillModal
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        columns={convertToExtendedColumns(multiTableRef.current?.columns)}
      />
    </>
  )
}
