import { requestToSuperlistFcs } from '@/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IndicatorTreeClassification } from 'gel-api'
import { filterIndicatorTree } from 'indicator'
import { filterIndicatorsByDisplayName } from '@/utils/indicatorUtils'
import { RootState } from '../type'

interface IndicatorState {
  indicatorTree?: IndicatorTreeClassification[]
  loading: boolean
  error: string | null
  hasLoaded: boolean
}

const initialState: IndicatorState = {
  loading: false,
  error: null,
  hasLoaded: false,
}

/**
 * Indicator Tree 的配置全局只保留一份，因此在 redux 中获取并且存储
 */
export const fetchIndicatorTree = createAsyncThunk(
  'indicator/fetchIndicatorTree',
  async (_, { getState }) => {
    try {
      // Check if we already have the data
      const state = getState() as RootState
      if (state.indicator.indicatorTree && state.indicator.hasLoaded) {
        // If data exists and has been loaded before, return it directly without making API call
        return state.indicator.indicatorTree
      }

      // If no data, make the API call
      const response = await requestToSuperlistFcs('indicator/treeV2', { version: 2 })
      if (response?.Data?.data?.classifications) {
        return response?.Data?.data?.classifications
      } else {
        return []
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  {
    // Only allow one pending request at a time
    condition: (_, { getState }) => {
      const state = getState() as RootState
      return !state.indicator.loading
    },
  }
)

const indicatorSlice = createSlice({
  name: 'indicator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndicatorTree.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIndicatorTree.fulfilled, (state, action) => {
        state.loading = false

        let processedTree = action.payload

        processedTree = filterIndicatorTree(processedTree)

        const displayNamesToExclude = ['企业名称'] // 需要排除的 displayName 列表
        processedTree = filterIndicatorsByDisplayName(processedTree, displayNamesToExclude)

        state.indicatorTree = processedTree
        state.hasLoaded = true
      })
      .addCase(fetchIndicatorTree.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch indicator tree'
      })
  },
})

// Selectors
export const selectIndicatorTree = (state: RootState) => state.indicator.indicatorTree
export const selectIndicatorTreeLoading = (state: RootState) => state.indicator.loading
export const selectIndicatorTreeError = (state: RootState) => state.indicator.error
export const selectHasLoaded = (state: RootState) => state.indicator.hasLoaded

export default indicatorSlice.reducer
