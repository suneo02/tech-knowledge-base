import { ChartComp, useChartUrl } from '@/chart/ChartComp'
import { Button, Card } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { GelCardTypeEnum, GelData, postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import { isArray } from 'lodash'
import { FC } from 'react'

export const isGelData = (content: any): content is GelData => {
  return typeof content === 'object' && content !== null && 'type' in content
}

export const gelCardTitleMap: Record<GelCardTypeEnum, string> = {
  [GelCardTypeEnum.AgentGetrelationpath]: '关系路径查询',
  [GelCardTypeEnum.AgentGetrelationpathmulti]: '多对一触达',
  [GelCardTypeEnum.ChartCorrelationParty]: '关联方图谱',
  [GelCardTypeEnum.ChartCorrelationParty2]: '关联方图谱',
  [GelCardTypeEnum.ChartEquityPenetration]: '股权穿透图',
  [GelCardTypeEnum.AgentDueDiligenceReport]: '尽职调查报告',
  [GelCardTypeEnum.AgentDepthCreditReport]: '深度信用报告',
  [GelCardTypeEnum.Company]: '企业卡片',
  [GelCardTypeEnum.Character]: '人物卡片',
  [GelCardTypeEnum.Bid]: '招投标卡片',
  [GelCardTypeEnum.Job]: '招聘卡片',
  [GelCardTypeEnum.Standard]: '标准信息',
  [GelCardTypeEnum.Patent]: '专利信息',
  [GelCardTypeEnum.Trademark]: '商标',
  [GelCardTypeEnum.Group]: '集团系',
  [GelCardTypeEnum.ChartActualController]: '实际控制人',
  [GelCardTypeEnum.ChartBeneficialOwner]: '受益所有人',
  [GelCardTypeEnum.ChartBeneficiaryNaturalPerson]: '受益自然人',
  [GelCardTypeEnum.ChartBeneficiaryInstitution]: '受益机构',
  [GelCardTypeEnum.ChartTzct]: '对外投资',
  [GelCardTypeEnum.ChartQytp]: '企业图谱',
  [GelCardTypeEnum.ChartGqct]: '股权穿透图',
  [GelCardTypeEnum.ChartRztp]: '融资图谱',
  [GelCardTypeEnum.Bar]: '柱状图',
  [GelCardTypeEnum.Line]: '折线图',
  [GelCardTypeEnum.Pie]: '饼图',
}

export const getGelDataArrar = (content: any): GelData[] => {
  if (!isArray(content)) {
    console.error('gelData is null or not an array', content)
    return []
  }
  return content.filter(isGelData)
}

export const ChartCard: FC<{ item: GelData; isDev: boolean; entWebAxiosInstance: AxiosInstance; wsid: string }> = ({
  item,
  isDev,
  entWebAxiosInstance,
  wsid,
}) => {
  const { url, fullUrl } = useChartUrl(item.type, item.params.companyCode, wsid, isDev)
  if (!url) return null
  // 埋点
  const buryPoint = () => {
    postPointBuriedWithAxios(entWebAxiosInstance, '922610370012', {
      type: item.type,
    })
  }
  return (
    <Card
      size="small"
      title={gelCardTitleMap[item.type]}
      style={{
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        marginBottom: 12,
      }}
      styleType="block"
      extra={[
        <Button
          size="small"
          type="link"
          onClick={() => {
            buryPoint()
            window.open(fullUrl, '_blank')
          }}
          style={{
            padding: 0,
          }}
        >
          {t('138310', '全屏查看')}
        </Button>,
      ]}
    >
      <ChartComp style={{ height: 400, width: '100%', padding: 0, border: 0 }} url={url} onClick={buryPoint} />
    </Card>
  )
}
