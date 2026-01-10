import React from 'react'
import { Result, Button } from 'antd'
import { t } from 'gel-util/intl'

export type FallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

type Props = {
  fallback?: React.ReactNode
  FallbackComponent?: React.ComponentType<FallbackProps>
  fallbackRender?: (props: FallbackProps) => React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
  onReset?: () => void
  children?: React.ReactNode
}

type State = {
  error: Error | null
}

const reportEagleSMock = (payload: unknown) => {
  console.log('[eagleS]', payload)
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportEagleSMock({
      app: 'super-agent',
      type: 'react_error',
      message: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: info.componentStack,
      url: window.location.href,
      time: new Date().toISOString(),
    })

    this.props.onError?.(error, info)
  }

  resetErrorBoundary = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state
    const { fallback, FallbackComponent, fallbackRender, children } = this.props

    if (error) {
      const fallbackProps: FallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      }

      if (React.isValidElement(fallback)) {
        return fallback
      }

      if (fallbackRender) {
        return fallbackRender(fallbackProps)
      }

      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />
      }

      return (
        <Result
          status="error"
          title={t('482215', '页面发生错误')}
          subTitle={error.message}
          extra={[
            <Button key="reload" type="primary" onClick={this.handleReload}>
              {t('482216', '刷新页面')}
            </Button>,
            <Button key="retry" onClick={this.resetErrorBoundary}>
              {t('313393', '重试')}
            </Button>,
          ]}
        />
      )
    }
    return children
  }
}
