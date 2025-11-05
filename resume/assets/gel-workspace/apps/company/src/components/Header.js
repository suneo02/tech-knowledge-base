import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
// import i18n from 'i18next';
import { Button, Modal } from "antd";
import { getUserInfo } from "../api/userApi";
import { pointBuried } from "../api/configApi";
import global from '../lib/global';
import { parseQueryString } from '../lib/utils';

import "./Header.less";

// 登录前的页面头部
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname,
      menuList: [
        // {
        //   name: "产品",
        //   url: "",
        // },
        // {
        //   name: "行业解决方案",
        //   url: "",
        // },
        // {
        //   name: "服务与支持",
        //   url: "",
        // },
        // {
        //   name: "关于我们",
        //   url: "",
        // }
      ]
    };
  }

  componentDidMount = () => {
    this.getUserInfo();
  }

  getUserInfo = () => {
    getUserInfo().then(res => {
      if (res.code === global.SUCCESS) {
        this.props.history.push("/");
      }
    });
  }

  login = () => {
    pointBuried({
      action: "922604570253",
      params: [
        { paramName: "Terminal_System", paramValue: "" },
        { paramName: "Terminal_Resolution", paramValue: "" },
      ],
    });
    this.props.changeLoginVisible();
  }

  register = () => {
    pointBuried({
      action: "922604570254",
      params: [
        { paramName: "Terminal_System", paramValue: "" },
        { paramName: "Terminal_Resolution", paramValue: "" },
      ],
    });
    this.props.changeRegisterVisible();
  }

  render () {

    const { path, menuList } = this.state;

    return (
      <div className="header">
        <div className="logo"></div>
        <ul className="menu">
          {
            menuList.map((item, index) => {
              return <a key={index} href={item.url} className={path === item.url || (index === 0 && path === '/') ? "curr" : ""}><li>{item.name}</li></a>;
            })
          }
        </ul>
        <div className="login">
          <Button type="primary" onClick={this.login}>{this.$translation(99999695)}</Button>
          <Button onClick={this.register}>{this.$translation(153506)}</Button>
        </div>
        <Modal {...this.props.home.globalModalProps}>
          {this.props.home.globalModalProps && this.props.home.globalModalProps.content}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    home: state.home,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Header))