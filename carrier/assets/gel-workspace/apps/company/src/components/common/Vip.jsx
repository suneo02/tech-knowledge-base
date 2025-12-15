/**
 * 暂时用原来写的，改个名字，之后有时间优化
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import { getPayGoods } from '../../api/homeApi'
import * as HomeActions from '../../actions/home'
import VipModule from '../company/VipModule'

function VipComponent(props) {
  return <VipModule {...props}></VipModule>
}

const mapStateToProps = (state) => {
  return {
    home: state.home,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPayGoods: (data) => {
      getPayGoods().then((res) => {
        console.log(res)
        res && res.Data && dispatch(HomeActions.getPayGoods({ ...res }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VipComponent)
