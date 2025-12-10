import InnerHtml from '@/components/InnerHtml'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { CloseO, ExclamationCircleF } from '@wind/icons'
import { Button, Link } from '@wind/wind-ui'
import React from 'react'

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
      <ExclamationCircleF
        style={{ color: '#00aec7', marginInlineEnd: 8 }}
        data-uc-id="lBnb4IA-7n"
        data-uc-ct="exclamationcirclef"
      />
      <Link
        // @ts-expect-error ttt
        style={{ marginInlineEnd: 4 }}
        onClick={onClick}
        data-uc-id="o_7iVJn0RI"
        data-uc-ct="link"
      >
        <InnerHtml
          html={intl('406776', '为您检索到全球企业 % 家，点击切换查看').replace(
            /%/,
            `<strong> ${wftCommon.formatMoneyComma(globalCount)}</strong>`
          )}
        ></InnerHtml>
      </Link>
      <Button
        size="small"
        type="text"
        icon={
          <CloseO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="muS3ZlSN6j"
            data-uc-ct="closeo"
          />
        }
        onClick={onClose}
        data-uc-id="nULercNykx"
        data-uc-ct="button"
      />
    </div>
  )
}
export default GlobalTips
