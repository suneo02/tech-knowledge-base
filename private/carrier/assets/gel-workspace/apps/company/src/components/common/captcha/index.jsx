import { GlobalContext } from '@/context/GlobalContext'
import { Init as CaptchaInit } from '@wind/captcha' // 需要用init时安装
import { useContext, useEffect, useRef } from 'react'

/**
 * wind Captcha 的 React 简单封装。
 *
 * TODO 改造为 hook 没必要用组件，
 * 改造为 hook的话，内部的状态需要考虑，考虑是现有的传回调还是state，
 * 改造需要熟悉 @wind/captcha 包
 *
 * 该组件用于显示和交互 wind Captcha，支持多种回调事件。
 *
 * @param {Object} param0 - 组件的参数对象。
 * @param {boolean} param0.open - 控制是否显示 captcha 的开关，必选。
 * @param {Function} param0.onSuccess - captcha 验证成功的回调函数，必选。
 * @param {Function} [param0.onReady] - captcha 准备好的回调函数，可选。
 * @param {Function} [param0.onNextReady] - captcha 下一个步骤准备好的回调函数，可选。
 * @param {Function} [param0.onFail] - captcha 验证失败的回调函数，可选。
 * @param {Function} [param0.onError] - captcha 发生错误的回调函数，可选。
 * @param {Function} [param0.onClose] - captcha 关闭的回调函数，可选。
 * @returns {JSX.Element} 返回一个 React 组件。
 */
export const CaptchaComp = ({ open, onSuccess, onReady, onNextReady, onFail, onError, onClose, appName }) => {
  const { language } = useContext(GlobalContext)
  // 验证码验证 dom
  const captchaBox = useRef()

  const onCaptchatInit = () => {
    CaptchaInit({
      appName: appName ? appName : 'BindContactCaptcha',
      lang: (window.localStorage.getItem('lang') || language) === 'zh' ? 'cn' : 'en',
      onReady: (instance) => {
        onReady && onReady(instance)
        // Captcha加载完毕
        //若需在其他地方使用该instance只需将其保存，在需要使用的地方使用即可
        captchaBox.current = instance
        instance.showBox()
        console.log('onReady', instance)
      },
      onNextReady: (result) => {
        onNextReady && onNextReady(result)
        //刷新后验证码加载完毕
        console.log('onNextReady', result)
      },
      /**
       *
       * @param {Object} result
       * @param {string} result.logNumber
       * @param {string} result.
       */
      onSuccess: (result) => {
        onSuccess(result)
      },
      onFail: (result) => {
        onFail && onFail(result)
        //验证失败回调
        console.log('fail', result)
      },
      onError: (result) => {
        onError && onError(result) //接口出错回调
      },
      onClose: () => {
        onClose && onClose()
        //验证码组件关闭后回调
        console.log('onClose')
      },
    })
  }

  useEffect(() => {
    if (!open) {
      // not show captcha box
      return
    }

    if (captchaBox.current) {
      // instance created
      captchaBox.current.showBox()
      return
    }
    onCaptchatInit()
  }, [open])

  return <span></span>
}
