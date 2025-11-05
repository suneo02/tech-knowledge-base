import { ApiResponseForWFC } from '@/wfc'
import { ApiResponseForChat } from '../types'
import { AddChatGroupRequest, AddChatGroupResponse } from './addChatGroup'
import { AddChatItemRequest, ChatQuestion } from './addChatItem'
import { AnalysisEngineRequest, AnalysisEngineResponse } from './analysisEngine'
import { GetResultRequest } from './messageStream'
import { QueryReferenceRequest, QueryReferenceResponse } from './QueryReference'
import {
  ChatHistoryRequest,
  ChatHistoryResponse,
  ChatRestoreRequest,
  ChatRestoreResponse,
  ChatTraceRequest,
  ChatTraceResponse,
  CreateRecordStampRequest,
  DeleteChatGroupRequest,
  DeleteChatGroupResponse,
  SessionCompleteRequest,
  SessionCompleteResponse,
  UpdateChatGroupRequest,
  UpdateChatGroupResponse,
} from './session'
import { SummarizeTitleRequest, SummarizeTitleResponse } from './summarizeTitle'
import { GetUserQuestionRequest, GetUserQuestionResponse } from './useQuestion'
import { UserQuestionGuideRequest, UserQuestionGuideResponse } from './userQuestionGuide'

export * from './addChatGroup'
export * from './addChatItem'
export * from './analysisEngine'
export * from './gelData'
export * from './messageStream'
export * from './QueryReference'
export * from './session'
export * from './summarizeTitle'
export * from './tableData'
export * from './useQuestion'
export * from './userQuestionGuide'

/**
 * chat api
 * key 是 url
 */
export type chatApiPathMap = {
  'chat/addChatGroup': {
    params: void
    data: AddChatGroupRequest
    response: ApiResponseForChat<AddChatGroupResponse>
  }
  'chat/analysisEngine': {
    data: AnalysisEngineRequest
    response: ApiResponseForChat<AnalysisEngineResponse>
  }
  'chat/getUserQuestion': {
    data: GetUserQuestionRequest
    response: ApiResponseForChat<GetUserQuestionResponse>
  }
  'chat/summarizeTitle': {
    data: SummarizeTitleRequest
    response: ApiResponseForWFC<SummarizeTitleResponse>
  }
  'chat/userQuestionGuide': {
    data: UserQuestionGuideRequest
    response: ApiResponseForChat<UserQuestionGuideResponse>
  }
  'chat/queryReference': {
    data: QueryReferenceRequest
    response: ApiResponseForChat<QueryReferenceResponse>
  }
  'chat/getResult': {
    data: GetResultRequest
  }
  'chat/sessionComplete': {
    data: SessionCompleteRequest
    response: ApiResponseForChat<SessionCompleteResponse[]>
  }
  'chat/trace': {
    data: ChatTraceRequest
    response: ApiResponseForChat<ChatTraceResponse[]>
  }
  selectChatAIConversation: {
    data: ChatHistoryRequest
    response: ApiResponseForWFC<ChatHistoryResponse[]>
  }
  'chat/addChatItem': {
    data: AddChatItemRequest
  }
  selectChatAIRecord: {
    data: ChatRestoreRequest
    response: ApiResponseForWFC<ChatRestoreResponse[]>
  }
  delChatGroup: {
    data: DeleteChatGroupRequest
    response: ApiResponseForWFC<DeleteChatGroupResponse>
  }
  updateChatGroup: {
    data: UpdateChatGroupRequest
    response: ApiResponseForWFC<UpdateChatGroupResponse>
  }
  getQuestion: {
    response: ApiResponseForWFC<ChatQuestion[]>
  }
  createRecordStamp: {
    data: CreateRecordStampRequest
  }
}
