import { rawHtmlToJQuery } from '@/utils/html/RawHtml'
// Re-use the same CSS module that BasicTable relies on so the visual style is consistent.
import styles from '../Basic/index.module.less'

/**
 * Create a clean jQuery table element from a raw HTML string.
 *
 * 1. Sanitises the incoming HTML via `rawHtmlToJQuery`.
 * 2. Removes ALL inline `style` attributes from the table and its descendants.
 * 3. Adds the default table classes used by `TableElementCreator` so the
 *    resulting table is styled consistently (`styles.table` & `styles.bordered`).
 *
 * @param html   A string that contains **one** table element.
 *                  If multiple tables exist, the first one will be used.
 * @returns         A jQuery object wrapping the processed table element.
 */
export const createHtmlTableElement = (html: string | JQuery): JQuery => {
  let $table: JQuery

  // Case-1: Caller passes raw HTML string
  if (typeof html === 'string') {
    // 1) Sanitise HTML – keep id, strip scripts, etc.
    const sanitizedHtml = rawHtmlToJQuery(html)

    // 2) Parse & locate the first <table>
    const $container = $('<div></div>').html(sanitizedHtml)
    $table = $container.find('table').first()
  } else {
    // Case-2: Caller passes a jQuery element (expected to be <table>)
    // Clone to avoid mutating the original DOM tree.
    const $candidate = html.first()
    if ($candidate.prop('tagName')?.toUpperCase() === 'TABLE') {
      $table = $candidate.clone(true, true)
    } else {
      // Not a table? Search within element
      $table = $candidate.find('table').first().clone(true, true)
    }
  }

  // Fallback – if we still didn't get a table element, create an empty one.
  if (!$table || !$table.length) {
    $table = $('<table></table>')
  }

  // Remove all inline styles from the table & its descendants.
  $table.add($table.find('[style]')).removeAttr('style')

  // Apply unified styling classes.
  $table.addClass(styles.table).addClass(styles.bordered)

  return $table
}
