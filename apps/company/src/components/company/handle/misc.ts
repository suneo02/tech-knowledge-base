import intl from '@/utils/intl'

export function getLegalPersonField(corpType: string): string {
  if (corpType !== '有限合伙企业' && corpType !== '普通合伙企业' && corpType !== '特殊普通合伙企业') {
    return intl('451206', '法定代表人')
  }
  if (window.en_access_config) {
    return 'Managing Partner'
  } else {
    return intl(0, '执行事务合伙人')
  }
}
