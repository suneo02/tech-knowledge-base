import { Col } from '@wind/wind-ui'
import { CorpCardInfo } from 'gel-types'
import React from 'react'
import { ICorpBasicInfoFront } from '../../info/handle'

export interface BaseCorpIntroProps {
  headerInfo: Partial<CorpCardInfo>
  companybaseInfo: Partial<ICorpBasicInfoFront>
}

export interface BaseCorpIntroItemProps {
  title: string
  value: string | undefined
  span?: number
}

export const CorpIntroItem: React.FC<BaseCorpIntroItemProps> = ({ title, value, span = 12 }) => (
  <Col span={span}>
    <span className="itemTitle">{title} :</span> <span className="">{value || '--'}</span>
  </Col>
)
