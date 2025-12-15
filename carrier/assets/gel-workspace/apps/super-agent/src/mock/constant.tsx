import { ColumnDataTypeEnum } from 'gel-api'
import mockMd from '@/mock/mock.md?raw'
export const MOCK_CONTENT =
  '例：动力电池组件及电池管理系统，应用于新能源汽车储能领域\n人形双足机器人，具备行走、搬运、人机交互能力，可用于工厂自动化和家庭服务\n特斯拉Optimus人形机器人，波士顿动力Atlas机器人\n例：动力电池组件及电池管理系统，应用于新能源汽车储能领域\n人形双足机器人，具备行走、搬运、人机交互能力，可用于工厂自动化和家庭服务\n特斯拉Optimus人形机器人，波士顿动力Atlas机器人\n例：动力电池组件及电池管理系统，应用于新能源汽车储能领域\n人形双足机器人，具备行走、搬运、人机交互能力，可用于工厂自动化和家庭服务\n特斯拉Optimus人形机器人，波士顿动力Atlas机器人'

export const MOCK_DATA = [
  // 基础示例保留一条，随后使用程序化方式扩充到 100 条
]

const descriptionTemplates = [
  `这是 \${name} 的业务描述，覆盖新能源汽车、储能及新能源发电等领域,\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚`,
  `这是 \${name} 的das dasd asd asd asd ，覆盖储能系统、智能电网与动力电池等领域,\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚`,
  `这是 \${name} ioua sbdiuy ais jd nasjdkb asdtuia sdhqwu gaufdg ashjdgjask djkas ,\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚`,
  `这是 \${name} 的业务描述，覆盖储能设备制造、新能源出行服务与光伏储能等领域,\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚`,
  `这是 \${name} 的业务描述，覆盖新能源汽车供应链、储能技术研发及智能能源管理等领域,\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚\n你还是没有我清楚`,
]

