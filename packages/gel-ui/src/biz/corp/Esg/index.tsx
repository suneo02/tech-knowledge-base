import {
  esgRatingA,
  esgRatingAA,
  esgRatingAAA,
  esgRatingB,
  esgRatingBB,
  esgRatingBBB,
  esgRatingCCC,
  esgRatingD,
} from '@/assets/img'
import { useIntl } from '@/common'
import { InfoCircleButton } from '@/common/Button'
import { Card, Link, Tooltip } from '@wind/wind-ui'
import cn from 'classnames'
import { CorpEsgScore } from 'gel-api'
import { usedInClient } from 'gel-util/env'
import { EMPTY_PLACEHOLDER, formatTime } from 'gel-util/format'
import { isEn } from 'gel-util/intl'
import { getF9TerminalCommandLink, handleJumpTerminalCompatible } from 'gel-util/link'
import { FC, useMemo } from 'react'
import styles from './index.module.less'

const VALID_RATINGS: CorpEsgScore['Rating'][] = ['A', 'AA', 'AAA', 'B', 'BB', 'BBB', 'CCC', 'D']

export const isValidEsgRating = (rating?: string | null) => {
  return !!rating && VALID_RATINGS.includes(rating as CorpEsgScore['Rating'])
}

export const isValidEsgInfo = (info?: CorpEsgScore | null) => {
  return isValidEsgRating(info?.Rating)
}

export const EsgBrand: FC<{
  info: CorpEsgScore
  className?: string
  style?: React.CSSProperties
}> = ({ info, className, style }) => {
  const t = useIntl()
  const link = useMemo(
    () =>
      usedInClient() && info.WindCode
        ? getF9TerminalCommandLink({
            windcode: info.WindCode,
            SubjectID: '1108',
          })
        : null,
    [info.WindCode]
  )
  const imgSrc = useMemo(() => {
    switch (info.Rating) {
      case 'A':
        return esgRatingA
      case 'AA':
        return esgRatingAA
      case 'AAA':
        return esgRatingAAA
      case 'B':
        return esgRatingB
      case 'BB':
        return esgRatingBB
      case 'BBB':
        return esgRatingBBB
      case 'CCC':
        return esgRatingCCC
      case 'D':
        return esgRatingD
    }
  }, [info.Rating])

  const formattedYear = useMemo(() => {
    if (!info.RatingDate) return null

    try {
      const formattedDate = formatTime(info.RatingDate)
      if (formattedDate === EMPTY_PLACEHOLDER) return null
      // 从格式化后的日期中提取年份（取第一个连字符前的部分）
      return formattedDate.split('-')[0]
    } catch (error) {
      console.warn('Failed to format RatingDate:', info.RatingDate, error)
      return null
    }
  }, [info.RatingDate])

  const hintText = isEn()
    ? `The Wind ESG Rating framework is composed of management & practice and controversies assessment, which can comprehensively reflect the company’s longterm ESG fundamental impact and the impact of short-term risk. Focusing on the ESG risks and opportunities of each industry, the companies are rated on a AAA-CCC scale relative to the performance of their industry peers.`
    : `Wind ESG 评价体系由管理实践评估和争议事件评估组成，能综合反映企业的 ESG 管理实践水平以及重大突发风险。Wind ESG 根据公司所属行业具有的 ESG 风险与机遇，以及相对于同行的绩效表现，按照分值区间给公司评为 AAA 到 CCC 的结果。`
  if (!imgSrc) {
    return null
  }
  return (
    <Card
      className={cn(styles['esg-brand'], className)}
      style={style}
      title={
        <>
          <span>Wind ESG</span>
          <Tooltip title={hintText}>
            <InfoCircleButton />
          </Tooltip>
        </>
      }
      extra={
        link ? (
          <Link
            className={styles['esg-brand-link']}
            // @ts-expect-error ttt
            onClick={(e) => {
              e.preventDefault()
              if (link) {
                handleJumpTerminalCompatible(link, e)
              }
            }}
          >
            {t('40513', '详情')}
          </Link>
        ) : null
      }
    >
      <div className={styles['esg-brand-img-wrapper']}>
        {imgSrc && <img className={styles['esg-brand-img']} src={imgSrc} alt={info.Rating} />}
      </div>
      {formattedYear ? (
        <div className={styles['esg-brand-date']}>
          <span>{formattedYear}</span>
          <span>{t('30628', '评级')}</span>
        </div>
      ) : null}
    </Card>
  )
}
