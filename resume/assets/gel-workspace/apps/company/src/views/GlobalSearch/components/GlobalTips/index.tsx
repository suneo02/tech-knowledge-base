import { CloseO, ExclamationCircleF } from '@wind/icons'
import { Button, Link } from '@wind/wind-ui'
import React from 'react'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import InnerHtml from '@/components/InnerHtml'

interface GlobalTipsProps {
  visible: boolean
  globalCount: number
  onClose: () => void
  onClick: () => void
}

const GlobalTips: React.FC<GlobalTipsProps> = ({ visible, globalCount, onClose, onClick }) => {
  if (!visible || globalCount === 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 42,
        left: 6,
        width: 'fit-content',
        height: 36,
        border: '1px solid #ededed',
        // borderRadius: 4,
        backgroundColor: '#fff',
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 8,
        // justifyContent: 'space-between',
      }}
    >
      {/* @ts-expect-error ttt */}
      <ExclamationCircleF style={{ color: '#00aec7', marginInlineEnd: 8 }} />
      {/* @ts-expect-error ttt */}
      <Link style={{ marginInlineEnd: 4 }} onClick={onClick}>
        <InnerHtml
          html={intl('406776', '为您检索到全球企业 % 家，点击切换查看').replace(
            /%/,
            `<strong> ${wftCommon.formatMoneyComma(globalCount)}</strong>`
          )}
        ></InnerHtml>
      </Link>
      {/* @ts-expect-error ttt */}
      <Button size="small" type="text" icon={<CloseO />} onClick={onClose} />
    </div>
  )
}
export default GlobalTips
