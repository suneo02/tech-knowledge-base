import { Cascader, ConfigProvider, Form } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import React from 'react'
import '../filterOptions/MyCascader.less'
import PrefixLogic from '../filterOptions/PrefixLogic'

/**
 * @deprecated
 * 移步 ts 版
 */
class MyCascader extends React.Component<any, any> {
  item: any
  dropstate: boolean

  constructor(props) {
    super(props)
    this.item = null
    this.dropstate = false
  }

  dropdownRender = (menus) => {
    const { isModal, height } = this.props
    return <div style={{ height: isModal ? '360px' : height ? height : '400px' }}>{menus}</div>
  }

  filter = (inputValue, path) => {
    return path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  onChange = (value, label) => {
    const { onDropdownVisibleChange } = this.props
    if (value.length === 0) {
      if (onDropdownVisibleChange && !this.dropstate) {
        onDropdownVisibleChange(false)
      }
      this.props.onChange && this.props.onChange([])

      return
    }
    let current = value[value.length - 1][0]
    if (['0000', '全国|0000', '全部|0000', 'National|0000', 'All|0000'].includes(current)) {
      // 点击全国，取消其他选中
      value.splice(0, value.length, [current])
    } else {
      // 点击其他，取消全国选中
      ;(value[0][0].split('|')[1] === '0000' || value[0][0] === '0000') && value.splice(0, 1)
    }
    if (onDropdownVisibleChange && !this.dropstate) {
      onDropdownVisibleChange(false)
    }
    this.props.onChange && this.props.onChange(value, label)
  }

  render() {
    const {
      name,
      rules,
      placeholder,
      options,
      hasLogic,
      open,
      isModal,
      onDropdownVisibleChange,
      defaultValue,
      onClear,
      maxTagCount,
      value,
      dropMatchWidth,
      fieldNames = { label: 'name', value: this.props.valueType ? this.props.valueType : 'code', children: 'node' },
    } = this.props

    return (
      <div
        className="filter-item"
        ref={(el) => {
          this.item = el
        }}
      >
        {hasLogic ? <PrefixLogic name={name} /> : null}
        <Form.Item className="item" name={[name, 'value']} rules={rules}>
          <ConfigProvider
            locale={window.en_access_config ? enUS : zhCN}
            theme={{
              token: { colorPrimary: '#0596b3', borderRadius: 0, borderRadiusSM: 2, colorBorder: '#c3c5c9' },
              components: {
                Cascader: { optionSelectedBg: '#d3eef5' },
              },
            }}
          >
            <Cascader
              open={open}
              defaultValue={value ? value : defaultValue ? defaultValue : []}
              value={value}
              onDropdownVisibleChange={(item) => {
                if (onDropdownVisibleChange) {
                  this.dropstate = item
                  onDropdownVisibleChange(item)
                }
              }}
              onClear={() => {
                if (onClear) {
                  onClear()
                }
              }}
              expandTrigger="hover"
              multiple
              maxTagCount={maxTagCount ? maxTagCount : ''}
              fieldNames={fieldNames}
              getPopupContainer={() => this.item}
              // @ts-expect-error ttt
              showSearch={this.filter}
              dropdownClassName={(hasLogic ? 'hasLogic' : '') + ' ' + (isModal ? 'isModal' : '' + ' ') + ' ' + name}
              dropdownRender={this.dropdownRender}
              // @ts-expect-error ttt
              options={options ? options : this.options}
              placeholder={placeholder}
              dropdownMatchSelectWidth={dropMatchWidth}
              onChange={this.onChange}
              data-uc-id="IqLawaA1SW"
              data-uc-ct="cascader"
            />
          </ConfigProvider>
        </Form.Item>
      </div>
    )
  }
}

export default MyCascader
