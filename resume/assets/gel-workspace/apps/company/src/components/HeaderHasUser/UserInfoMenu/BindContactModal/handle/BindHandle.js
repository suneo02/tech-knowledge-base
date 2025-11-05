import { message } from 'antd'
import { useAsync } from '../../../../../utils/useAsync'
import { apiBindContact, apiGetPublicKey, apiUpdateContact } from '../api'
import { useEffect } from 'react'

// TODO 从 jQuery 中抄过来的 不知道如何重构在本项目
const global_isRelease = false
/**
 * 从 jQuery 项目中抄过来的，不知道干啥用
 * @param {*} json
 * @param {*} publicKey
 * @returns
 */

/**
 * 绑定手机号或者邮箱时要先获取 public key
 */
export function useApiGetAuthPublicKey() {
  const [execute, data, loading, hasFetched, error] = useAsync(apiGetPublicKey)

  useEffect(() => {
    // 监听 api error
    if (hasFetched) {
      // TODO intl
      message.error('绑定错误，请稍后再试1')
    }
  }, [error])

  useEffect(() => {
    // public key 获取到后 判断返回值
    if (hasFetched) {
      if (!data || data.ErrorCode != '0') {
        // TODO intl
        message.error('绑定错误，请稍后再试2')
      }
    }
  }, [data])

  return [execute, data, loading, hasFetched, error]
}

/**
 * 根据 publicKey 绑定手机号或者邮箱
 */
export function useApiUpdatePhoneEmail() {
  const [execute, data, loading, hasFetched, error] = useAsync(apiUpdateContact)

  useEffect(() => {
    // 监听 api error
    if (hasFetched) {
      // TODO intl
      message.error('绑定错误，请稍后再试3')
    }
  }, [error])

  useEffect(() => {
    // public key 获取到后 判断返回值
    if (hasFetched) {
      if (data && data.ErrorCode == '0') {
      } else {
        // TODO intl
        message.error('绑定错误，请稍后再试4')
      }
    }
  }, [data])

  return [execute, data, loading, hasFetched, error]
}

/**
 * 绑定 手机号或者邮箱的 hook
 */
export function useApiBindContact() {
  const [execute, data, loading, hasFetched, error] = useAsync(apiBindContact)

  useEffect(() => {
    // 监听 api error
    if (hasFetched) {
      // TODO intl
      message.error('绑定错误，请稍后再试5')
    }
  }, [error])

  useEffect(() => {
    // public key 获取到后 判断返回值
    if (hasFetched) {
      switch (String(data.ErrorCode)) {
        case '0':
          message.success('绑定完成')
          break
        case '1':
          message.error('手机验证码错误')
          break
        case '2':
          message.error('邮箱验证码错误')
          break
        case '3':
          message.error('手机及邮箱验证码均错误')
          break
        case '4':
          message.error('未知错误')
          break
        case '5':
          message.error('没有找到安全信息')
          break
        case '6':
          message.error('绑定邮箱已被注册')
          break
        case '7':
          message.error('当前手机已有绑定账号，请更换手机号绑定。')
          break
        case '99':
          message.error('不支持的操作')
          break
        default:
          message.error('绑定错误，请稍后再试6')
      }
    }
  }, [data])

  return [execute, data, loading, hasFetched, error]
}
