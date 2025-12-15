import React from 'react'
import { useProgressGuard } from '../context/useProgressGuard'
import { Button, message } from '@wind/wind-ui'
import type { ButtonProps } from '@wind/wind-ui/lib/button/button'

interface GuardedButtonProps extends ButtonProps {
  toastMessage?: string
}

export const GuardedButton: React.FC<GuardedButtonProps> = ({
  children,
  onClick,
  toastMessage = '数据正在处理中，请稍候...',
  ...props
}) => {
  const { inProgress } = useProgressGuard()

  const showToast = (msg: string) => {
    message.info(msg)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (inProgress) {
      showToast(toastMessage)
      return
    }
    onClick?.(e)
  }

  return (
    <Button {...props} onClick={handleClick} type="primary">
      {children}
    </Button>
  )
}
