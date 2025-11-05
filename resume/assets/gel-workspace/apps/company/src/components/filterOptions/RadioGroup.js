import React from 'react'
import { Form, Radio, InputNumber } from 'antd'
import { MyIcon } from '../Icon'
import 'moment/locale/zh-cn'
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

  dateChange = (moment, timeString) => {
    console.log('🚀 ~ moment, timeString:', moment, timeString)
    // console.log(moment, timeString);
    // this.props.setCustomRange({
    //   customStart: moment[0].format("yyyyMMDD"),
    //   customEnd: moment[1].format("yyyyMMDD"),
    // });
    // 监听自定义输入框的状态
    // this.props.customChange && this.props.customChange();
    const { itemKey, setFieldsValue, customChange } = this.props
    let obj = {}
    obj[itemKey] = {
      value: 'isCustom',
      customMin: moment[0].format('yyyyMMDD'),
      customMax: moment[1].format('yyyyMMDD'),
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
          <Radio value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
            </Form.Item>
            {intl('20116', '万')}
          </Radio>
        )
      case 2:
        return (
          <Radio value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
            </Form.Item>
            {intl('38056', '人')}
          </Radio>
        )
      case 3:
        return (
          <Radio value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'date']}>
              <RangePicker format={dateFormat} onChange={this.dateChange} />
            </Form.Item>
          </Radio>
        )
      default:
        return (
          <Radio value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
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
        {hasLogic ? <PrefixLogic name={itemKey} logicOption={logicOption} /> : null}
        <Form.Item className="my-check-group" style={hasLogic ? { flex: 1 } : {}} name={[itemKey, 'value']} rules={rules}>
          <Radio.Group onChange={this.radioChange}>
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
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={detailEnd ? detailEnd : 999998} onChange={(value) => this.detailChange(value, 'min')} />
            </Form.Item>
            -
            <Form.Item noStyle name={[hasDetail.itemId, 'max']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={detailStart} max={999999} onChange={(value) => this.detailChange(value, 'max')} />
            </Form.Item>
          </div>
        ) : null}
      </div>
    )
  }
}

export default RadioGroup
