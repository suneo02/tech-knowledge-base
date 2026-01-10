import { Button, Checkbox, message, Modal } from '@wind/wind-ui'
import React from 'react'
import { addCollect, deleteCollect } from '../../api/searchListApi'
import intl from '../../utils/intl'
import './history.less'
// import Checkbox from "antd/lib/checkbox/Checkbox";
const CheckboxGroup = Checkbox.Group
class Collect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollect: false,
      visible: false,
      visible2: false,
      group: '',
      defaultSelected: [],
    }
  }

  componentDidMount = () => {
    const { state, list } = this.props
    this.setState({ isCollect: state })
    if (this.props.from == 'detail') {
      if (state) {
        this.setState({ visible2: true })
      } else {
        this.setState({ visible: true })
      }
    }
    if (list && list.length > 1) {
      const firstOption = list[1].groupId
      this.setState({
        defaultSelected: [firstOption],
        group: firstOption,
      })
    }
  }

  changeStatus = () => {
    let { isCollect } = this.state
    if (isCollect) {
      this.setState({ visible2: true })
    } else {
      this.setState({ visible: true })
    }
  }
  handleOk = (_e, show) => {
    let { code } = this.props
    if (show == 'visible') {
      let { group } = this.state
      if (!group) {
        message.warning(intl(0, '请选择分组'), 2)
        return
      }
      addCollect({ groupIdArray: group, CompanyCode: code }).then((res) => {
        if (res.Data == true) {
          message.success(intl('261913', '已收藏') + '！', 2)
          if (this.props.from == 'detail') {
            this.props.close()
            this.props.change(true)
          }
          this.setState({ isCollect: true, [show]: false })
        } else {
          this.props.close()
          message.warning('新增收藏失败！', 2)
          this.setState({ [show]: false })
        }
      })
    } else {
      deleteCollect({ CompanyCode: code, groupId: 'all' }).then((res) => {
        if (res.Data == true) {
          message.success(intl('257657', '取消收藏'), 2)
          if (this.props.from == 'detail') {
            this.props.close()
            this.props.change(false)
          }
          this.setState({ isCollect: false, [show]: false })
        } else {
          this.props.close()
          message.warning('取消收藏失败！', 2)
          this.setState({ [show]: false })
        }
      })
    }
  }
  handleCancel = (_e, show) => {
    if (this.props.from == 'detail') {
      this.props.close()
    }
    this.setState({
      [show]: false,
    })
  }
  checkChange = (value) => {
    console.log(value)
    this.setState({ group: value.join(',') })
  }
  render() {
    const { list } = this.props
    let option = []
    if (list) {
      list.map((item, index) => {
        if (index > 0) {
          let obj = {
            label: item.name,
            value: item.groupId,
          }
          option.push(obj)
        }
      })
    }
    return (
      <div>
        <Modal
          title={intl('437320', '选择分组')}
          visible={this.state.visible}
          onOk={(e) => this.handleOk(e, 'visible')}
          width="400px"
          onCancel={(e) => this.handleCancel(e, 'visible')}
          data-uc-id="31UuGxhCba6"
          data-uc-ct="modal"
        >
          <div className="warn-layer-msg">
            <span className="collect-modal-c-title"> {intl('437299', '将所选企业收藏至')} </span>
            <CheckboxGroup
              options={option}
              onChange={this.checkChange}
              defaultValue={this.state.defaultSelected}
              data-uc-id="9HBbdWJpYlj"
              data-uc-ct="checkboxgroup"
            ></CheckboxGroup>
          </div>
        </Modal>
        <Modal
          title={intl('31041', '提示')}
          visible={this.state.visible2}
          onOk={(e) => this.handleOk(e, 'visible2')}
          width="400px"
          onCancel={(e) => this.handleCancel(e, 'visible2')}
          data-uc-id="MudbqxW7G96"
          data-uc-ct="modal"
        >
          <div className="warn-layer-msg">{intl('257657', '取消收藏')}?</div>
        </Modal>
        {this.props.from == 'detail' ? null : (
          <Button onClick={this.changeStatus} data-uc-id="XNxevhSWwTs" data-uc-ct="button">
            <i className={this.state.isCollect ? 'list-icon-customer-ok' : 'list-icon-customer'}></i>
            {this.state.isCollect ? intl('138129', '已收藏') : intl('143165', '收藏')}
          </Button>
        )}
      </div>
    )
  }
}

export default Collect
