import { List } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getConditionBySid } from '../api/collect&namelist'
import { pointBuried } from '../api/configApi'
import { getNoticeList } from '../api/noticeCenterApi'
import global from '../lib/global'
import { cutStringByWidth, getCompanyUrl, renderEmptyData } from '../lib/utils'
import { connectZustand } from '../store'
import { useConditionFilterStore } from '../store/cde/useConditionFilterStore'
import { MyIcon } from './Icon'
import './NoticeBox.less'

// 头部通知中心下拉框
class NoticeBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notices: [],
      total: 0,
    }
  }

  componentDidMount = () => {
    this.props.onRef && this.props.onRef(this)
  }

  getNoticeList = () => {
    return getNoticeList({
      pageNum: 1,
      pageSize: 3,
    }).then((res) => {
      if (res.code === global.SUCCESS) {
        this.setState({
          notices: res.data.list,
          total: res.data.total,
        })
      }
      return res
    })
  }

  toNoticeCenter = () => {
    this.props.closeFn(false)
    pointBuried({
      action: '922604570014',
      params: [],
    })
    if (window.location.pathname !== '/superlist/noticeCenter') {
      this.props.history.push('/noticeCenter')
    }
  }

  toDetail = (notice) => {
    const { history } = this.props
    this.props.closeFn(false)
    switch (notice.type) {
      case 'subscribe_name_list':
        // history.push("/filterRes", {subscribeId: notice.});
        this.toFilterRes(notice.tag)
        return
      case 'collect_company_news':
        window.open(getCompanyUrl(notice.tag))
        return
      case 'subscribe_new_enterprise':
        history.push('/newEnterprise')
        return
      case 'subscribe_similar_customer':
        history.push('/sameCustomer')
        return
      case 'download_name_list':
        history.push('/downloadCenter')
        return
      case 'corp_auth':
        history.push('/noticeCenter')
        return
      default:
        return ''
    }
  }

  toFilterRes = (subscribeId) => {
    let state = {}
    getConditionBySid(subscribeId).then((res) => {
      if (res.code === global.SUCCESS) {
        const { name, templateId, condition } = res.data
        const { filters, geoFilter } = condition
        state = {
          filters,
          geoFilter,
          subscribeId,
          specialSQL: {
            words: name,
          },
          templateId,
        }
        this.props.setFilters(filters)
        this.props.setGeoFilters(geoFilter)
        this.props.history.push('/filterRes', state)
      }
    })
  }

  render() {
    const { notices, total } = this.state

    return (
      <div className="notice_box">
        <List
          grid={{ gutter: 10, column: 1 }}
          locale={{
            emptyText: renderEmptyData(0, this.$translation),
          }}
          dataSource={notices}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <p className="title">{item.title}</p>
              <p className="time">{item.time}</p>
              <p className="content">{cutStringByWidth(item.body, 420, 12)}</p>
              <a onClick={() => this.toDetail(item)}>
                {item.type === 'download_name_list' ? this.$translation(286681) : this.$translation(257689)}
                <MyIcon name="arrow_right_small" />
              </a>
            </List.Item>
          )}
        />
        {total > 3 && (
          <a className="toNoticeCenter" onClick={this.toNoticeCenter}>
            {this.$translation(257726)}
          </a>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connectZustand(useConditionFilterStore, (state) => ({
  setFilters: state.setFilters,
  setGeoFilters: state.setGeoFilters,
}))(connect(mapStateToProps, mapDispatchToProps)(withRouter(NoticeBox)))
