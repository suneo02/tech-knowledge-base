import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './type'

interface TranslationState {
  loadingCount: number
}

const initialState: TranslationState = {
  loadingCount: 0,
}

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    incrementTranslateTask: (state) => {
      state.loadingCount += 1
    },
    decrementTranslateTask: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1)
    },
  },
})

export const { incrementTranslateTask, decrementTranslateTask } = translationSlice.actions

export const selectIsTranslating = (state: RootState) => state.translation.loadingCount > 0

export default translationSlice.reducer
