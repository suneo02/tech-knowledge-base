import React from "react";
import { connect } from "react-redux";
import { Table, Button, Tag, ConfigProvider } from "antd";
import { WCBChart } from '@wind/chart-builder';
import { rankingListStatistics } from '../../api/rankingListApi';
import * as RankingListActions from "../../actions/rankingList";
import { getMapHost, numberFormat, renderEmptyData } from '../../lib/utils';

// 企业动态/最新资讯
class IndustryAnalysis extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.industryColumns = [
      {
        title: <p>{this.$translation(66287)}</p>,
        dataIndex: "key",
        width: 200,
      },
      {
        title: <p>{this.$translation(259906)}</p>,
        dataIndex: "value",
        width: 100,
        render: (text, record) => numberFormat(text, true, 0),
      },
      {
        title: <p>{this.$translation(265576)}</p>,
        dataIndex: "percent",
        width: 100,
        render: (text, record) => {
          return `${numberFormat(text * 100, true, 2, true)}%`;
        }
      },
    ];
  }

  componentDidMount = () => {
    // this.props.onRef && this.props.onRef(this);
    this.props.rankingListStatistics({
      area: this.props.area,
      id: this.props.id,
      // topN: 10,
      type: 2,
    });
  }

  componentWillReceiveProps = (newProps) => {
    // console.log(newProps);
    newProps.area !== this.props.area && this.props.rankingListStatistics({
      area: newProps.area,
      id: this.props.id,
      // topN: 10,
      type: 2,
    });
  }

  getIpoOption = (dataList) => {
    // console.log(dataList)
    let _dataList = JSON.parse(JSON.stringify(dataList));
    let indicators = [
      {
        meta: {
          type: "pie",
          unit: "%",
          uuid: "0",
        },
        data: {},
      }
    ]
    _dataList.forEach(item => {
      if (item.key === "其他") {
        return;
      }
      if (item.value > 0) {
        indicators[0].data[item.key] = item.value;
      }
    });
    return {
      chart: {
        categoryAxisDataType: "category"
      },
      config: {
        layoutConfig: {
          isSingleSeries: true,
        },
        legend: { show: false },
        series: {
          "0:0-series-0": {
            pie: {
              "radius": ['45%', '75%']
            }
          }
        },
      },
      indicators,
    };
  }

  getAllOption = (dataList) => {
    // console.log(dataList)
    if (dataList.length === 0) {
      return;
    }
    let indicators = [
      {
        meta: {
          type: "pie",
          unit: "%",
          uuid: "0",
        },
        data: {},
      }
    ];
    const { cropListByIPOTotal } = this.props.rankingListDetail;
    const last = dataList[dataList.length - 1];
    if (last.key !== "其他") {
      // 全部已上市
      indicators[0].data["已上市"] = cropListByIPOTotal;
    } else if (last.value === cropListByIPOTotal) {
      // 全部未上市
      indicators[0].data["未上市"] = cropListByIPOTotal;
    } else {
      indicators[0].data["已上市"] = cropListByIPOTotal - last.value;
      indicators[0].data["未上市"] = last.value;
    }
    return {
      chart: {
        categoryAxisDataType: "category"
      },
      config: {
        layoutConfig: {
          isSingleSeries: true,
        },
        legend: { show: false },
      },
      indicators,
    };
  }

  formatTableData = () => {
    const { cropListByIPO, cropListByIPOTotal } = this.props.rankingListDetail;
    if (cropListByIPO.length === 0) {
      return;
    }
    const last = cropListByIPO[cropListByIPO.length - 1];
    let _cropListByIPO = JSON.parse(JSON.stringify(cropListByIPO));
    let tableData = [];
    if (last.key !== "其他") {
      // total=0
      if (cropListByIPOTotal === 0) {
        tableData.push({
          key: "已上市",
          percent: 0,
          value: cropListByIPOTotal,
          children: _cropListByIPO,
        });
      } else {
        // 全部已上市
        tableData.push({
          key: "已上市",
          percent: 1,
          value: cropListByIPOTotal,
          children: _cropListByIPO,
        });
      }
    } else {
      _cropListByIPO.splice(_cropListByIPO.length - 1, 1);
      tableData.push({
        key: "已上市",
        percent: (cropListByIPOTotal - last.value) / cropListByIPOTotal,
        value: cropListByIPOTotal - last.value,
        children: _cropListByIPO,
      });
      tableData.push({ ...last, key: "未上市" });
    }
    return tableData;
  }

  render () {
    const { cropListByArea, cropListByAreaTotal, cropListByIPO, cropListByIPOTotal } = this.props.rankingListDetail;

    return (
      <div className="rankingListAnalysis ipoAnalysis">
        <p>{this.$translation(66287)}</p>
        <div style={{ display: "flex" }}>
          <WCBChart data={this.getAllOption(cropListByIPO)} waterMark={false} style={{ height: 400 }} />
          <WCBChart data={this.getIpoOption(cropListByIPO)} waterMark={false} style={{ height: 400 }} />
          <ConfigProvider renderEmpty={() => renderEmptyData(0, this.$translation)}>
            <Table size="small" rowKey="key" expandedRowKeys={["已上市"]}
              rowClassName={this.props.setRow}
              columns={this.industryColumns}
              dataSource={this.formatTableData()}
              pagination={false} />
          </ConfigProvider>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    rankingListDetail: state.rankingListDetail,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    rankingListStatistics: data => {
      rankingListStatistics(data)
        .then(res => {
          dispatch(RankingListActions.rankingListStatistics({ ...res, ...data }));
        })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndustryAnalysis);