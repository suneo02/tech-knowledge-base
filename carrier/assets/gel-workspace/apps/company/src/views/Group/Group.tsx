/**
 * page 集团系
 * Created by Calvin
 *
 * @format
 */

import LayoutNavAndScrollContent from '@/components/layout/LayoutNavAndScrollContent.tsx'
import { TreeModuleName } from '@/store/group'
import { Skeleton } from '@wind/wind-ui'
import React, { useEffect } from 'react'
import { usePageTitle } from '../../handle/siteTitle'
import { VipPopupModal } from '../../lib/globalModal'
import { useGroupStore } from '../../store/group'
import { useUserInfoStore } from '../../store/userInfo'

const Group = () => {
  const { basicInfo } = useGroupStore()
  usePageTitle('GroupDetail', basicInfo?.groupSystemName)
  const { userInfo, getUserInfo } = useUserInfoStore()
  const initPage = () => {
    switch (userInfo.vipStatus) {
      case 1:
        return <VipPopupModal show disabled></VipPopupModal>
      case 2:
        return <LayoutNavAndScrollContent moduleName={TreeModuleName.Group}></LayoutNavAndScrollContent>
      case 3:
        return <LayoutNavAndScrollContent moduleName={TreeModuleName.Group}></LayoutNavAndScrollContent>
      default:
        return (
          <div style={{ position: 'absolute', inset: 0 }}>
            <Skeleton animation></Skeleton>
          </div>
        )
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return initPage()
}

export default Group
