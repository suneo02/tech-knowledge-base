import { t } from '@/utils/lang'
import styles from './index.module.less'

export const createRPAppendix = (content: string[]) => {
  const $title = $('<div>').addClass(styles['report-appendix-title']).text(t('451098', '附录'))

  const $contentArray = content.map((item) => {
    return $('<div>').addClass(styles['report-appendix-line']).text(item)
  })

  return [$title, ...$contentArray]
}
