import intl from '@/utils/intl'

// 产品介绍页面，游客访问
export const releaseDate = [
  {
    value: '',
    name: intl('138649', '不限'),
  },
  {
    value: '~3',
    name: intl('313036', '近3天'),
  },
  {
    value: '~7',
    name: intl('313054', '近7天'),
  },
  {
    value: '~30',
    name: intl('313055', '近1月'),
  },
]

export const expReq = [
  {
    value: '[0,1]',
    label: intl('563', '1年以内'),
  },
  {
    value: '[1,3]',
    label: intl('138841', '1-3年'),
  },
  {
    value: '[3,5]',
    label: intl('138638', '3-5年'),
  },
  {
    value: '[5,10]',
    label: intl('138641', '5-10年'),
  },
  {
    value: '[10,]',
    label: intl('138842', '10年以上'),
  },
]

export const eduReq = [
  {
    value: '520',
    label: intl('48614', '小学'),
  },
  {
    value: '521',
    label: intl('49535', '初中'),
  },
  {
    value: '523',
    label: intl('214206', '中专'),
  },
  {
    value: '522',
    label: intl('214205', '高中'),
  },
  {
    value: '518',
    label: intl('50567', '中等教育'),
  },
  {
    value: '19439981826',
    label: intl('214207', '大专'),
  },
  {
    value: '529',
    label: intl('152751', '本科'),
  },
  {
    value: '530',
    label: intl('349193', '硕士研究生'),
  },
  {
    value: '142373728',
    label: 'MBA',
  },
  {
    value: '531',
    label: intl('349194', '博士研究生'),
  },
  {
    value: '142373971',
    label: intl('23435', '其他'),
  },
]
