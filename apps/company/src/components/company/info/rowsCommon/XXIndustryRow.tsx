import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { BaiFenSites } from '@/handle/link'
import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { Link, Tooltip } from '@wind/wind-ui'
import React from 'react'
import { StrategicIndustryButtonModal } from '../comp/XXIndustryModal'
import { XXIndustryTree } from '../comp/XXIndustryTree'
import { CorpBasicInfoFront } from '../handle'
import styles from './styles/XXIndustryRow.module.less'

export const corpInfoXXIndustryRow = (fromShfic: boolean): HorizontalTableCol<CorpBasicInfoFront> => {
  const { strategicIndustries: strategicIndustriesUrl } = BaiFenSites()
  const strategicText = intl('361813', '战略性新兴产业')
  return {
    title: (
      <>
        {/*// 中文才有链接*/}
        {!window.en_access_config && strategicIndustriesUrl ? (
          <Link
            // @ts-expect-error ttt
            onClick={() => {
              window.open(strategicIndustriesUrl)
            }}
            data-uc-id="U_QM3dIJAn"
            data-uc-ct="link"
          >
            {strategicText}
          </Link>
        ) : (
          <span>{strategicText}</span>
        )}
        <Tooltip
          title={intl(
            420673,
            '基于《战略性新兴产业分类（2018）》规定的分类范围和适用领域、以及与《国民经济行业分类》（GB/T 4754-2017）的对应关系，对战新产业层级进行划分以及企业关联。请注意，并非所有企业都具备被纳入战略性新兴产业范畴的条件。'
          )}
        >
          <InfoCircleButton />
        </Tooltip>
      </>
    ),
    dataIndex: 'xxIndustryList',
    render: (_txt, backData) => {
      return corpInfoXXIndustryRowComp(backData, fromShfic)
    },
  }
}

export const corpInfoXXIndustryRowComp = (backData: CorpBasicInfoFront, fromShfic: boolean) => {
  if (window.en_access_config) {
    const dataList = backData.xxIndustryListEn
    if (!dataList) return '--'
    return (
      <div className={styles['industry-container']}>
        <XXIndustryTree data={dataList} fromShfic={fromShfic} />
        <StrategicIndustryButtonModal companyCode={backData.corp_id} basicInfo={backData} />
      </div>
    )
  }

  const dataList = backData.xxIndustryList
  if (!dataList || Object.keys(dataList).length === 0) return '--'

  return (
    <div className={styles['industry-container']}>
      {Object.keys(dataList).map((k) => {
        const industryItem = dataList[k]
        if (!industryItem || industryItem.length === 0) return '--'
        return <XXIndustryTree key={k} data={industryItem} fromShfic={fromShfic} />
      })}
      <StrategicIndustryButtonModal companyCode={backData.corp_id} basicInfo={backData} />
    </div>
  )
}
