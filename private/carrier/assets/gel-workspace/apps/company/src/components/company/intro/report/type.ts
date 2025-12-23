import { ECorpReport } from 'gel-util/corp'
import React from 'react'

export interface ReportCompProps {
  enum: ECorpReport
  buttons: React.ReactNode
  imgSrc: string
  ifSvip?: boolean
}
