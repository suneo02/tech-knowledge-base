import { Input, message } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import React, { useContext, useEffect } from 'react'
import { useApiGetAuthPublicKey, useApiUpdatePhoneEmail } from '../handle/BindHandle'
import { useOnCaptchaSuccess } from '../handle/CaptchaHandle'
import { BindContactModalCtx } from '../handle/Ctx'
import { CaptchaBtn } from './CaptchaBtn'
import './UpdateForm.less'
import intl from '../../../../../utils/intl'

const StylePrefix = 'update-contact-form'

/**
 * 更新绑定手机号或者有邮箱
 * @param {*} param0
 * @returns
 */
export const UpdateContactForm = ({ onSuccess, isOversea }) => {
  const { dispatch, captchaRes, form } = useContext(BindContactModalCtx)

  const [apiGetAuthPublicKey, publicKeyData, apiGetAuthPublicKeyLoading, apiGetAuthPublicKeyHasFetched] =
    useApiGetAuthPublicKey()
  const [apiUpdateContact, apiUpdateContactData, apiUpdateContactLoading, apiUpdateContactHasFetched] =
    useApiUpdatePhoneEmail()

  // 验证码处理
  const [apiGetAuthCode] = useOnCaptchaSuccess()
  const PhoneOrEmailNamePath = isOversea ? 'email' : 'phone'

  useEffect(() => {
    // public key 获取到后 发送绑定api
    if (apiGetAuthPublicKeyHasFetched) {
      const values = form.getFieldsValue()
      const phoneOrEmail = values[PhoneOrEmailNamePath]
      if (!phoneOrEmail) {
        // 正常执行一般不会执行到这
        console.error('🚀 ~ useEffect ~ phoneOrEmail:', phoneOrEmail)
      }
      if (publicKeyData && publicKeyData.ErrorCode == '0') {
        apiUpdateContact(phoneOrEmail, values.verificationCode, values.password, publicKeyData.Data)
      }
    }
  }, [publicKeyData])

  useEffect(() => {
    if (apiUpdateContactHasFetched) {
      if (apiUpdateContactData && apiUpdateContactData.ErrorCode == '0') {
        message.success(intl('417583', '绑定成功！')) // TODO intl
        onSuccess()
      }
    }
  }, [apiUpdateContactData])

  useEffect(() => {
    dispatch({
      type: 'setConfirmLoading',
      payload: apiUpdateContactLoading || apiGetAuthPublicKeyLoading,
    })
  }, [apiUpdateContactLoading, apiGetAuthPublicKeyLoading])

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
        captchaRes.validateResult,
        form,
        form.getFieldsValue()
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

  return (
    <Form form={form} layout="vertical" onFinish={apiGetAuthPublicKey}>
      {isOversea ? (
        <Form.Item
          name={PhoneOrEmailNamePath}
          label="邮箱"
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
          <Input placeholder={intl('417570', '请输入邮箱')} data-uc-id="9o2HVUftuT" data-uc-ct="input" />
        </Form.Item>
      ) : (
        <Form.Item
          name={PhoneOrEmailNamePath}
          label={intl('149821', '手机号')}
          rules={[
            {
              required: true,
              message: intl('254955', '请输入手机号码'),
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: intl('417571', '请输入有效的手机号'),
            },
          ]}
        >
          <Input placeholder={intl('254955', '请输入手机号')} data-uc-id="qFOzDXWie0" data-uc-ct="input" />
        </Form.Item>
      )}
      <Form.Item
        name="password"
        label={intl('417572', '密码')}
        rules={[
          {
            required: true,
            message: intl('417585', '请输入密码'),
          },
          {
            min: 8,
            max: 15,
            message: intl('415877', '密码需为8-15位'),
          },
        ]}
      >
        <Input placeholder={intl('417585', '请输入密码')} type="password" data-uc-id="Q_XZt0ih4E" data-uc-ct="input" />
      </Form.Item>
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
          data-uc-id="jz_3VBUD0e"
          data-uc-ct="input"
        />
      </Form.Item>
    </Form>
  )
}
