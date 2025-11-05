import { isEnForRPPrint } from '@/utils/lang'
import { getDisclaimerSecondary, getRPCoverComment, getTodayIntl } from 'report-util/constants'
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
  const disclaimerSecondary = getDisclaimerSecondary(isEnForRPPrint())
  const $contentWrapper = $('<div>').addClass(styles['pdf-cover']) // Use a wrapper to build the content

  const $companyName = $('<h1>')
    .addClass(styles['company-name'])
    .text(options.companyName || '')
  $contentWrapper.append($companyName)

  const $reportTitle = $('<h1>').addClass(styles['report-title']).text(options.reportTitle)
  $contentWrapper.append($reportTitle)

  const $reportDate = $('<h3>').addClass(styles['report-date']).text(getTodayIntl(isEnForRPPrint())) // Default if not provided
  $contentWrapper.append($reportDate)

  const primaryDisclaimerText = getRPCoverComment(isEnForRPPrint())
  const $disclaimer1 = $('<div>').addClass(styles['disclaimer']).text(primaryDisclaimerText)
  const $disclaimer2 = $('<div>').addClass(styles['disclaimer']).text(disclaimerSecondary)
  $contentWrapper.append($disclaimer1).append($disclaimer2)
  return $contentWrapper
}
