import configureStore from 'redux-mock-store'
// import thunk from 'redux-thunk' // 移除 thunk 导入
import pointsReducer, { fetchPoints, consumePoints } from '../index'
import { PointsState, ConsumePointsPayload } from '../type'
// import * as pointsApi from '@/api/points' // 移除模拟 API 导入
import { requestToSuperlistFcs, createWFCSuperlistRequestFcs } from '@/api' // 导入实际 API

// Mock 实际 API 函数
jest.mock('@/api', () => ({
  requestToSuperlistFcs: jest.fn(),
  // Mock createWFCSuperlistRequestFcs 返回一个 mock 函数
  createWFCSuperlistRequestFcs: jest.fn(() => jest.fn()),
}))

// 获取 mock 函数的引用
const mockedRequestToSuperlistFcs = requestToSuperlistFcs as jest.Mock
// 获取 createWFCSuperlistRequestFcs 返回的 mock 函数的引用
const mockedAddDataToSheetApi = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet') as jest.Mock

// const middlewares = [thunk] // 移除 thunk 中间件
const mockStore = configureStore(/* middlewares */) // configureStore 不需要显式传递 thunk

const initialState: PointsState = {
  count: 0,
  loading: false,
  error: null,
}

// 准备 consumePoints 的模拟 payload
const mockConsumePayload: ConsumePointsPayload = {
  tableId: 'test-table-id',
  dataType: 'AI_CHAT_DPU',
  rawSentenceID: 'test-raw-id',
  rawSentence: 'test sentence',
  answers: 'test answer',
  sheetId: 'test-sheet-id',
  sheetName: 'Test Sheet',
  chatId: 'test-chat-id',
  dpuHeaders: [{ Id: 'h1', Name: 'Header1', DataType: 'string' }], // 添加 Id 字段
  dpuContent: [['row1-col1']],
}

describe('Points Slice', () => {
  let store: ReturnType<typeof mockStore> & { dispatch: jest.Mock }

  beforeEach(() => {
    store = mockStore({ points: initialState }) as any
    jest.clearAllMocks() // 清除所有 mock 调用记录

    // 为 createWFCSuperlistRequestFcs 返回的 mock 函数设置默认行为（如果需要）
    // mockedAddDataToSheetApi.mockResolvedValue({});
  })

  // Reducer 测试保持不变
  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(pointsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    // 测试 fetchPoints 的 extraReducers
    it('should handle fetchPoints.pending', () => {
      const action = { type: fetchPoints.pending.type }
      const state = pointsReducer(initialState, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchPoints.fulfilled', () => {
      const action = { type: fetchPoints.fulfilled.type, payload: 100 }
      const state = pointsReducer({ ...initialState, loading: true }, action)
      expect(state.loading).toBe(false)
      expect(state.count).toBe(100)
    })

    it('should handle fetchPoints.rejected', () => {
      const action = { type: fetchPoints.rejected.type, payload: 'Fetch Error' }
      const state = pointsReducer({ ...initialState, loading: true }, action)
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Fetch Error')
    })

    // 测试 consumePoints 的 extraReducers (pending 和 rejected)
    it('should handle consumePoints.pending', () => {
      const action = { type: consumePoints.pending.type }
      const state = pointsReducer(initialState, action)
      expect(state.error).toBeNull() // 仅检查错误被清除
    })

    it('should handle consumePoints.rejected', () => {
      const action = { type: consumePoints.rejected.type, payload: 'Consume Error' }
      const state = pointsReducer(initialState, action)
      expect(state.error).toBe('Consume Error')
    })
  })

  describe('async thunks', () => {
    it('should fetch points successfully', async () => {
      const mockPoints = 500
      mockedRequestToSuperlistFcs.mockResolvedValue({ Data: { pointTotal: mockPoints } })

      await store.dispatch(fetchPoints() as any)

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchPoints.pending.type)
      expect(actions[1].type).toBe(fetchPoints.fulfilled.type)
      expect(actions[1].payload).toBe(mockPoints)
      expect(mockedRequestToSuperlistFcs).toHaveBeenCalledWith('points/getUserPointsInfo', {})
    })

    it('should handle fetch points failure', async () => {
      const errorMessage = 'Network Error'
      mockedRequestToSuperlistFcs.mockRejectedValue(new Error(errorMessage))

      await store.dispatch(fetchPoints() as any)

      const actions = store.getActions()
      expect(actions[0].type).toBe(fetchPoints.pending.type)
      expect(actions[1].type).toBe(fetchPoints.rejected.type)
      expect(actions[1].payload).toBe(errorMessage)
    })

    it('should consume points and refetch successfully', async () => {
      const refetchedPoints = 450
      mockedAddDataToSheetApi.mockResolvedValue({}) // 模拟 addDataToSheet 成功
      mockedRequestToSuperlistFcs.mockResolvedValue({ Data: { pointTotal: refetchedPoints } }) // 模拟 refetch 成功

      await store.dispatch(consumePoints(mockConsumePayload) as any)

      const actions = store.getActions()
      expect(actions[0].type).toBe(consumePoints.pending.type)
      expect(actions[1].type).toBe(fetchPoints.pending.type) // fetch 被调用
      expect(actions[2].type).toBe(fetchPoints.fulfilled.type)
      expect(actions[2].payload).toBe(refetchedPoints)
      expect(actions[3].type).toBe(consumePoints.fulfilled.type)

      // 验证 addDataToSheet 被调用，并带有 enablePointConsumption
      expect(mockedAddDataToSheetApi).toHaveBeenCalledWith({
        ...mockConsumePayload,
        enablePointConsumption: 1,
      })
      // 验证 fetchPoints 被调用
      expect(mockedRequestToSuperlistFcs).toHaveBeenCalledWith('points/getUserPointsInfo', {})
    })

    it('should handle consume points failure', async () => {
      const errorMessage = 'Consume Failed'
      mockedAddDataToSheetApi.mockRejectedValue(new Error(errorMessage))

      await store.dispatch(consumePoints(mockConsumePayload) as any)

      const actions = store.getActions()
      expect(actions[0].type).toBe(consumePoints.pending.type)
      expect(actions[1].type).toBe(consumePoints.rejected.type)
      expect(actions[1].payload).toBe(errorMessage)
      // 验证失败时 fetchPoints 没有被调用
      expect(mockedRequestToSuperlistFcs).not.toHaveBeenCalled()
    })
  })
})
