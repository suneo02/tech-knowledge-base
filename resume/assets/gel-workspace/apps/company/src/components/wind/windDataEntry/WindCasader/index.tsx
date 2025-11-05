/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-08-29 22:09:26
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-09 15:15:36
 * @FilePath: \Wind.GEL.Web\src\components\wind\windDataEntry\WindCasader\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { WindCascadeFieldNamesCommon } from '@/components/cascade/type'
import { globalAreaTree } from '@/utils/areaTree'
import {
  globalIndustryOfNationalEconomy,
  globalIndustryOfNationalEconomy3,
} from '@/utils/industryOfNationalEconomyTree'
import intl from '@/utils/intl'
import { Button, Divider } from '@wind/wind-ui'
import { Cascader, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import React, { useEffect, useState } from 'react'
import './index.less'

/**
 * @deprecated
 * @param {*} props
 * @returns
 */
export const WindCascadeForConfigDetail = (props) => {
  const [value, setValue] = useState()
  const [options, setOptions] = useState(props.options)
  const [hasChanged, setHasChanged] = useState(false)
  const [open, setOpen] = useState(false)

  const dropdownRender = (dom) => {
    return (
      <div>
        {dom}
        <Divider />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBlockEnd: 8,
            paddingInlineEnd: 12,
          }}
        >
          <Button onClick={() => handleOnChange()}>{intl('138836', '确定')}</Button>
        </div>
      </div>
    )
  }
  const handleOnChange = (val?) => {
    setHasChanged(false)
    props.onChange((val || value)?.flat()?.join(), props.parentKey)
    setOpen(false)
  }

  useEffect(() => {
    let _options
    switch (props?.optionsKey) {
      case 'area':
        _options = globalAreaTree
        break
      case 'industry':
        _options = globalIndustryOfNationalEconomy
        break
      case 'industryOld':
        _options = globalIndustryOfNationalEconomy3
        break
      default:
        _options = options
        break
    }
    setOptions(_options)
  }, [])
  return (
    <ConfigProvider
      locale={window.en_access_config ? enUS : zhCN}
      theme={{
        token: { colorPrimary: '#0596b3', borderRadius: 0, borderRadiusSM: 2, colorBorder: '#c3c5c9' },
        components: {
          Cascader: { optionSelectedBg: '#d3eef5', controlWidth: 140 },
        },
      }}
    >
      <Cascader
        className="calvin-cascader"
        style={props.style}
        open={open}
        expandTrigger="hover"
        fieldNames={WindCascadeFieldNamesCommon}
        options={options}
        onChange={
          props?.mode === 'multiple'
            ? (e) => {
                if (!open) {
                  handleOnChange(e)
                  return
                }
                setValue(e)
                setHasChanged(true)
              }
            : handleOnChange
        }
        multiple={props?.mode === 'multiple'}
        onDropdownVisibleChange={(e) => {
          setOpen(e)
          if (!e && hasChanged) {
            handleOnChange()
          }
        }}
        showSearch
        maxTagCount={1}
        maxTagTextLength={3}
        placeholder={intl(props?.defaultId, props?.default)}
        dropdownRender={props?.mode === 'multiple' ? dropdownRender : null}
      />
    </ConfigProvider>
  )
}
