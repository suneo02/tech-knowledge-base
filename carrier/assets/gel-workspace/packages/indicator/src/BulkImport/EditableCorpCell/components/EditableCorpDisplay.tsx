import { Button, Tooltip } from '@wind/wind-ui'
import classNames from 'classnames'
import { IndicatorCorpMatchItem } from 'gel-api'
import styles from './EditableCorpDisplay.module.less'
import { DeleteO, EditO } from '@wind/icons'

interface EditableCorpDisplayProps {
  value: IndicatorCorpMatchItem
  editable: boolean
  onEdit: () => void
  onDelete: () => void
}

export const EditableCorpDisplay: React.FC<EditableCorpDisplayProps> = ({ value, editable, onEdit, onDelete }) => {
  // 渲染操作按钮（编辑和删除）
  const renderActionButtons = (
    <div className={classNames(styles['editable-cell-actions'], 'editable-cell-actions')}>
      <Tooltip title={'编辑'}>
        <Button
          className={classNames(styles['editable-cell-icon'], styles['editable-cell-icon--edit'])}
          style={{ display: editable ? 'flex' : 'none' }}
          onClick={onEdit}
          // @ts-expect-error wind-icon 类型定义错误
          icon={<EditO />}
        />
      </Tooltip>
      <Tooltip title={'删除'}>
        <Button
          className={classNames(styles['editable-cell-icon'], styles['editable-cell-icon--delete'])}
          onClick={onDelete}
          // @ts-expect-error wind-icon 类型定义错误
          icon={<DeleteO />}
        />
      </Tooltip>
    </div>
  )

  return (
    <>
      <span
        className={classNames(styles['editable-cell-text'], {
          [styles['editable-cell-text--unmatched']]: value.matched === 0,
          [styles['editable-cell-text--matched']]: value.matched !== 0,
        })}
      >
        {value.queryText || ' '}
      </span>
      {renderActionButtons}
    </>
  )
}
