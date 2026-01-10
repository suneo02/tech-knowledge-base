import { SupportedLocale } from 'gel-util/intl'
import { DisplayMode } from 'gel-util/misc'

type AiTranslateFn = (text: string, targetLocale: SupportedLocale) => Promise<string | null | undefined>

export interface CompanyNameBaseProps {
  record: Record<string, unknown>
  field: string
  mode?: DisplayMode
  aiTranslate?: AiTranslateFn
  className?: string
}
