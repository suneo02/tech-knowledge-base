import { wftCommon } from '@/utils/utils'
import React, { useEffect } from 'react'
import { BindContactModal } from './UserInfoMenu/BindContactModal'
import { useUserInfoStore } from '../../store/userInfo'
import { BindContactForm } from './UserInfoMenu/BindContactModal/form/BindForm'
import { UpdateContactForm } from './UserInfoMenu/BindContactModal/form/UpdateForm'
import { getIfOverseaByUserInfo } from '../../utils/user/oversea'
import intl from '../../utils/intl'

/**
 *
 * @param {*} param0
 * @param {ActionModalType} param0.modalType
 * @returns
 */
const HeaderHasUserActionModal = ({ setActionModal, modalType }) => {
  const getUserInfo = useUserInfoStore((state) => state.getUserInfo)
  const userInfo = useUserInfoStore((state) => state.userInfo)
  const isOversea = useUserInfoStore((state) => getIfOverseaByUserInfo(state.userInfo))
  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    if (!userInfo) {
      return
    }

    // 终端中不绑定邮箱或者手机号
    if (!wftCommon.usedInClient()) {
      // 判断是否 web 端
      if (!isOversea /** 国内用户*/ && !userInfo.phone /**没有绑定手机号 */) {
        // 海外用户不判断是否有邮箱，历史遗留问题，后端没这个接口
        setActionModal('bindContact')
      }
    }
  }, [userInfo, isOversea])

  if (wftCommon.usedInClient()) {
    // 终端中返回 null 再加一层保底的，防止出事情
    return null
  }
  return (
    <BindContactModal
      title={isOversea ? intl('417574', '绑定邮箱') : intl('417575', '绑定手机号')}
      visible={modalType === 'updateContact' || modalType === 'bindContact'}
      onClose={() => setActionModal('')}
      data-uc-id="Xozi7NPd4O"
      data-uc-ct="bindcontactmodal"
    >
      {modalType === 'updateContact' ? (
        <UpdateContactForm
          onSuccess={() => setActionModal('')}
          isOversea={isOversea}
          data-uc-id="dg0t4rzPRe"
          data-uc-ct="updatecontactform"
        />
      ) : modalType === 'bindContact' ? (
        <BindContactForm
          onSuccess={() => setActionModal('')}
          isOversea={isOversea}
          data-uc-id="-47O4_4LNC"
          data-uc-ct="bindcontactform"
        />
      ) : null}
    </BindContactModal>
  )
}

// 添加默认导出以支持懒加载
export default HeaderHasUserActionModal
