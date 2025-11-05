import React from 'react'
import { EditableLabel } from 'gel-ui'
import { CSSProperties } from 'react'
import { useTableName } from '../hooks/useTableName'

interface TableNameEditorProps {
  tableId: string
  initialName?: string
  className?: string
  style?: CSSProperties
  onNameChange?: (name: string) => void
}

/**
 * 表格名称编辑组件
 * 提供表格名称的展示和编辑功能
 */
export const TableNameEditor: React.FC<TableNameEditorProps> = ({
  tableId,
  initialName = '',
  className,
  style,
  onNameChange,
}) => {
  // 使用表格名称钩子
  const { tableName, handleUpdateTableName, validateTableName } = useTableName(tableId, initialName, onNameChange)

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <EditableLabel
        value={tableName}
        onSave={handleUpdateTableName}
        validateFn={validateTableName}
        placeholder="请输入表格名称"
        style={{ fontWeight: 'bold', paddingInlineStart: 10 }}
        maxLength={50}
      />
    </div>
  )
}

export default TableNameEditor
