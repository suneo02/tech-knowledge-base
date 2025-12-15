import { CheckO, CloseO } from '@wind/icons'
import { Input } from '@wind/wind-ui'
import { memo, useEffect, useState } from 'react'
import styles from './index.module.less'

// 编辑输入框组件
export const ConversavionEditingInput = memo(
  ({
    initialValue,
    conversationId,
    onConfirm,
    onCancel,
  }: {
    initialValue: string
    conversationId: string
    onConfirm: (id: string, value: string) => void
    onCancel: () => void
  }) => {
    const [value, setValue] = useState(initialValue)
    const [blurable, setBlurable] = useState(false)

    useEffect(() => {
      // 延迟设置blurable，避免立即失焦
      const timer = setTimeout(() => {
        setBlurable(true)
      }, 100)
      return () => clearTimeout(timer)
    }, [])

    return (
      <>
        <div className={styles['editing-item']}>
          <Input
            autoFocus
            size="small"
            value={value}
            // @ts-expect-error windui
            maxLength={30}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              if (!value) {
                return
              }
              e.preventDefault()
              e.stopPropagation()
              if (blurable) {
                setTimeout(() => {
                  onCancel()
                }, 100)
              }
            }}
            onPressEnter={() => {
              onConfirm(conversationId, value)
            }}
            style={{ width: '100%' }}
          />
          <CheckO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontSize: 16, marginLeft: '8px', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onConfirm(conversationId, value)
            }}
          />
          <CloseO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ fontSize: 16, marginLeft: '8px' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
          />
        </div>
      </>
    )
  }
)

ConversavionEditingInput.displayName = 'ConversavionEditingInput'
