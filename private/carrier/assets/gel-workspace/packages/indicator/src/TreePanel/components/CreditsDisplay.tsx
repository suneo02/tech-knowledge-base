import React from 'react'
import { Button, Divider, Tooltip } from '@wind/wind-ui'
import { InfoCircleO } from '@wind/icons'
import { CoinsO } from '@/assets'
import styles from './creditsDisplay.module.less'
import { t } from 'gel-util/intl'

interface CreditsDisplayProps {
  unitCredits: number
  rowLength: number
  displayCredits: number | null
}

const STRINGS = {
  CREDITS_UPDATED: t('464168', '积分已更新'),
  CREDITS_CONSUME_TEXT: t('465479', '预估消耗'),
  CONSUME_DETAILS: t('464186', '消耗详情'),
  STATUS_LABEL: t('32098', '状态'),
  CURRENT_CONSUME_LABEL: t('464126', '当前消耗'),
  UNIT_PRICE_LABEL: t('464118', '单价'),
  ROWS_LABEL: t('464194', '行'),
  TOTAL_CONSUME_LABEL: t('464138', '总消耗'),
}

export const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ unitCredits, rowLength, displayCredits }) => {
  const total = displayCredits !== null ? displayCredits : unitCredits * rowLength

  const renderTooltipContent = () => {
    if (displayCredits !== null) {
      return (
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipTitle}>
            <CoinsO style={{ marginInlineEnd: 6 }} />
            {STRINGS.CONSUME_DETAILS}
          </div>
          <div className={styles.tooltipItem}>
            <span className={styles.tooltipItemLabel}>{STRINGS.STATUS_LABEL}</span>
            <span className={styles.tooltipItemValue} style={{ color: 'var(--basic-6)' }}>
              {STRINGS.CREDITS_UPDATED}
            </span>
          </div>
          <Divider />
          <div className={styles.tooltipTotal}>
            <span className={styles.tooltipTotalLabel}>{STRINGS.CURRENT_CONSUME_LABEL}</span>
            <div className={styles.tooltipTotalValue}>
              <CoinsO style={{ marginInlineEnd: 6 }} />
              {total.toLocaleString()}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.tooltipContainer}>
        <div className={styles.tooltipTitle}>
          <CoinsO style={{ marginInlineEnd: 6 }} />
          {STRINGS.CONSUME_DETAILS}
        </div>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipItemLabel}>{STRINGS.UNIT_PRICE_LABEL}</span>
          <div className={styles.tooltipItemValueCoin}>
            <CoinsO style={{ marginInlineEnd: 6 }} />
            {unitCredits.toLocaleString()}
          </div>
        </div>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipItemLabel}>{STRINGS.ROWS_LABEL}</span>
          <span className={styles.tooltipItemValue}>{rowLength.toLocaleString()}</span>
        </div>
        <Divider />
        <div className={styles.tooltipTotal}>
          <span className={styles.tooltipTotalLabel}>{STRINGS.TOTAL_CONSUME_LABEL}</span>
          <div className={styles.tooltipTotalValue}>
            <CoinsO style={{ marginInlineEnd: 6 }} />
            {(unitCredits * rowLength).toLocaleString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.credits}>
      <span className={styles.creditsText}>{STRINGS.CREDITS_CONSUME_TEXT}</span>
      <div className={styles.creditsAmount}>
        <CoinsO style={{ marginInlineEnd: 6 }} />
        <span>{total.toLocaleString()}</span>
      </div>
      <Tooltip title={renderTooltipContent()} placement="top">
        <Button
          className={styles.infoBtn}
          icon={
            // @ts-expect-error wind-icon type
            <InfoCircleO style={{ fontSize: 16, color: displayCredits ? 'var(--red-6)' : 'var(--basic-8)' }} />
          }
          type="text"
        />
      </Tooltip>
    </div>
  )
}
