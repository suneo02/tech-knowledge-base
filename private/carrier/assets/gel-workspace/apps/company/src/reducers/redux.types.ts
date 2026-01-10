/**
 * Redux Action 总类型定义
 * 包含所有 reducer 的 action 类型
 */
import { CorpAction } from './company.types'
import type { FindCustomerAction } from './findCustomer.types'
import { GlobalAction } from './global.types'
import type { HomeAction } from './home.types'
import type { SearchListAction } from './searchList.types'

/**
 * Redux Action 总类型
 * 联合所有 reducer 的 action 类型
 */
export type RootAction = SearchListAction | HomeAction | GlobalAction | FindCustomerAction | CorpAction
