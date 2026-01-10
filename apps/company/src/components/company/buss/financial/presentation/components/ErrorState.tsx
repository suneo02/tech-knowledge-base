/**
 * 错误占位组件：显示错误信息并提供重试按钮。
 * @author yxlu.calvin
 * @example
 * <ErrorState error={error} onRetry={() => reload()} />
 * @remarks
 * - 文案国际化：使用 `gel-util/intl` 的 `t` 方法
 * - 错误文本：优先展示 `error.message`，否则回退为 `String(error)`
 */
import React from 'react'
import { t } from 'gel-util/intl'

const STRINGS = {
  LOAD_FAILED: t('', '数据加载失败'),
  RETRY: t('313393', '重试'),
} as const

const hasMessage = (e: unknown): e is { message: unknown } => {
  return typeof e === 'object' && e !== null && Object.prototype.hasOwnProperty.call(e, 'message')
}

export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({ error, onRetry }) => {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ color: 'var(--danger-6)', marginBottom: 8 }}>{STRINGS.LOAD_FAILED}</div>
      <div style={{ color: 'var(--text-2)', marginBottom: 12 }}>
        {hasMessage(error) && typeof error.message === 'string' ? String(error.message) : String(error)}
      </div>
      <button onClick={onRetry} style={{ padding: '6px 12px' }}>
        {STRINGS.RETRY}
      </button>
    </div>
  )
}
