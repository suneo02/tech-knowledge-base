import { useCDEModal } from '@/components/CDE/component/Search'
import { CDEModalOptions } from '@/components/CDE/component/Search/CDEModal'
import { Button } from '@wind/wind-ui'
import { CDEFormBizValues } from 'cde'
import { AddDataToSheetResponse } from 'gel-api'
import { t } from 'gel-util/intl'

const STRINGS = {
  FIND_COMPANY: t('425485', '找企业')
}

interface FindCompanyProps {
  filters?: CDEFormBizValues[]
  onFinish: (sheetInfos: AddDataToSheetResponse['data']) => void // 如果要异步关闭弹窗需要修改成 promise
  sheetId: string
  tableId: string
  disabled?: boolean
}

export const FindCompany: React.FC<FindCompanyProps> = (props) => {
  const { filters, onFinish, sheetId, tableId, disabled } = props || {}
  const [CDEModal, contextHolder] = useCDEModal()
  const handleFindCompany = () => {
    const options: CDEModalOptions = {
      tableId,
      sheetId,
      onOk: (sheetInfos) => {
        onFinish(sheetInfos as AddDataToSheetResponse['data'])
        CDEModal.hide()
      },
    }
    if (filters) {
      options.initialValues = filters
    }
    CDEModal.show(options)
  }
  return (
    <div>
      <Button onClick={() => handleFindCompany()} disabled={disabled}>
        {STRINGS.FIND_COMPANY}
      </Button>
      {contextHolder}
    </div>
  )
}
