import { Input } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import { useMemo, useState } from 'react'
import intl from '../../utils/intl'
const Search = Input.Search
const FilterTable = (props) => {
  let { columns, dataSource, filterFn, style, ...rest } = props
  const [value, setValue] = useState('')

  filterFn = filterFn || ((i) => i.name?.indexOf(value) > -1)

  return (
    <>
      <Search
        style={{
          width: '280px',
          marginBottom: '12px',
        }}
        placeholder={intl('437655', '请输入筛选名称')}
        onSearch={(value) => {
          setValue(value)
        }}
      ></Search>
      <Table
        columns={columns}
        dataSource={dataSource?.filter(filterFn)}
        pagination={false}
        style={style}
        {...rest}
      ></Table>
    </>
  )
}

export default FilterTable
