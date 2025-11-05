import React, { FC, useContext } from 'react'
import { useTechScoreChart } from '@/components/company/techScore/chartHandle.tsx'
import { getCorpTechScoreRows, useTechRank } from '@/components/company/techScore/tableHandle.tsx'
import { Card, Col, Row } from '@wind/wind-ui'
import { CorpTechTitleComponent } from '@/components/company/techScore/CompanyTechScore.tsx'
import Table from '@wind/wind-ui-table'
import { CompanyDetailContext } from '@/views/Company/ctx.ts'
import intl from '@/utils/intl'
import RadarChart from '../../../charts/RadarChart.jsx'
import { ICfgDetailCompJson } from '@/types/configDetail/module.ts'

const { HorizontalTable } = Table

export const ConfigDetailCorpTechScore: FC<ICfgDetailCompJson> = ({ titleId, title }) => {
  const { corpCode } = useContext(CompanyDetailContext)
  const { radarChartOpts, score, date } = useTechScoreChart(corpCode)

  const rankData = useTechRank(corpCode, score, date)

  const rows = getCorpTechScoreRows({
    score,
    corpCode,
  })

  return (
    <Card
      key={'CompanyTechScore'}
      className="vtable-container CompanyTechScore-card"
      divider={'none'}
      title={<CorpTechTitleComponent title={intl(titleId, title)} date={date} />}
    >
      <Row>
        <Col span={10}>{radarChartOpts ? <RadarChart opts={radarChartOpts} /> : null}</Col>
        <Col span={14}>
          <HorizontalTable
            bordered={'default'}
            className="table-custom-module-readyed"
            rows={rows}
            dataSource={rankData}
          />
        </Col>
      </Row>
    </Card>
  )
}
