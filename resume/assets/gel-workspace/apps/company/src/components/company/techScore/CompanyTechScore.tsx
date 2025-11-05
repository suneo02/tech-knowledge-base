import { TechScoreHint } from '@/components/company/techScore/comp.tsx'
import { ICorpTableCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle/index.tsx'
import intl from '@/utils/intl/index.ts'
import { Card, Col, Row, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { FC, ReactNode } from 'react'
import RadarChart from '../../charts/RadarChart'
import { useTechScoreChart } from './chartHandle.tsx'
import './style/index.less'
import styles from './style/title.module.less'
import { getCorpTechScoreRows, useTechRank } from './tableHandle.tsx'

const { HorizontalTable } = Table

export const CorpTechTitleComponent: React.FC<{
  title: ReactNode
  date?: string
}> = ({ title, date }) => {
  return (
    <div className={`has-child-table ${styles['corp-tech-score-title']}`}>
      <span>
        <span className="table-title">{title}</span>
        <Tooltip overlayClassName="corp-tooltip" title={<TechScoreHint />}>
          <InfoCircleButton />
        </Tooltip>
      </span>
      {date ? (
        <span className={`${styles['corp-tech-score-title--date']}`}>
          {intl('378220', '评分日期')}: {date}
        </span>
      ) : null}
    </div>
  )
}

export const CompanyTechScore: FC<{
  corpCode: string
  eachTable: Partial<Pick<ICorpTableCfg, 'title'>>
  eachTableKey: string
}> = ({ corpCode, eachTable, eachTableKey }) => {
  const { radarChartOpts, score, date } = useTechScoreChart(corpCode)

  const rankData = useTechRank(corpCode, score, date)

  const rows = getCorpTechScoreRows({
    score,
    corpCode,
  })

  return (
    <Card
      key={'CompanyTechScore'}
      // @ts-expect-error ttt
      multiTabId={eachTableKey}
      className="vtable-container CompanyTechScore-card"
      divider={'none'}
      title={<CorpTechTitleComponent title={eachTable.title} date={date} />}
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