// 生成 100 条更丰富的模拟数据
for (let i = 0; i < 100; i++) {
  const id = i + 1
  const name = `示例企业 ${id}`
  ;(MOCK_DATA as unknown as Array<Record<string, unknown>>).push({
    id,
    name,
    description: descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)].replace(
      /\${name}/g,
      name
    ),
    legalPerson: `张${String.fromCharCode(65 + (i % 26))}`,
    regCapital: `${(i % 90) + 10}00万人民币`,
    address: `中国·某市高新区 ${id} 号`,
    phone: `138${String(10000000 + i).slice(0, 8)}`,
    email: `contact${id}@example.com`,
    website: `https://example.com/${id}`,
    // Markdown 示例字段
    introMd: mockMd,
    moreMd: mockMd,
    score: Math.floor(Math.random() * 100),
    // 数值型字段（用于专业看板展示）
    revenue: (100 + Math.random() * 9900).toFixed(2), // 营收（单位：万元）
    employees: Math.floor(20 + Math.random() * 5000), // 员工数
    growthRate: parseFloat((Math.random() * 50).toFixed(2)), // 增长率（%）
    profitMargin: parseFloat((5 + Math.random() * 35).toFixed(2)), // 利润率（%）
    marketShare: parseFloat((Math.random() * 30).toFixed(2)), // 市占率（%）
    activeUsers: Math.floor(500 + Math.random() * 100000), // 活跃用户数
    churnRate: parseFloat((Math.random() * 20).toFixed(2)), // 流失率（%）
    conversionRate: parseFloat((Math.random() * 10).toFixed(2)), // 转化率（%）
    miningTime: `2025-09-${String((i % 30) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  })
}

export const MOCK_COLUMNS = [
  {
    title: '企业名称',
    dataIndex: 'name',
    type: 'company',
    fixed: true,
    width: 280,
  },
  {
    title: '简介（MD 展示）',
    dataIndex: 'introMd',
    type: 'md',
    width: 260,
  },
  {
    title: '法定代表人',
    dataIndex: 'legalPerson',
    width: 120,
  },
  {
    title: '注册资本',
    dataIndex: 'regCapital',
    width: 120,
  },
  {
    title: '办公地址',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '网站',
    dataIndex: 'website',
    width: 120,
  },
  {
    title: '营销分数',
    dataIndex: 'score',
    type: ColumnDataTypeEnum.FLOAT,
    width: 120,
  },
  {
    title: '营收(万元)',
    dataIndex: 'revenue',
    type: ColumnDataTypeEnum.FLOAT,
    width: 120,
  },
  {
    title: '员工数',
    dataIndex: 'employees',
    type: ColumnDataTypeEnum.INTEGER,
    width: 120,
  },
  {
    title: '增长率(%)',
    dataIndex: 'growthRate',
    type: ColumnDataTypeEnum.PERCENT,
    width: 120,
  },
  {
    title: '利润率(%)',
    dataIndex: 'profitMargin',
    type: ColumnDataTypeEnum.PERCENT,
    width: 120,
  },
  {
    title: '市占率(%)',
    dataIndex: 'marketShare',
    type: ColumnDataTypeEnum.PERCENT,
    width: 120,
  },
  {
    title: '活跃用户',
    dataIndex: 'activeUsers',
    type: ColumnDataTypeEnum.INTEGER,
    width: 120,
  },
  {
    title: '营销话术',
    dataIndex: 'description',
    type: 'drawer',
    width: 200,
  },
  {
    title: '更多说明（MD）',
    dataIndex: 'moreMd',
    type: 'md',
    width: 200,
  },
  {
    title: '挖掘时间',
    dataIndex: 'miningTime',

    width: 160,
  },
]

export const MOCK_LOG_DATA = [
  {
    id: 1,
    description: '✅ [09:14:55] 初始化挖掘引擎...',
    date: '09:14:55',
  },
  {
    id: 2,
    date: '09:14:55',
    description: '✅ [09:14:55] 连接企业数据库...',
  },
  {
    id: 3,
    date: '09:14:55',
    description: '✅ [09:14:55] 加载筛选规则...',
  },

  {
    id: 4,
    date: '09:14:55',
    description: '🔍 [09:14:55] 正在扫描企业信息...',
  },

  {
    id: 5,
    date: '09:15:01',
    description: '[09:15:01] 🔍 发现匹配企业: 新能源科技有限公司',
  },

  {
    id: 6,
    date: '09:15:02',
    description: '[09:15:02] ✅ 企业信息验证完成',
  },

  {
    id: 7,
    date: '09:15:02',
    description: '[09:15:02] 🔍 继续扫描相关企业...',
  },

  {
    id: 8,
    date: '09:15:05',
    description: '[09:15:05] ✅ 企业信息验证完成',
  },

  {
    id: 9,
    date: '09:15:06',
    description: '[09:15:06] 📍 获取企业联系方式...',
  },
]

export const MOCK_CUSTOM_LIST_DATA = [
  {
    id: 1,
    date: '2025-09-24 17:01',
    title: '1 · 1 · 2025-09-24 17:01',
    newCompany: 40,
    subscribed: true,
    totalCompany: 50,
    createTime: '2025-09-24 17:01',
    status: '1', // 1: 挖掘中, 2: 挖掘完成
  },
  {
    id: 2,
    date: '2025-09-24 17:01',
    title: '2 · 2 · 2025-09-24 17:01',
    newCompany: 40,
    subscribed: true,
    totalCompany: 40,
    createTime: '2025-09-24 17:01',
    status: '2', // 1: 挖掘中, 2: 挖掘完成
  },
  {
    id: 3,
    date: '2025-09-24 17:01',
    title: '3 · 3 · 2025-09-24 17:01',
    newCompany: 40,
    subscribed: true,
    totalCompany: 40,
    createTime: '2025-09-24 17:01',
    status: '2', // 1: 挖掘中, 2: 挖掘完成
  },
]
