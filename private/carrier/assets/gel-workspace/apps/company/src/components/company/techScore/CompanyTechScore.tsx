import { downloadTechRankWord } from '@/api/companyApi.ts'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { TechScoreHint } from '@/components/company/techScore/comp.tsx'
import { ICorpTableCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle/index.tsx'
import { VipPopup } from '@/lib/globalModal'
import { getVipInfo } from '@/lib/utils'
import intl from '@/utils/intl/index.ts'
import { wftCommon } from '@/utils/utils.tsx'
import { DownloadO } from '@wind/icons'
import { Button, Card, Col, Row, Tooltip } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React, { FC, ReactNode } from 'react'
import { useTechScoreChart } from './chartHandle.tsx'
import './style/index.less'
import styles from './style/title.module.less'
import { getCorpTechScoreRows, useTechRank } from './tableHandle.tsx'

// 懒加载 RadarChart 组件，避免首屏加载 ECharts 资源
const RadarChartComponent = () =>
  React.lazy(() => import('../../charts/RadarChart.jsx').then((module) => ({ default: module.RadarChartComponent })))
const RadarChart = RadarChartComponent()

const { HorizontalTable } = Table

export const downloadTechRank = async (code) => {
  try {
    const res = await downloadTechRankWord(code)
    if (res && res?.code == '0' && res.data && res.data?.id) {
      // 导出成功
      wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
    }
  } catch (error) {
    console.error('Error downloading tech rank:', error)
  }
}
export const CorpTechTitleComponent: React.FC<{
  title: ReactNode
  date?: string
  corpCode: string
}> = ({ title, date, corpCode }) => {
  const userVipInfo = getVipInfo()
  const handleClick = () => {
    if (!userVipInfo.isSvip) {
      VipPopup()
      return
    }
    pointBuriedByModule(922602101127, {
      company_id: corpCode,
    })
    downloadTechRank(corpCode)
  }

  return (
    <div className={`has-child-table ${styles['corp-tech-score-title']}`}>
      <div className="table-title-container">
        <span className="table-title">{title}</span>
        <Tooltip overlayClassName="corp-tooltip" title={<TechScoreHint />}>
          <InfoCircleButton className={styles['corp-tech-score-title--info-circle']} />
        </Tooltip>
        {date ? (
          <span className={`${styles['corp-tech-score-title--date']}`}>
            {intl('378220', '评分日期')}: {date}
          </span>
        ) : null}
      </div>
      <Button
        style={{ marginTop: 4 }}
        onClick={handleClick}
        icon={<DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
      >
        {intl('4698', '导出数据')}
      </Button>
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
  })

  return (
    <Card
      key={'CompanyTechScore'}
      // @ts-expect-error ttt
      multiTabId={eachTableKey}
      className="vtable-container CompanyTechScore-card"
      divider={'none'}
      title={<CorpTechTitleComponent title={eachTable.title} date={date} corpCode={corpCode} />}
    >
      <Row>
        <Col span={10}>
          {radarChartOpts ? (
            <React.Suspense fallback={<div></div>}>
              {/* @ts-ignore */}
              <RadarChart opts={radarChartOpts} />
            </React.Suspense>
          ) : null}
        </Col>
        <Col span={14}>
          <HorizontalTable
            bordered={'default'}
            className="table-custom-module-readyed"
            rows={rows}
            dataSource={rankData}
            data-uc-id="XfuFYrFZq2"
            data-uc-ct="horizontaltable"
          />
        </Col>
      </Row>
    </Card>
  )
}
