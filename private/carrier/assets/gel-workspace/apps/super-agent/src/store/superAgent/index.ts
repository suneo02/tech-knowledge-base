import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestToWFC } from '@/api'
import { type RootState } from '@/store/type'
import type { GetTaskListRequest, TaskListItem } from 'gel-api'
import { getAreaNameByCode } from '@/utils/area'

// ---- Types ----

export type TaskStatus = '1' | '2'

// 仅在本地 store 中增强的视图模型类型
export interface TaskListItemWithAreaName extends TaskListItem {
  areaName: string
}

// 复用通用工具：根据地区 code 获取名称（见 src/utils/area.ts）

export interface SplAgentTaskState {
  items: TaskListItemWithAreaName[]
  total: number
  pageNum: number
  pageSize: number
  loading: boolean
  error: string | null
}

const initialState: SplAgentTaskState = {
  items: [],
  total: 0,
  pageNum: 1,
  pageSize: 20,
  loading: true,
  error: null,
}

export const fetchSplAgentTaskList = createAsyncThunk<
  { list: TaskListItem[]; total?: number; pageNum: number; pageSize: number },
  GetTaskListRequest,
  { rejectValue: string }
>('superAgent/fetchSplAgentTaskList', async (params, { rejectWithValue }) => {
  try {
    const res = await requestToWFC('superlist/excel/splAgentTaskList', params)
    const list = (res?.Data?.tasks ?? []) as TaskListItem[]
    const total = res?.Page?.Records
    return {
      list,
      total,
      pageNum: params.pageNum ?? 1,
      pageSize: params.pageSize ?? 20,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch task list'
    return rejectWithValue(message)
  }
})

const slice = createSlice({
  name: 'superAgent',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchSplAgentTaskList.pending, (state, action) => {
        state.loading = true
        state.error = null
        // 保存分页请求参数
        const arg = action.meta.arg
        if (arg?.pageNum) state.pageNum = arg.pageNum
        if (arg?.pageSize) state.pageSize = arg.pageSize
      })
      .addCase(fetchSplAgentTaskList.fulfilled, (state, action) => {
        state.loading = false
        const source = action.payload.list || []
        state.items = source.map((item) => ({
          ...item,
          areaName: getAreaNameByCode(item.areaCode),
        }))
        state.total = action.payload.total ?? state.items.length
        state.pageNum = action.payload.pageNum
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchSplAgentTaskList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch task list'
      }),
})

export default slice.reducer

// ---- Selectors ----

export const selectSplTasks = (state: RootState) => state.superAgentReducer.items
export const selectSplTasksLoading = (state: RootState) => state.superAgentReducer.loading
export const selectSplTasksTotal = (state: RootState) => state.superAgentReducer.total
