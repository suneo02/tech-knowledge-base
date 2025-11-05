import React, { FC, useEffect } from 'react'
import { Button, message } from '@wind/wind-ui'
import styles from '../style/searcherForm.module.less'
import Form, { FormInstance } from '@wind/wind-ui-form'
import cn from 'classnames'
import { getUserInfoBackFilling, IHKSearcherInfo } from '@/api/corp/HKCorp/pay.ts'
import { useAsync } from '@/utils/api'
import { useHKCorpInfoCtx } from '../../ctx.tsx'
import { ConfirmDeclaration } from './comp.tsx'
import { UserNameField } from './UserNameField'
import { IdentityCardField } from './IdentityCardField'
import { EmailField } from './EmailField'
import { PhoneField } from './PhoneField'
import { NeedRecordField } from './NeedRecordField'
import { DeclarationOptionsField } from './DeclarationOptionsField'
import intl from '@/utils/intl'

export const SearcherForm: FC<{
  onFinish: () => void // 表单提交回调
  onFormReady: (form: FormInstance<IHKSearcherInfo>) => void // 回调将表单实例传递给父组件
  onCancel: () => void
}> = ({ onFinish, onFormReady, onCancel }) => {
  const { dispatch } = useHKCorpInfoCtx()
  const [form] = Form.useForm<IHKSearcherInfo>()

  const [maskedFields, setMaskedFields] = React.useState<{ [key: string]: boolean }>({}) // 用于记录哪些字段被遮挡

  useEffect(() => {
    onFormReady(form)
  }, [form])

  const [executeGetUserInfo, userInfoData] = useAsync(getUserInfoBackFilling)
  useEffect(() => {
    executeGetUserInfo()
  }, [])

  useEffect(() => {
    // 当获取到用户回填信息时
    if (userInfoData?.Data) {
      // 将回填数据设置到表单中
      form.setFieldsValue(userInfoData.Data)

      // 遍历回填数据，标记已掩码的字段（除了用户名以外）
      Object.keys(userInfoData.Data).forEach((key) => {
        if (userInfoData.Data[key] && key !== 'userName') {
          setMaskedFields((prev) => ({ ...prev, [key]: true }))
        }
      })
    }
  }, [userInfoData])

  const handleFormFinish = (values: IHKSearcherInfo) => {
    try {
      // 用于存储最终提交的值
      const finalValues: IHKSearcherInfo = { ...values }

      // 检查 values 的所有字段

      const toValidateFields = [] // 待验证的字段
      Object.keys(values).forEach((key) => {
        if (maskedFields[key]) {
          // 如果在 maskedFields 中有对应的字段，那么表示该字段未被更改，需要使用原始值，在 finalValues 删除该字段，表示不提交
          delete finalValues[key]
        } else {
          // 如果在 maskedFields 中没有对应的字段，那么表示该字段被更改，需要提交, 并且 validate,
          toValidateFields.push(key)
        }
      })

      // 调用 定义的 validate
      form.validateFields(toValidateFields)

      dispatch({
        type: 'SET_SEARCHER_FORM_VALUES',
        payload: finalValues,
      })
      onFinish()
    } catch (error) {
      console.log('~ error', error)
      message.error(intl(414538, '表单填写有误，请检查'))
    }
  }

  // 处理字段变化
  const handleFieldChange = (fields: { [key: string]: any }) => {
    // 如果字段在 maskedFields 中，表示用户修改了它，所以将它从 maskedFields 中移除
    Object.keys(fields).forEach((fieldName) => {
      if (maskedFields[fieldName]) {
        const updatedMaskedFields = { ...maskedFields }
        delete updatedMaskedFields[fieldName] // 移除该字段
        setMaskedFields(updatedMaskedFields)
      }
    })
  }

  return (
    <>
      {/* // TODO: 翻译 */}
      <p className={styles.hint}>
        <span>{intl(414516, '根据香港特区政府公司注册处规定，查册人需提供以下信息')}</span>
      </p>

      <div className={styles.formContainer}>
        <div className={styles.scrollContent}>
          <h3 className={styles.title}>
            <span>{intl(415033, '查册人信息')}</span>
          </h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormFinish}
            className={styles.form}
            onValuesChange={handleFieldChange}
          >
            <UserNameField maskedFields={maskedFields} />
            <IdentityCardField maskedFields={maskedFields} />
            <EmailField maskedFields={maskedFields} />
            <PhoneField maskedFields={maskedFields} />

            <NeedRecordField />
            <DeclarationOptionsField />
            <ConfirmDeclaration />
          </Form>
        </div>

        <div className={styles.formFooter}>
          <Form.Item>
            <div className={cn('flex', 'justify-end')}>
              <Button
                onClick={() => {
                  onCancel()
                  form.resetFields()
                }}
              >
                {intl('19405', '取消')}
              </Button>
              <Button
                className={cn('ml-6')}
                type="primary"
                onClick={() => {
                  form.submit()
                }}
              >
                {intl(414517, '接受并提交')}
              </Button>
            </div>
          </Form.Item>
        </div>
      </div>
    </>
  )
}
