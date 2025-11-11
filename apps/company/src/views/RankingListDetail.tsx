import { Breadcrumb, Card, Input, LocaleProvider, Select, Tabs } from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../actions/rankingList'
import { rankingListSearchCorps } from '../api/rankingListApi'
import { MyIcon } from '../components/Icon'
import AreaAnalysis from '../components/rankingList/AreaAnalysis'
import CapitalAnalysis from '../components/rankingList/CapitalAnalysis'
import IPOAnalysis from '../components/rankingList/IPOAnalysis'
import IndustryAnalysis from '../components/rankingList/IndustryAnalysis'
import PeopleAnalysis from '../components/rankingList/PeopleAnalysis'
import TypeAnalysis from '../components/rankingList/TypeAnalysis'
import { getCompanyUrl, numberFormat, renderEmptyData } from '../lib/utils'

import intl from '../utils/intl'
import './RankingListDetail.less'

const { TabPane } = Tabs

const provinceList = [
  {
    name: '全国',
    value: '',
    nameId: '51886',
  },
  {
    name: '安徽省',
    value: '安徽省',
    nameId: '77236',
  },
  {
    name: '北京市',
    value: '北京市',
    nameId: '151970',
  },
  {
    name: '重庆市',
    value: '重庆市',
    nameId: '28010',
  },
  {
    name: '福建省',
    value: '福建省',
    nameId: '77239',
  },
  {
    name: '甘肃省',
    value: '甘肃省',
    nameId: '77254',
  },
  {
    name: '广东省',
    value: '广东省',
    nameId: '77251',
  },
  {
    name: '广西壮族自治区',
    value: '广西壮族自治区',
    nameId: '77250',
  },
  {
    name: '贵州省',
    value: '贵州省',
    nameId: '77241',
  },
  {
    name: '海南省',
    value: '海南省',
    nameId: '77252',
  },
  {
    name: '河北省',
    value: '河北省',
    nameId: '77245',
  },
  {
    name: '黑龙江省',
    value: '黑龙江省',
    nameId: '77258',
  },
  {
    name: '河南省',
    value: '河南省',
    nameId: '77247',
  },
  {
    name: '湖北省',
    value: '湖北省',
    nameId: '77248',
  },
  {
    name: '湖南省',
    value: '湖南省',
    nameId: '77249',
  },
  {
    name: '江苏省',
    value: '江苏省',
    nameId: '77235',
  },
  {
    name: '江西省',
    value: '江西省',
    nameId: '77238',
  },
  {
    name: '吉林省',
    value: '吉林省',
    nameId: '77260',
  },
  {
    name: '辽宁省',
    value: '辽宁省',
    nameId: '77259',
  },
  {
    name: '内蒙古自治区',
    value: '内蒙古自治区',
    nameId: '77244',
  },
  {
    name: '宁夏回族自治区',
    value: '宁夏回族自治区',
    nameId: '77255',
  },
  {
    name: '青海省',
    value: '青海省',
    nameId: '77256',
  },
  {
    name: '山东省',
    value: '山东省',
    nameId: '77234',
  },
  {
    name: '上海市',
    value: '上海市',
    nameId: '28275',
  },
  {
    name: '山西省',
    value: '山西省',
    nameId: '77246',
  },
  {
    name: '陕西省',
    value: '陕西省',
    nameId: '77253',
  },
  {
    name: '四川省',
    value: '四川省',
    nameId: '77240',
  },
  {
    name: '天津市',
    value: '天津市',
    nameId: '28297',
  },
  {
    name: '新疆维吾尔自治区',
    value: '新疆维吾尔自治区',
    nameId: '77257',
  },
  {
    name: '西藏自治区',
    value: '西藏自治区',
    nameId: '77243',
  },
  {
    name: '云南省',
    value: '云南省',
    nameId: '77242',
  },
  {
    name: '浙江省',
    value: '浙江省',
    nameId: '77237',
  },
]

// 招投标
class RankingListDetail extends React.Component<any, any> {
  columns: any
  timer: any
  tabsBoxEl: any
  $translation: any

