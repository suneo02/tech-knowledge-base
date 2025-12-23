import { Cascader, ConfigProvider, Form } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import React from 'react'
import '../../components/filterOptions/MyCascader.less'
import PrefixLogic from '../../components/filterOptions/PrefixLogic'
import './searchCascader.less'
/**
 * @deprecated
 */
class SearchCasader extends React.Component<any, any> {
  item: any
  dropstate: boolean

  constructor(props) {
    super(props)
    this.state = {}
    this.item = null
    this.dropstate = false
  }

  dropdownRender = (menus) => {
    const { isModal } = this.props
    return <div style={{ height: isModal ? '360px' : '190px' }}>{menus}</div>
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
    if (this.props.useCode) {
      // 需要用到code 地区编码
      this.props.onChange && this.props.onChange(value, label)
    } else {
      this.props.onChange && this.props.onChange(value)
    }
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
      maxTagCount,
      value,
      fieldNames = { label: 'name', value: 'name', children: 'node' },
      expandTrigger = 'hover',
    } = this.props
    const cssName = this.props.cssName || ''
    // value && value.length > 0 ? typeof(value) == 'string' ? value.split(' ') : value : []
    return (
      <div
        className={cssName ? `${cssName} filter-item` : 'filter-item'}
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
                Cascader: { optionSelectedBg: '#d3eef5', controlWidth: 140 },
              },
            }}
          >
            <Cascader
              size="small"
              open={open}
              key={value && value.length > 0 ? (typeof value == 'string' ? value.split(' ') : value) : []}
              defaultValue={value && value.length > 0 ? (typeof value == 'string' ? value.split(' ') : value) : []}
              onDropdownVisibleChange={(item) => {
                if (onDropdownVisibleChange) {
                  this.dropstate = item
                  onDropdownVisibleChange(item)
                }
              }}
              expandTrigger={expandTrigger}
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
              dropdownMatchSelectWidth={false}
              onChange={this.onChange}
              data-uc-id="onKNAa_HfXS"
              data-uc-ct="cascader"
              data-uc-x={value && value.length > 0 ? (typeof value == 'string' ? value.split(' ') : value) : []}
            />
          </ConfigProvider>
        </Form.Item>
      </div>
    )
  }
}

export default SearchCasader
