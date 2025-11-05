import React, { useState, useEffect, useCallback } from 'react'
import { Modal } from '@wind/wind-ui'
import { ModalProps } from '@wind/wind-ui/lib/modal/Modal'
import styles from './index.module.less'

const PREFIX = 'route-modal'

// Simplified Location-like structure for internal state
export interface ModalLocation {
  pathname: string
  state?: Record<string, unknown> | null
}

// Simplified NavigateFunction-like signature
export type ModalNavigateFunction = (
  to: string,
  options?: { replace?: boolean; state?: Record<string, unknown> | null }
) => void

// Props injected into components rendered within the modal's "routes"
export interface InjectedRouteProps {
  navigate?: ModalNavigateFunction
  location?: ModalLocation
  onCancel?: () => void
  onOk?: (data: unknown) => void
}

// Configuration for a single "route" or page within the modal
export interface RouteConfig {
  path: string
  element: React.ReactElement // The React element to render for this path
}

// Props for the RouteModal component
export interface RouteModalProps extends ModalProps {
  open: boolean
  initialRoutePath: string
  routes: RouteConfig[]
  modalTitle?: React.ReactNode
  initParams?: Record<string, unknown>
  contentStyle?: React.CSSProperties
}

export const RouteModal: React.FC<RouteModalProps> = ({
  open,
  onCancel,
  onOk,
  initialRoutePath,
  routes,
  modalTitle = '提示',
  initParams,
  width = 800,
  contentStyle,
  ...modalProps
}) => {
  const [currentPath, setCurrentPath] = useState<string>(initialRoutePath)
  const [currentState, setCurrentState] = useState<Record<string, unknown> | null | undefined>(initParams)

  // Reset state when modal opens to ensure clean state, especially if not using destroyOnClose
  // or if destroyOnClose behavior is not sufficient for this internal router.
  useEffect(() => {
    if (open) {
      setCurrentPath(initialRoutePath)
      setCurrentState(initParams)
    } else {
      // Optionally clear path/state when closed, though destroyOnClose on Modal might handle element unmounting
      // setCurrentPath(''); // Or some default/invalid path
      // setCurrentState(null);
    }
  }, [open, initialRoutePath, initParams])

  const navigate: ModalNavigateFunction = useCallback((to, options) => {
    setCurrentPath(to)
    // Only update state if the 'state' key is explicitly part of the options.
    // If options is undefined, or options.state is undefined, current state persists.
    if (options && Object.prototype.hasOwnProperty.call(options, 'state')) {
      setCurrentState(options.state)
    }
  }, [])

  if (!open) {
    return null
  }

  if (!routes || routes.length === 0) {
    console.error('RouteModal: routes prop is required and cannot be empty.')
    return (
      // @ts-expect-error wind-ui modal
      <Modal title="配置错误" open={open} onCancel={onClose} footer={null} width={modalWidth}>
        <p>路由配置错误，请提供有效的 `routes`。</p>
      </Modal>
    )
  }

  const activeRoute = routes.find((route) => route.path === currentPath)
  let content: React.ReactNode = null

  if (activeRoute) {
    const location: ModalLocation = { pathname: currentPath, state: currentState }
    content = React.cloneElement(activeRoute.element, {
      navigate,
      location,
      onCloseModal: onCancel,
      onSubmitModal: onOk,
    } as InjectedRouteProps)
  } else {
    console.warn(`RouteModal: No route found for path: ${currentPath}`)
    content = <p>页面未找到: {currentPath}</p> // Fallback UI for missing route
  }

  return (
    // @ts-expect-error wind-ui modal
    <Modal
      title={modalTitle}
      visible={open}
      onCancel={onCancel}
      footer={null}
      width={width}
      destroyOnClose
      {...modalProps}
    >
      <div className={styles[`${PREFIX}-container`]} style={contentStyle}>
        {content}
      </div>
    </Modal>
  )
}
