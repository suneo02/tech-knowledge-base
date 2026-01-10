import { create } from 'zustand'
import { getServerApi } from '../api/serverApi'
import store from './store'

type UserPackageNameType =
  | 'EQ_APL_GEL_FORTRAIL' // 试用 SVIP
  | 'EQ_APL_GEL_FORSTAFF' // 员工
  | 'EQ_APL_GEL_SVIP' // SVIP
  | 'EQ_APL_GEL_VIP' // VIP
  | 'EQ_APL_GEL_BS' // 终端 非Vip 非SVIP账号

enum VipStatusEnum {
  NORMAL = 1,
  VIP = 2,
  SVIP = 3,
}

interface UserInfo {
  accountName?: string
  email?: string
  expireDate?: string
  hasCompGeAcc?: boolean
  isAgree?: boolean
  isBuy?: boolean
  isForeign?: boolean
  isSafe?: boolean
  isTrailed?: boolean
  packageName?: UserPackageNameType
  vipStatus?: VipStatusEnum
  isActivityUser?: boolean
}

interface ActivityDetail {
  id: number
  // 添加其他活动详情字段
}

interface ActivityInfo {
  activityDetail?: ActivityDetail
  // 添加其他活动信息字段
}

interface UserInfoState {
  userInfo: UserInfo
  activityInfos: ActivityInfo[]
  isActivityUser: boolean
  isEmployee: boolean
  getUserInfo: () => Promise<void>
  getActivityInfos: () => Promise<void>
  setIsActivityUser: (isActivityUser: boolean) => void
}

interface GlobalStore {
  home?: {
    userPackageinfo?: UserInfo
  }
}
/**
 * @deprecated 使用 redux
 */
export const useUserInfoStore = create<UserInfoState>((set, get) => ({
  userInfo: {},
  activityInfos: [],
  isActivityUser: false,
  isEmployee: false,
  getUserInfo: async () => {
    const globalStore = (await store.getState()) as GlobalStore
    let userInfo: UserInfo = {}
    if (globalStore?.home && globalStore.home?.userPackageinfo) {
      userInfo = globalStore.home.userPackageinfo
    } else {
      const { Data } = await getServerApi({
        api: 'getuserpackageinfo',
        matchOldData: true,
      })
      userInfo = { ...Data }
    }

    switch (userInfo.packageName) {
      case 'EQ_APL_GEL_FORTRAIL':
        userInfo.vipStatus = 3
        break
      case 'EQ_APL_GEL_FORSTAFF':
        userInfo.vipStatus = 3
        break
      case 'EQ_APL_GEL_SVIP':
        userInfo.vipStatus = 3
        break
      case 'EQ_APL_GEL_VIP':
        userInfo.vipStatus = 2
        break
      case 'EQ_APL_GEL_BS':
        userInfo.vipStatus = 1
        break
      default:
        userInfo.vipStatus = 1
        break
    }
    // 活动用户
    userInfo.isActivityUser = true
    set({ userInfo })
  },
  getActivityInfos: async () => {
    try {
      const { Data } = await getServerApi({
        api: '/operation/get/getactivityinfo',
        noExtra: true,
      })
      set({ activityInfos: Data })

      const setIsActivityUser = get().setIsActivityUser
      setIsActivityUser(Data?.some((i: ActivityInfo) => i?.activityDetail?.id === 1))
    } catch (error) {
      console.log('🚀 ~ getActivityInfos: ~ error:', error)
    }
  },
  setIsActivityUser: (isActivityUser: boolean) => {
    set({ isActivityUser })
  },
}))
