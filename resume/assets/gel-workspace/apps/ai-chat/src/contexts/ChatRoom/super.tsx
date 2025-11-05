import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { VisTableRefType } from '@/pages/VisTable'
import { useRequest, useResetState } from 'ahooks'
import { CHAT_ROOM_ID_PREFIX, initRandomRoomId, useChatRoomState } from 'ai-ui'
import { isEmpty, isNil } from 'lodash'
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChatRoomSuperCtx, SheetInfo } from './TChatRoomSuperCtx'

/**
 * 超级名单聊天室提供者组件属性接口
 */
export interface SuperChatProviderProps {
  children: ReactNode
}

// 创建上下文
const Context = createContext<ChatRoomSuperCtx | undefined>(undefined)

/**
 * 超级名单聊天室上下文Hook
 * 用于在组件中获取和使用超级名单聊天室上下文
 * @returns 超级名单聊天室上下文
 * @throws 如果在Provider外部使用则抛出错误
 */
export const useChatRoomSuperContext = () => {
  const contextState = useContext(Context)
  if (!contextState) {
    throw new Error('useSuperChatRoomContext must be used within a SuperChatRoomProvider')
  }
  return contextState
}

/**
 * 超级名单聊天室提供者组件
 *
 * 设计特点:
 * 1. 复用基础聊天状态：继承了基础聊天室的双ID设计
 * 2. 扩展超级名单功能：添加表格和工作表的状态管理
 * 3. 统一状态更新：通过updateRoomId方法确保ID状态的一致性
 * 4. URL同步：支持URL与会话状态同步，避免重新渲染
 *
 * 使用场景:
 * - 创建超级名单会话：初始化会话ID、表格ID和工作表ID
 * - 切换超级名单会话：更新相关ID，保持UI和数据同步
 * - 数据操作：提供对表格和工作表的引用，支持数据的读写
 *
 * 接口发送最好不要放在 provider 中，待移出
 *
 * @param children 子组件
 */
export const ChatRoomSuperProvider = ({ children }: SuperChatProviderProps) => {
  // 使用基础聊天状态hook
  const { conversationId: conversationIdFromParam } = useParams()
  const roomState = useChatRoomState(conversationIdFromParam)

  // Super chat特有的状态
  const visTableRef = useRef<VisTableRefType>(null)
  const [tableId, setTableId, resetTableId] = useResetState<string>('')
  const [conversationId, setConversationId] = useState<string>(conversationIdFromParam || '')
  const [sheetList, setSheetList, resetSheetList] = useResetState<SheetInfo[]>([])
  const [activeTableSheetsVersion, setActiveTableSheetsVersion, resetActiveTableSheetsVersion] =
    useResetState<number>(0)

  const { run: getConversationDetail } = useRequest(createSuperlistRequestFcs('conversation/conversationDetail'), {
    onSuccess: (data) => {
      roomState.setChatId(data.Data.data.chatId)
      setTableId(data.Data.data.tableId)
    },
    onError: console.error,
    manual: true,
  })

  // 处理URL参数变化
  useEffect(() => {
    if (isNil(conversationIdFromParam) || isEmpty(conversationIdFromParam)) {
      resetConversation()
    } else if (conversationIdFromParam !== conversationId) {
      updateRoomId(conversationIdFromParam)
    }
  }, [conversationIdFromParam, conversationId])

  useEffect(() => {
    if (conversationId) {
      getConversationDetail({ conversationId })
    }
  }, [conversationId])

  const updateRoomId = useCallback(
    (id: string) => {
      console.log('updateRoomId', id)
      roomState.setRoomId(id)
      setConversationId(id.includes(CHAT_ROOM_ID_PREFIX) ? '' : id)
    },
    [roomState, setConversationId]
  )

  const resetConversation = useCallback(() => {
    updateRoomId(initRandomRoomId())
    roomState.resetChatId()
    roomState.resetIsChating()
    resetTableId()
    resetSheetList()
    resetActiveTableSheetsVersion()
  }, [updateRoomId, roomState, resetTableId, resetSheetList, resetActiveTableSheetsVersion])

  return (
    <Context.Provider
      value={{
        ...roomState,
        tableId,
        conversationId,
        sheetList,
        activeTableSheetsVersion,
        setTableId,
        setSheetList,
        setConversationId,
        updateRoomId,
        setActiveTableSheetsVersion,
        resetConversation,
        visTableRef,
      }}
    >
      {children}
    </Context.Provider>
  )
}
