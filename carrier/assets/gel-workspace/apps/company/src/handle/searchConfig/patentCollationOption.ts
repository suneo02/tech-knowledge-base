import intl from '@/utils/intl'

const patentCollationOption = [
  {
    sort: '默认排序',
    sortid: '138255',
    key: '',
  },
  {
    sort: window.en_access_config ? intl('437302', '按日期升序') : '按公开公告日升序',
    sortid: '',
    key: 'sort_date_asc',
  },
  {
    sort: window.en_access_config ? intl('437301', '按日期降序') : '按公开公告日降序',
    sortid: '',
    key: 'sort_date_desc',
  },
]
export { patentCollationOption }
