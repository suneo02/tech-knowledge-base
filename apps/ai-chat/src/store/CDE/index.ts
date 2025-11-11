import { requestToWFCSecure } from '@/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CDEFormConfigItem, filterCDECfg } from 'cde'
import { CDEFilterCategory, isCDEFilterCategories } from 'gel-api'
import { RootState } from '../type'

interface CDEState {
  filterCategories?: CDEFilterCategory[]
  filterCategoriesFlatMap?: CDEFormConfigItem[]
  loading: boolean
  error: string | null
  hasLoaded: boolean
}

const initialState: CDEState = {
  loading: false,
  error: null,
  hasLoaded: false,
}

const CDE_FILTER_CATEGORIES_CACHE_KEY = 'cdeFilterCategories'

/**
 * CDE 的配置全局只保留一份，因此在 redux 中获取并且存储
 */
export const fetchFilterCategories = createAsyncThunk(
  'cde/fetchFilterCategories',
  async (_, { getState }) => {
    const state = getState() as RootState
    // 1. Try to get data from sessionStorage first
    const cachedData = sessionStorage.getItem(CDE_FILTER_CATEGORIES_CACHE_KEY)

    if (cachedData) {
      const cachedCategories = JSON.parse(cachedData) as CDEFilterCategory[]
      if (state.cde.filterCategoriesFlatMap) {
        state.cde.filterCategoriesFlatMap = cachedCategories.flatMap(
          (item) => item.newFilterItemList as CDEFormConfigItem[]
        )
      }
      return cachedCategories
    }

    // 2. Check if we already have the data in Redux state (in-memory cache)

    if (state.cde.filterCategories && state.cde.filterCategoriesFlatMap && state.cde.hasLoaded) {
      return state.cde.filterCategories
    }

    // 3. If no data in cache or state, make the API call
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
      const filteredCategories = filterCDECfg(response?.Data)
      if (state.cde.filterCategoriesFlatMap) {
        state.cde.filterCategoriesFlatMap = filteredCategories.flatMap(
          (item) => item.newFilterItemList as CDEFormConfigItem[]
        )
      }
      return filteredCategories
    }

    return []
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState
      // Prevent fetching if already loading or if data has been loaded (and is now cached)
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
        state.filterCategoriesFlatMap = action.payload.flatMap((item) => item.newFilterItemList as CDEFormConfigItem[])
        state.hasLoaded = true
        // Cache the result in sessionStorage
        try {
          sessionStorage.setItem(CDE_FILTER_CATEGORIES_CACHE_KEY, JSON.stringify(action.payload))
        } catch (e) {
          console.error('Failed to cache CDE filter categories:', e)
        }
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
export const selectFilterCategoriesFlatMap = (state: RootState) => state.cde.filterCategoriesFlatMap

export default cdeSlice.reducer
