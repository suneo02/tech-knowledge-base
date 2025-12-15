import { isDev } from '@/utils';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import conversationsReducer from './conversations';
import layoutReducer from './layout';
import { rpOutlineReducer } from './rpOutline';
import { AppDispatch, RootState } from './type';
import { userPackageReducer } from './user';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
  reducer: {
    userPackage: userPackageReducer,
    layout: layoutReducer,
    conversations: conversationsReducer,
    rpOutline: rpOutlineReducer,
  },
  devTools: isDev && {
    name: 'report-ai',
    trace: true,
  },
});

// Re-export user package actions and selectors
export { fetchPackageInfo, selectUserPackage, selectUserPackageError, selectUserPackageLoading } from './user';

// Re-export layout actions and selectors
export { selectSidebarCollapsed, setSidebarCollapsed, toggleSidebar } from './layout';

// Re-export conversations actions and selectors
export {
  addConversationItem,
  clearConversations,
  removeConversationById,
  selectConversationsItems,
  setConversationsItems,
  updateConversationTitle,
} from './conversations';
