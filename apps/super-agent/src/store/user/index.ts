import { requestToWFCSecure } from '@/api'
import { type RootState } from '@/store/type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { type UserPackageInfo } from 'gel-types'
import { t } from 'gel-util/intl'
import { getIfOverseaByUserInfo } from 'gel-util/user'

// --- Enums and Types ---

/**
 * VIP 状态枚举
 * 1: 普通用户, 2: VIP, 3: SVIP
 */
export const VipStatusEnum = {
  NORMAL: 1,
  VIP: 2,
  SVIP: 3,
} as const

export type VipStatusEnum = (typeof VipStatusEnum)[keyof typeof VipStatusEnum]

// User slice 的状态结构
export interface UserState {
  /** 用户信息 */
  userInfo: UserPackageInfo | null
  /** VIP 状态 */
  vipStatus: VipStatusEnum
  /** 用户信息是否已加载 */
  isUserInfoFetched: boolean
  /** 加载状态 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
}

// --- Initial State ---

const initialState: UserState = {
  userInfo: null,
  vipStatus: VipStatusEnum.NORMAL,
  isUserInfoFetched: false,
  isLoading: false,
  error: null,
}

// --- Helper Functions ---

/**
 * 根据套餐名称确定VIP状态
 * @param packageName - 套餐名称
 * @returns VIP 状态
 */
const determineVipStatus = (packageName?: UserPackageInfo['packageName']): VipStatusEnum => {
  switch (packageName) {
    case 'EQ_APL_GEL_FORTRAIL':
    case 'EQ_APL_GEL_FORSTAFF':
    case 'EQ_APL_GEL_SVIP':
      return VipStatusEnum.SVIP
    case 'EQ_APL_GEL_VIP':
      return VipStatusEnum.VIP
    case 'EQ_APL_GEL_BS':
    default:
      return VipStatusEnum.NORMAL
  }
}

// --- Async Thunks ---

export const fetchUserInfo = createAsyncThunk<UserPackageInfo, void, { rejectValue: string }>(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestToWFCSecure({
        cmd: 'getuserpackageinfo',
      })
      return (response as { Data: UserPackageInfo }).Data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'user error'
      return rejectWithValue(errorMessage)
    }
  }
)

// --- Slice Definition ---

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 可以添加一些同步的 reducer，如果需要的话
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload
        state.vipStatus = determineVipStatus(action.payload.packageName)
        state.isLoading = false
        state.isUserInfoFetched = true
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.error = action.payload ?? t('398771', '获取用户信息失败')
        state.isLoading = false
        state.isUserInfoFetched = true // 即使失败也标记为已获取，避免重复请求
      }),
})

// --- Selectors ---

export const selectUserInfo = (state: RootState) => state.user.userInfo
export const selectVipStatus = (state: RootState) => state.user.vipStatus
export const selectIsUserVip = (state: RootState) => state.user.vipStatus === VipStatusEnum.VIP
export const selectIsUserSVip = (state: RootState) => state.user.vipStatus === VipStatusEnum.SVIP
export const selectUserInfoFetched = (state: RootState) => state.user.isUserInfoFetched
export const selectUserLoading = (state: RootState) => state.user.isLoading
export const selectUserError = (state: RootState) => state.user.error

export const isOverseas = (state: RootState) => getIfOverseaByUserInfo(state.user.userInfo)

// --- Export Reducer ---

export default userSlice.reducer
