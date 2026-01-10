import React from 'react'
import { CoinsIcon } from '@/assets/icon'
import { Button, Divider, Tooltip } from '@wind/wind-ui'
import CountUp from 'react-countup'
import { InfoCircleO } from '@wind/icons'
import { t } from 'gel-util/intl'
import styles from '../index.module.less'
import { FOOTER_CONSTANTS } from '../constants'

const PREFIX = 'generate-ai-column-home-footer'

const STRINGS = {
  CREDITS_UPDATED: t('464168', '积分已更新'),
  CREDITS_CONSUME_TEXT: t('464180', '本次执行预估消耗'),
  CONSUME_DETAILS: t('464186', '消耗详情'),
  STATUS_LABEL: t('32098', '状态'),
  CURRENT_CONSUME_LABEL: t('464126', '当前消耗'),
  UNIT_PRICE_LABEL: t('464118', '单价'),
  ROWS_LABEL: t('464194', '行'),
  TOTAL_CONSUME_LABEL: t('464138', '总消耗'),
}

interface CreditsDisplayProps {
  credits: number
  recordsCount: number
  displayCredits: number | null
}

export const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ credits, recordsCount, displayCredits }) => {
  const renderTooltipContent = () => {
    if (displayCredits !== null) {
      // 积分已变更的情况 - 只显示服务端返回的总数
      return (
        <div className={styles[`${PREFIX}-tooltip-container`]}>
          <div className={styles[`${PREFIX}-tooltip-title`]}>
            <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
            {STRINGS.CONSUME_DETAILS}
          </div>

          <div className={styles[`${PREFIX}-tooltip-item`]}>
            <span className={styles[`${PREFIX}-tooltip-item-label`]}>{STRINGS.STATUS_LABEL}</span>
            <span className={styles[`${PREFIX}-tooltip-item-value`]} style={{ color: 'var(--basic-6)' }}>
              {STRINGS.CREDITS_UPDATED}
            </span>
          </div>

          <Divider />

          <div className={styles[`${PREFIX}-tooltip-total`]}>
            <span className={styles[`${PREFIX}-tooltip-total-label`]}>{STRINGS.CURRENT_CONSUME_LABEL}</span>
            <div className={styles[`${PREFIX}-tooltip-total-value`]}>
              <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
              {displayCredits.toLocaleString()}
            </div>
          </div>
        </div>
      )
    }

    // 正常统计展示
    return (
      <div className={styles[`${PREFIX}-tooltip-container`]}>
        <div className={styles[`${PREFIX}-tooltip-title`]}>
          <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
          {STRINGS.CONSUME_DETAILS}
        </div>

        <div className={styles[`${PREFIX}-tooltip-item`]}>
          <span className={styles[`${PREFIX}-tooltip-item-label`]}>{STRINGS.UNIT_PRICE_LABEL}</span>
          <div className={styles[`${PREFIX}-tooltip-item-value-coin`]}>
            <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
            {credits.toLocaleString()}
          </div>
        </div>

        <div className={styles[`${PREFIX}-tooltip-item`]}>
          <span className={styles[`${PREFIX}-tooltip-item-label`]}>{STRINGS.ROWS_LABEL}</span>
          <span className={styles[`${PREFIX}-tooltip-item-value`]}>{recordsCount.toLocaleString()}</span>
        </div>

        <Divider />

        <div className={styles[`${PREFIX}-tooltip-total`]}>
          <span className={styles[`${PREFIX}-tooltip-total-label`]}>{STRINGS.TOTAL_CONSUME_LABEL}</span>
          <div className={styles[`${PREFIX}-tooltip-total-value`]}>
            <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
            {(credits * recordsCount).toLocaleString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles[`${PREFIX}-credits`]}>
      <span className={styles[`${PREFIX}-credits-text`]}>{STRINGS.CREDITS_CONSUME_TEXT}</span>
      <div className={styles[`${PREFIX}-credits-amount`]}>
        <CoinsIcon style={{ marginInlineEnd: FOOTER_CONSTANTS.UI.ICON_MARGIN_END }} />
        <CountUp
          end={displayCredits !== null ? displayCredits : credits * recordsCount}
          duration={FOOTER_CONSTANTS.ANIMATION.COUNTUP_DURATION}
          separator=","
          preserveValue
        />
      </div>
      <Tooltip title={renderTooltipContent()} placement="top">
        {/* @ts-expect-error wind-icon */}
        <InfoCircleO style={{ fontSize: FOOTER_CONSTANTS.UI.INFO_ICON_SIZE, color: 'var(--basic-8)' }} />
      </Tooltip>
    </div>
  )
}
