import { requestToWFCSecure } from '@/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { filterCDECfg } from 'cde'
import { CDEFilterCategory, isCDEFilterCategories } from 'gel-api'
import { RootState } from '../type'

interface CDEState {
  filterCategories?: CDEFilterCategory[]
  loading: boolean
  error: string | null
  hasLoaded: boolean
}

const initialState: CDEState = {
  loading: false,
  error: null,
  hasLoaded: false,
}

/**
 * CDE 的配置全局只保留一份，因此在 redux 中获取并且存储
 */
export const fetchFilterCategories = createAsyncThunk(
  'cde/fetchFilterCategories',
  async (_, { getState }) => {
    try {
      // Check if we already have the data
      const state = getState() as RootState
      if (state.cde.filterCategories && state.cde.hasLoaded) {
        // If data exists and has been loaded before, return it directly without making API call
        return state.cde.filterCategories
      }

      // If no data, make the API call
      const response = await requestToWFCSecure(
        {
          cmd: 'getcrossfilterquery',
        },
        {
          cmdType: 'filterItem',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (isCDEFilterCategories(response?.Data)) {
        return filterCDECfg(response?.Data)
      } else {
        return []
      }
    } catch (e) {
      console.error(e)
    }
  },
  {
    // Only allow one pending request at a time
    condition: (_, { getState }) => {
      const state = getState() as RootState
      return !state.cde.loading
    },
  }
)

const cdeSlice = createSlice({
  name: 'cde',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFilterCategories.fulfilled, (state, action) => {
        state.loading = false
        state.filterCategories = action.payload
        state.hasLoaded = true
      })
      .addCase(fetchFilterCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch filter categories'
      })
  },
})

// Selectors
export const selectFilterCategories = (state: RootState) => state.cde.filterCategories
export const selectFilterCategoriesLoading = (state: RootState) => state.cde.loading
export const selectFilterCategoriesError = (state: RootState) => state.cde.error
export const selectHasLoaded = (state: RootState) => state.cde.hasLoaded

export default cdeSlice.reducer
