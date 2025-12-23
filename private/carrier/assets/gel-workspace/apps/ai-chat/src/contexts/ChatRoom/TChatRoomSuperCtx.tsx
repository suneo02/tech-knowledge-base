import { VisTableRefType } from '@/pages/VisTable'
import { ChatRoomStateReturn } from 'ai-ui'
import { Dispatch, RefObject, SetStateAction } from 'react'

/**
 * 工作表信息接口
 */
export interface SheetInfo {
  id: string | number // 可根据实际表格组件返回的sheet id类型调整
  name: string
  // 如果 VisTablePage 返回的 sheet 对象有其他需要在 ChatMessageSuper 中使用的属性，也可以在这里添加
}

/**
 * 超级名单聊天室上下文接口
 * 扩展基础聊天室状态，增加超级名单特有的属性和方法
 */

export interface ChatRoomSuperCtx extends ChatRoomStateReturn {
  // 超级名单会话中以 session id 来作为唯一键
  // 会话 id 和 chat id一对一，与 table id 一对一
  /**
   * conversationId: 超级名单会话ID，来自后端接口
   * 用于标识特定的超级名单会话，与后端交互的主要标识符
   */
  conversationId: string

  /**
   * tableId: 数据表格ID
   * 每个超级名单会话关联一个数据表格，用于存储和展示结构化数据
   */
  tableId: string
  /**
   * 设置表格ID
   * 当创建新表格或切换到已有表格时调用
   */
  setTableId: Dispatch<SetStateAction<string>>
  /**
   * sheetList: 当前表格的工作表列表
   * 一个表格可能包含多个工作表
   */
  sheetList: SheetInfo[]

  /**
   * 设置当前表格的工作表列表
   * 当工作表发生变化（增、删、改名）时由 VisTablePage 调用
   */
  setSheetList: Dispatch<SetStateAction<SheetInfo[]>>

  /**
   * activeTableSheetsVersion: 当前表格工作表列表的版本号
   * 当工作表列表内容或数量发生变化时，此版本号应递增
   * ChatMessageSuper 可以监听此值的变化以同步状态
   */
  activeTableSheetsVersion: number

  /**
   * 设置当前表格工作表列表的版本号
   */
  setActiveTableSheetsVersion: Dispatch<SetStateAction<number>>

  /**
   * 设置会话ID
   * 当创建新会话或切换会话时调用
   */
  setConversationId: Dispatch<SetStateAction<string>>

  /**
   * 更新聊天室ID
   * 统一管理roomId、chatId和conversationId的更新
   * 确保三者状态一致性，避免UI和数据不同步
   * @param id 新的ID值
   */
  updateRoomId: (id: string) => void

  /**
   * 重置会话
   */
  resetConversation: () => void

  /**
   * vis table ref
   */
  visTableRef: RefObject<VisTableRefType>
}
