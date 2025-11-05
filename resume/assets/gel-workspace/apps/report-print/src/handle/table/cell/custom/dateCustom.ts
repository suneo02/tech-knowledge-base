import { DEFAULT_EMPTY_TEXT } from '@/handle/table/cell/shared'
import { t } from '@/utils/lang'
import { formatTime } from 'report-util/format'

/**
 * 日期期限，同时在一个字段中 用 - 分割
 */
export const renderDateRangeInOneFieldCustom = (txt) => {
  if (txt) {
    const start = txt.split('-')[0] ? formatTime(txt.split('-')[0]) : DEFAULT_EMPTY_TEXT
    const end = txt.split('-')[1] ? formatTime(txt.split('-')[1]) : DEFAULT_EMPTY_TEXT
    return start + t('271245', ' 至 ') + end
  } else {
    return DEFAULT_EMPTY_TEXT
  }
}
