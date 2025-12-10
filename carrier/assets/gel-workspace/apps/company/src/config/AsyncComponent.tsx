import React, { Component } from 'react'

// 异步加载组件，拆分文件打包
// React.lazy ?
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component<
    any,
    {
      component: any
    }
  > {
    constructor(props) {
      super(props)
      this.state = {
        component: null,
      }
    }

    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({
        component: component,
      })
    }

    render() {
      const Comp = this.state.component
      return Comp ? <Comp {...this.props} /> : null
    }
  }
  return AsyncComponent
}
