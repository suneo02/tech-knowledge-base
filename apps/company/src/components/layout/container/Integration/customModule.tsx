import { useTechScoreChart } from '@/components/company/techScore/chartHandle.tsx'
import { CorpTechTitleComponent } from '@/components/company/techScore/CompanyTechScore.tsx'
import { getCorpTechScoreRows, useTechRank } from '@/components/company/techScore/tableHandle.tsx'
import { ICfgDetailCompJson } from '@/types/configDetail/module.ts'
import intl from '@/utils/intl'
import { CompanyDetailContext } from '@/views/Company/ctx.ts'
import { Card, Col, Row } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { FC, useContext } from 'react'
import { RadarChartComponent } from '../../../charts/RadarChart'

const { HorizontalTable } = Table

export const ConfigDetailCorpTechScore: FC<ICfgDetailCompJson> = ({ titleId, title }) => {
  const { corpCode } = useContext(CompanyDetailContext)
  const { radarChartOpts, score, date } = useTechScoreChart(corpCode)

  const rankData = useTechRank(corpCode, score, date)

  const rows = getCorpTechScoreRows({
    score,
  })

  return (
    <Card
      key={'CompanyTechScore'}
      className="vtable-container CompanyTechScore-card"
      divider={'none'}
      title={<CorpTechTitleComponent title={intl(titleId, title)} date={date} corpCode={corpCode} />}
    >
      <Row>
        <Col span={10}>{radarChartOpts ? <RadarChartComponent opts={radarChartOpts} /> : null}</Col>
        <Col span={14}>
          <HorizontalTable
            bordered={'default'}
            className="table-custom-module-readyed"
            rows={rows}
            dataSource={rankData}
            data-uc-id="IEpX2rDh85"
            data-uc-ct="horizontaltable"
          />
        </Col>
      </Row>
    </Card>
  )
}
