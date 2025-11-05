// 特殊统计配置
export interface SpecialStatisticsConfig {
  id: string
  name: string
  components: SpecialComponent[]
}

export interface SpecialComponent {
  type: 'property' | 'bed' | 'custom'
  title: string
  titleIntl: string
  queryType: string // 对应 rankListAggSelectV2 的 queryType 参数
  chartType: 'pie' | 'bar'
  columns: ColumnConfig[]
}

export interface ColumnConfig {
  title: string
  titleIntl: string
  dataIndex: string
  align?: 'left' | 'right' | 'center'
  render?: 'percent' | 'money' | 'custom'
}

// 特殊统计配置ID枚举
export enum SpecialStatisticsConfigId {
  ELDERLY_CARE = '2010100777',
}

// 养老机构配置
export const ELDERLY_CARE_CONFIG: SpecialStatisticsConfig = {
  id: SpecialStatisticsConfigId.ELDERLY_CARE,
  name: '养老机构统计',
  components: [
    {
      type: 'property',
      title: '养老机构性质',
      titleIntl: '451774',
      queryType: 'institutionType',
      chartType: 'pie',
      columns: [
        { title: '养老机构性质', titleIntl: '451774', dataIndex: 'key' },
        { title: '企业数量', titleIntl: '208504', dataIndex: 'doc_count', align: 'right', render: 'money' },
        { title: '占比', titleIntl: '105862', dataIndex: 'doc_count', align: 'right', render: 'percent' },
      ],
    },
    {
      type: 'bed',
      title: '床位数量分布',
      titleIntl: '451794',
      queryType: 'bedNumber',
      chartType: 'bar',
      columns: [
        { title: '床位数量（张）', titleIntl: '451954', dataIndex: 'key' },
        { title: '企业数量', titleIntl: '208504', dataIndex: 'doc_count', align: 'right', render: 'money' },
        { title: '占比', titleIntl: '105862', dataIndex: 'doc_count', align: 'right', render: 'percent' },
      ],
    },
  ],
}

// 其他特殊统计配置可以在这里添加
export const SPECIAL_STATISTICS_CONFIGS = [ELDERLY_CARE_CONFIG]

// 根据ID获取配置的辅助函数
export const getSpecialStatisticsConfigById = (id: string): SpecialStatisticsConfig | undefined => {
  return SPECIAL_STATISTICS_CONFIGS.find((config) => config.id === id)
}
