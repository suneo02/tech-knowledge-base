import { ReportIdIdentifier } from './common'
import { RPFileTraced } from './file'

export interface RPChapterIdIdentifier {
  chapterId: number
}

export interface RPChapter extends RPChapterIdIdentifier {
  title: string
  writingThought?: string
  keywords?: string[]
  children?: RPChapter[]
}

export interface ReportOutlineData extends ReportIdIdentifier {
  outlineName: string
  chapters: RPChapter[]
}

export type RPChapterOperation = {
  chapter: Pick<RPChapter, 'chapterId' | 'writingThought' | 'title' | 'keywords'>
  status: {
    success: boolean
    message: string
    operation: 'create_with_ai'
  }
}

export type ReportChatData = {
  outline?: ReportOutlineData
  file?: RPFileTraced[]
  // 报告大纲 公司列表数据
  companyList?: ReportOutlineCorpCandidates // 公司列表数据
  chapterOperation?: RPChapterOperation
}

export type ReportOutlineCorpCandidates = {
  companyName: string
  companyCode: string
}[]
