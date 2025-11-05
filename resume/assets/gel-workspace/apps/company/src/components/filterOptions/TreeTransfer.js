import React from 'react'
import { GlobalContext } from '../../context/GlobalContext'
// import {  Transfer, Tree } from 'antd';
import { MyIcon } from '../Icon'
import './TreeTransfer.less'
import intl from '../../utils/intl'
import { Modal, Transfer, Tree } from '@wind/wind-ui'

const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1

const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ children, ...props }) => ({
    disabled: checkedKeys.includes(props.indicator),
    disableCheckbox: children,
    selectable: false,
    children: generateTree(children, checkedKeys),
    ...props,
    name: (
      <>
        {props.name}
        {/* {props.isVip ? <MyIcon name="vip_filter" className="vip_filter" /> : null} */}
      </>
    ),
  }))

// 指标树选择控件
class TreeTransfer extends React.Component {
  // 获取context
  static contextType = GlobalContext

  constructor(props) {
    console.log('🚀 ~ TreeTransfer ~ constructor ~ props:', props)
    super(props)
    this.state = {
      targetKeys: props.targetKeys,
      leftHeight: 400,
    }
    this.selectedKeys_right = []
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    // console.log(targetKeys);
    // console.log(targetKeys, direction, moveKeys);
    if (direction === 'right') {
      if (moveKeys.length === 0) {
        return
      }
      let right = moveKeys.map((key) => targetKeys.indexOf(key))
      right
        .sort((a, b) => {
          return a - b
        })
        .reverse()
      right.forEach((index, i) => {
        targetKeys.splice(targetKeys.length - i - 1, 0, targetKeys.splice(index, 1)[0])
      })
      // this.setState({ targetKeys });
      this.setState({ targetKeys }, () => {
        let leftHeight = document.getElementsByClassName('w-transfer-list-content')[0]?.offsetHeight
        this.setState({ leftHeight })
      })
    } else {
      let list = document.getElementsByClassName('w-transfer-list-content-item').length
      let leftHeight = 400
      if (list < 13) {
        leftHeight = 400
      } else {
        leftHeight = list * 28
      }
      this.setState({ targetKeys, leftHeight })
    }
  }

  onOk = () => {
    this.props.onChange(this.state.targetKeys)
    this.props.changeVisible()
  }

  toTop = () => {
    console.log(this.state.targetKeys, this.selectedKeys_right)
    const { targetKeys } = this.state
    if (this.selectedKeys_right.length === 0) {
      return
    }
    let right = this.selectedKeys_right.map((key) => targetKeys.indexOf(key))
    right.sort((a, b) => {
      return a - b
    })
    right.forEach((index, i) => {
      // 前两位是id，name
      targetKeys.splice(i, 0, targetKeys.splice(index, 1)[0])
    })
    this.setState({ targetKeys })
  }

  up = () => {
    console.log(this.state.targetKeys, this.selectedKeys_right)
    const { targetKeys } = this.state
    if (this.selectedKeys_right.length === 0) {
      return
    }
    let right = this.selectedKeys_right.map((key) => targetKeys.indexOf(key))
    right.sort((a, b) => {
      return a - b
    })
    console.log(right)
    right.forEach((index, i) => {
      let toIndex = index - 1 > 2 + i ? index - 1 : 2 + i
      // console.log(toIndex)
      targetKeys.splice(toIndex, 0, targetKeys.splice(index, 1)[0])
    })
    this.setState({ targetKeys })
  }

  down = () => {
    console.log(this.state.targetKeys, this.selectedKeys_right)
    const { targetKeys } = this.state
    if (this.selectedKeys_right.length === 0) {
      return
    }
    let right = this.selectedKeys_right.map((key) => targetKeys.indexOf(key))
    right
      .sort((a, b) => {
        return a - b
      })
      .reverse()
    right.forEach((index, i) => {
      let toIndex = index + 1 > targetKeys.length - i - 1 ? targetKeys.length - i - 1 : index + 1
      console.log(toIndex)
      targetKeys.splice(toIndex, 0, targetKeys.splice(index, 1)[0])
    })
    this.setState({ targetKeys })
  }

  toBottom = () => {
    // console.log(this.state.targetKeys, this.selectedKeys_right);
    const { targetKeys } = this.state
    if (this.selectedKeys_right.length === 0) {
      return
    }
    let right = this.selectedKeys_right.map((key) => targetKeys.indexOf(key))
    right
      .sort((a, b) => {
        return a - b
      })
      .reverse()
    right.forEach((index, i) => {
      targetKeys.splice(targetKeys.length - i - 1, 0, targetKeys.splice(index, 1)[0])
    })
    this.setState({ targetKeys })
  }

  render() {
    const { visible, changeVisible, dataSource } = this.props
    const { targetKeys, leftHeight } = this.state
    console.log('🚀 ~ TreeTransfer ~ render ~ targetKeys:', dataSource, targetKeys)

    const filterTargetKeys = targetKeys.filter((i) => dataSource.some((j) => j?.indicator === i))
    return (
      <Modal
        className="treeTransfer"
        title={intl(257761, '选择列指标')}
        width={760}
        visible={visible}
        onCancel={changeVisible}
        onOk={this.onOk}
        cancelText={intl(286234, '取 消')}
        okText={intl(286235, '确 定')}
      >
        <Transfer
          onChange={this.handleChange}
          targetKeys={filterTargetKeys}
          dataSource={dataSource}
          className="tree-transfer"
          rowKey={(record) => record.indicator}
          render={(item) => (
            <>
              {item.name}
              {/* {item.isVip ?  <MyIcon name="vip_filter" className="vip_filter" />   : null} */}
            </>
          )}
          showSelectAll={false}
          locale={{
            itemUnit: window.en_access_config ? 'Item' : '项',
            itemsUnit: window.en_access_config ? 'Item' : '项',
            searchPlaceholder: '请输入搜索内容',
          }}
          titles={[intl(3604, '待选指标'), intl(257692, '已选指标')]}
        >
          {({ direction, onItemSelect, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...filterTargetKeys]
              return (
                <Tree
                  blockNode
                  checkable
                  checkStrictly
                  defaultExpandAll
                  fieldNames={{ title: 'name', key: 'indicator' }}
                  height={leftHeight}
                  checkedKeys={checkedKeys}
                  treeData={generateTree(dataSource, filterTargetKeys)}
                  onCheck={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                  onSelect={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                />
              )
            } else {
              this.selectedKeys_right = selectedKeys
            }
          }}
        </Transfer>
        <div className="treeTransfer_right">
          <a className="top" onClick={this.toTop}>
            <MyIcon name="ToTop_small_999@1x" />
          </a>
          <a className="up" onClick={this.up}>
            <MyIcon name="Up_small_999@1x" />
          </a>
          <a className="down" onClick={this.down}>
            <MyIcon name="Down_999@1x" />
          </a>
          <a className="bottom" onClick={this.toBottom}>
            <MyIcon name="ToBottom_small_999@1x" />
          </a>
        </div>
      </Modal>
    )
  }
}

export default TreeTransfer
