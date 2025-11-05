import { RoleTypeSuper } from './type'
import Table from '@wind/wind-ui-table'

export const SmartTableRole: RoleTypeSuper = {
  placement: 'end',
  style: {
    marginBlock: 24,
  },
  messageRender: (content) => {
    // 超级名单的引用资料不展示 table 数据
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
    ]
    const dataSource = [
      {
        name: '张三',
        description: '男',
      },
      {
        name: '李四',
        description: '女',
      },
    ]
    console.log(content)
    return (
      <div>
        <Table title="智能表格" dataSource={dataSource} columns={columns} />
      </div>
    )
  },
}
