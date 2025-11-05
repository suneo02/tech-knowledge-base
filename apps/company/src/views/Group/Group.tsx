/**
 * page 集团系
 * Created by Calvin
 *
 * @format
 */

import { TreeModuleName } from '@/store/group'
import React, { useEffect } from 'react'
import { useUserInfoStore } from '../../store/userInfo'
import { VipPopupModal } from '../../lib/globalModal'
import { Skeleton } from '@wind/wind-ui'
import { useGroupStore } from '../../store/group'
import { usePageTitle } from '../../handle/siteTitle'
import LayoutNavAndScrollContent from '@/components/layout/LayoutNavAndScrollContent.tsx'

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

  // @ts-expect-error ttt
  useEffect(async () => {
    getUserInfo()
  }, [])

  return initPage()
}

export default Group
