import { SectionHeading } from '@/components/SectionHeading'
import { TableComment } from '@/components/TableComment'
import { tForRPPreview } from '@/utils'
import { ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { isEn } from 'gel-util/intl'
import { FC } from 'react'
import { SectionHeadingOptions, getReportNodePrefixComment } from 'report-util/corpConfigJson'

export const RPSection: FC<
  {
    tableKey: TCorpDetailNodeKey | undefined
    tableData?: any
    tableConfigsStore: Partial<Record<TCorpDetailNodeKey, ReportDetailTableJson>>
  } & SectionHeadingOptions
> = ({ tableKey, tableData, tableConfigsStore, ...options }) => {
  let tableDataFirst = tableData?.[0]
  if (!tableDataFirst) {
    tableDataFirst = tableData
  }
  const comment = tableKey
    ? getReportNodePrefixComment(tableKey, tableDataFirst || {}, tableConfigsStore[tableKey], tForRPPreview, isEn())
    : undefined
  return (
    <SectionHeading
      {...options}
      Suffix={comment ? ({ className }) => <TableComment content={comment} className={className} /> : undefined}
    />
  )
}
