import { WindCascade } from '@/components/cascade/WindCascade'
import { WindCascadeFieldNamesCommon } from '@/components/cascade/type'
import { globalAreaTree } from '@/utils/areaTree'
import { globalIndustryOfNationalEconomy3 } from '@/utils/industryOfNationalEconomyTree'
import intl from '@/utils/intl'
import { corpDescCondition, createDate, moreFilter, organizationType } from '@/views/GlobalSearch/config'
import { DeleteO } from '@wind/icons'
import { Button, Divider, Tag } from '@wind/wind-ui'
import Form, { FormProps } from '@wind/wind-ui-form'
import React, { useState } from 'react'
import CustomRadio from '../common/radio/CustomRadio'
import WSelect, { WSelectAbstractProps } from '../common/select/WSelect'
import { PRIMARY_COLOR_1, SelectOptionProps } from '../common/select/type'
import './index.less'
// import intl  from '@/utils/intl'

export interface ChinaSearchFormProps extends FormProps {
  isModernBrowser?: boolean
  text?: string
}

const ChinaSearchForm: React.FC<ChinaSearchFormProps> = ({ onValuesChange, onFinish }) => {
  const [form] = Form.useForm()

  // 从页面地址获取初始值
  const searchParams = new URLSearchParams(window.location.search)
  const lsId = searchParams.get('lsId')

  let initialValues: SelectOptionProps
  if (lsId) {
    // 从 localStorage 获取数据
    const globalSearchData = JSON.parse(localStorage.getItem('globalSearch') || '{}')
    initialValues = globalSearchData[lsId] || {}
  } else {
    initialValues = JSON.parse(searchParams.get('initialValues') || '{}')
  }
  const [formValues, setFormValues] = useState<SelectOptionProps | {}>(initialValues)

  // 处理表单值的变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (values?: any, allValues?: any) => {
    console.log('🚀 ~ handleFormChange ~ allValues:', allValues)
    if (allValues?.regioninfo) {
      allValues.regioninfo = {
        title: '省份地区',
        value: allValues.regioninfo?.map((item) => item.map((res) => res).join(' ')).join('|'),
        label: allValues.regioninfo?.map((item) => item[item.length - 1]).join('，'),
      }
    }
    if (allValues?.industryname) {
      const _industryData = allValues.industryname.map((item) => item[item.length - 1])
      allValues.industryname = {
        title: '国标行业',
        value: _industryData.join('|'),
        label: _industryData.join('，'),
      }
    }
    setFormValues(allValues)
    onValuesChange?.(values, allValues)
  }

  const handleDeleteTag = (key: string) => {
    form.setFieldsValue({
      [key]: null,
    })
    handleFormChange(form.getFieldsValue(), form.getFieldsValue())
  }
  // TODO 最好做成组件
  const renderTags = () => {
    return Object.entries(formValues)
      .filter(([, values]) => values?.length || values?.value)
      .map(([key, values]) => {
        if (values?.length) {
          return (
            // @ts-expect-error wind ui
            <Tag.CheckableTag
              style={{
                marginBlockEnd: 8,
                // maxWidth: '300px',
              }}
              key={key}
              checked={true}
              closable
              onClose={() => handleDeleteTag(key)}
            >
              {values?.[0]?.filterLabel || values?.[0]?.title}：
              <span
                style={{
                  color: PRIMARY_COLOR_1,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  marginBottom: -5,
                }}
              >
                {values.map((value) => value.label).join('，')}
              </span>
            </Tag.CheckableTag>
          )
        } else if (typeof values === 'object' && 'value' in values) {
          return (
            // @ts-expect-error wind ui
            <Tag.CheckableTag
              style={{
                marginBlockEnd: 8,
              }}
              key={key}
              checked={true}
              closable
              onClose={() => handleDeleteTag(key)}
            >
              {values?.filterLabel || values?.title}：
              <span
                style={{
                  color: PRIMARY_COLOR_1,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  marginBottom: -5,
                }}
              >
                {values?.labelCloned || values?.label}
              </span>
            </Tag.CheckableTag>
          )
        }
        return null
      })
  }

  return (
    <div className="china-search-form-container">
      {Object.entries(formValues)?.filter(([, val]) => val?.length || val?.value)?.length > 0 && (
        <>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ width: 80, marginBlockStart: 1 }}>已选条件</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderTags()}
                <span>
                  {/* <Button
                    icon={<SaveO />}
                    type="link"
                    size="small"
                    onClick={() => {
                      const timestamp = Date.now()
                      const key = 'globalSearch'
                      const existingData = JSON.parse(localStorage.getItem(key) || '{}')
                      const newData = { ...existingData, [timestamp]: formValues }
                      localStorage.setItem(key, JSON.stringify(newData))
                    }}
                  >
                    保存
                  </Button> */}

                  <Button
                    // @ts-expect-error wind icons
                    icon={<DeleteO />}
                    type="link"
                    size="small"
                    onClick={() => {
                      form.resetFields()
                      setFormValues(form.getFieldsValue())
                      handleFormChange(form.getFieldsValue(), form.getFieldsValue())
                    }}
                  >
                    {intl('67839', '重置')}
                  </Button>
                </span>
              </div>
            </div>
          </div>
          <Divider style={{ marginBlockStart: 4, marginBlockEnd: 12 }} />
        </>
      )}
      <Form
        className="form-container"
        initialValues={initialValues}
        form={form}
        onValuesChange={handleFormChange}
        onFinish={onFinish}
      >
        <div className="form-item">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="label">{intl('31990', '机构类型')}</div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Form.Item name={'orgType'} style={{ marginBlockEnd: 0 }}>
                  <CustomRadio label={intl('31990', '机构类型')} options={organizationType} showAdvanced />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className="form-item">
          <div className="flex-container">
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="label" style={{ marginInlineEnd: 8 }}>
                {intl('451213', '省份地区')}
              </div>
              <div style={{ minWidth: '300px' }}>
                <Form.Item name={'regioninfo'} style={{ marginBlockEnd: 0 }}>
                  <WindCascade
                    fieldNames={{ ...WindCascadeFieldNamesCommon, value: 'name' }}
                    options={globalAreaTree}
                    maxTagCount="responsive"
                    dropdownMenuColumnStyle={{ width: 180 }}
                  />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="label">{intl('257690', '国标行业')}</div>
              <div style={{ minWidth: '300px' }}>
                <Form.Item name={'industryname'} style={{ marginBlockEnd: 0 }}>
                  <WindCascade
                    fieldNames={{ ...WindCascadeFieldNamesCommon, value: 'name' }}
                    options={globalIndustryOfNationalEconomy3}
                    maxTagCount="responsive"
                    popupPlacement="bottomRight"
                    dropdownMenuColumnStyle={{ width: 220 }}
                    // dropdownMatchSelectWidth
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className="form-item">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="label">{intl('2824', '成立时间')}</div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Form.Item name={'establishedTime'} style={{ marginBlockEnd: 0 }}>
                  <CustomRadio showCustom label={intl('2824', '成立时间')} options={createDate} />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className="form-item">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="label">{intl('437316', '企业描述')}</div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {corpDescCondition.map((item, index) => {
                  const { key, ...rest } = item
                  return (
                    <Form.Item key={index} name={key} style={{ marginBlockEnd: 0 }}>
                      <WSelect {...(rest as WSelectAbstractProps)} />
                    </Form.Item>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="form-item">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div className="label">
              {intl('257674', '更多筛选')}
              <i className="vip-icon vip"></i>
            </div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {moreFilter.map((item, index) => {
                  const { key, ...rest } = item
                  return (
                    <Form.Item key={index} name={key} style={{ marginBlockEnd: 0 }}>
                      <WSelect {...(rest as WSelectAbstractProps)} />
                    </Form.Item>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default ChinaSearchForm
