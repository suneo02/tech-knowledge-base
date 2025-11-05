import intl from '@/utils/intl'

const softwareCollationOption = [
  {
    sort: '默认排序',
    sortid: '138255',
    key: '',
  },
  {
    sort: window.en_access_config ? intl('437302', '按日期升序') : '按登记批准日期升序',
    sortid: '',
    key: 'sort_date_asc',
  },
  {
    sort: window.en_access_config ? intl('437301', '按日期降序') : '按登记批准日期降序',
    sortid: '',
    key: 'sort_date_desc',
  },
]
export { softwareCollationOption }
