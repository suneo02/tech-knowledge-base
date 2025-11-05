import { connect } from 'react-redux'

import * as HomeActions from '../../actions/home'
import {
  getPayGoods
} from '../../api/homeApi'

import { VipModule as VipModuleNew } from './VipModuleNew'
// 需要替换成下载的二维码


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
export const VipModule = VipModuleNew

export default connect(mapStateToProps, mapDispatchToProps)(VipModuleNew)
