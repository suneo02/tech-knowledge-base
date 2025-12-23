import { TIntl } from '@/types/misc'
import { ConfigTableCellRenderConfig } from 'gel-types'

export type ReportSimpleTableCellRenderFunc = (
  txt: any,
  record: any,
  config: Pick<ConfigTableCellRenderConfig, 'objectKey' | 'isArrayData' | 'renderConfig'>,
  env: {
    t: TIntl
    isEn: boolean
  }
) => string | number | undefined
