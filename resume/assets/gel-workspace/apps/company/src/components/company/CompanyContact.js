import React from 'react'
import { connect } from 'react-redux'
import CompanyTable from './CompanyTable'
import { pageShareholder, pageMailInfo, pageTelInfo, pageBranchInfo } from '../../api/companyApi'
import * as companyActions from '../../actions/company'
import { parseQueryString, getVipInfo } from '../../lib/utils'

// 企业详情页-联系方式
class CompanyContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      corpId: parseQueryString().id || sessionStorage.getItem('corpId'),
      corpInfo: null,
      shareholder: null,
      isVip: getVipInfo().isSvip,
    }
  }

  componentDidMount = () => {
    this.pageTelInfo()
    this.pageMailInfo()
    this.pageBranchInfo()
  }

  pageTelInfo = (pageNum = 1, pageSize = 10) => {
    this.props.pageTelInfo({
      corpId: this.state.corpId,
      pageNum,
      pageSize,
    })
  }

  pageMailInfo = (pageNum = 1, pageSize = 10) => {
    this.props.pageMailInfo({
      corpId: this.state.corpId,
      pageNum,
      pageSize,
    })
  }

  pageBranchInfo = (pageNum = 1, pageSize = 10) => {
    this.props.pageBranchInfo({
      corpId: this.state.corpId,
      pageNum,
      pageSize,
    })
  }

  onTableChange1 = (pagination, filters, sorter) => {
    this.pageTelInfo(pagination.current)
  }

  onTableChange2 = (pagination, filters, sorter) => {
    this.pageMailInfo(pagination.current)
  }

  onTableChange3 = (pagination, filters, sorter) => {
    this.pageBranchInfo(pagination.current)
  }

  render() {
    const { telList, telPagination, mailList, mailPagination, branchList, branchPagination } = this.props.company
    const { isVip } = this.state

    // console.log(telList, isVip)

    return (
      <>
        <div className="companyTable">
          <div className="corpTableTitle">
            {this.$translation(10057)}
            {telPagination.total > 0 && <span>({telPagination.total})</span>}
          </div>
          <CompanyTable
            cmd="gettel"
            dataInfo={telList}
            pagination={telPagination}
            vipControl={!isVip}
            onChange={this.onTableChange1}
            data-uc-id="CNflf1Sn5"
            data-uc-ct="companytable"
          />
        </div>
        <div className="companyTable">
          <div className="corpTableTitle">
            {this.$translation(91283)}
            {mailPagination.total > 0 && <span>({mailPagination.total})</span>}
          </div>
          <CompanyTable
            cmd="getmail"
            dataInfo={mailList}
            pagination={mailPagination}
            vipControl={!isVip}
            onChange={this.onTableChange2}
            data-uc-id="_RB_bLlizP"
            data-uc-ct="companytable"
          />
        </div>
        <div className="companyTable">
          <div className="corpTableTitle">
            {this.$translation(204320)}
            {branchPagination.total > 0 && <span>({branchPagination.total})</span>}
          </div>
          <CompanyTable
            cmd="getsubcorp"
            dataInfo={branchList}
            pagination={branchPagination}
            vipControl={!isVip}
            onChange={this.onTableChange3}
            data-uc-id="uxSj7bBCMJ"
            data-uc-ct="companytable"
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
    pageTelInfo: (data) => {
      pageTelInfo(data).then((res) => {
        dispatch(companyActions.pageTelInfo({ ...res, ...data }))
      })
    },
    pageMailInfo: (data) => {
      pageMailInfo(data).then((res) => {
        dispatch(companyActions.pageMailInfo({ ...res, ...data }))
      })
    },
    pageBranchInfo: (data) => {
      pageBranchInfo(data).then((res) => {
        dispatch(companyActions.pageBranchInfo({ ...res, ...data }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyContact)
