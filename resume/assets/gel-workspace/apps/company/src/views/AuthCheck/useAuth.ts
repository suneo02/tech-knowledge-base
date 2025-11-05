import { useState, useEffect } from 'react'
import { loginFromLanxin } from '../../lib/logout'
import global from '../../lib/global'
import { pointBuriedByModule } from '@/api/pointBuried/bury'

interface UseAuthResult {
  title: string
  isDebug: boolean
  debugCount: number
  handleDebugClick: () => void
}

export const useAuth = (): UseAuthResult => {
  const [title, setTitle] = useState('正在为您自动登录，请稍后...')
  const [isDebug, setIsDebug] = useState(!!window.localStorage.getItem('ngdev'))
  const [debugCount, setDebugCount] = useState(0)

  const loginHandle = async (authCode: string) => {
    if (!authCode) return

    try {
      const res = await loginFromLanxin({ njgovCode: authCode })

      if (res?.wsid) {
        setTitle('登录成功，正在为您跳转...')
        setTimeout(() => {
          window.location.href = './SearchHome.html'
        }, 300)
      } else {
        setTitle(`自动登录失败，请退出重试(login failed ${JSON.stringify(res)})`)
      }
    } catch (error) {
      setTitle(`登录失败: ${error?.message}`)
    }
  }

  const autoLogin = async () => {
    if (!window.lx?.biz) {
      isDebug && setTitle((prev) => `${prev}\nlan xin sdk not found!`)
      console.warn('lan xin sdk not found!')
      return
    }

    const authCode = window.localStorage.getItem('lanxin_auth_code')
    if (authCode) {
      return loginHandle(authCode)
    }

    try {
      await window.lx.biz.getAuthCode({
        appId: global.NJGOV_APP_ID,
        success: (res) => {
          isDebug && setTitle((prev) => `${prev}\ngetAuthCode success: ${JSON.stringify(res)}`)
          if (res?.authCode) {
            loginHandle(res.authCode)
          } else {
            setTitle(`自动登录失败，请退出重试(auth code not found ${JSON.stringify(res)})`)
          }
        },
        fail: (res) => {
          isDebug && setTitle((prev) => `${prev}\ngetAuthCode failed: ${JSON.stringify(res)}`)
          setTitle('自动登录失败，请退出重试(auth code get failed)')
        },
      })
    } catch (error) {
      console.error('获取授权码失败', error)
    }
  }

  const handleDebugClick = () => {
    const count = debugCount + 1
    setDebugCount(count)

    if (count === 15) {
      window.localStorage.setItem('ngdev', '1')
      setIsDebug(true)
      setTitle((prev) => `dev${prev}`)
    }

    if (count === 20) {
      window.localStorage.removeItem('ngdev')
      setIsDebug(false)
      setTitle((prev) => `release${prev}`)
      setDebugCount(0)
    }
  }

  useEffect(() => {
    pointBuriedByModule(922602101138)
    autoLogin()
  }, [])

  return { title, isDebug, debugCount, handleDebugClick }
}
