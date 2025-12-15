import { WSIDStorageKey } from './misc'
import { ClientFunc } from './type'

export const callClientFunc: ClientFunc = (params) => {
  return new Promise((resolve, reject) => {
    if (!window.external?.ClientFunc) {
      console.warn('ClientFunc is not available')
      reject(null)
      return
    }

    window.external.ClientFunc(JSON.stringify(params), (res: string | null) => {
      if (!res) {
        resolve('')
        return
      }

      try {
        const data = JSON.parse(res)
        resolve(data)
      } catch (e) {
        console.error('Failed to parse ClientFunc response:', e)
        reject(null)
      }
    })
  })
}

export const clientGetSessionId = async () => {
  try {
    const res = await callClientFunc({
      func: 'querydata',
      isGlobal: 1,
      name: 'sessionid',
    })
    if (res) {
      const data = JSON.parse(res)
      if (data && data.value) {
        return data.value
      }
    }
  } catch (e) {
    console.error('Failed to get session id:', e)
    return null
  }
}

export const clientGetTerminalUserInfo = async () => {
  try {
    const res = await callClientFunc({
      func: 'querydata',
      isGlobal: 1,
      name: 'terminaluserinfo',
    })
    if (res) {
      return res
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export const clientInitWSID = async () => {
  try {
    const res = await clientGetSessionId()
    window.sessionStorage.setItem(WSIDStorageKey, JSON.stringify(res))
  } catch (e) {
    console.error('Failed to get WSID:', e)
    return null
  }
}
