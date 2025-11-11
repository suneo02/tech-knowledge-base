import { request } from '@/api/request'
import { addSearchHistory, getSearchHistoryAndSlice, deleteSearchHistoryItem } from '@/api/services/history'
import { SearchFormProps } from '@/components/searchForm/type'

import { COMPANY, GROUP, PEOPLE, RELATION } from './config'
import { t } from 'gel-util/intl'
import {
  getGroupRecentViewList,
  addGroupRecentViewItem,
  clearAllGroupRecentView,
  deleteGroupRecentViewItem,
} from '@/api/services/groupRecentView'
import {
  getCompanyRecentViewList,
  addCompanyRecentViewItem,
  clearAllCompanyRecentView,
  deleteCompanyRecentViewItem,
} from '@/api/services/companyRecentView'
import {
  getPersonRecentViewList,
  addPersonRecentViewItem,
  clearAllPersonRecentView,
  deletePersonRecentViewItem,
} from '@/api/services/personRecentView'
import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'

export type SearchFormConfig = Pick<
  SearchFormProps,
  | 'type'
  | 'placeHolder'
  | 'historyAddTiming'
  | 'pageFlag'
  | 'onFetchHistory'
  | 'onAddHistoryItem'
  | 'onClearHistory'
  | 'onDeleteHistoryItem'
  | 'onFetchRecentView'
  | 'onAddRecentViewItem'
  | 'onClearRecentView'
  | 'onDeleteRecentViewItem'
  | 'onRecentViewItemClick'
  | 'withLogo'
>

export const searchFormConfigs = {
  [COMPANY]: {
    placeHolder: t('455517', '请输入企业名称、注册号或统一社会信用代码'),
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
    onDeleteHistoryItem: async (searchKey: string) => {
      await deleteSearchHistoryItem('COMPANY_SEARCH', searchKey)
    },
    onFetchRecentView: async () => {
      return await getCompanyRecentViewList()
    },
    onAddRecentViewItem: async (entityId: string) => {
      await addCompanyRecentViewItem(entityId)
    },
    onClearRecentView: async () => {
      await clearAllCompanyRecentView()
    },
    onDeleteRecentViewItem: async (entityId: string) => {
      await deleteCompanyRecentViewItem(entityId)
    },
    onRecentViewItemClick: (item) => {
      // 企业最近浏览点击跳转逻辑
      handleJumpTerminalCompatibleAndCheckPermission(
        getUrlByLinkModule(LinksModule.COMPANY, {
          id: item.entityId,
        })
      )
    },
    withLogo: true,
  },
  [PEOPLE]: {
    placeHolder: t('437322', '请输入法定代表人、股东或高管的完整姓名'),
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
    onDeleteHistoryItem: async (searchKey: string) => {
      await deleteSearchHistoryItem('PEOPLE_SEARCH', searchKey)
    },
    onFetchRecentView: async () => {
      return await getPersonRecentViewList()
    },
    onAddRecentViewItem: async (entityId: string, parameter?: string) => {
      await addPersonRecentViewItem({ entityId, parameter })
    },
    onClearRecentView: async () => {
      await clearAllPersonRecentView()
    },
    onDeleteRecentViewItem: async (entityId: string, parameter?: string) => {
      await deletePersonRecentViewItem(entityId, parameter)
    },
    onRecentViewItemClick: (item) => {
      // 人物最近浏览点击跳转逻辑
      handleJumpTerminalCompatibleAndCheckPermission(
        getUrlByLinkModule(LinksModule.CHARACTER, {
          id: item.entityId,
        })
      )
    },
  },
  [GROUP]: {
    placeHolder: t('437323', '请输入集团系、公司、人名、品牌等关键词'),
    historyAddTiming: 'click',
    pageFlag: 'homeSearch',
    onFetchHistory: async () => {
      return await getSearchHistoryAndSlice('GROUP_SEARCH')
    },
    onAddHistoryItem: async (name: any, value?: any) => {
      await addSearchHistory('GROUP_SEARCH', { name, value })
    },
    onClearHistory: async () => {
      await request('operation/delete/searchhistorydeleteall', {
        params: {
          type: 'GROUP_SEARCH',
        },
      })
    },
    onDeleteHistoryItem: async (searchKey: string) => {
      await deleteSearchHistoryItem('GROUP_SEARCH', searchKey)
    },
    onFetchRecentView: async () => {
      return await getGroupRecentViewList()
    },
    onAddRecentViewItem: async (entityId: string, entityName: string) => {
      await addGroupRecentViewItem(entityId, entityName)
    },
    onClearRecentView: async () => {
      await clearAllGroupRecentView()
    },
    onDeleteRecentViewItem: async (entityId: string) => {
      await deleteGroupRecentViewItem(entityId)
    },
    onRecentViewItemClick: (item) => {
      // 最近浏览点击跳转逻辑
      handleJumpTerminalCompatibleAndCheckPermission(
        getUrlByLinkModule(LinksModule.GROUP, {
          id: item.entityId,
        })
      )
    },
  },
  [RELATION]: {
    type: 'multi',
    historyAddTiming: 'click',
    placeHolder: t('315909', '请输入公司名称'),
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
    onDeleteHistoryItem: async (searchKey: string) => {
      await deleteSearchHistoryItem('RELATION_SEARCH', searchKey)
    },
  },
} as const
