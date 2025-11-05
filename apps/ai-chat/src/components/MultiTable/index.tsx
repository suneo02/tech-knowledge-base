import { CSSProperties, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'
import { ListTable } from '@visactor/vtable'
// 导入AI任务Provider
// import { TableAITaskProvider } from './context/TableAITaskContext'
import { TableContent } from './components/TableContent'
// import { TableOperationProvider } from './context/TableOperationContext'
import { TableOperation, TableOperationType } from './types'
import { onCellClickBySourceProps } from './types/table'

// 表格内容引用接口
export interface TableContentRef {
  multiTableInstance: ListTable | null
}

export interface onOperationProps {
  type: TableOperationType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface MultiTableProps {
  id: string
  style?: CSSProperties
  children?: ReactNode
  handleRecordOperation?: (operation: TableOperation) => void
  onCellClickBySource?: (value?: onCellClickBySourceProps) => void
  onOperation?: (operation: onOperationProps) => void
}

/**
 * @deprecated 请使用VisTable组件
 * MultiTable组件
 * 一个基于VTable的表格组件，支持虚拟滚动和高性能渲染
 */
const MultiTable = forwardRef<TableContentRef, MultiTableProps>(
  ({ id, style, handleRecordOperation, onCellClickBySource }, ref) => {
    // 创建内部引用
    const tableContentRef = useRef<TableContentRef>({ multiTableInstance: null })

    // 向父组件暴露引用
    useImperativeHandle(ref, () => tableContentRef.current, [tableContentRef.current])

    const onOperation = (operation: TableOperation) => {
      console.log('🚀 ~ onOperation ~ operation:', operation)
    }

    return (
      <TableContent
        key={id}
        sheetId={id}
        ref={tableContentRef}
        style={style}
        handleRecordOperation={handleRecordOperation}
        onCellClickBySource={onCellClickBySource}
        onOperation={onOperation}
      />
    )
  }
)

// 设置显示名称，以便在调试工具中标识组件
MultiTable.displayName = 'MultiTable'

// 导出组件和上下文
export default MultiTable
