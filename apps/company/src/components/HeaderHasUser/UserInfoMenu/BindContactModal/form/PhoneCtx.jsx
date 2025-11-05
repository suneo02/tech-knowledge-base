import { createContext, useReducer } from 'react'

/**
 * 绑定手机号 或者 绑定邮箱 的ctc
 */
export const BindPhoneEmailFormCtx = createContext({
  captchaRes: null, // captcha 验证结果 从 wind/captcha 获得

  /**
   * 表示 CAPTCHA 验证的状态。
   * @typedef {Object} CaptchaState
   * @property {number} secRemain - 表示验证码发送后剩余的倒计时间，单位为秒。
   * @property {boolean} ifSent - 表示是否已经发送过验证码。
   * @property {boolean} loading apiLoading
   */
  captchaState: null,

  /**
   * @typedef {Function}
   */
  dispatch: null,
})

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCaptchaResult': {
      
      return {
        ...state,
        captchaRes: action.payload,
      }
    }
    case 'setCaptchaState': {
      return {
        ...state,
        captchaState: action.payload,
      }
    }
    case 'decrmentCaptchaSecRemain': {
      return {
        ...state,
        captchaState: {
          ...state.captchaState,
          secRemain: state.captchaState.secRemain - 1,
        },
      }
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const BindPhoneEmailFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    fieldData: null,
    captchaRes: null,
    /**
     * @typedef {CaptchaState}
     */
    captchaState: {},
  })

  return <BindPhoneEmailFormCtx.Provider value={{ ...state, dispatch }}>{children}</BindPhoneEmailFormCtx.Provider>
}
