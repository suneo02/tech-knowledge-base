import { IndicatorTreePanelLocal } from '@/components/Indicator/TreePanel'
import { postPointBuried } from '@/utils/common/bury'
import { NewTemplateO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { AddDataToSheetResponse } from 'gel-api'
import { t } from 'gel-util/intl'

const STRINGS = {
  FIND_INDICATOR: t('464148', '新增列')
}

interface FindIndicatorProps {
  onFinish: (sheetInfos: AddDataToSheetResponse['data']) => void // 如果要异步关闭弹窗需要修改成 promise
  sheetId: string
  tableId: string
  disabled?: boolean
}

export const FindIndicator: React.FC<FindIndicatorProps> = (props) => {
  const { onFinish, sheetId, tableId, disabled } = props || {}
  const [open, setOpen] = useState(false)

  const handleFindIndicator = () => {
    postPointBuried('922604570307')
    setOpen(true)
  }
  const handleFinish = (sheetInfos: AddDataToSheetResponse['data']) => {
    onFinish(sheetInfos)
    setOpen(false)
  }
  return (
    <div>
      {/* @ts-expect-error wind-icon */}
      <Button onClick={() => handleFindIndicator()} icon={<NewTemplateO />} disabled={disabled} type="text">
        {STRINGS.FIND_INDICATOR}
      </Button>
      <IndicatorTreePanelLocal
        open={open}
        close={() => setOpen(false)}
        onFinish={handleFinish}
        tableId={tableId}
        sheetId={Number(sheetId)}
      />
    </div>
  )
}
