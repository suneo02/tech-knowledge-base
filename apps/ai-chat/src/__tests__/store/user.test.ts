import userReducer, { fetchUserInfo, UserState, VipStatusEnum } from '../../store/user'

describe('user slice', () => {
  let initialState: UserState

  beforeEach(() => {
    initialState = {
      userInfo: null,
      vipStatus: VipStatusEnum.NORMAL,
      isUserInfoFetched: false,
      isLoading: false,
      error: null,
    }
  })

  it('should handle initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle fetchUserInfo.pending', () => {
    const action = { type: fetchUserInfo.pending.type }
    const state = userReducer(initialState, action)
    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle fetchUserInfo.fulfilled for SVIP user', () => {
    const mockUserData = { packageName: 'EQ_APL_GEL_SVIP' }
    const action = { type: fetchUserInfo.fulfilled.type, payload: mockUserData }
    const state = userReducer(initialState, action)
    expect(state.isLoading).toBe(false)
    expect(state.isUserInfoFetched).toBe(true)
    expect(state.userInfo).toEqual(mockUserData)
    expect(state.vipStatus).toBe(VipStatusEnum.SVIP)
  })

  it('should handle fetchUserInfo.fulfilled for VIP user', () => {
    const mockUserData = { packageName: 'EQ_APL_GEL_VIP' }
    const action = { type: fetchUserInfo.fulfilled.type, payload: mockUserData }
    const state = userReducer(initialState, action)
    expect(state.vipStatus).toBe(VipStatusEnum.VIP)
  })

  it('should handle fetchUserInfo.fulfilled for NORMAL user', () => {
    const mockUserData = { packageName: 'EQ_APL_GEL_BS' }
    const action = { type: fetchUserInfo.fulfilled.type, payload: mockUserData }
    const state = userReducer(initialState, action)
    expect(state.vipStatus).toBe(VipStatusEnum.NORMAL)
  })

  it('should handle fetchUserInfo.rejected', () => {
    const error = 'Failed to fetch user info'
    const action = { type: fetchUserInfo.rejected.type, payload: error }
    const state = userReducer(initialState, action)
    expect(state.isLoading).toBe(false)
    expect(state.isUserInfoFetched).toBe(true)
    expect(state.error).toBe(error)
  })
})
