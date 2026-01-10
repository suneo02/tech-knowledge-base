import React from 'react'
import { Button, Checkbox } from '@wind/wind-ui'
import { CoinsIcon } from '@/assets/icon'
import styles from './index.module.less'
import { t } from 'gel-util/intl'
import { generateUrlByModule, LinkModule, UserLinkParamEnum } from 'gel-util/link'
import { CreditsDisplay } from '@/components/VisTable/components/Modal/GenerateAIColumn/Home/Footer/components/CreditsDisplay'

const PREFIX = 'indicator-tree-panel-footer'

interface FooterProps {
  credits: number
  recordsCount: number
  displayCredits: number | null
  onCancel: () => void
  onConfirm: () => void
  checked: boolean
  updateChecked: (checked: boolean) => void
  hasSelection?: boolean
  loading?: boolean
}

// const CreditsDisplay = ({ credits, recordsCount, displayCredits }: { credits: number; recordsCount: number; displayCredits: number | null }) => {
//   const total = displayCredits ?? credits * recordsCount
//   return (
//     <div
//       className={styles[`${PREFIX}-credits`]}
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         background: 'rgba(240, 111, 19, 0.08)',
//         borderRadius: 16,
//         padding: '4px 10px',
//         marginInlineEnd: 12,
//       }}
//     >
//       <CoinsIcon style={{ width: 16, height: 16, marginRight: 4, color: '#f06f13' }} />
//       <span style={{ fontSize: 14, color: '#f06f13', marginInlineEnd: 4 }}>{total}</span>
//       <span style={{ fontSize: 14, color: '#f06f13' }}>/ 行</span>
//     </div>
//   )
// }

const ActionButtons = ({
  onCancel,
  onConfirm,
  disabled,
  confirmText,
  loading = false,
}: {
  onCancel: () => void
  onConfirm: () => void
  disabled: boolean
  confirmText: string
  loading?: boolean
}) => (
  <div>
    <Button onClick={onCancel}>{t('19405', '取消')}</Button>
    <Button type="primary" disabled={disabled} onClick={onConfirm} loading={loading}>
      {confirmText}
    </Button>
  </div>
)

const UsageAgreement = ({
  checked,
  updateChecked,
}: {
  checked: boolean
  updateChecked: (checked: boolean) => void
}) => {
  const NOTICE = t(
    '465498',
    '我已知晓并同意 {{user}}，指标提取结果受限于可查找的数据信息，可能返回无数据、或存在不准确的情况，请核实后再使用',
    {
      user: (
        <Button
          type="link"
          onClick={() =>
            window.open(
              generateUrlByModule({
                module: LinkModule.USER_CENTER,
                params: { type: UserLinkParamEnum.UserNote },
              }),
              '_blank'
            )
          }
          style={{ padding: 0 }}
          size="mini"
        >
          《{t('452995', '用户协议')}》
        </Button>
      ),
    }
  )

  return (
    <div className={styles[`${PREFIX}-agreement`]}>
      <Checkbox checked={checked} onChange={(e) => updateChecked(!!e?.target?.checked)} />
      {NOTICE}
    </div>
  )
}

const Footer: React.FC<FooterProps> = ({
  credits,
  recordsCount,
  displayCredits,
  onCancel,
  onConfirm,
  checked,
  updateChecked,
  hasSelection = true,
  loading = false,
}) => {
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-notice`]}>
        <UsageAgreement checked={checked} updateChecked={updateChecked} />
      </div>
      <div className={styles[`${PREFIX}-action`]}>
        <CreditsDisplay credits={credits} recordsCount={recordsCount} displayCredits={displayCredits} />
        <ActionButtons
          onCancel={onCancel}
          onConfirm={onConfirm}
          disabled={recordsCount === 0 || !hasSelection}
          confirmText={displayCredits ? t('464142', '确认提取') : t('464142', '提取')}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Footer
