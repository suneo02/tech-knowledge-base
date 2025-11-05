import axios from './index'
import { aesEncrypt, encrypt, getFakePwd } from '../lib/utils'

// 发送短信验证码
export const sendMessage = (data) => {
  return axios.request({
    url: '/api/portal/security/visa/sendVerifyCode',
    method: 'post',
    encrypt: true,
    data: aesEncrypt(data),
  })
}

// 忘记密码-发送验证码
export const sendVerifyCode = (data) => {
  return axios.request({
    url: '/api/portal/security/visa/forget/password/sendVerifyCode',
    method: 'post',
    encrypt: true,
    data: aesEncrypt(data),
  })
}

// 用户中心-我的数据
export const getdoctasklist = (data) => {
  return axios.request({
    url: '/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=getdoctasklist',
    method: 'post',
    data,
    cmd: 'getdoctasklist',
  })
}

// 用户中心-我的订单
export const listPayOrder = (data) => {
  return axios.request({
    cmd: `operation/get/listPayOrder?type=ENTERPRISE`,
    method: 'post',
    data,
  })
}

// 发票详情
export const getPayInvoice = (orderId) => {
  return axios.request({
    cmd: `operation/get/getPayInvoice?orderId=${orderId}`,
    method: 'post',
    data: {},
  })
}

export const getAllAccountInfo = () => {
  return axios.requestToEntWeb('user/account-info', null, 'get')
}

export const setVerifyCodeV2 = (data) => {
  return axios.requestToEntWeb('auth/login/v2/verifyCode', data, 'post')
}

export const setVerifyCodeForChangeAccount = (data) => {
  return axios.requestToEntWeb('user/verify-code', data, 'post')
}

export const loginByVerifyCode = (data) => {
  return axios.requestToEntWeb('login', data, 'post', 'formdata')
}

export const loginBySwitch = (terminalType, code) => {
  return axios.requestToEntWeb(`user/switch?terminalType=${terminalType}&code=${code}`, null, 'post')
}

export const loginByToken = (data) => {
  return axios.requestToEntWeb('login', data, 'post', 'formdata')
}

// 获取现场签到二维码
export const getBarCode = () => {
  const url = 'https://wx.wind.com.cn/traincall/barcode'
  return axios.request({
    url: url,
    method: 'post',
    data: {
      terminialType: 1,
    },
    formType: 'payload',
  })
}
