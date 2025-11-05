import { Input, Radio } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as companyActions from '../../actions/company'
import intl from '../../utils/intl'
import { CompanyObjectionHandling } from './feedback'
import './style/CompanyFloatingWindow.less'

const RadioGroup = Radio.Group
const { TextArea } = Input

// 企业详情页-头部卡片
class CompanyFloatingWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      feedType: '数据纠错',
      companyName: this.props.name,
      message: this.props.feedParam?.message || '',
      tel: this.props.feedParam?.tel || '',
      warning: 'none',
      waringColor: 'var(--basic-8)',
    }
  }

  componentWillUnmount = () => {}

  componentDidMount = () => {}

  onTypeChange = (e) => {
    const feedType = e.target.value
    if (feedType === '异议处理') {
      document.querySelector('.companyIntroductionTagModal .w-btn-primary').style.display = 'none'
    } else {
      document.querySelector('.companyIntroductionTagModal .w-btn-primary').style.display = 'inline-block'
    }
    this.setState({ feedType })
    this.props.getFeedType && this.props.getFeedType(feedType)
    this.props.setFeedBack && this.props.setFeedBack({ feedType: feedType })
  }
  onCompanyChange = (e, type) => {
    let param = {}
    if (type == 'companyname') {
      param = {
        type: this.state.feedType,
        companyname: e.target.value,
        tel: this.state.tel,
        message: this.state.message,
      }
      this.setState({ companyName: e.target.value })
    } else if (type == 'message') {
      param = {
        type: this.state.feedType,
        companyname: this.state.companyName,
        tel: this.state.tel,
        message: e.target.value?.trimLeft(''),
      }
      if (e.target.value.length == 0) {
        this.setState({ warning: 'block', waringColor: 'rgba(223, 38, 44, 1)' })
      } else {
        this.setState({ warning: 'none', waringColor: 'var(--basic-8)' })
      }
      this.setState({ message: e.target.value })
    } else {
      param = {
        type: this.state.feedType,
        companyname: this.state.companyName,
        tel: e.target.value,
        message: this.state.message,
      }
      this.setState({ tel: e.target.value })
    }
    this.props.setFeedBack(param)
  }

  render() {
    return (
      <div>
        <div className="feedback-nav">
          <div className="feedback-nav-type-title">{intl('283797', '反馈类型')}</div>
          <RadioGroup onChange={this.onTypeChange} value={this.state.feedType}>
            <Radio value={'数据纠错'}>{intl('138235', '数据纠错')}</Radio>
            <Radio value={'功能提升'}>{intl('138311', '功能提升')}</Radio>
            <Radio value={'其他建议'}>{intl('138421', '其他建议')}</Radio>
            <Radio value={'异议处理'}>{intl('366153', '异议处理')}</Radio>
          </RadioGroup>
        </div>
        <div className="feedback-content">
          {this.state.feedType === '异议处理' ? (
            <CompanyObjectionHandling />
          ) : (
            <>
              <div className="feedback-nav">
                <div className="feedback-nav-company-title">{intl('32914', '公司名称')}</div>
                <Input
                  placeholder={intl('225183', '请输入公司名称')}
                  defaultValue={this.props.name}
                  onChange={(e) => this.onCompanyChange(e, 'companyname')}
                />
              </div>
              <div className="feedback-nav">
                <div className="feedback-nav-desc-title">{intl('138258', '反馈描述')}</div>
                <TextArea
                  rows={4}
                  defaultValue={this.state.message}
                  placeholder={intl('138574', '我们期待您的反馈')}
                  onChange={(e) => this.onCompanyChange(e, 'message')}
                  style={{ marginBottom: '5px', borderColor: this.state.waringColor }}
                />
                <span className="feedback-warning" style={{ display: this.state.warning }}>
                  {intl('438476', '请填写反馈描述')}
                </span>
              </div>
              <div className="feedback-nav">
                <div className="feedback-nav-company-title">{intl('257643', '联系方式')}</div>
                <Input
                  placeholder={intl('138444', '请留下您的联系方式，以便我们与您联系')}
                  onChange={(e) => this.onCompanyChange(e, 'tel')}
                  defaultValue={this.state.tel}
                />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    company: state.company,
    en_access_config: state.global.en_access_config,
    feedParam: state.company.feedBackPara,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteById: (data) => {
      return deleteById(data).then((res) => {
        dispatch(companyActions.toggleCollect(res))
        return res
      })
    },
    setFeedBack: (data) => {
      dispatch(companyActions.setFeedBack(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompanyFloatingWindow))
