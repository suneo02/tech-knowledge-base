import { message, Modal } from '@wind/wind-ui'
import intl from '@/utils/intl'
import CheckboxGroup from '@wind/wind-ui/lib/checkbox/Group'
import React, { useEffect, useState, useImperativeHandle } from 'react'
import { getcustomercountgroupnew, addtomycustomer } from '@/api/companyDynamic'

interface OptionItem {
  groupId: string
  num: number
  name: string
}

export const SearchResultCollectModal = React.forwardRef<
  {
    open: (companyCode: string) => void
    onCollectSuccess?: () => void
  },
  { onCollectSuccess?: (res?: string) => void }
>((props, ref) => {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<OptionItem[]>([])
  const [checkboxValue, setCheckboxValue] = useState<string[]>([])
  const [currentCompanyCode, setCurrentCompanyCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getCollectList = async () => {
    try {
      const { Data } = await getcustomercountgroupnew()
      setOptions(Data.filter((item) => item.group_id !== 'all').map((res) => ({ label: res.name, value: res.groupId })))
    } catch (error) {
      message.error(intl('272001', '获取收藏分组失败'))
    }
  }

  const addCollect = async (groupIds: string) => {
    if (currentCompanyCode) {
      try {
        setLoading(true)
        const { ErrorCode, ErrorMessage } = await addtomycustomer({
          groupIdArray: groupIds,
          CompanyCode: currentCompanyCode,
        }).finally(() => setLoading(false))
        if (ErrorCode === '0') {
          message.success(intl('283661', '收藏成功，可至“我的收藏”查看！'))
          if (props.onCollectSuccess) {
            props.onCollectSuccess(currentCompanyCode)
          }
          setVisible(false)
        } else {
          message.error(ErrorMessage)
        }
      } catch (error) {
        message.error(intl('283662', '收藏失败！'))
      }
    }
  }

  const open = (companyCode: string) => {
    if (!companyCode) return
    setCheckboxValue([])
    setCurrentCompanyCode(companyCode)
    setVisible(true)
  }

  const ok = () => {
    addCollect(checkboxValue.join())
  }

  const close = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (visible && options.length === 0) getCollectList()
  }, [visible, options])

  useImperativeHandle(ref, () => ({
    open,
    onCollectSuccess: props.onCollectSuccess,
  }))

  return (
    <Modal
      title={intl('437320', '选择分组')}
      visible={visible}
      onOk={ok}
      width="400px"
      onCancel={close}
      loading={loading}
      data-uc-id="KASx0ehmvw"
      data-uc-ct="modal"
    >
      <div className="warn-layer-msg">
        <div style={{ marginBlockEnd: 12 }}>{intl('437299', '将所选企业收藏至')}</div>

        <CheckboxGroup
          value={checkboxValue}
          options={options}
          onChange={setCheckboxValue}
          data-uc-id="YTIF-9m0FG"
          data-uc-ct="checkboxgroup"
        />
      </div>
    </Modal>
  )
})

SearchResultCollectModal.displayName = 'SearchResultCollectModal'

export default SearchResultCollectModal
