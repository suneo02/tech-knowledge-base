import { request } from '@/api/request'
import { addSearchHistory, getSearchHistoryAndSlice } from '@/api/services/history'
import { SearchFormProps } from '@/components/searchForm/type'
import intl from '@/utils/intl'
import { COMPANY, GROUP, PEOPLE, RELATION } from './config'

export type SearchFormConfig = Pick<
  SearchFormProps,
  'type' | 'placeHolder' | 'historyAddTiming' | 'pageFlag' | 'onFetchHistory' | 'onAddHistoryItem' | 'onClearHistory'
>

export const searchFormConfigs = {
  [COMPANY]: {
    placeHolder: intl(0, '请输入企业名称、注册号或统一社会信用代码'),
    historyAddTiming: 'click',
    pageFlag: 'homeSearch',
    onFetchHistory: async () => {
      return await getSearchHistoryAndSlice('COMPANY_SEARCH')
    },
    onAddHistoryItem: async (name: any, value?: any) => {
      await addSearchHistory('COMPANY_SEARCH', { name, value })
    },
    onClearHistory: async () => {
      await request('operation/delete/searchhistorydeleteall', {
        params: {
          type: 'COMPANY_SEARCH',
        },
      })
    },
  },
  [PEOPLE]: {
    placeHolder: intl('271662', '请输入法定代表人、股东或高管的完整姓名'),
    historyAddTiming: 'click',
    pageFlag: 'homeSearch',
    onFetchHistory: async () => {
      return await getSearchHistoryAndSlice('PEOPLE_SEARCH')
    },
    onAddHistoryItem: async (name: any, value?: any) => {
      await addSearchHistory('PEOPLE_SEARCH', { name, value })
    },
    onClearHistory: async () => {
      await request('operation/delete/searchhistorydeleteall', {
        params: {
          type: 'PEOPLE_SEARCH',
        },
      })
    },
  },
  [GROUP]: {
    placeHolder: intl('437323', '请输入集团系、公司、人名、品牌等关键词'),
  },
  [RELATION]: {
    type: 'multi',
    historyAddTiming: 'click',
    placeHolder: intl('315909', '请输入公司名称'),
    onFetchHistory: async () => {
      return await getSearchHistoryAndSlice('RELATION_SEARCH')
    },
    onAddHistoryItem: async (name: any, value?: any) => {
      await addSearchHistory('RELATION_SEARCH', { name, value })
    },
    onClearHistory: async () => {
      await request('operation/delete/searchhistorydeleteall', {
        params: {
          type: 'RELATION_SEARCH',
        },
      })
    },
  },
} as const
