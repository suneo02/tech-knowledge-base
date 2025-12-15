import { Button } from '@wind/wind-ui'
import React from 'react'
import { useContactManager } from '.'
import intl from '../../../utils/intl'

interface ContactManagerButtonProps {
  title?: React.ReactNode
  className?: string
}

/**
 * 联系客户经理按钮组件
 */
export const ContactManagerButton: React.FC<ContactManagerButtonProps> = ({ title, className }) => {
  const { handleContactManager } = useContactManager()

  return (
    <Button
      className={className}
      type="link"
      onClick={handleContactManager}
      data-uc-id="w_rcaFUjjO"
      data-uc-ct="button"
    >
      {title || intl('234937', '联系客户经理')}
    </Button>
  )
}

/**
 * 联系客户经理按钮组件
 * 这是一个高阶组件，用于在类组件中使用useContactManager hook
 */
export const withContactManager = (WrappedComponent: React.ComponentType<any>) => {
  return function WithContactManagerComponent(props: any) {
    const { handleContactManager } = useContactManager()

    return (
      <WrappedComponent
        {...props}
        onContactManager={handleContactManager}
        data-uc-id="NJpEDBtC1h"
        data-uc-ct="wrappedcomponent"
      />
    )
  }
}
