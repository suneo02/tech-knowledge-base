import intl from 'src/utils/intl'

const createDatebidSearch = [
  {
    time: '不限',
    timeId: '138649',
    type: '',
  },
  {
    time: '3天内',
    timeId: '228617',
    type: '~3',
  },
  {
    time: '7天内',
    timeId: '228618',
    type: '~7',
  },
  {
    time: '30天内',
    timeId: '228620',
    type: '~30',
  },
]
const outCompanySort = [
  {
    sort: '默认排序',
    sortid: '138255',
    key: '-1',
  },
  {
    sort: '按成立日期倒序',
    sortid: '138304',
    key: '1',
  },
  {
    sort: '按成立日期正序',
    sortid: '138305',
    key: '2',
  },
]
const outCompanySort2 = [
  {
    sort: '默认排序',
    sortid: '138255',
    key: '-1',
  },
  {
    sort: '按成立日期倒序',
    sortid: '138304',
    key: '1',
  },
  {
    sort: '按成立日期正序',
    sortid: '138305',
    key: '2',
  },
  {
    sort: '按注册资本倒序',
    sortid: '138474',
    key: '3',
  },
  {
    sort: '按注册资本正序',
    sortid: '138475',
    key: '4',
  },
]
// 用于全球企业的国家选择
const outCompanyParam = [
  {
    type: '不限',
    typeid: '138649',
    param: '',
  },
  {
    type: '美国',
    typeid: '76',
    param: 'usa',
    code: '180401',
  },
  {
    type: '加拿大',
    typeid: '79',
    param: 'can',
    code: '180402',
  },
  {
    type: '新加坡',
    typeid: '68',
    param: 'sgp',
    code: '180101',
  },
  {
    type: '日本',
    typeid: '77',
    param: 'jpn',
    code: '180102',
  },
  {
    type: '韩国',
    typeid: '144',
    param: 'kor',
    code: '180114',
  },
  {
    type: '德国',
    typeid: '71063',
    param: 'deu',
    code: '180202',
  },
  {
    type: '法国',
    typeid: '71068',
    param: 'fra',
    code: '180203',
  },
  {
    type: '意大利',
    typeid: '71200',
    param: 'ita',
    code: '180204',
  },
  {
    type: '英国',
    typeid: '78',
    param: 'eng',
    code: '180201',
  },
  {
    type: '泰国',
    typeid: '211694',
    param: 'tha',
    code: '180120',
  },
  {
    type: '越南',
    typeid: '53975',
    param: 'vie',
    code: '180104',
  },
  {
    type: '新西兰',
    typeid: '211660',
    param: 'nzl',
    code: '180602',
  },
  {
    type: '卢森堡',
    typeid: '224575',
    param: 'lux',
    code: '180205',
  },
  {
    type: '印度',
    typeid: '226992',
    param: 'ind',
    code: '180111',
  },
  {
    type: '俄罗斯',
    typeid: '226990',
    param: 'rus',
    code: '180235',
  },
  {
    type: '马来西亚',
    typeid: '298293',
    param: 'mas',
    code: '180117',
  },
  {
    type: '其他',
    typeid: '23435',
    param: 'oth',
    code: '180',
  },
]
const jobResultOption = [
  {
    sort: intl('138255', '默认排序'),
    key: '',
  },
  {
    sort: intl('348975', '按最新岗位日期降序'),
    key: 'publishDate_desc',
  },
  {
    sort: intl('348993', '按最新岗位日期升序'),
    key: 'publishDate_asc',
  },
]
const bidResultOption = [
  {
    sort: intl('138255', '默认排序'),
    key: '',
    // sortid: "138255"
  },
  {
    sort: window.en_access_config ? intl('437301', '按日期降序') : intl('', '按公告日期降序'),
    key: 'sort_date_desc',
    // sortid: "138255"
  },
  {
    sort: window.en_access_config ? intl('437302', '按日期升序') : intl('', '按公告日期正序'),
    key: 'sort_date_asc',
    // sortid: "138255"
  },
  {
    sort: intl('313034', '按招标金额倒序'),
    key: 'project_budget_money_desc',
    // sortid: "138255"
  },
  {
    sort: intl('313035', '按招标金额正序'),
    key: 'project_budget_money_asc',
    // sortid: "138255"
  },
]

export { bidResultOption, createDatebidSearch, jobResultOption, outCompanyParam, outCompanySort, outCompanySort2 }
