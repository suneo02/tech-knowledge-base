import React from 'react'
import { Form, Radio, InputNumber } from 'antd'
import { MyIcon } from '../Icon'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import PrefixLogic from './PrefixLogic'
import './CheckBoxGroup.less'
import { limitNumber } from '../../lib/utils'
import { DatePicker } from '@wind/wind-ui'
import { dateFormat } from '../../locales/constants'
const { RangePicker } = DatePicker

// 筛选项中的单选框控件
class RadioGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCustom: false,
      customStart: '',
      customEnd: '',
      detailStart: '',
      detailEnd: '',
    }
  }

  radioChange = (e) => {
    console.log(e.target.value)
    this.setState({ isCustom: e.target.value === 'isCustom' })
    const { hasDetail, setFieldsValue, customChange, itemKey, extraConfig } = this.props
    // 每次打开/关闭自定义，先清除痕迹
    this.props.itemObj.customStart = 0
    this.props.itemObj.customEnd = 0
    // 每次选择有无，先清除痕迹
    if (this.props.hasDetail) {
      let obj = {}
      obj[hasDetail.itemId] = {
        value: [],
        min: '',
        max: '',
      }
      setFieldsValue && setFieldsValue(obj)
      customChange && customChange()
    } else {
      let obj = {}
      obj[itemKey] = {
        value: e.target.value,
      }
      setFieldsValue && setFieldsValue(obj, extraConfig)
    }
  }

  changeStart = (value) => {
    // this.props.setCustomRange({
    //   customStart: value
    // });
    this.state.customStart = value
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
    const { itemKey, setFieldsValue } = this.props
    let obj = {}
    obj[itemKey] = {
      value: 'isCustom',
    }
    setFieldsValue && setFieldsValue(obj)
  }

  changeEnd = (value) => {
    // this.props.setCustomRange({
    //   customEnd: value
    // });
    this.state.customEnd = value
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
    const { itemKey, setFieldsValue } = this.props
    let obj = {}
    obj[itemKey] = {
      value: 'isCustom',
    }
    setFieldsValue && setFieldsValue(obj)
  }

  dateChange = (dayjsDate, timeString) => {
    console.log('🚀 ~ dayjsDate, timeString:', dayjsDate, timeString)
    // console.log(dayjsDate, timeString);
    // this.props.setCustomRange({
    //   customStart: dayjsDate[0].format("YYYYMMDD"),
    //   customEnd: dayjsDate[1].format("YYYYMMDD"),
    // });
    // 监听自定义输入框的状态
    // this.props.customChange && this.props.customChange();
    const { itemKey, setFieldsValue, customChange } = this.props
    let obj = {}
    obj[itemKey] = {
      value: 'isCustom',
      customMin: dayjsDate[0].format('YYYYMMDD'),
      customMax: dayjsDate[1].format('YYYYMMDD'),
    }
    setFieldsValue && setFieldsValue(obj)
    customChange && customChange()
  }

  // 切换自定义是清空对应的设置
  customChange = () => {
    // console.log("radioChange");
    // this.props.setCustomRange({
    //   customStart: null,
    //   customEnd: null,
    // });
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
  }

  getTemplate = (type) => {
    const { customStart, customEnd } = this.state
    const { itemKey } = this.props
    switch (type) {
      case 1:
        return (
          <Radio value="isCustom" onChange={this.customChange} data-uc-id="13om83MXpa" data-uc-ct="radio">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="0ojVbfNGtXh"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={customStart}
                max={999999}
                onChange={this.changeEnd}
                data-uc-id="siZ0wNuIFGX"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            {intl('20116', '万')}
          </Radio>
        )
      case 2:
        return (
          <Radio value="isCustom" onChange={this.customChange} data-uc-id="hQTqVNDwfUP" data-uc-ct="radio">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="ie5WI4tbT8C"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={customStart}
                max={999999}
                onChange={this.changeEnd}
                data-uc-id="kRk7r8NaAJL"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            {intl('38056', '人')}
          </Radio>
        )
      case 3:
        return (
          <Radio value="isCustom" onChange={this.customChange} data-uc-id="Gst9zGe_3zM" data-uc-ct="radio">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'date']}>
              <RangePicker
                format={dateFormat}
                onChange={this.dateChange}
                data-uc-id="0YQkVr_-tD"
                data-uc-ct="rangepicker"
              />
            </Form.Item>
          </Radio>
        )
      default:
        return (
          <Radio value="isCustom" onChange={this.customChange} data-uc-id="HPtlK6orbjj" data-uc-ct="radio">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="a-VXBkP5IgI"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={customStart}
                max={999999}
                onChange={this.changeEnd}
                data-uc-id="AWGjE90mxxb"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            {type}
          </Radio>
        )
    }
  }

  // 关联选中有无选项中的有
  detailChange = (value, type) => {
    // console.log(value);
    if (type === 'min') {
      this.state.detailStart = value
    } else {
      this.state.detailEnd = value
    }
    const { itemKey, setFieldsValue } = this.props
    let obj = {}
    obj[itemKey] = {
      value: 'true',
    }
    setFieldsValue && setFieldsValue(obj)
    this.props.customChange && this.props.customChange()
  }

  render() {
    // const RadioGroup = (props) => {
    const { itemKey, rules, hasCustom, hasDetail, hasLogic } = this.props
    const { detailStart, detailEnd } = this.state
    const { itemOption, logicOption } = this.props.itemObj
    // console.log(this.state);

    return (
      <div className="filter-item">
        {hasLogic ? (
          <PrefixLogic name={itemKey} logicOption={logicOption} data-uc-id="M8kQ78gunTJ" data-uc-ct="prefixlogic" />
        ) : null}
        <Form.Item
          className="my-check-group"
          style={hasLogic ? { flex: 1 } : {}}
          name={[itemKey, 'value']}
          rules={rules}
        >
          <Radio.Group onChange={this.radioChange} data-uc-id="hVp-kXnbOyA" data-uc-ct="">
            {itemOption.map((item, index) => {
              return (
                <Radio key={index} value={item.value}>
                  {item.name}
                </Radio>
              )
            })}
            {hasCustom ? this.getTemplate(hasCustom) : null}
          </Radio.Group>
        </Form.Item>
        {hasDetail ? (
          <div className="item-detail">
            <p>
              {hasDetail.itemName}
              {hasDetail.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null}
            </p>
            <Form.Item noStyle name={[hasDetail.itemId, 'min']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={detailEnd ? detailEnd : 999998}
                onChange={(value) => this.detailChange(value, 'min')}
                data-uc-id="LszqyN2xT_g"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            -
            <Form.Item noStyle name={[hasDetail.itemId, 'max']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={detailStart}
                max={999999}
                onChange={(value) => this.detailChange(value, 'max')}
                data-uc-id="TzU4y9e7CAv"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
          </div>
        ) : null}
      </div>
    )
  }
}

export default RadioGroup
