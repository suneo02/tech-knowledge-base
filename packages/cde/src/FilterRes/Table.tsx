import { useCDEMeasuresCtx } from '@/ctx'
import { CDEFilterResItem } from 'gel-api'
import { getColumnConfig } from './columnConfig'
import Table, { TableProps } from '@wind/wind-ui-table'

export type CDEFilterResTableProps = TableProps<CDEFilterResItem>

export const CDEFilterResTable: React.FC<CDEFilterResTableProps> = (props) => {
  const { measuresForDisplay } = useCDEMeasuresCtx()
  const columns = measuresForDisplay.map((item) => getColumnConfig(item))
  return <Table size="small" rowKey="corp_id" columns={columns} pagination={false} {...props} />
}
