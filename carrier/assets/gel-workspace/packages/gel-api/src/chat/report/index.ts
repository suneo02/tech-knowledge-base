import { ApiResponseForWFC } from '@/types'
import { AxiosRequestConfig } from 'axios'
import { ChatGroupIdIdentifier, RPDetailChapter, ReportIdIdentifier } from '../types'
import { RPChapterSavePayload } from '../types/report/detail'
import { reportAIFileApiPathMap, reportFileApiConfigMap } from './file'
import { ReportAIReportTemplateApiPathMap } from './template'

export interface ReportDetailChapterInfo {
  chapters: RPDetailChapter[]
  id: string
  name: string
}
export type ReportAIApiPathMap = reportAIFileApiPathMap &
  ReportAIReportTemplateApiPathMap & {
    'report/create': {
      data: ChatGroupIdIdentifier
      response: ApiResponseForWFC<
        {
          chatTitle: string
          // 报告会话 id
          chatId: string
        } & ReportIdIdentifier
      >
    }

    'report/query': {
      response: ApiResponseForWFC<ReportDetailChapterInfo>
    }
    'reportChapter/batchUpdateChapterTree': {
      data: {
        chapterTree: RPChapterSavePayload[]
      } & ReportIdIdentifier
      response: ApiResponseForWFC<{
        tempIdMapping: Record<string, string>
      }>
    }
    'report/save': {
      data: {
        referencePriority: number
      } & ReportIdIdentifier
      response: ApiResponseForWFC<string>
    }
  }

export const reportApiConfigMap: Partial<Record<keyof ReportAIApiPathMap, AxiosRequestConfig>> = {
  'report/query': {
    method: 'GET',
  },
  'report/fileUpload': {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
  ...reportFileApiConfigMap,
}
