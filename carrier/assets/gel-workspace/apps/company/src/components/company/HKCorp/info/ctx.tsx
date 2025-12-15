import { IHKSearcherInfo } from '@/api/corp/HKCorp/pay.ts'
import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import { CorpPurchaseData } from 'gel-types'
import React, { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react'

// 1. 定义 State 结构
export interface HKCorpInfoState {
  modalType?: 'pay' | 'instruction' | 'processing' // 弹窗类型
  showModalClose?: boolean // 显示弹窗的关闭函数

  bussStatus?: CorpPurchaseData['processingStatus'] // 业务的状态
  lastedProcessTime?: CorpPurchaseData['lastedProcessTime'] // 数据的最后更新时间
  refreshBussStatus?: () => void // 刷新业务状态的函数

  tableReady?: boolean // 表格是否准备好
  corpCode?: string
  corpName?: string
  baseInfo?: CorpBasicInfo
  searcherFormValues?: IHKSearcherInfo // 只有在 用户点击提交时才会更新此值
}

// 2. 定义可触发的 Action
type HKCorpInfoAction =
  | {
      type: 'SET_STATE'
      payload: Partial<HKCorpInfoState>
    }
  | { type: 'SET_MODAL_TYPE'; payload: NonNullable<HKCorpInfoState['modalType']> }
  | { type: 'SET_SHOW_MODAL_CLOSE'; payload: boolean }
  | { type: 'SET_BUSS_STATUS'; payload: NonNullable<HKCorpInfoState['bussStatus']> }
  | { type: 'SET_SEARCHER_FORM_VALUES'; payload: IHKSearcherInfo }
  | { type: 'SET_REFRESH_BUSS_STATUS'; payload: () => void }
  | { type: 'SET_TABLE_READY'; payload: boolean }
// 3. reducer 函数：根据 action 更新 state
function hkCorpInfoReducer(state: HKCorpInfoState, action: HKCorpInfoAction): HKCorpInfoState {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'SET_MODAL_TYPE':
      return {
        ...state,
        modalType: action.payload,
      }
    case 'SET_SHOW_MODAL_CLOSE':
      return {
        ...state,
        showModalClose: action.payload,
      }
    case 'SET_SEARCHER_FORM_VALUES':
      return {
        ...state,
        searcherFormValues: action.payload,
      }
    case 'SET_BUSS_STATUS':
      return {
        ...state,
        bussStatus: action.payload,
      }
    case 'SET_REFRESH_BUSS_STATUS':
      return {
        ...state,
        refreshBussStatus: action.payload,
      }
    case 'SET_TABLE_READY':
      return {
        ...state,
        tableReady: action.payload,
      }
    default:
      return state
  }
}

// 4. 组合 Context 的值类型：既包括 state，也包括 dispatch
interface HKCorpInfoContextValue {
  state: HKCorpInfoState
  dispatch: Dispatch<HKCorpInfoAction>
}

// 5. 创建 Context，并给个默认值（仅初始化用，实际在 Provider 中会被覆盖）
export const Ctx = createContext<HKCorpInfoContextValue>({
  state: {},
  dispatch: () => {
    // 这里故意留空实现，用于在不包裹 Provider 时避免调用错误
  },
})

// 6. 定义 Provider 组件，内部使用 useReducer 管理 state
export const HKCorpInfoCtxProvider = ({
  children,
  value,
}: {
  children: ReactNode
  value?: Partial<HKCorpInfoState>
}) => {
  // 可以在这里定义初始 state，或者从外部 props 注入
  const [state, dispatch] = useReducer(hkCorpInfoReducer, value)

  useEffect(() => {
    dispatch({
      type: 'SET_STATE',
      payload: value,
    })
  }, [value])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export const useHKCorpInfoCtx = () => {
  const context = useContext(Ctx)
  if (!context) {
    throw new Error('useHKCorpInfoCtx must be used within a HKCorpInfoCtxProvider')
  }
  return context
}
