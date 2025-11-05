import { Input, message } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import React, { useContext, useEffect } from 'react'
import { useApiBindContact, useApiGetAuthPublicKey } from '../handle/BindHandle'
import { useOnCaptchaSuccess } from '../handle/CaptchaHandle'
import { BindContactModalCtx } from '../handle/Ctx'
import './BindForm.less'
import { CaptchaBtn } from './CaptchaBtn'
import intl from '../../../../../utils/intl'

const StylePrefix = 'bind-contact-form'

/**
 * 首次绑定手机号或者有邮箱
 * @param {*} param0
 * @returns
 */
export const BindContactForm = ({ onSuccess, isOversea }) => {
  const { dispatch, captchaRes, form } = useContext(BindContactModalCtx)

  const [apiGetAuthPublicKey, publicKeyData, apiGetAuthPublicKeyLoading, apiGetAuthPublicKeyHasFetched] =
    useApiGetAuthPublicKey()
  const [apiBindContact, apiBindContactData, apiBindContactLoading, apiBindContactHasFetched] = useApiBindContact()

  // 验证码处理
  const [apiGetAuthCode] = useOnCaptchaSuccess()
  const PhoneOrEmailNamePath = isOversea ? 'email' : 'phone'

  useEffect(() => {
    // public key 获取到后 发送绑定api
    if (apiGetAuthPublicKeyHasFetched) {
      const values = form.getFieldsValue()
      const phoneOrEmail = values[PhoneOrEmailNamePath]
      if (publicKeyData && publicKeyData.ErrorCode == '0') {
        apiBindContact(phoneOrEmail, values.verificationCode, publicKeyData.Data)
      } else {
        console.error(`api get public key error ${publicKeyData}`)
      }
    }
  }, [publicKeyData])

  useEffect(() => {
    if (apiBindContactHasFetched) {
      if (apiBindContactData && apiBindContactData.ErrorCode == '0') {
        message.success(intl('417583', '绑定成功！'))
        onSuccess()
      }
    }
  }, [apiBindContactData])

  useEffect(() => {
    dispatch({
      type: 'setConfirmLoading',
      payload: apiBindContactLoading || apiGetAuthPublicKeyLoading,
    })
  }, [apiBindContactLoading, apiGetAuthPublicKeyLoading])

  useEffect(() => {
    // TODO custom rule check，将校验规则放在 rules 里会更好，但是限制于 form 版本，较难实现
    //获取绑定手机验证码
    if (!captchaRes) {
      return
    }
    const fieldVal = form.getFieldValue(PhoneOrEmailNamePath)
    if (!(fieldVal && captchaRes.lotNumber && captchaRes.validateResult)) {
      // 正常执行一般不会执行到这
      console.error(
        '🚀 ~ useEffect ~ fieldVal, captchaRes.lotNumber, captchaRes.validateResult:',
        fieldVal,
        captchaRes.lotNumber,
        captchaRes.validateResult
      )
    }
    form
      .validateFields([PhoneOrEmailNamePath])
      .then(() => {
        apiGetAuthCode(fieldVal, captchaRes.lotNumber, captchaRes.validateResult)
      })
      .catch(() => {
        message.error(isOversea ? intl('417584', '邮箱错误') : intl('417569', '手机号错误'))
      })
  }, [captchaRes])

  const hint = isOversea
    ? intl('417587', '使用临时密码登录的用户请在首次登录时绑定邮箱，否则将无法使用企业库相关功能')
    : intl('417588', '使用临时密码登录的用户请在首次登录时绑定中国大陆手机号，否则将无法使用企业库相关功能')

  return (
    <Form form={form} layout="vertical" onFinish={apiGetAuthPublicKey}>
      <div className={`${StylePrefix}--hint`}>{hint}</div>
      {isOversea ? (
        <Form.Item
          name="email"
          label={intl('93833', '邮箱')}
          rules={[
            {
              required: true,
              message: intl('417570', '请输入邮箱'),
            },
            {
              type: 'email',
              message: intl('438014', '请输入有效的邮箱地址'),
            },
          ]}
        >
          <Input placeholder={intl('417570', '请输入邮箱')} />
        </Form.Item>
      ) : (
        <Form.Item
          name="phone"
          label={intl('149821', '手机号')}
          rules={[
            {
              required: true,
              message: intl('254955', '请输入手机号'),
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: intl('417571', '请输入有效的手机号'),
            },
          ]}
        >
          <Input placeholder={intl('254955', '请输入手机号')} />
        </Form.Item>
      )}

      <Form.Item
        name="verificationCode"
        label={intl('417586', '验证码')}
        rules={[
          {
            required: true,
            message: intl('417205', '请输入验证码'),
          },
          {
            len: 6,
            message: intl('420164', '验证码需为6位'),
          },
        ]}
      >
        <Input
          className={`${StylePrefix}--captcha-input`}
          placeholder={intl('417205', '请输入验证码')}
          addonAfter={<CaptchaBtn />}
        />
      </Form.Item>
    </Form>
  )
}
