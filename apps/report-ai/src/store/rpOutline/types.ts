/**
 * RPOutline Redux 状态类型定义
 *
 * @description 定义 RPOutline 模块的 Redux 状态结构
 */

import { RPFileUploaded, RPOutlineAgentMsg } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';

/**
 * RPOutline 模块的根状态
 *
 * @description 包含大纲会话模块的所有状态
 */
export interface RPOutlineState {
  /** 文件列表 - 整体会话所有文件列表 */
  files: RPFileUploaded[];
}

/**
 * Redux Action Payload 类型
 */

/** 添加文件 */
export interface AddFilePayload {
  file: RPFileUploaded;
}

/** 设置原始消息 */
export interface SetRawMessagesPayload {
  rawMessages: MessageInfo<RPOutlineAgentMsg>[];
}
