import { createSuperlistRequestFcs } from '@/api'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { Spin } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { EditableLabel } from 'gel-ui'
import React, { CSSProperties } from 'react'
import { useTableName } from './useTableName'
import { GetTableInfoResponse } from 'gel-api'
import { t } from 'gel-util/intl'

interface TableNameEditorProps {
  tableId: string
  initialName?: string
  className?: string
  style?: CSSProperties
  onNameChange?: (name: string) => void
}

const aiRenameConversationFcs = createSuperlistRequestFcs('chat/aiRenameConversation')

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
  const { conversationId, updateTableInfo } = useSuperChatRoomContext()
  const [loading, setLoading] = useState(false)
  // 使用表格名称钩子
  const { tableName, handleUpdateTableName, validateTableName, updateTableName } = useTableName(
    tableId,
    initialName,
    onNameChange ||
      ((name) => {
        updateTableInfo({ tableName: name } as GetTableInfoResponse)
      })
  )

  const { run, cancel } = useRequest(aiRenameConversationFcs, {
    manual: true,
    onSuccess: (data) => {
      if (data.Data?.generateOver) {
        setLoading(false)
        cancel()
        if (data.Data?.generateResult) updateTableName(data.Data.generateResult)
      } else {
        setLoading(true)
      }
    },
    loadingDelay: 100,
    pollingInterval: 5000,
    pollingErrorRetryCount: 3,
  })

  useEffect(() => {
    if (conversationId) {
      run({ conversationId })
    }
    return () => {
      cancel()
    }
  }, [conversationId])

  return loading ? (
    <Spin />
  ) : (
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
        placeholder={t('443836', '请输入名称')}
        maxLength={50}
      />
    </div>
  )
}

export default TableNameEditor
