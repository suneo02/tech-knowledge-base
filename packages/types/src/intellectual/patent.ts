export interface PatentAssignee {
  mainBodyName: string
  mainBodyId: string
  applicationNumber: string
  mainBodyType: string
}

export interface PatentApplicant {
  mainBodyName: string
  mainBodyId: string
  applicationNumber: string
  mainBodyType: string
}
export interface PatentItem {
  publicAnnouncementDate: string
  assigneeList: string
  publicAnnouncementNumber: string
  applicationNumber: string
  patentType: string
  dataId: string
  patentName: string
  assignee: PatentAssignee[]
  applicant?: PatentApplicant[]
  lawStatus: string
}

export interface PatentItemFront extends PatentItem {
  patentName_en?: string
}
