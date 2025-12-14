import { WCBChart } from '@wind/chart-builder'
import { ConfigProvider, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../../actions/rankingList'
import { rankingListStatistics } from '../../api/rankingListApi'
import { numberFormat, renderEmptyData } from '../../lib/utils'

// 企业动态/最新资讯
class IndustryAnalysis extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.industryColumns = [
      {
        title: <p>{this.$translation(257653)}</p>,
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
      type: 1,
    })
  }

  componentWillReceiveProps = (newProps) => {
    // console.log(newProps);
    newProps.area !== this.props.area &&
      this.props.rankingListStatistics({
        area: newProps.area,
        id: this.props.id,
        // topN: 10,
        type: 1,
      })
  }

  getIndustryOption = (dataList) => {
    // console.log(dataList)
    let _dataList = JSON.parse(JSON.stringify(dataList))
    if (_dataList.length > 10) {
      const { cropListByIndustryTotal } = this.props.rankingListDetail
      _dataList.splice(9, dataList.length - 9)
      let prevNum = 0
      _dataList.forEach((item) => {
        prevNum += item.value
      })
      _dataList.push({
        key: '其他',
        value: cropListByIndustryTotal - prevNum,
      })
    }
    let indicators = [
      {
        meta: {
          type: 'pie',
          unit: '%',
          uuid: '0',
        },
        data: {},
      },
    ]
    _dataList.forEach((item) => {
      indicators[0].data[item.key] = item.value
    })
    return {
      chart: {
        categoryAxisDataType: 'category',
      },
      config: {
        layoutConfig: {
          isSingleSeries: true,
        },
        legend: { show: false },
        series: {
          '0:0-series-0': {
            pie: {
              radius: ['45%', '75%'],
            },
          },
        },
      },
      indicators,
    }
  }

  render() {
    const { cropListByIndustry } = this.props.rankingListDetail

    return (
      <div className="rankingListAnalysis">
        <p>{this.$translation(261357)}</p>
        <WCBChart data={this.getIndustryOption(cropListByIndustry)} waterMark={false} style={{ height: 400 }} />
        <ConfigProvider renderEmpty={() => renderEmptyData(0, this.$translation)}>
          <Table
            size="small"
            rowKey="key"
            className="whole_width"
            rowClassName={this.props.setRow}
            columns={this.industryColumns}
            dataSource={cropListByIndustry}
            pagination={false}
            data-uc-id="-B-xupjzyc"
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

export default connect(mapStateToProps, mapDispatchToProps)(IndustryAnalysis)
