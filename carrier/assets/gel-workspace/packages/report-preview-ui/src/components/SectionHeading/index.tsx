import { isEn } from 'gel-util/intl'
import React, { FC } from 'react'
import {
  getHeadingTagBySectionHeadingLevel,
  getSectionNumberText,
  SectionHeadingOptions,
} from 'report-util/corpConfigJson'
import styles from './index.module.less'

export const SectionHeading: React.FC<
  SectionHeadingOptions & {
    Suffix?: FC<{ className?: string }>
  }
> = ({ numbers, hideNumber, headingLevel, className, Suffix, title }) => {
  const HeadingTag = getHeadingTagBySectionHeadingLevel(headingLevel) as keyof JSX.IntrinsicElements

  const numberText = getSectionNumberText(
    {
      numbers,
      hideNumber,
      headingLevel,
    },
    isEn()
  )
  return (
    <HeadingTag className={[styles.sectionHeading, className].filter(Boolean).join(' ')}>
      {numberText && <span className={styles.sectionNumber}>{numberText}</span>}
      <span className={styles.sectionTitle}>{title}</span>
      {Suffix && <Suffix className={styles.sectionSuffix} />}
    </HeadingTag>
  )
}
