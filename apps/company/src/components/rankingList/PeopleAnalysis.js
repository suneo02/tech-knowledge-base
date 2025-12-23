import { WCBChart } from '@wind/chart-builder'
import { ConfigProvider, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../../actions/rankingList'
import { rankingListStatistics } from '../../api/rankingListApi'
import { numberFormat, renderEmptyData } from '../../lib/utils'

// 企业动态/最新资讯
class PeopleAnalysis extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.peopleColumns = [
      {
        title: <p>{this.$translation(145878)}</p>,
        dataIndex: 'key',
        width: 200,
      },
      {
        title: <p>{this.$translation(259906)}</p>,
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
      type: 5,
    })
  }

  componentWillReceiveProps = (newProps) => {
    // console.log(newProps);
    newProps.area !== this.props.area &&
      this.props.rankingListStatistics({
        area: newProps.area,
        id: this.props.id,
        // topN: 10,
        type: 5,
      })
  }

  getPeopleOption = (dataList) => {
    // console.log(dataList)
    let _dataList = JSON.parse(JSON.stringify(dataList))
    let max = 0
    let data = _dataList
      .map((item) => {
        let data = {}
        data[item.key] = item.value
        max = item.value > max ? item.value : max
        return {
          name: item.key,
          value: item.value,
        }
      })
      .reverse()
    let option = {
      chart: {
        categoryAxisDataType: 'category',
      },
      config: {
        layoutConfig: {
          transpose: true,
          type: 'bar',
          subType: ['stack'],
        },
        tooltip: {
          formatter: function (params) {
            // console.log(params[0])
            return params[0].value.join(': ')
          },
        },
        legend: { show: false },
        xAxis: {
          '0:0-xAxis-0': {
            isCopied: false,
          },
        },
      },
      indicators: [
        {
          meta: {
            name: '参保人数',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              // distance: 10,
              formatter: function (params, value) {
                return value
              },
            },
          },
          data,
        },
      ],
    }
    if (max < 25) {
      option.config.xAxis['0:0-xAxis-0'].interval = 1
    }
    return option
  }

  render() {
    const { cropListByPeople } = this.props.rankingListDetail
    let _cropListByPeople = cropListByPeople.map((item) => {
      const { from, to, docCount, percent } = item
      return {
        key: `${from}${from ? '人' : ''}${to ? ` - ${to}人` : '以上'}`,
        value: docCount,
        percent,
      }
    })

    return (
      <div className="rankingListAnalysis">
        <p>{this.$translation(260276)}</p>
        <div style={{ display: 'flex' }}>
          <WCBChart data={this.getPeopleOption(_cropListByPeople)} waterMark={false} style={{ height: 400 }} />
          <ConfigProvider renderEmpty={() => renderEmptyData(0, this.$translation)}>
            <Table
              size="small"
              rowKey="key"
              rowClassName={this.props.setRow}
              columns={this.peopleColumns}
              dataSource={_cropListByPeople}
              pagination={false}
              data-uc-id="DNICaTgZW6j"
              data-uc-ct="table"
            />
          </ConfigProvider>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PeopleAnalysis)
