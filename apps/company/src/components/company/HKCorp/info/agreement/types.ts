import { ReactNode } from 'react'

export interface AgreementSection {
  title: string
  bold?: boolean
  underline?: boolean
  content: Array<{
    id: string
    text: ReactNode
    bold?: boolean
    underline?: boolean
    list?: Array<{
      text: string
      bold?: boolean
      underline?: boolean
    }>
    textAfterList?: string
  }>
}

export interface Platform {
  name: string
  queryUrl: string
  privacyUrl: string
  restrictions: string[]
}

export interface AgreementMeta {
  version: string
  updateDate: string
  effectiveDate: string
}
