import { apiGetTechScore, TCorpTechScoreReport } from '@/api/corp/report.ts'
import { useEffect, useState } from 'react'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ITechScoreChartOpts } from '@/components/company/techScore/type.ts'

export const generateTechScoreRadarChartOpts = (data: TCorpTechScoreReport) => {
  const key4score = {
    strengthScore: intl('273193', '企业实力'),
    influenceScore: intl('378216', '社会影响力'),
    qualityScore: intl('378215', '技术质量'),
    layoutScore: intl('378214', '技术布局'),
    scaleScore: intl('378213', '研发规模'),
  }
  const lastReportData = data[data.length - 1] // 取最新一期
  const time = lastReportData.report // 报告期时间

  const opts: ITechScoreChartOpts = {
    data: [
      {
        name: wftCommon.formatTime(time),
        value: [],
      },
    ],
    indicator: [],
    style: {
      height: '320px',
      width: '100%',
    },
    radarExtras: {
      name: {
        textStyle: {
          color: '#333',
        },
      },
    },
  }

  if (window.en_access_config) {
    opts.radarExtras.radius = 90
  }

  for (const k in key4score) {
    if (key4score[k]) {
      opts.indicator.push({
        name: key4score[k],
        max: 10,
      })
      opts.data[0].value.push(lastReportData[k])
    }
  }

  opts.centerTxt =
    (window.en_access_config ? 'Score: ' : '总分: ') +
    (lastReportData['innovateScore'] ? lastReportData['innovateScore'].toFixed(1) : '0')
  opts.centerTxtFontSize = 18
  opts.tooltipPos = 'right'

  return {
    opts,
    innovateScore:
      (lastReportData['innovateScore'] ? lastReportData['innovateScore'].toFixed(1) : '0') +
      (window.en_access_config ? '' : ' 分'),
    formattedTime: wftCommon.formatTime(time),
  }
}
export const useTechScoreChart = (corpCode: string) => {
  const [radarChartOpts, setRadarChartOpts] = useState(null)
  const [score, setScore] = useState<string | number>(0)
  const [date, setDate] = useState('')

  const drawRadarChart = async () => {
    try {
      const res = await apiGetTechScore(corpCode)
      if (res?.code === '0' && res.data?.length) {
        const { opts, innovateScore, formattedTime } = generateTechScoreRadarChartOpts(res.data)
        setScore(innovateScore)
        setRadarChartOpts(opts)
        setDate(formattedTime)
      }
    } catch (error) {
      console.error('Failed to fetch Tech Score:', error)
    }
  }

  // Trigger drawing the chart if `corpCode` is provided
  useEffect(() => {
    if (corpCode) {
      drawRadarChart()
    }
  }, [corpCode])

  return { radarChartOpts, score, date }
}
