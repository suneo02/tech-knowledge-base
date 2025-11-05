import { FilterConfigItem } from '../types'

export const comprehensiveMockConfig: FilterConfigItem[] = [
  // 1. 测试基础组件：Select (单选)
  {
    itemId: 'singleSelect',
    itemName: '基础下拉（单选）',
    itemType: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '活跃', value: 'active' },
      { label: '不活跃', value: 'inactive' },
    ],
    initialValue: 'active',
  },
  // 2. 测试基础组件：Select (多选)
  {
    itemId: 'multiSelect',
    itemName: '基础下拉（多选）',
    itemType: 'select',
    placeholder: '可选择多个标签',
    options: [
      { label: '标签A', value: 'A' },
      { label: '标签B', value: 'B' },
      { label: '标签C', value: 'C' },
    ],
    mode: 'multiple',
  },
  // 3. 测试基础组件：TagsInput
  {
    itemId: 'tags',
    itemName: '基础标签输入',
    itemType: 'tagsInput',
    placeholder: '输入后按回车创建标签',
  },
  // 4. 测试白名单组合组件：logicalKeywordFilter
  {
    itemId: 'logicalKeyword',
    itemName: '白名单组合：逻辑关键词',
    tooltip: '这个组件由 compositionMap 定义',
    itemType: 'logicalKeywordFilter',
  },
  // 5. 测试直接定义的组合组件，并混合使用 span 和 width
  {
    itemId: 'mixedLayout',
    itemName: '直接定义组合：混合布局',
    tooltip: '混合使用 span 和 width，会自动换行',
    itemType: 'composite',
    composition: [
      {
        componentKey: 'type',
        itemType: 'select',
        span: 8,
        options: [
          { label: '按金额', value: 'amount' },
          { label: '按时间', value: 'date' },
        ],
      },
      {
        componentKey: 'operator',
        itemType: 'select',
        width: '120px', // 固定宽度
        options: [
          { label: '大于等于', value: 'gte' },
          { label: '小于等于', value: 'lte' },
        ],
      },
      {
        componentKey: 'value',
        itemType: 'tagsInput',
        span: 12, // 这个会和上面两个在同一行
      },
      {
        componentKey: 'fullRow',
        itemType: 'select',
        span: 24, // 这个会强制换到新的一行
        props: { placeholder: '我占据一整行' },
        options: [{ label: '整行选项', value: 'full' }],
      },
    ],
  },
  {
    itemId: 'noValue',
    itemName: '测试没有value的组件',
    itemType: 'composite',
    composition: [
      {
        componentKey: 'type',
        itemType: 'select',
        span: 8,
        options: [
          { label: '按金额', value: 'amount' },
          { label: '按时间', value: 'date' },
        ],
      },
      {
        componentKey: 'operator',
        itemType: 'select',
        width: '120px', // 固定宽度
        options: [
          { label: '大于等于', value: 'gte' },
          { label: '小于等于', value: 'lte' },
        ],
      },
      {
        componentKey: 'fullRow',
        itemType: 'select',
        span: 24, // 这个会强制换到新的一行
        props: { placeholder: '我占据一整行' },
        options: [{ label: '整行选项', value: 'full' }],
      },
    ],
  },
]

export const comprehensiveInitialValues = {
  // singleSelect: {
  //   value: 'active',
  // },
  // multiSelect: {
  //   value: ['A', 'C'],
  // },
  // tags: {
  //   value: ['初始标签1', '初始标签2'],
  // },
  logicalKeyword: {
    logic: 'notAny',
    value: ['小米', '华为'],
  },
  mixedLayout: {
    type: 'amount',
    operator: 'gte',
    value: ['10000'],
    fullRow: 'full',
  },
}
