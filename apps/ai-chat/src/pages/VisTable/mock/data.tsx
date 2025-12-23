import { ColumnType } from 'antd/es/table'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
  status: 'success' | 'processing' | 'error' | 'default' | 'warning'
  amount: number
  updateTime: string
  progress: number
}

// Table列定义
export const columns: ColumnType<DataType>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (text) => text,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 200,
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    width: 200,
    render: (tags: string[]) => (
      <Space>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              backgroundColor: tag === '前端' ? '#108ee9' : '#87d068',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {tag}
          </span>
        ))}
      </Space>
    ),
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 200,
    filters: [
      { text: '成功', value: 'success' },
      { text: '处理中', value: 'processing' },
      { text: '错误', value: 'error' },
      { text: '默认', value: 'default' },
      { text: '警告', value: 'warning' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 200,
    render: (amount) => `¥${amount.toFixed(2)}`,
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    sorter: (a, b) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 200,
    render: (progress) => `${progress}%`,
    sorter: (a, b) => a.progress - b.progress,
  },
]

// 生成模拟数据
const generateRandomDate = () => {
  const start = new Date(2023, 0, 1)
  const end = new Date()
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().split('T')[0]
}

const statuses: DataType['status'][] = ['success', 'processing', 'error', 'default', 'warning']
const tagList = ['开发', '设计', '测试', '产品', '运营', '市场', '拒绝', '通过']

// 表格数据源
export const dataSource: DataType[] = Array.from({ length: 30 }, (_, index) => {
  const randomTags = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => tagList[Math.floor(Math.random() * tagList.length)]
  )

  // 去重
  const uniqueTags = [...new Set(randomTags)]

  return {
    key: `${index + 1}`,
    name: `用户${index + 1}`,
    age: Math.floor(Math.random() * 40) + 18,
    address: `北京市朝阳区第${Math.floor(Math.random() * 100) + 1}号`,
    tags: uniqueTags,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: Math.random() * 10000,
    updateTime: generateRandomDate(),
    progress: Math.floor(Math.random() * 100),
  }
})
