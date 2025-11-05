import { getCDEFilterResPayload } from '@/windSecure'

export interface AddClueExcelDataToSheetRequest {
  conversationType: 'CLUE_EXCEL'
  clueExcelName?: string
  clueExcelCondition: {
    header: {
      companyCode: string
      [key: string]: string
    }
    dataList: {
      companyCode: string
      [key: string]: string
    }[]
  }
}

export type SuperListAddConversationPayload =
  // 创建空白表格来创建会话
  | {
      conversationType: 'EMPTY_TABLE'
    }
  // 上传线索名单
  | AddClueExcelDataToSheetRequest
  // 从企业数据浏览器创建会话
  | {
      conversationType: 'CDE_FILTER'
      // 该筛选项名称
      cdeDescription: string
      // 筛选项的 json string
      cdeFilterCondition: getCDEFilterResPayload
    }
  // 从用户的对话中创建会话
  | {
      conversationType: 'AI_CHAT'
      rawSentence: string
    }
  // 从预设问句创建
  | {
      conversationType: 'PRESET_QUESTION'
      // 预设问句 id
      rawSentenceID: string
    }

export type SuperListAddConversationResponse = {
  conversationId: string
  /**
   * 暂时不用，在会话详情接口会再调用接口查询
   */
  chatId: string
  conversationName: string
  /**
   * 暂时不用，在会话详情接口会再调用接口查询
   */
  tableId: string
  /**
   * 暂时不用，在会话详情接口会再调用接口查询
   */
  sheetId: number[]
}
