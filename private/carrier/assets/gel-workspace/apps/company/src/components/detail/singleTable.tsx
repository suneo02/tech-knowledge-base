import React from 'react'
import Table from '@wind/wind-ui-table'
import useDetailHooks from './useDetailHooks'
import { isArray } from 'lodash'

const { HorizontalTable } = Table

/**
 *
 * @param props
 * @param props.hideTableConstruct 是否在无数据时隐藏表头结构 默认false
 * @returns {React.JSX.Element|false}
 * @constructor
 */
function Tables(props) {
  const { title = '', columns = [], horizontal = false, key, isLoading, className, hideTableConstruct } = props
  const { dataSource, loading, pagination, onChangePage } = useDetailHooks(props)

  return horizontal ? (
    <HorizontalTable
      className={className}
      key={key}
      title={title}
      loading={loading || isLoading}
      dataSource={dataSource}
      style={{
        marginBottom: 10,
      }}
      rows={columns}
      bordered={'dotted'}
      size={'default'}
      data-uc-id="919m3h8gGLO"
      data-uc-ct="horizontaltable"
      data-uc-x={key}
    />
  ) : (
    // 如果有数据展示表格 如果要展示表结构 展示表格
    ((isArray(dataSource) && dataSource.length > 0) || !hideTableConstruct) && (
      <Table
        className={className}
        key={key}
        title={title}
        loading={loading || isLoading}
        dataSource={isArray(dataSource) ? dataSource : []}
        style={{
          marginBottom: 10,
        }}
        columns={columns}
        pagination={pagination}
        bordered={'dotted'}
        size={'default'}
        onChange={onChangePage}
        data-uc-id="g-67YKYbBd6"
        data-uc-ct="table"
        data-uc-x={key}
      />
    )
  )
}

export default React.memo(Tables)
