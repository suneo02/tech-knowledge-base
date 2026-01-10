export { translateDataWithApi } from './apiAdapter'
export type { TranslateServiceOptions } from './apiAdapter'
export {
  deriveCorpNameInputFromRecord,
  EnterpriseNameInput,
  formatEnterpriseNameMainFromRecordWithAI,
  formatEnterpriseNameMainWithAI,
  getCorpNameOriginalByBaseAndCardInfo,
  getCorpNameTransByCardInfo,
  NameDisplayBaseOptions,
  NameDisplayResult,
} from './companyName'
export { DEFAULT_DISPLAY_MODE } from './displayModes'
export type { DisplayMode } from './displayModes'
export { detectChinese, detectEnglish, getDetectorByLocale, hasTranslatableContent } from './languageDetector'
export type { TextDetector } from './languageDetector'
export type { TranslateResult } from './types'
