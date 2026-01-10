import { useEffect, useState } from 'react'

import { getTechRank } from '@/api/companyApi'
import { translateData } from '@/utils/intl/complexHtml'
import { isEn, t } from 'gel-util/intl'
import { corpTechScoreIndustryRender } from './comp'

export const processTechRankData = async (resData: any, rankData: any, score: string | number, date: string) => {
  try {
    const data: any = {}
    data.score = rankData?.score ? rankData?.score : score
    console.log('🚀 ~ processTechRankData ~ data.score:', data.score)
    data.date = date

    if (resData[0].industry && resData[0].industry.length) {
      resData[0].industry.sort((x, y) => x.level - y.level)
    }
    if (isEn()) {
      const result = await translateData(resData[0].industry, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })
      if (result.success) {
        resData[0].industry = result.data
      }
      data.industry = resData
      return data
    } else {
      data.industry = resData
      return data
    }
  } catch (e) {
    console.error('Error processing tech rank data:', e)
    return {}
  }
}
export const getCorpTechScoreRows = ({ score }) => {
  return [
    [
      {
        title: t('451195', '科创分'),
        dataIndex: 'score',
        colSpan: 5,
        render: () => {
          return (
            <div className="techScoreRank-history">
              <span>{score ? String(score) : '--'}</span>

              {/* 数据质量差，临时下架历史数据查看 from gaoyuan 2024.10.22 */}
              {/* <span
                className="wi-btn-color wi-btn-color-r"
                onClick={() => {
                  if (!userVipInfo.isSvip) {
                    VipPopup()
                    return
                  }
                  if (!allRankData) {
                    getAllRanks()
                  } else {
                    showRankModal(allRankData, allScoreData)
                  }
                }}
              >
                {t('378217', '查看历史得分和排名')}
              </span> */}
            </div>
          )
        },
      },
    ],
    [
      {
        title: t('361813', '战略性新兴产业及排名'),
        dataIndex: 'industry',
        colSpan: 5,
        render: corpTechScoreIndustryRender,
      },
    ],
  ]
}

export const useTechRank = (companycode: string, score: any, date: any) => {
  const [rankData, setRankData] = useState(null)

  const fetchTechRank = async () => {
    try {
      const res = await getTechRank(companycode, { latest: 1 })
      if (res?.code === '0' && res.data?.length) {
        const rankDataProcessed = await processTechRankData(res.data, rankData, score, date)
        setRankData(rankDataProcessed)
      }
    } catch (error) {
      console.error('Error fetching technical rank:', error)
    }
  }
  useEffect(() => {
    if (companycode) {
      fetchTechRank()
    }
  }, [companycode])

  return rankData
}
