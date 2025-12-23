import { WCBChart } from '@wind/chart-builder'
import { ConfigProvider, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../../actions/rankingList'
import { rankingListStatistics } from '../../api/rankingListApi'
import { numberFormat, renderEmptyData } from '../../lib/utils'

// 企业动态/最新资讯
class AreaAnalysis extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.areaColumns = [
      {
        title: <p>{this.$translation(257635)}</p>,
        dataIndex: 'key',
        width: 200,
      },
      {
        title: <p>{this.$translation(315082, { year: new Date().getFullYear() })}</p>,
        dataIndex: 'value',
        width: 100,
        render: (text) => numberFormat(text, true, 0),
      },
      {
        title: <p>{this.$translation(265576)}</p>,
        dataIndex: 'percent',
        width: 100,
        render: (text) => {
          return `${numberFormat(text * 100, true, 2, true)}%`
        },
      },
    ]
  }

  componentDidMount = () => {
    // this.props.onRef && this.props.onRef(this);
    this.props.rankingListStatistics({
      area: this.props.area,
      id: this.props.id,
      // topN: 10,
      type: 0,
    })
  }

  componentWillReceiveProps = (newProps) => {
    // console.log(newProps);
    newProps.area !== this.props.area &&
      this.props.rankingListStatistics({
        area: newProps.area,
        id: this.props.id,
        // topN: 10,
        type: 0,
      })
  }

  getAreaOption = (dataList) => {
    // console.log(dataList)
    let _dataList = JSON.parse(JSON.stringify(dataList))
    let max = 0
    _dataList.splice(10, dataList.length - 10)
    let indicators = _dataList.map((item) => {
      let data = {}
      data[item.key] = item.value
      max = item.value > max ? item.value : max
      return {
        meta: {
          name: item.key,
          label: {
            show: true,
            position: 'right',
            // distance: 10,
            formatter: function (_params, value) {
              return value
            },
          },
        },
        data,
      }
    })
    let option = {
      chart: {
        categoryAxisDataType: 'category',
      },
      config: {
        title: {
          show: true,
          text: this.$translation(315078),
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
          },
        },
        layoutConfig: {
          transpose: true,
          type: 'bar',
          subType: ['stack'],
        },
        tooltip: {
          formatter: function (params) {
            // console.log(params)
            let num = 0
            params.forEach((item) => {
              num += item.value[1]
            })
            return `${params[0].name}: ${num}`
          },
        },
        legend: { show: false },
        xAxis: {
          '0:0-xAxis-0': {
            isCopied: false,
          },
        },
      },
      indicators,
    }
    if (max < 25) {
      option.config.xAxis['0:0-xAxis-0'].interval = 1
    }
    // console.log(option)
    return option
  }

  render() {
    const { cropListByArea } = this.props.rankingListDetail

    // 去掉补0数据
    let _cropListByArea = []
    cropListByArea.forEach((item) => {
      item.value > 0 && _cropListByArea.push(item)
    })

    return (
      <div className="rankingListAnalysis">
        <p>{this.$translation(260282)}</p>
        <WCBChart data={this.getAreaOption(cropListByArea)} waterMark={false} style={{ height: 400 }} />
        <ConfigProvider renderEmpty={() => renderEmptyData(0, this.$translation)}>
          <Table
            size="small"
            className="whole_width"
            rowKey="key"
            rowClassName={this.props.setRow}
            columns={this.areaColumns}
            dataSource={_cropListByArea}
            pagination={false}
            data-uc-id="1tIox0CQf5-"
            data-uc-ct="table"
          />
        </ConfigProvider>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rankingListDetail: state.rankingListDetail,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rankingListStatistics: (data) => {
      rankingListStatistics(data).then((res) => {
        dispatch(RankingListActions.rankingListStatistics({ ...res, ...data }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaAnalysis)
