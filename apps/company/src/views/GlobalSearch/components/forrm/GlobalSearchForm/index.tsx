import { WindCascade } from '@/components/cascade/WindCascade'
import intl from '@/utils/intl'
import { hashParams } from '@/utils/links'
import Form, { FormProps } from '@wind/wind-ui-form'
import { ConfigProvider, Flex } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { areaTreeGlobalForSearch } from 'gel-util/config'
import React from 'react'
import { SelectOptionProps } from '../common/select/type'
import './index.less'

export interface GlobalSearchFormProps extends FormProps {
  text?: string
}

const GlobalSearchForm: React.FC<GlobalSearchFormProps> = ({ onValuesChange, onFinish }) => {
  const [form] = Form.useForm()

  // 从页面地址获取初始值
  const { getParamValue } = hashParams()
  const lsId = getParamValue('lsId')
  const areaCode = getParamValue('areaCode')

  let initialValues: SelectOptionProps
  if (lsId) {
    // 从 localStorage 获取数据
    const globalSearchData = JSON.parse(localStorage.getItem('globalSearch'))
    initialValues = globalSearchData[lsId] || {}
  } else {
    initialValues = getParamValue('initialValues')
      ? JSON.parse(getParamValue('initialValues'))
      : areaCode
        ? { areaCode: [areaCode] }
        : { areaCode: [] }
  }
  console.log('🚀 ~ initialValues:', initialValues)

  // 处理表单值的变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (values?: any, allValues?: any) => {
    const lastItems = allValues?.areaCode?.map((item) => item[item.length - 1]) as string[]
    allValues.areaCode = {
      title: intl('6886', '国家/地区'),
      value: lastItems.join(),
      label: allValues.areaCode?.map((item) => item[item.length - 1]).join('，'),
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
                dropdownMatchSelectWidth
                // dropdownRender={(menus) => <div className="global-seach-cascader">{menus}</div>}
                showSearch
              />
              {/* <Cascader
                options={RegionJSON}
                multiple
                size="small"
                style={{ width: '100%' }}
                maxTagCount={20}
                placeholder={intl('138649', '不限')}
                expandTrigger="click"
                dropdownMatchSelectWidth
                dropdownRender={(menus) => <div className="global-seach-cascader">{menus}</div>}
                showSearch
              /> */}
            </Form.Item>
          </ConfigProvider>
        </Flex>
      </div>
    </Form>
  )
}

export default GlobalSearchForm
