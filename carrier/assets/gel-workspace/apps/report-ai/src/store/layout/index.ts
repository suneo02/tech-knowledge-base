import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LayoutState {
  sidebarCollapsed: boolean;
}

const initialState: LayoutState = {
  sidebarCollapsed: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setSidebarCollapsed, toggleSidebar } = layoutSlice.actions;

// Selectors
export const selectSidebarCollapsed = (state: { layout: LayoutState }) => state.layout.sidebarCollapsed;

export default layoutSlice.reducer;
