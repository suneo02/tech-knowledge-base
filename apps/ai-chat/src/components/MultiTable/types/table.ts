import { SourceTypeEnum } from 'gel-api'

export type CellValue = string | number | boolean | null | undefined

export interface onCellClickBySourceProps {
  sourceId: string
  sourceType: SourceTypeEnum
  value?: string
}
