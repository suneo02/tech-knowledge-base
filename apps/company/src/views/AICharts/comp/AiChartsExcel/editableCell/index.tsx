import { CheckO, NoteO } from '@wind/icons'
import { Input, Select } from '@wind/wind-ui'
import React, { useState } from 'react'
const Option = Select.Option
import styles from './index.module.less'
import { useUpdateEffect } from 'ahooks'

interface EditableCellProps {
  value?: string
  cellConfig: any
  editMode: boolean
  disabled: boolean
  handleValueChange: (value: any) => void
}

const EditableCell: React.FC<EditableCellProps> = (props) => {
  const { cellConfig, editMode, disabled, handleValueChange } = props
  const [value, setValue] = useState(props.value)
  const [editing, setEditing] = useState(false)
  const cellType = cellConfig.type

  useUpdateEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleEditClick() {
    setEditing(true)
  }

  function handleDoneEdit() {
    setEditing(false)
    handleValueChange(value)
  }

  function handleChange(e) {
    if (cellType === 'select') {
      setValue(e)
      return
    }
    if (cellType === 'text') {
      setValue(e.target.value)
    }
  }

  return (
    <div className={styles['editable-cell']}>
      {editing ? (
        <div className={styles['editable-cell-input-wrapper']}>
          {cellType === 'text' && (
            <Input
              autoFocus
              value={value}
              onChange={handleChange}
              onPressEnter={handleDoneEdit}
              onBlur={handleDoneEdit}
            />
          )}
          {cellType === 'select' && (
            <Select autoFocus placeholder="请选择" value={value} onChange={handleChange} onBlur={handleDoneEdit}>
              {cellConfig.options.map(({ name, key }) => {
                return (
                  <Option key={key} value={key}>
                    {name}
                  </Option>
                )
              })}
            </Select>
          )}
          <CheckO
            className={styles['editable-cell-icon-check']}
            onClick={handleDoneEdit}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </div>
      ) : (
        <div className={styles['editable-cell-text-wrapper']}>
          {(cellType === 'text' && value) || ' '}
          {(cellType === 'select' && cellConfig.options.find((o) => o.key === value)?.name) || ' '}
          {editMode && cellConfig.editable && !disabled && (
            <NoteO
              type="edit"
              className={styles['editable-cell-icon']}
              onClick={handleEditClick}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default EditableCell
