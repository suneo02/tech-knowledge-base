export interface CreateInvestReportParams {
  cmd: 'createinvestreport'
}

export interface CreateInvestReportPayload {
  entityName: string
  entityId: string
  setting: string
}
