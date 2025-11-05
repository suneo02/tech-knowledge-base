import { connect } from 'react-redux'
import { truncateNestedOptionsMutating } from '../cascade/handle/truncateNestedOptionsMutating'
import MyCascader from './MyCascader'

/**
 * @deprecated
 * 移步 ts 版
 */
class IndustryCascader extends MyCascader {
  constructor(props) {
    super(props)
    this.options = []
    this.initData()
  }

  initData = () => {
    const { options } = this.props
    const { industries } = this.props.config
    this.options = options || JSON.parse(JSON.stringify(industries))

    if (this.props.industryLv4) {
      return
    }

    const maxDepth = this.props.industryLv3 ? 3 : 2
    truncateNestedOptionsMutating(this.options, maxDepth)
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(IndustryCascader)
