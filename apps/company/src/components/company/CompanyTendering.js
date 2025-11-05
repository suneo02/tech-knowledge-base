import React from 'react'
import { connect } from 'react-redux'
import { Input, Select, Tag } from 'antd'
import { pageBiddingInfo } from '../../api/companyApi'
import * as companyActions from '../../actions/company'
import { parseQueryString } from '../../lib/utils'

// 基础table组件
import CompanyTable from './CompanyTable'
import intl from '../../utils/intl'

// 企业详情页-招投标
class CompanyTendering extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      corpId: parseQueryString().id || sessionStorage.getItem('corpId'),
      doOnceQuery: true,
      tenderingKeyword: '',
      tenderingType: null,
      tenderingSort: '',
      biddingKeyword: '',
      biddingType: null,
      biddingSort: '',
    }
  }

  componentDidMount = () => {
    // 如果有可以获取基本信息各个模块第一页的接口，则进行数据请求，减少初次渲染时的ajax数量
    if (this.state.doOnceQuery) {
      // 传123，获取tags
      this.getTenderingInfo({ keyword: '' })
      this.getBiddingInfo({ keyword: '' })
    }
  }

  getTenderingInfo = ({ keyword, pageNum = 1, pageSize = 10 }) => {
    const { tenderingKeyword, tenderingType, tenderingSort } = this.state
    this.props.getTenderingInfo({
      corpId: this.state.corpId,
      pageNum,
      pageSize,
      filterCond: {
        role: intl('142476', '采购单位'),
        keyword: keyword || tenderingKeyword,
        type: tenderingType,
        sort: tenderingSort || 'latest_announcement_time,desc',
      },
      // latest_announcement_time,asc
      // project_budget_money
    })
  }

  getBiddingInfo = ({ keyword, pageNum = 1, pageSize = 10 }) => {
    const { biddingKeyword, biddingType, biddingSort } = this.state
    this.props.getBiddingInfo({
      corpId: this.state.corpId,
      pageNum,
      pageSize,
      filterCond: {
        role: '拟定供应商|投标单位|中标候选人|中标人/供应商',
        keyword: keyword || biddingKeyword,
        type: biddingType,
        sort: biddingSort || 'latest_announcement_time,desc',
      },
    })
  }

  tenderingKeywordChange = (e) => {
    this.setState({ tenderingKeyword: e.target.value })
  }
  tenderingTypeChange = (value) => {
    this.setState({ tenderingType: value }, () => {
      this.getTenderingInfo({})
    })
  }
  biddingKeywordChange = (e) => {
    this.setState({ biddingKeyword: e.target.value })
  }
  biddingTypeChange = (value) => {
    this.setState({ biddingType: value }, () => {
      this.getBiddingInfo({})
    })
  }

  onTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    const { field, order } = sorter
    this.setState({ tenderingSort: order ? `${field},${order === 'descend' ? 'desc' : 'asc'}` : '' }, () => {
      this.getTenderingInfo({ pageNum: pagination.current })
    })
  }
  onTableChange2 = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    const { field, order } = sorter
    this.setState({ biddingSort: order ? `${field},${order === 'descend' ? 'desc' : 'asc'}` : '' }, () => {
      this.getBiddingInfo({ pageNum: pagination.current })
    })
  }

  render() {
    const { doOnceQuery, tenderingKeyword, tenderingType, tenderingSort, biddingKeyword, biddingType, biddingSort } = this.state
    const { tenderingTags, tenderingTypes, tenderingList, tenderingPagination, biddingTags, biddingTypes, biddingList, biddingPagination } = this.props.company

    return (
      <>
        <div className="companyTable">
          <div className="corpTableTitle">
            {this.$translation(257706)}
            {tenderingPagination.total > 0 && <span>({tenderingPagination.total})</span>}
          </div>
          {tenderingTags?.length > 0 && (
            <div className="tags">
              {tenderingTags.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </div>
          )}
          {tenderingList?.length > 0 ? (
            <div style={{ marginBottom: 24 }}>
              <Input
                style={{ width: 400, marginRight: 20 }}
                placeholder="搜索公告标题"
                value={tenderingKeyword}
                onChange={this.tenderingKeywordChange}
                onPressEnter={() => this.getTenderingInfo({})}
              />
              <Select placeholder="公告类型" style={{ width: 150 }} value={tenderingType} onChange={this.tenderingTypeChange} allowClear>
                {tenderingTypes.map((item, index) => (
                  <Select.Option key={index} value={item.key}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : null}

          <CompanyTable
            cmd="getTendering"
            dataInfo={tenderingList}
            pagination={tenderingPagination}
            doOnceQuery={doOnceQuery}
            vipControl={false}
            onChange={this.onTableChange}
            keyword={tenderingKeyword}
          />
        </div>
        <div className="companyTable">
          <div className="corpTableTitle">
            {this.$translation(257827)}
            {biddingPagination.total > 0 && <span>({biddingPagination.total})</span>}
          </div>
          {biddingTags?.length > 0 && (
            <div className="tags">
              {biddingTags.map((item, index) => (
                <Tag key={index}>{item}</Tag>
              ))}
            </div>
          )}
          {biddingList?.length > 0 ? (
            <div style={{ marginBottom: 24 }}>
              <Input
                style={{ width: 400, marginRight: 20 }}
                placeholder="搜索公告标题"
                value={biddingKeyword}
                onChange={this.biddingKeywordChange}
                onPressEnter={() => this.getBiddingInfo({})}
              />
              <Select placeholder="公告类型" style={{ width: 150 }} value={biddingType} onChange={this.biddingTypeChange} allowClear>
                {biddingTypes.map((item, index) => (
                  <Select.Option key={index} value={item.key}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : null}

          <CompanyTable
            cmd="getBidding"
            dataInfo={biddingList}
            pagination={biddingPagination}
            doOnceQuery={doOnceQuery}
            vipControl={false}
            onChange={this.onTableChange2}
            keyword={biddingKeyword}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    company: state.company,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTenderingInfo: (data) => {
      pageBiddingInfo(data).then((res) => {
        dispatch(companyActions.getTenderingInfo({ ...res, ...data }))
      })
    },
    getBiddingInfo: (data) => {
      pageBiddingInfo(data).then((res) => {
        dispatch(companyActions.getBiddingInfo({ ...res, ...data }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTendering)
