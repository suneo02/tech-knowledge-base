import { connect } from 'react-redux'
import { GlobalContext } from '../../context/GlobalContext'
import MyCascader from './MyCascader'

/**
 * @deprecated
 * 移步 ts 版
 */
class RegionCascader extends MyCascader {
  // 获取context
  static contextType = GlobalContext

  constructor(props) {
    super(props)
    this.options = []
  }

  componentWillMount = () => {
    this.initData()
  }

  initData = () => {
    const { hasLocation, hasTerritory, current_location = [], options, territoryList } = this.props
    const { regions } = this.props.config
    this.options = options || JSON.parse(JSON.stringify(regions))
    // 地区暂处理前两级
    if (this.options.length > 0) {
      if (
        ['我的地盘', 'My Zone', '当前定位', this.$translation(261970)].includes(this.options[1].name) ||
        this.options[1].name.type === 'a'
      ) {
        this.options.splice(1, 1)
      }
      if (
        ['我的地盘', 'My Zone', '当前定位', this.$translation(261970)].includes(this.options[0].name) ||
        this.options[0].name.type === 'a'
      ) {
        this.options.splice(0, 1)
      }
    }
    if (hasTerritory && territoryList.length > 0) {
      let territorys = territoryList.map((item) => {
        return {
          name: item.territoryName,
          code: item.id,
          node: [],
        }
      })
      this.options.unshift({
        name: this.context.language === 'en' ? 'My Zone' : '我的地盘',
        code: 'territory',
        node: territorys,
      })
    }
    if (hasLocation && current_location.length > 0) {
      let name = current_location[0].territoryName
      this.options.unshift({
        name: '当前定位',
        code: 'current_location',
        node: [
          {
            name,
            code: 'current_location_1',
          },
        ],
      })
    } else if (hasLocation && current_location.length === 0) {
      this.options.unshift({
        name: this.$translation(261970),
        code: 'current_location',
        disabled: true,
        node: [],
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    map: state.map,
    config: state.config,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionCascader)