  constructor(props) {
    super(props)
    this.state = {
      info: props.location.state,
      name: '',
      province: '',
      activeKey: '0',
    }
    this.columns = [
      {
        title: <p>{this.$translation(138677)}</p>,
        dataIndex: 'corpName',
        width: 200,
        render: (text, record) => {
          const { corpId, corpName } = record
          return corpId ? (
            <a
              onClick={() => {
                window.open(getCompanyUrl(corpId))
              }}
              rel="noreferrer"
              data-uc-id="FRkGdwJhhSp"
              data-uc-ct="a"
            >
              {corpName}
            </a>
          ) : (
            corpName
          )
        },
      },
      {
        title: <p>{this.$translation(258983)}</p>,
        dataIndex: 'govlevel',
        width: 100,
      },
      {
        title: <p>{this.$translation(317178)}</p>,
        dataIndex: 'region',
        width: 200,
        render: (text, record) => (text ? text.split(' ')[0] : ''),
      },
      {
        title: <p>{this.$translation(317158)}</p>,
        dataIndex: 'industryGb2',
        width: 200,
      },
      {
        title: <p>{this.$translation(18688)}</p>,
        dataIndex: 'registerCapital',
        width: 200,
        align: 'right',
        render: (text, record) => (text ? numberFormat(text, true, 2, true) : '--'),
      },
      {
        title: <p>{this.$translation(35776)}</p>,
        dataIndex: 'registerAddress',
        width: 300,
      },
    ]
    // 输入后延时一秒查询词条
    this.timer = null
    this.tabsBoxEl = null
    // console.log(this.state.info)
    this.search()
  }

  componentDidMount = () => {}

  componentWillUnmount = () => {
    this.timer && clearTimeout(this.timer)
    // 清空页面数据
    this.props.clearRankingListDetail()
  }

  search = (pageNum = 1, pageSize = 10) => {
    const { name, province, info } = this.state
    this.props.rankingListSearchCorps({
      id: info.directoryId,
      name,
      pageNum,
      pageSize,
      province,
    })
  }

  pageChange = (page, pageSize) => {
    // console.log(page, pageSize);
    this.search(page, pageSize)
  }

  tabChange = (activeKey) => {
    this.setState({ activeKey })
  }

  setRow = (record, index) => {
    return index % 2 === 1 ? 'grey' : ''
  }

