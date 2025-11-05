import { Empty } from 'antd'
import { ComponentTypeEnum, ComponentTypeNumEnum } from '../../../../../types/emun'
import { CommonProps } from '../../../../container/type'
import WindTable, { WindTableProps } from '../../../Table'
import WindDescriptions from '../../../Descriptions'
import React from 'react'
// import Table from '@wind/wind-ui'

const getComponentsByIds = () => {
  return 'getComponentsByIds'
}

/**
 * todo 这里类型应该是多个组件的类型 待完善
 */
const ComponentSwitcher = (props: WindTableProps & CommonProps & any) => {
  const { response, params, updateParams, filter, updateFilter, type, ...tableProps } = props
  switch (type as any) {
    case ComponentTypeNumEnum.TABLE:
    case ComponentTypeEnum.TABLE:
      return (
        <WindTable
          columns={props?.columns}
          dataSource={response?.Data?.list || (response?.Data as unknown as [])}
          filter={filter}
          updateFilter={updateFilter}
          pagination={{
            total: response?.Page?.Records,
            current: params?.pageNo + 1,
            pageSize: params?.pageSize,
            showSizeChanger: false,
          }}
          onChange={updateParams}
          {...tableProps}
          bordered
        ></WindTable>
        // <Table columns={props?.columns} dataSource={response?.Data?.list || (response?.Data as unknown as [])} />
      )
    case ComponentTypeNumEnum.DESCRIPTIONS:
    case ComponentTypeEnum.DESCRIPTIONS:
      return <WindDescriptions {...tableProps} dataSource={response?.Data} columns={props.columns} />
    // return 'DESCRIPTIONS'
    case ComponentTypeNumEnum.INTEGRATION:
    case ComponentTypeEnum.INTEGRATION:
      return <div>{getComponentsByIds()}</div>
    case ComponentTypeNumEnum.CHAINS:
    case ComponentTypeEnum.CHAINS:
      return <Empty description="图谱还需开发对应组件" />
    default:
      return null
  }
}
export default ComponentSwitcher
