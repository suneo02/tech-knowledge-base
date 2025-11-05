import { requestToWFCSecure } from '@/api'
import { RootState } from '@/store/type.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserPackageInfo } from 'gel-types'

export interface UserPackageState {
  /** 用户套餐信息 */
  packageInfo: UserPackageInfo | null
  /** 加载状态 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
}

const initialState: UserPackageState = {
  packageInfo: null,
  isLoading: false,
  error: null,
}

export const fetchPackageInfo = createAsyncThunk('userPackage/fetchPackageInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await requestToWFCSecure()
    return response.Data as UserPackageInfo
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '获取套餐信息失败')
  }
})

const userPackageSlice = createSlice({
  name: 'userPackage',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchPackageInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPackageInfo.fulfilled, (state, action) => {
        state.packageInfo = action.payload
        state.isLoading = false
      })
      .addCase(fetchPackageInfo.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      }),
})

// Selectors
export const selectUserPackage = (state: RootState) => state.userPackage.packageInfo
export const selectUserPackageLoading = (state: RootState) => state.userPackage.isLoading
export const selectUserPackageError = (state: RootState) => state.userPackage.error

export default userPackageSlice.reducer
