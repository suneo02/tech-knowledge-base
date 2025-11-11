import { SectionHeading } from '@/components/SectionHeading'
import { TableComment } from '@/components/TableComment'
import { getTForRPPreview } from '@/utils'
import { TCorpDetailNodeKey } from 'gel-types'
import { useIntl } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import { FC } from 'react'
import { FlattenedReportConfig, SectionHeadingOptions, getReportNodePrefixComment } from 'report-util/corpConfigJson'

export const RPSection: FC<
  {
    tableKey: TCorpDetailNodeKey | undefined
    tableData?: any
    tableConfigsStore: FlattenedReportConfig['tableConfigsStore']
  } & SectionHeadingOptions
> = ({ tableKey, tableData, tableConfigsStore, ...options }) => {
  const t = useIntl()
  let tableDataFirst = tableData?.[0]
  if (!tableDataFirst) {
    tableDataFirst = tableData
  }
  const comment = tableKey
    ? getReportNodePrefixComment(
        tableKey,
        tableDataFirst || {},
        tableConfigsStore[tableKey],
        getTForRPPreview(t),
        isEn()
      )
    : undefined
  return (
    <SectionHeading
      {...options}
      Suffix={comment ? ({ className }) => <TableComment content={comment} className={className} /> : undefined}
    />
  )
}
