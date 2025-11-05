import { connect } from "react-redux";
import SearchCasader from "./SearchCasader";

/**
 * @deprecated
 */
class SearchRegion extends SearchCasader {
  constructor(props) {
    super(props);
    this.options = [];
    this.initData();
  }

  initData = () => {
    const { options } = this.props;
    const { industries } = this.props.config;
    this.options = options || JSON.parse(JSON.stringify(industries));
    // 行业只过滤前两级
    console.log(this.options);
    // this.options.forEach(option => {
    //   option.node.forEach(item => {

    //     item.node.forEach(x=>{
    //       x.node = null
    //     })
    //   })
    // });
  }
}

const mapStateToProps = state => {
  return {
    config: state.config,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchRegion)