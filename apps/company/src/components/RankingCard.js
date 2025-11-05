import { Card } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as RankingListActions from '../actions/rankingList'
import { addVisitHistory } from '../api/rankingListApi'
import { numberFormat, showHighLight } from '../lib/utils'
import { MyIcon } from './Icon'

import './RankingCard.less'

// 企业卡片
class RankingCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = () => {}

  toRankingListDetail = () => {
    const { directoryId, directoryName } = this.props.info
    this.props.addVisitHistory({
      id: directoryId,
      name: directoryName,
    })
    // 跳转
    this.props.history.push('/rankingListDetail', this.props.info)
  }

  render() {
    const { keyword } = this.props
    const { objectName, count, description } = this.props.info

    return (
      <Card size="small" className="rankingCard">
        <div className="content">
          <p className="title">
            <span className="name">{showHighLight(objectName, keyword)}</span>
            <a onClick={this.toRankingListDetail}>
              {numberFormat(count, true)}家 <MyIcon name="arrow_right_small" />
            </a>
          </p>
          <p className="remark" title={description}>
            {description}
          </p>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addVisitHistory: (data) => {
      addVisitHistory(data).then((res) => {
        dispatch(RankingListActions.addVisitHistory(Object.assign(data, res)))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RankingCard))
