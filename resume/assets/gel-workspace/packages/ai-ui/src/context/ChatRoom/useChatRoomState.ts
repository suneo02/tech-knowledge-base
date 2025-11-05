import { useResetState } from 'ahooks'
import { useUrlState } from 'gel-util/hooks'

/**
 * 聊天室状态接口
 * 包含：chatId（后端接口返回的对话ID）、roomId（前端聊天室ID）、isChating（是否正在聊天中）
 */
export interface ChatRoomState {
  chatId: string
  roomId: string
  isChating: boolean
}

/**
 * 前端聊天室 id 前缀（相比较 chat id）
 * 用于区分前端暂存的ID和后端返回的真实ID
 */
export const CHAT_ROOM_ID_PREFIX = 'V-'

/**
 * 初始化一个随机聊天室 id
 * 使用时间戳确保唯一性，在创建新会话时使用
 */
export const initRandomRoomId = () => {
  return `${CHAT_ROOM_ID_PREFIX}${Date.now()}`
}

/**
 * 从 room id 中抽离 chat id
 * 去除前缀，获取真实的聊天ID
 */
export const extractChatIdFromRoomId = (roomId: string) => {
  return roomId.replace(CHAT_ROOM_ID_PREFIX, '')
}

/**
 * 聊天室状态及操作方法接口
 * 扩展基础聊天状态，提供状态更新方法
 */
export interface ChatRoomStateReturn extends ChatRoomState {
  // ai 对话 id， 接口中获得 chat id 时会更新
  setChatId: (id: string) => void
  resetChatId: () => void
  // 前端 聊天室 id，
  // 创建会话时会使用更新 room id，并且会更新一个随机的字符作为 chat id，直到接口返回
  // 左侧历史会话切换时，会更新 room id，以及真实的 chat id
  // 前端使用 room id 来控制会话切换及会话组件的 key（这样能正确的加载卸载）
  // 加载历史会话时，roomId 与 chatId 相同，都从接口中获得
  setRoomId: (id: string) => void
  // 更新聊天状态，控制是否处于聊天中
  setIsChating: (isChating: boolean) => void
  resetIsChating: () => void
}

/**
 * 聊天室状态管理Hook
 *
 * 设计特点:
 * 1. 双ID设计：通过分离前端roomId和后端chatId，使得组件可以在等待后端响应时仍能保持会话状态
 * 2. 无缝切换：使用roomId作为组件key，确保会话切换时组件能够正确卸载与加载
 * 3. 状态隔离：将聊天状态逻辑从UI组件中抽离，提高代码复用性和可维护性
 *
 * 使用场景:
 * - 新建会话：生成临时roomId，等待后端返回真实chatId
 * - 切换会话：更新roomId和chatId，触发组件重新渲染
 * - 加载历史：使用后端返回的ID同时更新roomId和chatId
 *
 * @returns ChatRoomStateReturn 返回聊天室状态和状态操作方法
 */
export const useChatRoomState = (initialRoomId?: string): ChatRoomStateReturn => {
  const [chatId, setChatId, resetChatId] = useResetState<string>('')
  const [roomId, setRoomId] = useResetState<string>(initialRoomId || initRandomRoomId())
  const [isChating, setIsChating, resetIsChating] = useResetState<boolean>(false)

  return {
    chatId,
    setChatId,
    resetChatId,
    roomId,
    setRoomId,
    isChating,
    setIsChating,
    resetIsChating,
  }
}
