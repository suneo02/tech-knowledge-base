import { PlusOutlined } from '@ant-design/icons'
import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FC } from 'react'

const STRINGS = {
  HAS_INSERT_TABLE: t('464135', '已插入至表格'),
  INSERT_NEW_TABLE: t('464189', '添加至表格')
}

export const InsertTableButton: FC<{
  onClick: () => void
  loading: boolean
  id: string
  disabled: boolean
}> = ({ onClick, loading, id, disabled }) => (
  <Button key={id} type="primary" onClick={onClick} loading={loading} disabled={disabled}>
    {disabled ? (
      STRINGS.HAS_INSERT_TABLE
    ) : (
      <>
        <PlusOutlined />
        {STRINGS.INSERT_NEW_TABLE}
      </>
    )}
  </Button>
)