  render() {
    const { name, province, activeKey } = this.state
    const { rankingListInfo, cropList, cropListPagination } = this.props.rankingListDetail

    return (
      <div className="rankingListDetail">
        <div className="pageTitle">
          <Breadcrumb data-uc-id="ZDaWBdinL8M" data-uc-ct="breadcrumb">
            <Breadcrumb.Item
              onClick={() => {
                this.props.history.push('/rankingList')
              }}
              data-uc-id="RMBFJPID8Iq"
              data-uc-ct="breadcrumb"
            >
              {this.$translation(315079)}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => {
                this.props.history.push('/rankingListTree', { currMenu: rankingListInfo.type })
              }}
              data-uc-id="E6Uy3buE-fv"
              data-uc-ct="breadcrumb"
            >
              {rankingListInfo.type}
            </Breadcrumb.Item>
            <Breadcrumb.Item data-uc-id="GF49wEqj_o9" data-uc-ct="breadcrumb">
              {rankingListInfo.directoryName}
            </Breadcrumb.Item>
          </Breadcrumb>
          <a
            className="toRankingListTree"
            onClick={() => {
              this.props.history.push('/rankingListTree')
            }}
            data-uc-id="ijTOmj-NTn8"
            data-uc-ct="a"
          >
            {this.$translation(315097)}
          </a>
        </div>
        <div className="main_content">
          <Card size="small" className="rankingListInfo">
            <div className="left">
              <p className="title">{rankingListInfo.directoryName}</p>
              <p className="content">{rankingListInfo.remark}</p>
            </div>
            <div className="right">
              <p className="title">{this.$translation(259185)}</p>
              <p className="num">
                {numberFormat(rankingListInfo.corpNum, true, 0)}
                <span style={{ fontSize: 12 }}>{this.$translation(3171740000)}</span>
              </p>
            </div>
          </Card>

          <Card
            size="small"
            className="analysisTabsBox"
            bordered={false}
            style={{ marginTop: 15 }}
            ref={(el) => {
              this.tabsBoxEl = el
            }}
          >
            <div className="condition">
              {/* 筛选条件 */}
              <Select
                style={{ width: 100 }}
                getPopupContainer={() => this.tabsBoxEl}
                value={province}
                onChange={(value) => {
                  this.setState({ province: value }, () => {
                    this.search()
                  })
                }}
                data-uc-id="C1dv3DkS7cr"
                data-uc-ct="select"
              >
                {provinceList.map((item) => (
                  <Select.Option
                    key={item.value}
                    value={item.value}
                    data-uc-id={`CcJcY4631XQ${item.value}`}
                    data-uc-ct="select"
                    data-uc-x={item.value}
                  >
                    {intl(item.nameId, item.name)}
                  </Select.Option>
                ))}
              </Select>
              {activeKey === '0' && (
                <Input
                  style={{ width: 184 }}
                  placeholder={this.$translation(317177)}
                  value={name}
                  suffix={
                    <MyIcon
                      name="find"
                      onClick={(e) => {
                        e.stopPropagation()
                        this.search()
                      }}
                      data-uc-id="fj83fSHvi81"
                      data-uc-ct="myicon"
                    />
                  }
                  onChange={(e) => {
                    this.setState({ name: e.target.value })
                  }}
                  onPressEnter={() => this.search()}
                  data-uc-id="NFtXxDIpUkN"
                  data-uc-ct="input"
                />
              )}
            </div>
            <Tabs activeKey={activeKey} onChange={this.tabChange} data-uc-id="xKOM8_KKuJj" data-uc-ct="tabs">
              <TabPane
                tab={this.$translation(138216)}
                key={'0'}
                data-uc-id={`27UW3RldUK9${'0'}`}
                data-uc-ct="tabpane"
                data-uc-x={'0'}
              >
                {/* @ts-expect-error */}
                <LocaleProvider renderEmpty={() => renderEmptyData(0, this.$translation)}>
                  <Table
                    size="small"
                    className="whole_width"
                    rowKey="corpId"
                    rowClassName={this.setRow}
                    columns={this.columns}
                    dataSource={cropList}
                    pagination={{
                      current: cropListPagination.pageNum,
                      pageSize: cropListPagination.pageSize,
                      total: cropListPagination.total,
                      onChange: this.pageChange,
                      showSizeChanger: false,
                      showQuickJumper: true,
                      showTotal: (total) => this.$translation(257859, { total }),
                      // @ts-expect-error
                      nextIcon: <MyIcon name="nextpage" />,
                      prevIcon: <MyIcon name="prepage" />,
                    }}
                    data-uc-id="nTIgOpsQRnm"
                    data-uc-ct="table"
                  />
                </LocaleProvider>
              </TabPane>
              <TabPane
                tab={this.$translation(216301)}
                key={'1'}
                data-uc-id={`Gm51XptKkHd${'1'}`}
                data-uc-ct="tabpane"
                data-uc-x={'1'}
              >
                <AreaAnalysis id={rankingListInfo.directoryId} area={province} setRow={this.setRow}></AreaAnalysis>
              </TabPane>
              <TabPane
                tab={this.$translation(98629)}
                key={'2'}
                data-uc-id={`CpZ3dRnVdel${'2'}`}
                data-uc-ct="tabpane"
                data-uc-x={'2'}
              >
                <IndustryAnalysis
                  id={rankingListInfo.directoryId}
                  area={province}
                  setRow={this.setRow}
                ></IndustryAnalysis>
              </TabPane>
              <TabPane
                tab={this.$translation(437762)}
                key={'3'}
                data-uc-id={`6Jf-dpj-Rej${'3'}`}
                data-uc-ct="tabpane"
                data-uc-x={'3'}
              >
                <IPOAnalysis id={rankingListInfo.directoryId} area={province} setRow={this.setRow}></IPOAnalysis>
                <TypeAnalysis id={rankingListInfo.directoryId} area={province} setRow={this.setRow}></TypeAnalysis>
                <CapitalAnalysis
                  id={rankingListInfo.directoryId}
                  area={province}
                  setRow={this.setRow}
                ></CapitalAnalysis>
                <PeopleAnalysis id={rankingListInfo.directoryId} area={province} setRow={this.setRow}></PeopleAnalysis>
              </TabPane>
            </Tabs>
          </Card>
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
    rankingListSearchCorps: (data) => {
      rankingListSearchCorps(data).then((res) => {
        dispatch(RankingListActions.rankingListSearchCorps(res))
      })
    },
    clearRankingListDetail: () => {
      dispatch(RankingListActions.clearRankingListDetail())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingListDetail)
