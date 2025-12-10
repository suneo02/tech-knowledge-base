import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import { MyIcon } from './Icon'

import './Menu.less'

const { SubMenu } = Menu

// 左侧菜单
class Sider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuList: [
        {
          name: this.$translation(19475),
          url: '/home',
          icon: <MyIcon name="home" />,
        },
        {
          name: this.$translation(254999),
          url: '',
          icon: <MyIcon name="find" />,
          subMenu: [
            {
              name: this.$translation(257776),
              url: '/findCustomer',
            },
            // {
            //   name: this.$translation(254993),
            //   url: "/findInMap",
            // },
          ],
        },
        {
          name: this.$translation(283262),
          url: '',
          icon: <MyIcon name="user" />,
          subMenu: [
            {
              name: this.$translation(23033),
              url: '/userInfo',
            },
          ],
        },
      ],
    }
  }

  componentDidMount = () => {}

  handleClick = (e) => {
    // console.log('click ', e);
    this.props.history.push(e.key)
  }

  render() {
    const { menuList } = this.state
    // console.log(this.props);
    let path = this.props.location.pathname
    path = path === '/' ? '/home' : path

    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 160 }}
        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
        selectedKeys={[path]}
        mode="inline"
        expandIcon={(item) => {
          return (
            <MyIcon className="ant-menu-submenu-expand-icon" name={item.isOpen ? 'Arrow_Up_999@1x' : 'Arrow_Down@1x'} />
          )
        }}
        data-uc-id="cprH1WjeOH"
        data-uc-ct="menu"
      >
        {menuList.map((item, index) => {
          return item.subMenu ? (
            <SubMenu
              key={'sub' + index}
              icon={item.icon}
              title={item.name}
              data-uc-id="IVJypiAs_1"
              data-uc-ct="submenu"
              data-uc-x={'sub' + index}
            >
              {item.subMenu.map((item2, index2) => {
                return <Menu.Item key={item2.url}>{item2.name}</Menu.Item>
              })}
            </SubMenu>
          ) : (
            <Menu.Item key={item.url} icon={item.icon} data-uc-id="N-Eia_otmc" data-uc-ct="" data-uc-x={item.url}>
              {item.name}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sider))
