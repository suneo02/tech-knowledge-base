import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { Card, Tooltip } from '@wind/wind-ui'
import { intl, t } from 'gel-util/intl'
import React, { FC } from 'react'
import ecPng from '../../../../assets/imgs/ec.png'
import { wftCommon } from '@/utils/utils'

export const RiskCardTitle: FC = () => {
  return (
    <>
      {t('451196', '舆情得分')}
      <Tooltip
        overlayClassName="corp-tooltip"
        title={t(
          '437436',
          '企业无重要舆情时，企业舆情分数为50分； 舆情分数越高，舆情正面程度越高；分数越低，舆情负面程度越高，该数据从公示结果解析得出，仅供参考，不代表万得企业库任何明示、暗示之观点或保证。'
        )}
      >
        <InfoCircleButton />
      </Tooltip>
    </>
  )
}

export const RiskCardExtra: FC<{ companycode: string }> = ({ companycode }) => {
  if (!companycode) return null
  return (
    <span>
      <a
        className="risk-link"
        href={`//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${companycode}/1/RiskView`}
        target="_blank"
        rel="noreferrer"
        data-uc-id="R2tNd0CcqQ"
        data-uc-ct="a"
      >
        {intl('40513', '详情')}
      </a>
    </span>
  )
}

const getRotateZ = (score: number) => {
  const zeroRotateZ = 140 // 左边最大角度 -140
  let rotateZ = 0
  if (score && score !== 50) {
    rotateZ = score - 0
    rotateZ = (rotateZ / 50) * zeroRotateZ
    rotateZ = 0 - zeroRotateZ + rotateZ
  }
  return rotateZ
}

const routerToRiskView = (companycode: string) => {
  wftCommon.jumpJqueryPage(`//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${companycode}/1/RiskView`)
}
export const CorpIntroRiskCardSmall: FC<{
  companycode: string
  score: number
}> = ({ companycode, score }) => {
  const rotateZ = getRotateZ(score)
  return (
    <Card className="risk-card" title={<RiskCardTitle />} extra={<RiskCardExtra companycode={companycode} />}>
      <div
        className="risk-score-module"
        onClick={() => {
          routerToRiskView(companycode)
        }}
      >
        {score !== 50 ? (
          <div className="ec-for-risk">
            <span className="ec-for-risk1" style={{ transform: `rotateZ(${rotateZ}deg)` }}></span>
            <span className="ec-for-risk2">{score}</span>
          </div>
        ) : (
          <img style={{ marginLeft: '-2px', marginTop: '-2px' }} src={ecPng} alt="" className="" />
        )}
      </div>
    </Card>
  )
}

export const CorpIntroRiskCardBig: FC<{
  companycode: string
  score: number
  selfRisk: string
  aroundRisk: string
  negativeNews: string
}> = ({ companycode, score, selfRisk, aroundRisk, negativeNews }) => {
  const rotateZ = getRotateZ(score)
  return (
    <Card className="risk-card" title={<RiskCardTitle />} extra={<RiskCardExtra companycode={companycode} />}>
      <div
        className="risk-score-module"
        onClick={() => {
          routerToRiskView(companycode)
        }}
      >
        {score !== 50 ? (
          <div className="ec-for-risk">
            <span className="ec-for-risk1" style={{ transform: `rotateZ(${rotateZ}deg)` }}></span>
            <span className="ec-for-risk2">{score}</span>
          </div>
        ) : (
          <img style={{ marginLeft: '-2px', marginTop: '-2px' }} src={ecPng} alt="" className="" />
        )}

        <div className="score-text">
          <div className="title">{intl('313113', '近3月')}</div>
          <div className="part">
            {intl('443477', '舆情资讯')}
            <span>{negativeNews}</span>
          </div>
          <div className="part">
            {intl('143085', '自身风险')}
            <span>{selfRisk}</span>
          </div>
          <div className="part">
            {intl('142988', '关联风险')}
            <span>{aroundRisk}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
