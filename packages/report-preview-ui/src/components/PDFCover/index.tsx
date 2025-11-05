import { isEn } from 'gel-util/intl'
import React from 'react'
import { getRPCoverComment, getTodayIntl } from 'report-util/constants'
import styles from './index.module.less'
import { PDFCoverOptions } from './type'

export const getPdfCoverOptionsDefault = (): PDFCoverOptions => {
  return {
    companyName: '',
    reportTitle: '',
    reportDate: getTodayIntl(isEn()),
    showDisclaimers: true,
  }
}

export const PDFCover: React.FC<PDFCoverOptions> = (optionsProp) => {
  const options = {
    ...getPdfCoverOptionsDefault(),
    ...optionsProp,
  }

  return (
    <div className={styles.pdfCover}>
      <h1 className={styles.companyName}>{options.companyName || ''}</h1>
      <h1 className={styles.reportTitle}>{options.reportTitle}</h1>
      <h3 className={styles.reportDate}>{options.reportDate || getTodayIntl(isEn())}</h3>
      {options.showDisclaimers && (
        <div>
          <p className={styles.disclaimer}>{getRPCoverComment(isEn())}</p>
        </div>
      )}
    </div>
  )
}
