import { Button, Tooltip } from '@wind/wind-ui'
import { FC } from 'react'

export const AddCDEDataBtn: FC<{
  hasValidFilter: boolean
  disabled: boolean
  loading: boolean
  onClick: () => void
  content?: string
}> = ({ hasValidFilter, disabled, loading, onClick, content }) => {
  return (
    <Tooltip title={!hasValidFilter ? '请至少选择一个筛选项' : ''}>
      <Button key="add" type="primary" disabled={disabled} loading={loading} onClick={onClick}>
        {content}
      </Button>
    </Tooltip>
  )
}
