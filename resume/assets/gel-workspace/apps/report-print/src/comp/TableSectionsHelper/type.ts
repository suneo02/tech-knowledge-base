import { RawHtmlSplitResult } from '@/utils/html/reProcessAfterRawHtmlSplit'
import { TCorpDetailNodeKey } from 'gel-types'
import { FlattenedReportConfig } from 'report-util/corpConfigJson'
import { ApiResponseForWFC } from 'report-util/types'

export interface RPPrintApiState {
  apiDataStore: Partial<Record<TCorpDetailNodeKey, any>>
  apiDataOverAllStore: Partial<Record<TCorpDetailNodeKey, ApiResponseForWFC<any>>>
}

export interface RPPrintState extends RPPrintApiState, FlattenedReportConfig, Pick<RawHtmlSplitResult, 'htmlStore'> {}
