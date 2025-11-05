import intl from '@/utils/intl'
import { Init } from '@wind/captcha/lib/index'
import { Button, Input, message } from '@wind/wind-ui'
import Modal from '@wind/wind-ui/lib/modal/Modal'
import React, { useRef, useState } from 'react'
import { getUserInfo, sendVerifyCode, submitApplyMessage } from '../../../utils/utils'
import './index.less'
import SmsButton from './smsButton'

const ErrorMessage = ({ text }) =>
  text ? (
    <p key={text} className="errText">
      {text}
    </p>
  ) : null

/**
 * 账号申请
 * @returns
 */
export default function ApplyModal(props) {
  const userInfo = getUserInfo()
  const [userName, setUserName] = useState(userInfo.username || '')

  const [companyName, setCompanyName] = useState(userInfo.company || '')
  const [companyNameErrMsg, setCompanyNameErrMsg] = useState('')

  const [phone, setPhone] = useState(userInfo.phone || '')
  const [phoneErrMsg, setPhoneErrMsg] = useState('')

  const [smsCode, setSmsCode] = useState('')
  const [smsCodeErrMsg, setSmsCodeErrMsg] = useState('')

  function onUserNameChange(e) {
    const v = e.currentTarget.value.trim()

    setUserName(v)
  }

  function onCompanyChange(e) {
    const v = e.currentTarget.value.trim()

    setCompanyName(v)
    setCompanyNameErrMsg('')
  }

  function onPhoneChange(e) {
    const v = e.currentTarget.value.trim()

    setPhone(v)
    setPhoneErrMsg('')
  }

  function onSmsCodeChange(e) {
    const v = e.currentTarget.value.trim()

    setSmsCode(v)
    setSmsCodeErrMsg('')
  }

  function validateCompany() {
    if (!companyName) {
      setCompanyNameErrMsg(intl('417594', '公司名称不能为空'))
      return false
    }
    return true
  }

  function validatePhone() {
    if (!phone) {
      setPhoneErrMsg(intl('417595', '手机号码不能为空'))
      return false
    }
    if (!/^[1]([3-9])[0-9]{9}$/.test(phone)) {
      setPhoneErrMsg(intl('417592', '请输入正确的手机号码'))
      return false
    }
    return true
  }

  function validateSmsCode() {
    if (!smsCode) {
      setSmsCodeErrMsg(intl('417596', '验证码不能为空'))
      return false
    }
    if (!/[0-9]{4}/.test(smsCode)) {
      setSmsCodeErrMsg(intl('417613', '请输入正确的验证码'))
      return false
    }
    return true
  }

  async function onSmsCodeButtonClick(callback) {
    if (!validatePhone()) {
      return
    }

    Init({
      appName: 'Wind.DataReport.App',
      onReady: (instance) => {
        instance.showBox()
      },
      onSuccess: (result) => {
        // return;
        sendVerifyCode(phone).then((res) => {
          if (!res) {
            setSmsCodeErrMsg(intl('417614', '验证码发送失败，请稍后重试'))
          } else {
            setSmsCodeErrMsg('')
          }
          callback()
        })
      },
      onFail: (result) => {
        setSmsCodeErrMsg(intl('417597', '验证错误'))
      },
      onError: (result) => {
        setSmsCodeErrMsg(intl('417597', '验证错误'))
      },
    })
  }

  const isSubmitRef = useRef(false)
  function onSubmit() {
    const b1 = validateCompany()
    const b2 = validatePhone()
    const b3 = validateSmsCode()
    if (!b1 || !b2 || !b3) {
      return
    }
    if (isSubmitRef.current) return
    isSubmitRef.current = true
    submitApplyMessage(userName, companyName, phone, smsCode)
      .then((res) => {
        if (res) {
          message.success(intl('417598', '申请使用提交成功'))
        } else {
          message.error(intl('417599', '申请使用提交失败'))
        }
      })
      .finally(() => {
        isSubmitRef.current = false
      })
  }

  return (
    <Modal
      wrapClassName="applyModal"
      // title={"快速构建银行对公营销一站式服务平台"}
      // closeIcon={<SpriteIcon id="close" style={{ fontSize: 16 }} />}
      title={null}
      width={520}
      {...props}
      footer={null}
    >
      <p className="title">{intl('419841', '欢迎试用银行对公营销一站式服务平台')}</p>
      <div className={`row`}>
        <Input
          className={`input`}
          placeholder={intl('420089', '请输入名称(非必填)')}
          value={userName}
          onChange={onUserNameChange}
        />
      </div>
      <div className={`row`}>
        <Input
          className={`input ${companyNameErrMsg ? 'borderRed' : ''}`}
          placeholder={intl('420049', '请输入公司名称(必填)')}
          value={companyName}
          onChange={onCompanyChange}
        />
        <ErrorMessage text={companyNameErrMsg} />
      </div>
      <div className={`row`}>
        <Input
          className={`input ${phoneErrMsg ? 'borderRed' : ''}`}
          placeholder={intl('420057', '请输入手机号码(必填)')}
          value={phone}
          onChange={onPhoneChange}
        />
        <ErrorMessage text={phoneErrMsg} />
      </div>
      <div className={`row`}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Input
            className={`input ${smsCodeErrMsg ? 'borderRed' : ''}`}
            placeholder={intl('417205', '请输入验证码')}
            value={smsCode}
            onChange={onSmsCodeChange}
          />

          <SmsButton onSmsCodeButtonClick={onSmsCodeButtonClick}></SmsButton>
        </div>
        <ErrorMessage text={smsCodeErrMsg} />
      </div>

      <Button className={'submitButton'} onClick={onSubmit} type="primary">
        {intl('417615', '立即提交申请')}
      </Button>

      <p className={'contactText'}>
        {intl('140100', '联系邮箱')}
        <span>100support@rimedata.com</span>
      </p>
    </Modal>
  )
}
