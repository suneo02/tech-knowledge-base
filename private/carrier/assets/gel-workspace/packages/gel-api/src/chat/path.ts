import { ApiResponseForWFC } from '@/types'
import {
  AIChatHistory,
  AIChatHistoryRequest,
  AddChatGroupRequest,
  AddChatGroupResponse,
  AddChatItemRequest,
  AnalysisEnginePayload,
  AnalysisEngineResponse,
  ChatDetailTurn,
  ChatQuestion,
  ChatRestoreRequest,
  ChatTraceItem,
  CreateRecordStampRequest,
  DeleteChatGroupRequest,
  DeleteChatGroupResponse,
  GetResultRequest,
  GetUserQuestionRequest,
  QueryReferencePayload,
  SessionCompleteRequest,
  SummarizeTitleRequest,
  SummarizeTitleResponse,
  UpdateChatGroupRequest,
  UpdateChatGroupResponse,
  UserQuestionGuideRequest,
  UserQuestionGuideResponse,
} from './base'
import { ReportAIApiPathMap } from './report'
import { ApiResponseForChat, ChatEntityRecognize, ChatQuestionType, ChatRawSentenceIdIdentifier } from './types'
import { ApiResponseForGetUserQuestion } from './types/base'
import { ChatQuestionPlatform } from './types/question'

/**
 * chat api
 * key 是 url
 */
export type chatApiPathMap = ReportAIApiPathMap & {
  'chat/addChatGroup': {
    data: AddChatGroupRequest
    response: ApiResponseForChat<AddChatGroupResponse>
  }
  'chat/analysisEngine': {
    data: AnalysisEnginePayload
    response: ApiResponseForChat<AnalysisEngineResponse>
  }
  'chat/getUserQuestion': {
    data: GetUserQuestionRequest
    response: ApiResponseForGetUserQuestion<string>
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
    data: QueryReferencePayload
    response: ApiResponseForChat<null>
  }
  'chat/getResult': {
    data: GetResultRequest
  }
  'chat/sessionComplete': {
    data: SessionCompleteRequest
    response: ApiResponseForChat<ChatEntityRecognize[]>
  }
  'chat/trace': {
    data: ChatRawSentenceIdIdentifier
    response: ApiResponseForWFC<ChatTraceItem[]>
  }
  selectChatAIConversation: {
    data: AIChatHistoryRequest
    response: ApiResponseForWFC<AIChatHistory[]>
  }
  'chat/addChatItem': {
    data: AddChatItemRequest
  }
  selectChatAIRecord: {
    data: ChatRestoreRequest
    response: ApiResponseForWFC<ChatDetailTurn[]>
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
    data: {
      questionsType: ChatQuestionType
      questionsPlatform?: ChatQuestionPlatform
      pageSize?: number
      lang?: string
    }
    response: ApiResponseForWFC<ChatQuestion[]>
  }
  createRecordStamp: {
    data: CreateRecordStampRequest
  }
}
