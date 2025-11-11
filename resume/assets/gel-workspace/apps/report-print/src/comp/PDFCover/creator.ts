import { rpPrintStore } from '@/store'
import { isEnForRPPrint } from '@/utils/lang'
import { getTodayIntl } from 'report-util/constants'
import styles from './index.module.less'
import { PDFCoverOptions } from './type'

export const getPdfCoverOptionsDefault = (): PDFCoverOptions => {
  return {
    companyName: '',
    reportTitle: '',
  }
}

// Pure function to create cover content as a jQuery object
export function pdfCoverCreator(optionsProp: PDFCoverOptions): JQuery {
  const options = {
    ...getPdfCoverOptionsDefault(),
    ...optionsProp,
  }
  const $contentWrapper = $('<div>').addClass(styles['pdf-cover']) // Use a wrapper to build the content

  const $companyName = $('<h1>')
    .addClass(styles['company-name'])
    .text(options.companyName || '')
  $contentWrapper.append($companyName)

  const $reportTitle = $('<h1>').addClass(styles['report-title']).text(options.reportTitle)
  $contentWrapper.append($reportTitle)

  const $reportDate = $('<h3>').addClass(styles['report-date']).text(getTodayIntl(isEnForRPPrint())) // Default if not provided
  $contentWrapper.append($reportDate)

  const funcGetCoverComment = rpPrintStore.getData().getRpCoverComment
  const disclaimerText = funcGetCoverComment({
    isEn: isEnForRPPrint(),
  })
  disclaimerText.forEach((text) => {
    const $disclaimer = $('<div>').addClass(styles['disclaimer']).text(text)
    $contentWrapper.append($disclaimer)
  })
  return $contentWrapper
}
