import { EditO, LoadingO } from '@wind/icons'
import { Button, Input } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

export interface EditableLabelProps {
  value: string
  onSave: (value: string) => Promise<void>
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  validateFn?: (value: string) => { isValid: boolean; errorMsg?: string }
}

const STRINGS = {
  CANCEL: t('151548', '取消'),
  INPUT_PLACEHOLDER: t('443836', '请输入'),
  INPUT_MAX_LENGTH_ERROR: (maxLength: number) => t('421501', '输入内容不能超过{{maxLength}}个字符', { maxLength }),
}

export const EditableLabel: FC<EditableLabelProps> = ({
  value,
  onSave,
  style,
  inputStyle,
  placeholder = STRINGS.INPUT_PLACEHOLDER,
  disabled = false,
  maxLength,
  validateFn,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [displayValue, setDisplayValue] = useState(value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const originalValueRef = useRef(value)

  // 当外部value变化时更新显示值
  useEffect(() => {
    if (value !== originalValueRef.current) {
      setDisplayValue(value)
      if (!isEditing) {
        originalValueRef.current = value
      }
    }
  }, [value, isEditing])

  const handleEdit = useCallback(() => {
    if (disabled || loading) return
    setEditValue(displayValue)
    originalValueRef.current = displayValue
    setError(undefined)
    setIsEditing(true)
  }, [disabled, loading, displayValue])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditValue(originalValueRef.current)
    setError(undefined)
  }, [])

  const handleSave = useCallback(async () => {
    if (disabled || !editValue.trim() || loading) return

    // 验证输入
    if (validateFn) {
      const validation = validateFn(editValue)
      if (!validation.isValid) {
        setError(validation.errorMsg)
        return
      }
    }

    // 手动验证最大长度
    if (maxLength && editValue.length > maxLength) {
      setError(STRINGS.INPUT_MAX_LENGTH_ERROR(maxLength))

      return
    }

    const newValue = editValue
    setLoading(true)
    setIsEditing(false)
    setDisplayValue(newValue)

    try {
      await onSave(newValue)
      originalValueRef.current = newValue
      setError(undefined)
      setLoading(false)
    } catch (err) {
      setDisplayValue(originalValueRef.current)
      setLoading(false)
      setError(undefined)
      console.error('🚀 ~ handleSave ~ err:', err)
    }
  }, [editValue, onSave, maxLength, disabled, loading, validateFn])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      // 手动限制输入长度
      if (maxLength && newValue.length > maxLength) {
        setEditValue(newValue.slice(0, maxLength))
      } else {
        setEditValue(newValue)
      }
      setError(undefined)
    },
    [maxLength]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', ...style }}>
        <div style={{ position: 'relative', width: '100%', marginInlineEnd: 4 }}>
          <Input
            autoFocus
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              marginRight: 4,
              ...(error ? { borderColor: '#ff4d4f' } : {}),
              ...inputStyle,
            }}
            disabled={loading}
          />
          {error && <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
        </div>
        <Button onClick={handleCancel} disabled={loading} style={{ width: 90 }}>
          {STRINGS.CANCEL}
        </Button>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <span>{displayValue}</span>
      {!disabled && (
        <Button
          type="text"
          size="small"
          // @ts-expect-error wind-icons
          icon={loading ? <LoadingO /> : <EditO />}
          onClick={handleEdit}
          style={{ marginLeft: 4 }}
          disabled={loading}
        />
      )}
    </div>
  )
}
