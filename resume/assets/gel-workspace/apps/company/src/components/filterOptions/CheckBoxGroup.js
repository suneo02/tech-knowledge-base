import { Form, InputNumber } from 'antd'
import React from 'react'

import 'moment/locale/zh-cn'
// import locale from 'antd/es/date-picker/locale/zh_CN';
import { Checkbox, DatePicker } from '@wind/wind-ui'
import { limitNumber } from '../../lib/utils'
import { dateFormat } from '../../locales/constants'
import './CheckBoxGroup.less'
import PrefixLogic from './PrefixLogic'

const { RangePicker } = DatePicker

// 筛选项中的多选框控件
class CheckBoxGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCustom: false,
      customStart: '',
      customEnd: '',
    }
  }

  checkboxChange = (values) => {
    this.setState({ isCustom: values.includes('isCustom') })
    // 每次未选择自定义，先清除痕迹
    if (!values.includes('isCustom')) {
      this.props.itemObj.customStart = 0
      this.props.itemObj.customEnd = 0
    }
  }

  changeStart = (value) => {
    // this.props.itemObj.customStart = value;
    // this.props.setCustomRange({
    //   customStart: value
    // });
    this.state.customStart = value
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
    const { itemKey, setCheckboxValue } = this.props
    setCheckboxValue && setCheckboxValue(itemKey, 'isCustom')
  }

  changeEnd = (value) => {
    // this.props.itemObj.customEnd = value;
    // this.props.setCustomRange({
    //   customEnd: value
    // });
    this.state.customEnd = value
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
    const { itemKey, setCheckboxValue } = this.props
    setCheckboxValue && setCheckboxValue(itemKey, 'isCustom')
  }

  dateChange = (moment, timeString) => {
    // console.log(moment, timeString);
    // this.props.setCustomRange({
    //   customStart: moment[0].format("yyyyMMDD"),
    //   customEnd: moment[1].format("yyyyMMDD"),
    // });
    // 监听自定义输入框的状态
    this.props.customChange && this.props.customChange()
  }

  // 切换自定义是清空对应的设置
  customChange = () => {
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
    // if (!this.state.isCustom) {
    //   return <Checkbox value="isCustom" onChange={this.customChange}>自定义</Checkbox>
    // }
    switch (type) {
      case 1:
        return (
          <Checkbox value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
            </Form.Item>
            {intl('20116', '万')}
          </Checkbox>
        )
      case 2:
        return (
          <Checkbox value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
            </Form.Item>
            {intl('38056', '人')}
          </Checkbox>
        )
      case 3:
        return (
          <Checkbox value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <RangePicker format={dateFormat} onChange={this.dateChange} />
          </Checkbox>
        )
      default:
        return (
          <Checkbox value="isCustom" onChange={this.customChange}>
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={0} max={customEnd ? customEnd : 999998} onChange={this.changeStart} />
            </Form.Item>
            -
            <Form.Item noStyle name={[itemKey, 'customMax']}>
              <InputNumber formatter={limitNumber} parser={limitNumber} min={customStart} max={999999} onChange={this.changeEnd} />
            </Form.Item>
            {type}
          </Checkbox>
        )
    }
  }

  render() {
    // const RadioGroup = (props) => {
    const { itemKey, rules, hasCustom, hasLogic } = this.props
    const { itemOption, logicOption } = this.props.itemObj
    // console.log(this.state);

    return (
      <div className="filter-item">
        {hasLogic ? <PrefixLogic name={itemKey} logicOption={logicOption} /> : null}
        <Form.Item className="my-check-group" name={[itemKey, 'value']} rules={rules}>
          <Checkbox.Group onChange={this.checkboxChange}>
            {itemOption.map((item, index) => {
              return (
                <Checkbox key={index} value={item.value}>
                  {item.name}
                </Checkbox>
              )
            })}
            {hasCustom ? this.getTemplate(hasCustom) : null}
          </Checkbox.Group>
        </Form.Item>
      </div>
    )
  }
}

export default CheckBoxGroup
