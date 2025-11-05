import { WindDescriptionsProps } from '.'
import useColumns from '../../../utils/hooks/table/useColumns'

export default (props: WindDescriptionsProps) => {
  // const { columns } = useTableColumns({ columns: props.columns as any })
  const { columns } = useColumns(props.columns)

  const items = columns?.map((item) => {
    let value = props.dataSource?.[item.dataIndex as any]
    if (Array.isArray(value) || typeof value === 'object') value = JSON.stringify(value)
    return {
      ...item,
      children: item.render(value, props.dataSource),
      key: item.dataIndex,
      label: item.title,
      labelStyle: item.labelMinWidth
        ? {
            minWidth: item.labelMinWidth,
          }
        : false,
      contentStyle: item.contentMinWidth
        ? {
            minWidth: item.contentMinWidth,
          }
        : false,
    }
  })

  return {
    items,
  }
}
