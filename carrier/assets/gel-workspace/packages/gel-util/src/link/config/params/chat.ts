import { LinkModule } from '../linkModule'
import { CommonLinkParams } from './common'

// 定义常量避免魔法值
export const CHAT_PARAM_KEYS = {
  INITIAL_MSG: 'initialMsg',
  INITIAL_DEEPTHINK: 'initialDeepthink',
}

export const SUPER_LIST_CHAT_PARAM_KEYS = {
  CHAT_ID: '',
}

export interface ChatParams {
  [LinkModule.AI_CHAT]: {
    [CHAT_PARAM_KEYS.INITIAL_MSG]?: string
    [CHAT_PARAM_KEYS.INITIAL_DEEPTHINK]?: string
  } & CommonLinkParams
  [LinkModule.SUPER_LIST_CHAT]: {
    [SUPER_LIST_CHAT_PARAM_KEYS.CHAT_ID]?: string
  } & CommonLinkParams
}
