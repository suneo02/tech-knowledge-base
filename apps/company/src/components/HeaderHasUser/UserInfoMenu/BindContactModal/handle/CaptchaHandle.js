import { useAsync } from '@/utils/useAsync'
import { message } from '@wind/wind-ui'
import { useContext, useEffect, useRef } from 'react'
import { BindContactModalCtx } from './Ctx'
import { apiGetAuthCode } from '../api'

const CaptchIntervals = 60 // captcha 时间间隔

/**
 * 当 CAPTCHA 验证成功时的hook
 * 会倒计时，设置buttonDisable等
 *
 *
 * @returns {Function} 返回的函数，用于在 CAPTCHA 验证成功时调用。
 * @returns {boolean} 返回是否已经发送过验证码的状态。
 * @returns {number} 返回剩余的倒计时秒数。
 */
export const useOnCaptchaSuccess = () => {
  const { dispatch, captchaState } = useContext(BindContactModalCtx)
  const intervalID = useRef() // 倒计时 interval

  const [apiExecute, authCodeData, apiLoading, apiHasFetched, apiError] = useAsync(apiGetAuthCode)

  useEffect(() => {
    if (!apiHasFetched) {
      return
    }
    // api success 处理一些状态，给 发送的 button 展示用
    if (authCodeData && authCodeData.Data && authCodeData.ErrorCode == '0') {
      message.success('验证码已发送')
      dispatch({
        type: 'setCaptchaState',
        payload: {
          ...captchaState,
          secRemain: CaptchIntervals,
          ifSent: true,
        },
      })
      intervalID.current = setInterval(function () {
        if (captchaState.secRemain <= 0) {
          // 倒计时结束，可以再次发送验证码
          clearInterval(intervalID.current)
        } else {
          dispatch({
            type: 'decrmentCaptchaSecRemain',
          })
        }
      }, 1000)
    } else {
      console.error(`api get auth code fail ${authCodeData}`)
      message.error('验证码发送失败')
    }
  }, [authCodeData])

  useEffect(() => {
    if (!apiHasFetched) {
      return
    }
    console.error(`get auth code error occur ${apiError}`)
    message.error('验证码发送失败')
  }, [apiError])

  useEffect(() => {
    dispatch({
      type: 'setCaptchaState',
      payload: {
        ...captchaState,
        loading: apiLoading,
      },
    })
  }, [apiLoading])

  return [apiExecute]
}
