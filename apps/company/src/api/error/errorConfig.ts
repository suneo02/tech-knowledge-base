import { t } from 'gel-util/intl'

export enum ErrorActionType {
  NONE = 'none', // 没有操作按钮
  CONFIRM = 'confirm', // 确认按钮
  CANCEL = 'cancel', // 取消按钮
  RECHARGE = 'recharge', // 充值按钮
  RETRY = 'retry', // 重试按钮
  CLOSE = 'close', // 关闭按钮
}

export interface ErrorAction {
  type: ErrorActionType
  text: string
  onClick?: () => void
}

export interface ErrorConfig {
  title?: string // 错误标题
  message: string // 错误消息
  type: 'error' | 'warning' | 'info' | 'success' // 错误类型
  showIcon?: boolean // 是否显示图标
  actions?: ErrorAction[] // 操作按钮配置
  duration?: number // 自动关闭时间，单位毫秒，不设置则不自动关闭
  closable?: boolean // 是否可手动关闭
}

// 默认错误配置
export const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  title: t('422001', '提示'),
  message: t('422002', '发生了一个错误，请稍后再试'),
  type: 'error',
  showIcon: true,
  actions: [
    {
      type: ErrorActionType.CONFIRM,
      text: t('422003', '确定'),
    },
  ],
  closable: true,
}

// 错误码配置映射
export const ERROR_CONFIG_MAP: Record<string | number, ErrorConfig> = {
  // 默认错误
  DEFAULT: DEFAULT_ERROR_CONFIG,

  // 积分不足错误
  100001: {
    title: t('422004', '积分不足'),
    message: t('422005', '您的积分不足，无法完成此操作'),
    type: 'warning',
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.RECHARGE,
        text: t('422006', '立即充值'),
      },
      {
        type: ErrorActionType.CANCEL,
        text: t('422007', '取消'),
      },
    ],
    closable: true,
  },

  // 支付失败错误
  100002: {
    title: t('422008', '支付失败'),
    message: t('422009', '支付处理失败，请稍后再试'),
    type: 'error',
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.CONFIRM,
        text: t('422010', '我知道了'),
      },
    ],
    closable: true,
  },

  // 操作成功通知
  100003: {
    title: t('422011', '操作成功'),
    message: t('422012', '您已成功消费100积分，实际扣除80积分'),
    type: 'success',
    showIcon: true,
    duration: 3000,
    closable: true,
  },

  // 无需确认的提示
  100004: {
    message: t('422013', '操作已完成'),
    type: 'info',
    showIcon: true,
    duration: 2000,
    closable: false,
  },

  // 系统维护
  100005: {
    title: t('422014', '系统维护'),
    message: t('422015', '系统正在维护中，请稍后再试'),
    type: 'warning',
    showIcon: true,
    duration: 5000,
    closable: true,
  },

  // 权限不足
  100006: {
    title: t('422016', '权限不足'),
    message: t('422017', '您没有权限执行此操作'),
    type: 'error',
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.CONFIRM,
        text: t('422018', '确定'),
      },
    ],
    closable: true,
  },

  // 会话过期
  100007: {
    title: t('422019', '会话过期'),
    message: t('422020', '您的会话已过期，请重新登录'),
    type: 'warning',
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.CONFIRM,
        text: t('422021', '重新登录'),
      },
    ],
    closable: false,
  },

  // 网络错误
  100008: {
    title: t('422022', '网络错误'),
    message: t('422023', '网络连接失败，请检查网络设置'),
    type: 'error',
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.RETRY,
        text: t('313393', '重试'),
      },
      {
        type: ErrorActionType.CLOSE,
        text: t('6653', '关闭'),
      },
    ],
    closable: true,
  },
}

// 获取错误配置的辅助函数
export const getErrorConfig = (errorCode: string | number): ErrorConfig => {
  return ERROR_CONFIG_MAP[errorCode] || ERROR_CONFIG_MAP.DEFAULT
}
