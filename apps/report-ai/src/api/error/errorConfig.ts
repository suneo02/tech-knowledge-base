export enum ErrorActionType {
  NONE = 'none', // 没有操作按钮
  CONFIRM = 'confirm', // 确认按钮
  CANCEL = 'cancel', // 取消按钮
  RECHARGE = 'recharge', // 充值按钮
  RETRY = 'retry', // 重试按钮
  CLOSE = 'close', // 关闭按钮
}

export interface ErrorAction {
  type: ErrorActionType;
  text: string;
  onClick?: () => void;
}

export interface ErrorConfig {
  title?: string; // 错误标题
  message: string; // 错误消息
  type: 'error' | 'warning' | 'info' | 'success'; // 错误类型
  showIcon?: boolean; // 是否显示图标
  actions?: ErrorAction[]; // 操作按钮配置
  duration?: number; // 自动关闭时间，单位毫秒，不设置则不自动关闭
  closable?: boolean; // 是否可手动关闭
}
