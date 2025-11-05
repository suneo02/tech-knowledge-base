import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { requestToSuperlistFcs, createWFCSuperlistRequestFcs } from '@/api'
import { PointsState, ConsumePointsPayload } from './type'
import { RootState } from '../type'

// 重新添加 fetchPoints 定义
export const fetchPoints = createAsyncThunk('points/fetchPoints', async (_, { rejectWithValue }) => {
  try {
    const { Data } = await requestToSuperlistFcs('points/getUserPointsInfo', {})
    return Data?.pointTotal ?? 0
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch points'
    console.error('Failed to fetch user points:', error)
    return rejectWithValue(message)
  }
})

// API 函数实例
const addDataToSheetApi = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

// 异步 Thunk: 消耗积分
export const consumePoints = createAsyncThunk(
  'points/consumePoints',
  async (payload: ConsumePointsPayload, { dispatch, rejectWithValue }) => {
    try {
      const requestPayload = {
        ...payload,
        enablePointConsumption: 1,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (addDataToSheetApi as any)(requestPayload)
      await dispatch(fetchPoints())
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to consume points / add data to sheet'
      console.error('Failed to consume points / add data to sheet:', error)
      return rejectWithValue(message)
    }
  }
)

const initialState: PointsState = {
  count: 0,
  loading: false,
  error: null,
}

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPoints.fulfilled, (state, action: PayloadAction<number>) => {
        state.count = action.payload
        state.loading = false
      })
      .addCase(fetchPoints.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(consumePoints.pending, (state) => {
        state.error = null
      })
      .addCase(consumePoints.fulfilled, (/* state */) => {})
      .addCase(consumePoints.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

// 重新添加 Selectors 和默认导出
export const selectPointsCount = (state: RootState) => state.points.count
export const selectPointsLoading = (state: RootState) => state.points.loading
export const selectPointsError = (state: RootState) => state.points.error

export default pointsSlice.reducer
