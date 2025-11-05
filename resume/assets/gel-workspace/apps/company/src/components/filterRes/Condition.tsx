import { Button } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import { pointBuried } from '../../api/configApi'
import OptionViewport2 from '../../components/filterOptions/OptionViewport2'
import { connectZustand } from '../../store'
import { useConditionFilterStore } from '../../store/cde/useConditionFilterStore'
import intl from '../../utils/intl'
import OptionViewport from '../filterOptions/OptionViewport'
import { MyIcon } from '../Icon'

// import "./Condition.less";

// 筛选详情页面左侧条件模块
class Condition extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {}

  // static getDerivedStateFromProps(props, state) {
  //   // console.log('getDerivedStateFromProps', props, state);
  //   return props;
  // }

  addFilter = () => {
    pointBuried({
      action: '922604570160',
      params: [],
    })
    this.props.changeFilterVisible()
  }

  search = () => {
    this.props.search(1, 40)
  }

  saveSub = () => {
    this.props.toggleSubscribe()
  }

  render() {
    const {
      filters = [],
      geoFilter = [],
      changeFilterVisible,
      changeGeoFilter,
      changeFilter,
      getPreItemInfo,
    } = this.props
    // console.log(geoFilter);
    return (
      <div className="condition">
        <p className="title" style={{ margin: '4px 0' }}>
          <MyIcon name="filter" /> {intl(257655, '筛选条件')}
        </p>
        <Button className="addBtn" icon={<MyIcon name="add" />} onClick={this.addFilter}>
          {' '}
          {intl(257741, '添加筛选条件')}
        </Button>
        <div className="option-viewports">
          {/* 暂不显示一句话内容 */}
          {/* {sentence ? <OptionViewport mode={1} title={"我想要找"} value={sentence} /> : null} */}
          <OptionViewport2
            changeFilterVisible={changeFilterVisible}
            geoFilter={geoFilter}
            changeGeoFilter={changeGeoFilter}
          />
          {filters.map((item, index) => {
            if (item.field == 'finance_type_code') {
              // 金融机构 单独处理
              return (
                <OptionViewport
                  key={index}
                  mode={2}
                  filter={item}
                  title={item.title}
                  value={item.value}
                  logic={item.logic}
                  info={getPreItemInfo(item.itemId)}
                  changeFilter={changeFilter}
                  changeFilterVisible={changeFilterVisible}
                  detailFilter={
                    filters[index + 1] && filters[index + 1].field === item.field ? filters[index + 1] : null
                  }
                />
              )
            }
            return (
              <OptionViewport
                key={index}
                mode={2}
                filter={item}
                title={item.title}
                value={item.itemType == '9' ? (item.search ? item.search : item.value) : item.value}
                logic={item.logic}
                info={getPreItemInfo(item.itemId)}
                changeFilter={changeFilter}
                changeFilterVisible={changeFilterVisible}
                detailFilter={filters[index + 1] && filters[index + 1].field === item.field ? filters[index + 1] : null}
              />
            )
          })}
        </div>

        <Button
          className="condition-btn-save"
          // @ts-expect-error
          type="default"
          disabled={filters.length === 0 || this.props.subscribeBtnDisabled}
          onClick={this.saveSub}
        >
          {' '}
          {intl('261051', '保存条件')}
        </Button>

        <Button
          className="condition-btn-ok"
          disabled={filters.length === 0 && geoFilter.length === 0}
          type="primary"
          onClick={this.search}
        >
          {intl(257693, '应用筛选')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

export default connectZustand(useConditionFilterStore, (state) => ({
  getPreItemInfo: state.getPreItemInfo,
  // geoFilter: state.geoFilters,
  // filters: state.filters
}))(connect(mapStateToProps, mapDispatchToProps)(Condition))
