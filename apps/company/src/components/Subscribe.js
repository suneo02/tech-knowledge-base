import { Button, Checkbox, Input, message, Modal, Radio } from '@wind/wind-ui'
import { Space } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import * as globalActions from '../actions/global'
import { MyIcon } from './Icon'
import global from '../lib/global'
import store from '../store/store'
import intl from '../utils/intl'

import './Subscribe.less'

// 添加订阅控件
class Subscribe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      subscribed: true, // 是否开启推送，默认是
      emailNotice: true, // 是否邮件提醒，默认是
      emailEdit: true, //  初始展示邮箱输入框
      email: '',
      originalEmailNotice: true,
      originalEmail: '', // 客户自己邮箱
      name: '',
    }
  }

  componentDidMount = () => {}

  componentWillReceiveProps = (newProps) => {
    if (newProps && newProps.visible) {
      this.state.originalEmail = this.state.email
      this.state.originalEmailNotice = this.state.emailNotice
      this.state.name = newProps.name
    }
    // if (newProps && newProps.userPackageinfo && newProps.userPackageinfo.email) {
    //     this.state.email = newProps.userPackageinfo.email;
    //     this.state.originalEmail = newProps.userPackageinfo.email;
    //     this.state.emailEdit = false;
    // }

    if (newProps && newProps.findCustomer && newProps.findCustomer.subEmail) {
      this.state.email = newProps.findCustomer.subEmail
      this.state.originalEmail = newProps.findCustomer.subEmail
      this.state.emailEdit = false
    }
    if (newProps && newProps.info) {
      this.state.email = newProps.info.subEmail ? newProps.info.subEmail : this.state.email
      this.state.originalEmail = newProps.info.subEmail ? newProps.info.subEmail : this.state.email
      this.state.emailEdit = newProps.info.subEmail && newProps.info.subPush ? false : true
      this.state.name = newProps.info.subName ? newProps.info.subName : this.state.name

      if (newProps.info.fromAdd && !newProps.info.subName) {
        this.state.name = ''
      }
    }
  }

  nameChange = (e) => {
    this.setState({ name: e.target.value })
  }

  handleCancel = () => {
    this.state.emailNotice = this.state.originalEmailNotice
    this.props.changeVisible()
  }

  subscribeChange = (e) => {
    this.setState({
      subscribed: e.target.value,
      //   emailNotice: !e.target.value ? false : this.state.emailNotice,
    })
  }

  emailNoticeChange = (e) => {
    this.setState({
      emailNotice: e.target.checked,
    })
  }

  editChange = (e) => {
    e.preventDefault()
    this.setState({
      emailEdit: true,
      email: '',
    })
  }

  edit = (e) => {
    this.setState({
      email: e.target.value,
    })
  }

  OkHandle = () => {
    if (this.props.type === 1) {
      // 筛选结果页
      this.finish()
    } else {
      // 相似客户页
      this.finish()
    }
  }

  finish = () => {
    const { emailNotice, email, originalEmail, name } = this.state
    const { subscribe, emailBinding, dissubscribe, type, setTitle } = this.props
    const { subType } = this.props
    let subscribed = this.state.subscribed
    let info = this.props.info
    let param = null

    // const patt = /^([A-Za-z0-9_\-\.\*])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const patt = /^([A-Za-z0-9_\-\.*])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (name && setTitle) {
      setTitle(name)
    }

    if (!name) {
      message.error(intl(237985, '订阅名称不能为空'))
      return false
    }

    // if (type !== 1 && subscribed === subType) {
    //   // 对已订阅的情况进行判断，如果邮箱或者订阅方式改变
    //   if (subscribed && (originalEmail !== email || this.state.originalEmailNotice !== this.state.emailNotice)) {
    //     // subscribed = false
    //   } else {
    //     this.handleCancel();
    //     return;
    //   }
    // }

    if (!subscribed) {
      // 不推送
      if (info && info.id) {
        // 编辑修改原订阅
        param = {
          id: info.id,
          subName: name,
          subPush: 0,
          superQueryLogic: info.superQueryLogic,
        }
      }
    } else if (info && info.id && subscribed) {
      // 编辑修改原订阅，当前需要推送
      if (!emailNotice) {
        // 不发邮件
        param = {
          id: info.id,
          subName: name,
          subPush: 0,
          superQueryLogic: info.superQueryLogic,
        }
      } else {
        if (!email) {
          message.error(intl(257723, '请输入邮箱地址'))
          return false
        } else if (!patt.test(email)) {
          message.error(intl(283268, '邮箱地址格式不正确！'))
          return false
        }

        param = {
          id: info.id,
          subName: name,
          subPush: 1,
          mail: email,
          superQueryLogic: info.superQueryLogic,
        }
      }

      this.props.changeVisible()
    } else if (emailNotice) {
      if (!email) {
        message.error(intl(257723, '请输入邮箱地址'))
        return
      } else if (!patt.test(email)) {
        message.error(intl(283268, '邮箱地址格式不正确！'))
        return
      }
    }

    subscribe(
      {
        emailNotice: !subscribed ? false : emailNotice,
        email,
        name,
      },
      param
    ).then((res) => {
      if (!res) return
      if (res.code == '200029') {
        let txt = res.ErrorMessage
        if (txt) {
          txt = txt.split(':')[1]
          this.props.visible && this.props.changeVisible()
          this.addAgainLimit(txt)
          return false
        } else {
          message.info('订阅条件重复')
          return false
        }
      }
      if (res.code == '200028') {
        this.props.visible && this.props.changeVisible()
        this.addOverLimit()
        return false
      }

      if (res.code === global.SUCCESS) {
        //   message.info(intl(286714, '开启订阅成功！'));
        message.success('操作成功')
        this.props.visible && this.props.changeVisible()
      }
    })
  }

  addOverLimit = (okCall) => {
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'showAllSubModelPage',
        width: 500,
        height: 180,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: '温馨提示',
        content: <div>最多只可订阅20组条件，您已超限，您可以删除或者修改已订阅的条件。</div>,
        footer: [
          <Button
            type="grey"
            onClick={() => store.dispatch(globalActions.clearGolbalModal())}
            data-uc-id="UUvLmxbcUw-"
            data-uc-ct="button"
          >
            {intl('19405', '取消')}
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              store.dispatch(globalActions.clearGolbalModal())
            }}
            data-uc-id="WZTqZSVR3L3"
            data-uc-ct="button"
          >
            {intl('138836', '确定')}
          </Button>,
        ],
      })
    )
  }

  addAgainLimit = (txt) => {
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'showAllSubModelPage',
        width: 500,
        height: 180,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: '温馨提示',
        content: <div>{`您想订阅的条件和已订阅"${txt}"中的条件重复，请勿重复订阅。`}</div>,
        footer: [
          <Button
            type="grey"
            onClick={() => store.dispatch(globalActions.clearGolbalModal())}
            data-uc-id="rD-zyx7rgjv"
            data-uc-ct="button"
          >
            {intl('19405', '取消')}
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              store.dispatch(globalActions.clearGolbalModal())
            }}
            data-uc-id="t8FVlzol7kS"
            data-uc-ct="button"
          >
            {intl('138836', '确定')}
          </Button>,
        ],
      })
    )
  }

  render() {
    const { visible } = this.props
    const { subscribed, emailNotice, emailEdit, email, name } = this.state

    return (
      <Modal
        className="subscribe"
        title={intl('237485', '温馨提示')}
        visible={visible}
        onCancel={this.handleCancel}
        width={560}
        cancelText={intl(286234, '取消')}
        okText={intl(286235, '确定')}
        onOk={this.finish}
        data-uc-id="EynXOlfz3aW"
        data-uc-ct="modal"
      >
        <p className="content">
          {intl('438536', '保存筛选条件并订阅。订阅后，我们将根据保存的筛选条件，定期推送最新符合条件的企业给您')}
        </p>
        {name !== undefined && (
          <p className="name">
            <label>
              {' '}
              <i>*</i> {intl(5026, '订阅名称')}
            </label>
            <Input
              placeholder={intl('438534', '请输入名称，30个字符以内')}
              style={{ width: 435 }}
              value={name}
              onChange={this.nameChange}
              data-uc-id="DIvj9m5NVM2"
              data-uc-ct="input"
            />
          </p>
        )}
        <Radio.Group onChange={this.subscribeChange} value={subscribed} data-uc-id="IduWLfrfCwW" data-uc-ct="radio">
          <Space direction="vertical" data-uc-id="SWqQCqnuUp7" data-uc-ct="space">
            <Radio value={false} data-uc-id="H4XYqnaxzpS" data-uc-ct="radio">
              {intl('438515', '不推送')}
            </Radio>
            <Radio value={true} data-uc-id="A6GtRPamkPG" data-uc-ct="radio">
              {intl('438516', '开启推送')}
            </Radio>
          </Space>
        </Radio.Group>
        {subscribed && (
          <Checkbox
            onChange={this.emailNoticeChange}
            checked={emailNotice}
            data-uc-id="o3RrFWh9ZqC"
            data-uc-ct="checkbox"
          >
            {intl(283267)}
            {emailEdit ? (
              <>
                <Input
                  placeholder={intl(257723, '请输入邮箱地址')}
                  style={{ width: 344 }}
                  maxLength={50}
                  value={email}
                  onChange={this.edit}
                  data-uc-id="wqx-auvy3-E"
                  data-uc-ct="input"
                />
                <div style={{ color: '#999' }}>此邮箱将作为全部订阅推送邮件的接收邮箱</div>
              </>
            ) : (
              <span>
                {email}
                <MyIcon name="rename" onClick={this.editChange} data-uc-id="xsVXpPhBJaR" data-uc-ct="myicon" />
              </span>
            )}
          </Checkbox>
        )}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // userPackageinfo: state.home.userPackageinfo,
    findCustomer: state.findCustomer,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe)
