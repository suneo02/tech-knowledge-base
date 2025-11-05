import React from 'react'
import {  Radio, Input, Space, Checkbox, message, InputNumber } from 'antd'
import { GlobalContext } from '../context/GlobalContext'

import './Subscribe.less'
import NumberRangeOption from '../components/restructFilter/comps/filterOptions/NumberRangeOption'
import intl from '../utils/intl'
import { Modal } from '@wind/wind-ui';

// 下载超限提醒
class LimitNotice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      radioVal: 1,
      start: 0,
      customValue: 0,
      inputErr: false,
    }
    this.leftPage = 0
    this.rightPage = 0
  }

  // 获取context
  static contextType = GlobalContext

  customValueChange = (val) => {
    // 多选的自定义操作
    console.log(val)
    if (val === '-' || !val) {
      // 空数据
      //   setCustomValue('')
      //   changeOptionCallback(defaultValue.filter(item => item !== customValue))
      this.setState({ customValue: '', inputErr: true })
      return
    }
    const lNum = val.split('-')[0] ? val.split('-')[0] - 0 : 0
    const rNum = val.split('-')[1] ? val.split('-')[1] - 0 : 0
    this.leftPage = lNum
    this.rightPage = rNum
    if (rNum && lNum > rNum) {
      this.setState({ customValue: '', inputErr: true })
      return
    }

    if (rNum && rNum - lNum > 49) {
      this.setState({ customValue: '', inputErr: true })
      return
    }

    this.setState({
      inputErr: false,
    })
  }

  componentDidMount = () => {}

  handleCancel = () => {
    this.props.changeVisible()
  }

  radioChange = (e) => {
    this.setState({
      radioVal: e.target.value,
    })
  }

  changeHandle = (value) => {
    // console.log(value);
    this.setState({ start: value, radioVal: 0 })
  }

  OkHandle = () => {
    if (!this.leftPage || !this.rightPage) {
      this.setState({
        inputErr: true,
      })
      return
    }
    if (this.leftPage > this.rightPage) return
    if (this.rightPage - this.leftPage > 50) {
      return
    }
    // if (this.props.type === 1) {
    //   // 筛选结果页
    //   this.finish();
    // } else {
    //   // 相似客户页
    //   this.finish();
    // }
    this.finish()
  }

  finish = () => {
    console.log(this.leftPage)
    console.log(this.rightPage)
    // const { radioVal, start } = this.state;
    const { postFn } = this.props
    postFn(this.leftPage, (this.rightPage - this.leftPage + 1) * 20, this.rightPage, this.props.total)
  }

  render() {
    const { visible, total } = this.props
    const { radioVal, customValue, inputErr } = this.state
    // console.log(this.state);

    return (
      <Modal
        className="subscribe"
        title={intl('4698', '导出数据')}
        visible={visible}
        onCancel={this.handleCancel}
        width={560}
        cancelText={intl(286234, '取 消')}
        okText={intl(286235, '确 定')}
        onOk={this.OkHandle}
      >
        <p className="title">{intl('355863', '每次最多导出1000条（50页），请选择导出的页码数')}</p>
        {/* <Radio.Group onChange={this.radioChange} value={radioVal} style={{marginBottom: 28}}>
          <Space>
            <Radio value={1}>{intl(257753, {count: 200})}</Radio>
            {
              this.context.language === "en" ? <Radio value={0}>200 data since <InputNumber onChange={this.changeHandle} min={1} max={total - 199 < 1 ? 1 : total - 199} /></Radio>
                : <Radio value={0}>自第<InputNumber onChange={this.changeHandle} min={1} max={total - 199 < 1 ? 1 : total - 199} />条起后200条</Radio>
            }
          </Space>
        </Radio.Group> */}

        <NumberRangeOption
          min={customValue ? customValue.split('-')[0] : ''}
          max={customValue ? customValue.split('-')[1] : ''}
          maxVal={50}
          changeOptionCallback={this.customValueChange}
          unit={'页'}
        />

        {inputErr ? <p className="export-error"> {intl('355821', '输入有误，请重新输入！')} </p> : ''}
      </Modal>
    )
  }
}

export default LimitNotice
