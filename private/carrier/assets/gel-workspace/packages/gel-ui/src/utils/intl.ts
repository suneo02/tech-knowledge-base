import { LanBackend } from 'gel-api'
import { getLocale } from 'gel-util/intl'

export const getLanBackend = (): LanBackend => {
  return getLocale() === 'en-US' ? 'ENS' : 'CHS'
}
