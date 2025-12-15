/**
 * PDFCover options interface
 */
export interface PDFCoverOptions {
  /** Company name */
  companyName?: string
  /** Report title */
  reportTitle: string
  /** Report date */
  reportDate?: string
  /** Whether to show disclaimers */
  showDisclaimers?: boolean
  className?: string
}
