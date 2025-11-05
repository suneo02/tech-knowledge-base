import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import React, { useEffect, useState } from 'react'
import intl from '@/utils/intl'
import { getVipInfo } from '@/lib/utils'
import { VipPopup } from '@/lib/globalModal'
import { corpTechScoreIndustryRender } from '@/components/company/techScore/comp.tsx'
import { downloadTechRankWord, getTechRank } from '@/api/companyApi'
import { wftCommon } from '@/utils/utils'

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
export const processTechRankData = (resData: any, rankData: any, score: string | number, date: string) => {
  try {
    const data: any = {}
    data.score = rankData?.score ? rankData?.score : score
    console.log('🚀 ~ processTechRankData ~ data.score:', data.score)
    data.date = date

    if (resData[0].industry && resData[0].industry.length) {
      resData[0].industry.sort((x, y) => x.level - y.level)
    }
    if (window.en_access_config) {
      wftCommon.zh2en(resData[0].industry, (endata) => {
        resData[0].industry = endata
        data.industry = resData
        return data
      })
    } else {
      data.industry = resData
      return data
    }
  } catch (e) {
    console.error('Error processing tech rank data:', e)
    return {}
  }
}
export const getCorpTechScoreRows = ({ score, corpCode }) => {
  const userVipInfo = getVipInfo()
  return [
    [
      {
        title: intl('451195', '科创分'),
        dataIndex: 'score',
        titleWidth: '15%',
        contentWidth: '35%',
        colSpan: 3,
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
                {intl('378217', '查看历史得分和排名')}
              </span> */}
            </div>
          )
        },
      },
      {
        title: intl('175211', '报告'),
        dataIndex: '$1',
        titleWidth: '15%',
        contentWidth: '35%',
        render: () => {
          return (
            <div>
              <span
                className="wi-btn-color "
                onClick={() => {
                  if (!userVipInfo.isSvip) {
                    VipPopup()
                    return
                  }
                  pointBuriedByModule(922602101127, {
                    company_id: corpCode,
                  })
                  downloadTechRank(corpCode)
                }}
              >
                {intl('437448', '下载报告')}
              </span>
              <span
                className="wi-btn-color "
                onClick={() => {
                  pointBuriedByModule(922602101127, {
                    company_id: '1047934153',
                  })
                  downloadTechRank('1047934153')
                }}
              >
                {intl('378218', '查看样例报告')}
              </span>
            </div>
          )
        },
      },
    ],
    [
      {
        title: intl('361813', '战略性新兴产业及排名'),
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
        const rankDataProcessed = processTechRankData(res.data, rankData, score, date)
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
