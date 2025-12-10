import { outCompanyParam } from '@/handle/searchConfig'
import intl from '@/utils/intl'
import { hashParams } from '@/utils/links'
import Form, { FormProps } from '@wind/wind-ui-form'
import { ConfigProvider, Flex } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { WindCascade, WindCascadeFieldNamesCommon } from 'gel-ui'
import { areaTreeGlobalForSearch } from 'gel-util/config'
import React from 'react'
import './index.less'

export interface GlobalSearchFormProps extends FormProps {
  text?: string
}

const GlobalSearchForm: React.FC<GlobalSearchFormProps> = ({ onValuesChange, onFinish }) => {
  const [form] = Form.useForm()

  // 从页面地址获取初始值
  const { getParamValue } = hashParams()
  const areaType = getParamValue('areaType')

  let initialValues
  if (areaType) {
    const code = outCompanyParam.find((c) => c.param === areaType)?.code
    initialValues = { areaCode: code ? [[code]] : [] }
  }

  const handleFormChange = (values?: any, allValues?: { areaCode: string[][] }) => {
    const lastItems = allValues?.areaCode?.map((item) => item[item.length - 1])
    allValues.areaCode = {
      // @ts-expect-error ttt
      title: intl('6886', '国家/地区'),
      value: lastItems?.join(),
      label: allValues.areaCode?.map((item) => item[item.length - 1])?.join('，'),
    }
    onValuesChange?.(values, allValues)
  }

  return (
    <Form initialValues={initialValues} form={form} onValuesChange={handleFormChange} onFinish={onFinish}>
      <div style={{ position: 'relative' }}>
        <Flex align="start" style={{ width: '100%' }}>
          <div style={{ width: 70, marginBlockStart: 5, marginInlineEnd: 8 }}>{intl('6886', '国家/地区')}</div>
          <ConfigProvider
            locale={window.en_access_config ? enUS : zhCN}
            theme={{
              token: { colorPrimary: '#0596b3', borderRadius: 0, borderRadiusSM: 2, colorBorder: '#c3c5c9' },
              components: {
                Cascader: { optionSelectedBg: '#d3eef5', controlWidth: 140, dropdownHeight: '680px' },
              },
            }}
          >
            <Form.Item name={'areaCode'} style={{ marginBlockEnd: 0, flex: 1 }}>
              <WindCascade
                options={areaTreeGlobalForSearch}
                multiple
                size="small"
                style={{ width: '100%' }}
                maxTagCount={20}
                placeholder={intl('138649', '不限')}
                expandTrigger="click"
                fieldNames={WindCascadeFieldNamesCommon}
                dropdownMatchSelectWidth
                showSearch
                data-uc-id="nXdnPUlyBq"
                data-uc-ct="windcascade"
              />
            </Form.Item>
          </ConfigProvider>
        </Flex>
      </div>
    </Form>
  )
}

export default GlobalSearchForm
