import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AIChatHistory } from 'gel-api';

export interface ConversationsState {
  items: AIChatHistory[];
}

const initialState: ConversationsState = {
  items: [],
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversationsItems: (state, action: PayloadAction<AIChatHistory[]>) => {
      state.items = action.payload;
    },
    addConversationItem: (
      state,
      action: PayloadAction<
        Partial<AIChatHistory> &
          Pick<AIChatHistory, 'groupId'> & {
            questions?: string;
            updateTime?: string;
            questionsNum?: number;
          }
      >
    ) => {
      const minimal: AIChatHistory = {
        // required by type but not used by list UI; fill with safe defaults
        id: action.payload.groupId,
        userId: '',
        index: 0,
        isDelete: false,
        collectTime: '',
        answers: '',
        title: action.payload.questions || '',
        // provided / optional fields
        groupId: action.payload.groupId,
        questions: action.payload.questions,
        updateTime: action.payload.updateTime,
        questionsNum: action.payload.questionsNum ?? 1,
      };
      state.items = [minimal, ...state.items];
    },
    removeConversationById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((c) => c.groupId !== id);
    },
    updateConversationTitle: (state, action: PayloadAction<{ groupId: string; title: string }>) => {
      const { groupId, title } = action.payload;
      const target = state.items.find((c) => c.groupId === groupId);
      if (target) target.questions = title;
    },
    clearConversations: (state) => {
      state.items = [];
    },
  },
});

export const {
  setConversationsItems,
  addConversationItem,
  removeConversationById,
  updateConversationTitle,
  clearConversations,
} = conversationsSlice.actions;

// Selectors
export const selectConversationsItems = (state: { conversations: ConversationsState }) => state.conversations.items;

export default conversationsSlice.reducer;
