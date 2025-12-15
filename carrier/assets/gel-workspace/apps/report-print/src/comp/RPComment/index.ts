import { t } from '@/utils/lang'
import styles from './index.module.less'

export const createRPComment = (content: string[]): JQuery => {
  const $element = $('<div>')
  $element.addClass(styles['report-comment'])
  $element.append(
    $('<div>')
      .addClass('report-comment-title')
      .append($('<span>').text(`${t('451118', '报告说明')}`))
  )
  $element.append(
    $('<div>')
      .addClass('report-comment-content')
      .append(
        content.map((item) => {
          return $('<div>').addClass('report-comment-line').text(item)
        })
      )
  )
  return $element
}
