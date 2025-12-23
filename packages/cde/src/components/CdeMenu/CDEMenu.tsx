import { Button, Result, Skeleton } from '@wind/wind-ui'
import { Form } from 'antd'
import { useScrollRestoration } from 'gel-util/hooks'
import { t } from 'gel-util/intl'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { FilterFormItem } from '../CdeForm/components/FilterFormItem'
import { useFilterForm } from '../CdeForm/hooks/useFilterForm'
import { CDEFormBizValues, CDEFormValues, CDEMenuConfigItem } from '../CdeForm/types'
import styles from './index.module.less'
import { LeftMenu } from './LeftMenu'

export type CDEFormRef = {
  resetFields: () => void
  submit: () => Promise<CDEFormBizValues[]>
  getFormValues: () => CDEFormValues
  setFieldsValue: (values: CDEFormValues) => void
}

type CDEFormProps = {
  config: CDEMenuConfigItem[]
  initialSelectedKey?: string
  onValuesChange?: (fieldValues: CDEFormValues, allValues: CDEFormBizValues[]) => void
  initialValues?: CDEFormBizValues[] | CDEFormValues
  showFooter?: boolean
  loading?: boolean
  onFinish?: (values: CDEFormBizValues[]) => Promise<CDEFormBizValues[]>
}

const STRINGS = {
  RESET: t('', '重置条件'),
  SAVE: t('', '保存条件'),
  SUBMIT: t('', '立即搜索'),
  NO_DATA: t('', '暂无数据'),
}

const PREFIX = 'cde-menu'

const CDEFormInternal: React.ForwardRefRenderFunction<CDEFormRef, CDEFormProps> = (
  { config, initialSelectedKey, onValuesChange, initialValues, showFooter, loading, onFinish },
  ref
) => {
  const [activeKey, setActiveKey] = useState(initialSelectedKey || (config?.[0]?.id ?? ''))
  const [form] = Form.useForm()

  useEffect(() => {
    setActiveKey(initialSelectedKey || (config?.[0]?.id ?? ''))
  }, [config, initialSelectedKey])

  const { scrollContainerRef, handleScroll } = useScrollRestoration(activeKey)
  const { normalizedInitialValues, handleValuesChange, formValues, reset, handleFinish, handleSubmit } = useFilterForm({
    config,
    form,
    initialValues,
    onValuesChange,
    onFinish,
  })

  const handleSelect = (key: string) => {
    setActiveKey(key)
  }

  const resetFields = () => {
    reset()
  }

  const getFormValues = () => {
    return form.getFieldsValue()
  }

  useImperativeHandle(ref, () => ({
    resetFields,
    submit: () => handleSubmit(),
    getFormValues,
    setFieldsValue: (values: CDEFormValues) => form.setFieldsValue(values),
  }))

  if (!config && !loading) return <Result status="404" title={STRINGS.NO_DATA} />
  if (loading)
    return (
      <div className={styles[`${PREFIX}-container`]}>
        <div className={styles[`${PREFIX}-wrapper`]}>
          <Skeleton animation />
        </div>
        {showFooter && (
          <div className={styles[`${PREFIX}-footer`]}>
            <Button onClick={() => resetFields()}>{STRINGS.RESET}</Button>
            <Button onClick={() => handleSubmit()}>{STRINGS.SAVE}</Button>
            <Button type="primary" onClick={() => handleSubmit()}>
              {STRINGS.SUBMIT}
            </Button>
          </div>
        )}
      </div>
    )
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-wrapper`]}>
        <div className={styles[`${PREFIX}-left`]}>
          <LeftMenu data={config} onSelect={handleSelect} activeKey={activeKey} formValues={formValues} />
        </div>

        <div className={styles[`${PREFIX}-right`]} ref={scrollContainerRef} onScroll={handleScroll}>
          <Form
            form={form}
            onValuesChange={handleValuesChange}
            initialValues={normalizedInitialValues}
            layout="vertical"
            onFinish={handleFinish}
          >
            {config.map((item) => (
              <div key={item.id} style={{ display: item.id === activeKey ? 'block' : 'none' }}>
                <div key={item.id} className={styles[`${PREFIX}-right-container`]}>
                  <div className={styles[`${PREFIX}-right-title`]}>{item.label}</div>
                  <FilterFormItem name={`form-${item.id}`} config={item.children || []} />
                </div>
              </div>
            ))}
          </Form>
        </div>
      </div>
      {showFooter && (
        <div className={styles[`${PREFIX}-footer`]}>
          <Button onClick={() => resetFields()}>{STRINGS.RESET}</Button>
          <Button onClick={() => handleSubmit()}>{STRINGS.SAVE}</Button>
          <Button type="primary" onClick={() => handleSubmit()}>
            {STRINGS.SUBMIT}
          </Button>
        </div>
      )}
    </div>
  )
}

export const CDEMenu = React.forwardRef(CDEFormInternal)
