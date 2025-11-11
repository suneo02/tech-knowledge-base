import { connect } from 'react-redux'
import SearchCasader from './SearchCasader'

class SearchIndustry extends SearchCasader {
  options: any[]
  props: any
  $translation: any
  context: any

  constructor(props) {
    super(props)
    this.options = []
  }

  componentWillMount() {
    this.initData()
  }

  initData = () => {
    const { options } = this.props
    const { industries } = this.props.config
    this.options = options || JSON.parse(JSON.stringify(industries))

    if (this.props.industryLv3) {
    } else {
      // 行业只过滤前两级
      this.options.forEach((option) => {
        option.node.forEach((item) => {
          item.node.forEach((x) => {
            x.node = null
          })
        })
      })
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchIndustry)
