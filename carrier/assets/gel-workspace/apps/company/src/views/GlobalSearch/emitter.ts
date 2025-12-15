// GlobalSearch 页面内事件：使用 ahooks EventEmitter 统一管理
// author: 刘兴华<x h l i u . l i u @ w i n d . c o m . c n>

import { EventEmitter } from 'ahooks/lib/useEventEmitter'

// 刷新最近浏览企业列表
export const refreshHistoryEmitter = new EventEmitter<void>()
