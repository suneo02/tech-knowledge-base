import { message } from '@wind/wind-ui'
import { FormInstance } from '@wind/wind-ui-form'
import React, { useCallback, useRef, useState } from 'react'
import * as globalActions from '../../../actions/global'
import { myWfcAjax } from '../../../api/companyApi'
import { pointBuriedGel } from '../../../api/configApi'
import { apiCustomShareholderPenetrationReport } from '../../../api/corp/report'
import { getVipInfo } from '../../../lib/utils'
import store from '../../../store/store'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import { CallHelpForm, CallHelpFormField } from '../../misc/callHelpForm'

interface IUserInfo {
  tel: string
  email: string
}

interface IContactManagerProps {
  moduleId?: string // 埋点ID
  moduleName?: string // 埋点名称
  moduleType?: string // 埋点类型
}

interface IModalFormProps {
  userInfo: IUserInfo | null
  onFormChange: (form: FormInstance<CallHelpFormField>) => void
}

// 表单组件
const ModalForm: React.FC<IModalFormProps> = React.memo(({ userInfo, onFormChange }) => {
  const formRef = useRef<FormInstance<CallHelpFormField> | null>(null)

  return (
    <CallHelpForm
      initialValues={{
        phone: userInfo?.tel || '',
        email: userInfo?.email || '',
      }}
      onFormInstanceChange={(form) => {
        formRef.current = form
        onFormChange(form)
      }}
    />
  )
})

/**
 * 联系客户经理Hook
 */
export const useContactManager = ({
  moduleId = '922602100653',
  moduleName = '股东深度穿透报告-联系客户经理',
  moduleType = 'reportEx',
}: IContactManagerProps = {}) => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
  const [callHelpForm, setCallHelpForm] = useState<FormInstance<CallHelpFormField> | null>(null)
  const formRef = useRef<FormInstance<CallHelpFormField> | null>(null)
  const isLoadingRef = useRef(false)

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    if (isLoadingRef.current) {
      return null
    }

    try {
      isLoadingRef.current = true
      const res = await myWfcAjax('apigetuserdetailinfo', {})
      if (!res || res.ErrorCode != 0 || !res.Data) {
        return null
      }
      const userInfoData = JSON.parse(decodeURIComponent(window.atob(res.Data)))
      return {
        tel: userInfoData.UserMP || '',
        email: userInfoData.UserEmail || '',
      }
    } catch (e) {
      console.error(e)
      return null
    } finally {
      isLoadingRef.current = false
    }
  }, [])

  // 显示帮助弹窗
  const showHelpPopup = useCallback(
    (info: IUserInfo) => {
      store.dispatch(
        globalActions.setGolbalModal({
          className: '',
          width: 420,
          height: 280,
          visible: true,
          onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
          onOk: async () => {
            try {
              const form = formRef.current || callHelpForm
              if (!form) {
                return
              }

              await form.validateFields()
              const values = form.getFieldsValue()

              if (!values.phone || !values.email) {
                message.error(intl('', '请填写完整的联系方式'))
                return
              }

              const res = await apiCustomShareholderPenetrationReport(values)
              if (res && Number(res.ErrorCode) == 0) {
                if (res.Data) {
                  message.success(intl('', '您的购买信息已成功提交，客户经理将在三个工作日内与您联系'))
                  store.dispatch(globalActions.clearGolbalModal())
                } else {
                  message.info(intl('', '信息提交失败，请稍候重试！'))
                }
              }
            } catch (e) {
              console.error(e)
              message.error(intl('', '提交失败，请检查输入内容'))
            }
          },
          title: intl('234937', '联系客户经理'),
          content: (
            <ModalForm
              userInfo={info}
              onFormChange={(form) => {
                formRef.current = form
                setCallHelpForm(form)
              }}
            />
          ),
          okText: window.en_access_config ? 'OK' : '确定',
          cancelText: window.en_access_config ? 'Cancel' : '取消',
        })
      )
    },
    [callHelpForm]
  )

  // 联系客户经理主函数
  const handleContactManagerRaw = useCallback(async () => {
    try {
      // 如果已经有用户信息，直接使用
      if (userInfo) {
        showHelpPopup(userInfo)
        return
      }

      // 第一次点击时获取用户信息
      const info = await fetchUserInfo()
      if (!info) {
        message.error(intl('378222', '获取用户信息失败，请稍后重试'))
        return
      }

      // 更新状态并显示弹窗
      setUserInfo(info)
      showHelpPopup(info)
    } catch (e) {
      console.error(e)
      message.error(intl('378223', '系统错误，请稍后重试'))
    }
  }, [moduleId, moduleName, moduleType, userInfo, fetchUserInfo, showHelpPopup])

  // 联系客户经理主函数
  const handleContactManager = useCallback(async () => {
    pointBuriedGel(moduleId, moduleName, moduleType)
    const userVipInfo = getVipInfo()
    if (!userVipInfo.isSvip && !userVipInfo.isSvip && wftCommon.is_overseas_config) {
      message.info(intl('245503', '该功能暂未开放'))
      return
    }
    return handleContactManagerRaw()
  }, [moduleId, moduleName, moduleType, userInfo, fetchUserInfo, showHelpPopup])

  return { handleContactManager, handleContactManagerRaw }
}
