import { Form, InputNumber } from 'antd'
import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
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

  dateChange = (dayjsDate, timeString) => {
    // console.log(dayjsDate, timeString);
    // this.props.setCustomRange({
    //   customStart: dayjsDate[0].format("YYYYMMDD"),
    //   customEnd: dayjsDate[1].format("YYYYMMDD"),
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
          <Checkbox value="isCustom" onChange={this.customChange} data-uc-id="6fpByimYfb" data-uc-ct="checkbox">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="fgX1UsmVdd"
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
                data-uc-id="BuknwPxq55"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            {intl('20116', '万')}
          </Checkbox>
        )
      case 2:
        return (
          <Checkbox value="isCustom" onChange={this.customChange} data-uc-id="ndlBxrk7G1" data-uc-ct="checkbox">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="FN_S3tUv62"
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
                data-uc-id="ppmoqiUGqG"
                data-uc-ct="inputnumber"
              />
            </Form.Item>
            {intl('38056', '人')}
          </Checkbox>
        )
      case 3:
        return (
          <Checkbox value="isCustom" onChange={this.customChange} data-uc-id="q0lMFc8k9f" data-uc-ct="checkbox">
            {intl(25405, '自定义')}
            <RangePicker
              format={dateFormat}
              onChange={this.dateChange}
              data-uc-id="u6rHxM_hGk"
              data-uc-ct="rangepicker"
            />
          </Checkbox>
        )
      default:
        return (
          <Checkbox value="isCustom" onChange={this.customChange} data-uc-id="LBaMTgwLDw" data-uc-ct="checkbox">
            {intl(25405, '自定义')}
            <Form.Item noStyle name={[itemKey, 'customMin']}>
              <InputNumber
                formatter={limitNumber}
                parser={limitNumber}
                min={0}
                max={customEnd ? customEnd : 999998}
                onChange={this.changeStart}
                data-uc-id="Xf0VDqR-s7z"
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
                data-uc-id="VrduGkphpC6"
                data-uc-ct="inputnumber"
              />
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
        {hasLogic ? (
          <PrefixLogic name={itemKey} logicOption={logicOption} data-uc-id="-Jf1jqgJ6Fz" data-uc-ct="prefixlogic" />
        ) : null}
        <Form.Item className="my-check-group" name={[itemKey, 'value']} rules={rules}>
          <Checkbox.Group onChange={this.checkboxChange} data-uc-id="8pDItOazI" data-uc-ct="checkbox">
            {itemOption.map((item, index) => {
              return (
                <Checkbox
                  key={index}
                  value={item.value}
                  data-uc-id="oVcBWr6tRv"
                  data-uc-ct="checkbox"
                  data-uc-x={index}
                >
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
