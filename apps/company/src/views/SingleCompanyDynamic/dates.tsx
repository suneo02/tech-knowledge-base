import intl from '@/utils/intl'

const now = new Date()
let CurrentDate = Number(now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2))

export const dates = [
  {
    name: intl('138649', '不限'),
    langkey: '',
    endDate: '',
    // dateRange:''
  },
  {
    name: intl('8886', '今日'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 1,
  },
  {
    name: intl('19332', '昨日'),
    langkey: '',
    endDate: CurrentDate - 1,
    dateRange: 1,
  },
  {
    name: intl('437307', '近一周'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 7,
  },

  {
    name: intl('437325', '近一月'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 30,
  },
  {
    name: intl('9073', '近三月'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 90,
  },
  {
    name: intl('237722', '近半年'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 183,
  },
  {
    name: intl('73399', '近一年'),
    langkey: '',
    endDate: CurrentDate,
    dateRange: 365,
  },
]
