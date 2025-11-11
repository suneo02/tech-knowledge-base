import { getLocale } from '@/utils/intl'
import { getAgreementLink } from '@/utils/link'

export function getAgreementComponent() {
  return `<iframe src="${getAgreementLink(getLocale() === 'en-US' ? 'EN' : 'CN')}" style="width: 100%; height: 100%; border: none;" />`
}
