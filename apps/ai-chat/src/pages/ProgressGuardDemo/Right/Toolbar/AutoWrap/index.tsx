import { postPointBuried } from '@/utils/common/bury'
import { EnlargeO, ShrinkO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

const PREFIX = 'auto-wrap-button'
const STRINGS = {
  AUTO_WRAP: t('464124', '展开每行'),
  AUTO_WRAP_OFF: t('464157', '收起每行'),
}

/**
 * 自动换行按钮
 */
export const AutoWrapButton = ({ disabled, sheetRef }: { disabled?: boolean; sheetRef: any }) => {
  const [autoHeight, setAutoHeight] = useState(false)
  return (
    <Button
      className={`${PREFIX}-auto-wrap-button`}
      type={autoHeight ? 'primary' : undefined}
      disabled={disabled}
      onClick={() => {
        postPointBuried('922604570322', { click: autoHeight ? '收起每行' : '展开每行' })
        const pre = !autoHeight
        const tableInstance = sheetRef
        if (pre) {
          tableInstance.heightMode = 'autoHeight'
          tableInstance.autoWrapText = true
        } else {
          tableInstance.heightMode = undefined
          tableInstance.autoWrapText = undefined
        }
        tableInstance.renderWithRecreateCells()
        setAutoHeight(pre) // 使用 pre 来设置状态，因为它代表了点击后的期望状态
      }}
      // @ts-expect-error wind-icon
      icon={autoHeight ? <ShrinkO /> : <EnlargeO />}
      // @ts-expect-error wind-ui
      type="text"
    >
      {autoHeight ? STRINGS.AUTO_WRAP_OFF : STRINGS.AUTO_WRAP}
    </Button>
  )
}
