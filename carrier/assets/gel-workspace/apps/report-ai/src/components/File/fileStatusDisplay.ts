/**
 * 文件解析状态展示工具
 *
 * @description 提供文件解析状态的显示文本和样式
 */

import { RPFileStatus } from 'gel-api';

/**
 * 文件状态显示信息
 */
export interface FileStatusDisplay {
  /** 显示文本 */
  text: string;
  /** 图标 */
  icon?: string;
  /** 状态类型（用于样式） */
  type: 'success' | 'processing' | 'error' | 'default';
  /** 是否显示加载动画 */
  loading?: boolean;
  /** 是否显示查看按钮 */
  showViewButton?: boolean;
}

/**
 * 获取文件解析状态的显示信息
 *
 * @param status - 文件解析状态
 * @returns 状态显示信息
 *
 * @example
 * ```tsx
 * const display = getFileStatusDisplay(RPFileStatus.UPLOADED);
 * // { text: '解析中', type: 'processing', loading: true }
 * ```
 * 
 * 财报相关状态会在文件名称下提示：
 * - 财报诊断-信息确认（需要确认财报信息）
 * - 财报诊断-未配平（需要平衡诊断或未配平）
 * 并提供点击查看按钮
 */
export function getFileStatusDisplay(status?: RPFileStatus): FileStatusDisplay {
  if (status === undefined) {
    return {
      text: '',
      type: 'default',
    };
  }

  switch (status) {
    case RPFileStatus.FINISHED:
      return {
        text: '已完成',
        type: 'success',
      };

    case RPFileStatus.UPLOADED:
      return {
        text: '解析中',
        type: 'processing',
        loading: true,
      };

    case RPFileStatus.OUTLINE_PARSED:
      return {
        text: '大纲已解析',
        type: 'processing',
        loading: true,
      };

    case RPFileStatus.FAILED:
      return {
        text: '解析失败',
        type: 'error',
      };

    case RPFileStatus.FINANCE_INFO_PENDING:
      return {
        text: '财报诊断-信息确认',
        type: 'error',
        showViewButton: true,
      };

    case RPFileStatus.FINANCE_BALANCE_PENDING:
      return {
        text: '财报诊断-未配平',
        type: 'error',
        showViewButton: true,
      };

    case RPFileStatus.FINANCE_NOT_BALANCED:
      return {
        text: '财报诊断-未配平',
        type: 'error',
        showViewButton: true,
      };

    default:
      return {
        text: '未知状态',
        type: 'default',
      };
  }
}
