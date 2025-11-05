import Table from '@wind/wind-ui-table'
import React, { useCallback, useEffect, useReducer } from 'react'
import { useHandleLinksTablePagination, useLinksTableColumns } from './handle'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EXTERNAL_PROPS':
      return { ...state, [action.payload.key]: action.payload.value }
    case 'SET_INTERNAL_PROPS':
      return { ...state, [action.payload.key]: action.payload.value }
    default:
      return state
  }
}

/**
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @param {Boolean} props.useTooltips 是否使用文字提示
 * @param {Boolean} props.useLinks 是否可点击跳转
 * @param {Object} props.pagination 分页参数
 * @param {boolean} props.useLinks 是否展示链接
 * @returns React.FC
 * @example
 */
export const LinksTable = (props) => {
  const [propsLocal, dispatch] = useReducer(reducer, props)

  const handlePropsChange = useCallback(
    (key, value) =>
      dispatch({
        type: 'SET_INTERNAL_PROPS',
        payload: { key, value },
      }),
    [dispatch]
  )

  const { handlePagination } = useHandleLinksTablePagination()
  const columns = useLinksTableColumns(props.useLinks, props.columns)

  useEffect(() => {
    Object.keys(props).forEach((key) => {
      dispatch({ type: 'SET_EXTERNAL_PROPS', payload: { key, value: props[key] } })
    })
  }, [props, dispatch])

  return (
    <Table
      columns={columns || []}
      dataSource={propsLocal.dataSource || []}
      rowKey="key"
      pagination={handlePagination(propsLocal.pagination)}
      onChange={(p, f, s) => {
        handlePropsChange('pagination', {
          current: p.currentPage,
          pageSize: p.pageSize,
          total: p.total,
        })
      }}
    />
  )
}
