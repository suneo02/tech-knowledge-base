import axios from '@/api'
import { wftCommon } from '@/utils/utils'
import { encryptData } from './handle'

/**
 * 发送请求以获取认证码。
 * @param {string} phoneOrEmail - 用户输入的手机号或邮箱。
 * @param {string} lotNumber - 认证码对应的批次号。 从 CAPTCHA 获取的结果
 * @param {boolean} validateResult - 验证结果。 从 CAPTCHA 获取的结果
 */
export const apiGetAuthCode = (phoneOrEmail, lotNumber, validateResult) => {
  if (!phoneOrEmail) {
    return Promise.reject('apiGetAuthCode phone or email must not to be null')
  }
  let cmd
  const data = new FormData()

  // 是海外用户的话绑定邮箱
  if (wftCommon.is_overseas_config) {
    cmd = '/wind.ent.web/biz/commercial/updateEmail/verifyCode'
    data.append('email', phoneOrEmail)
  } else {
    cmd = '/wind.ent.web/biz/commercial/updateMobile/verifyCode'
    data.append('mobile', phoneOrEmail)
    data.append('lotNumber', lotNumber)
    data.append('validateResult', validateResult)
  }

  const url = cmd

  return axios.request({
    url,
    method: 'post',
    data,
    timeout: 30000,
    formType: 'payload',
    needWsid: true, // 终端内未注册serverinfo的服务，mac终端上必须自己传入wsid
  })
}

export const apiGetPublicKey = () => {
  const cmd = 'wind.ent.web/auth/publicKey'
  const url = '/' + cmd
  return axios.request({
    url,
    method: 'get',
    timeout: 30000,
  })
}

export const apiUpdateContact = (phone, code, pwd, publicKey) => {
  let json
  let bindPhoneCmd = 'wind.ent.web/biz/commercial'
  if (wftCommon.is_overseas_config) {
    json = {
      email: phone,
      code: code,
      pwd: pwd,
    }
    bindPhoneCmd = `${bindPhoneCmd}/bindEmail`
  } else {
    json = {
      mobile: phone,
      code: code,
      pwd: pwd,
    }
    bindPhoneCmd = `${bindPhoneCmd}/updateMobile`
  }
  // 这部分写的很奇怪 从 Jquery 抄过来的
  const data = {
    data: encryptData(json, publicKey),
    publicKey,
  }

  const url = `/${bindPhoneCmd}`
  return axios.request({
    url,
    method: 'post',
    data,
    timeout: 30000,
  })
}

/**
 * 首次绑定 phone
 * 本来应该有绑定邮箱的，但是历史遗留问题，后端没这个接口
 * @param {*} phone
 * @param {*} code
 * @param {*} publicKey
 * @returns
 */
export const apiBindContact = (phone, code, publicKey) => {
  const cmd = 'wind.ent.web/biz/commercial/bindMobile'
  const json = {
    mobile: phone,
    code: code,
  }

  const data = {
    data: encryptData(json, publicKey),
    publicKey,
  }

  const url = `/${cmd}`
  return axios.request({
    url,
    method: 'post',
    data,
    timeout: 30000,
  })
}
