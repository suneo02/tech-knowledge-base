import { getDefaultImage } from 'report-util/misc'
import styles from './index.module.less'
/**
 * Create image element
 * @param url
 * @param css
 * @param defaultWidth
 * @param imgType
 */
export const createCompanyTableLogo = (url, css?, defaultWidth?, imgType?) => {
  const defaultImg = getDefaultImage(imgType)

  const $element = $('<img/>')
    .attr('src', url)
    .attr('width', defaultWidth ? defaultWidth : 'auto')
    .addClass(styles['company-table-logo'])
    .on('error', (e) => {
      // @ts-expect-error
      e.target.src = defaultImg
    })

  if (css) {
    $element.addClass(css)
  }

  return $element
}
