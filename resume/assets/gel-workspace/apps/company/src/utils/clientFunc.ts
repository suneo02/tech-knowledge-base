type ClientFuncCallback<T> = (data: T | null) => void

interface ClientFuncParams {
  func: string
  isGlobal?: number
  name: string

  [key: string]: any
}

export const callClientFunc = <T>(params: ClientFuncParams, callback: ClientFuncCallback<T>) => {
  if (!window.external?.ClientFunc) {
    console.warn('ClientFunc is not available')
    return
  }

  window.external.ClientFunc(JSON.stringify(params), (res: string) => {
    if (!res) {
      callback(null)
      return
    }

    try {
      const data = JSON.parse(res)
      callback(data)
    } catch (e) {
      console.error('Failed to parse ClientFunc response:', e)
      callback(null)
    }
  })
}

// 预定义的一些常用查询
export const clientQueries = {
  getSessionId: () => {
    return new Promise<string | null>((resolve) => {
      callClientFunc<{ value: string }>(
        {
          func: 'querydata',
          isGlobal: 1,
          name: 'sessionid',
        },
        (data) => {
          resolve(data?.value || null)
        }
      )
    })
  },

  getTerminalUserInfo: () => {
    return new Promise<{ userid: string } | null>((resolve) => {
      callClientFunc<{ userid: string }>(
        {
          func: 'querydata',
          isGlobal: 1,
          name: 'terminaluserinfo',
        },
        (data) => {
          resolve(data)
        }
      )
    })
  },
}
