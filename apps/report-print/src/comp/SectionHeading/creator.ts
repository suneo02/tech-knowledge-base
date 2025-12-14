/**
 * creator.ts
 * Pure function for creating SectionHeading jQuery elements.
 */
import { isEnForRPPrint } from '@/utils/lang'
import {
  getHeadingTagBySectionHeadingLevel,
  getSectionNumberText,
  SectionHeadingOptions,
} from 'report-util/corpConfigJson'
import styles from './index.module.less'

export const sectionHeadingElementCreator = (
  options: SectionHeadingOptions & {
    suffix?: string | JQuery
  } // Should receive options from the class, already merged with defaults
): JQuery => {
  const { headingLevel, hideNumber, numbers, title, className, suffix } = options

  const headingTag = getHeadingTagBySectionHeadingLevel(headingLevel)
  const $heading = $(`<${headingTag}></${headingTag}>`).addClass(styles.sectionHeading)

  if (!hideNumber && numbers && numbers.length > 0) {
    const numberText = getSectionNumberText(
      {
        numbers,
        hideNumber,
        headingLevel,
      },
      isEnForRPPrint()
    )
    const $number = $('<span></span>').addClass(styles.sectionNumber).text(numberText)
    $heading.append($number)
  }

  const $title = $('<span></span>').addClass(styles.sectionTitle).text(title)
  $heading.append($title)

  // Apply className to the heading element itself if not in container mode
  // (in container mode, className is applied to the $container by the class)
  if (className) {
    $heading.addClass(className)
  }

  if (suffix) {
    const $suffix = typeof suffix === 'string' ? $(suffix) : suffix
    $suffix.addClass(styles.sectionSuffix)
    $heading.append($suffix)
  }

  return $heading
}
