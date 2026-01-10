/** @format */
import { IState } from '@/reducers/type'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { GlobalContext } from '../../../context/GlobalContext'
import { wftCommon } from '../../../utils/utils'
import { openFeedbackModal } from '../feedback/useFeedbackModal'
import { CompanyInfoDisplay } from './CompanyInfoDisplay'
import { CorpBasicInfoFront } from './handle'

// 定义组件的 Props 和 State 接口
interface CompanyInfoProps {
  company: IState['company']
  history: any
  companycode?: any
}

interface CompanyInfoState {
  en_corpInfo: Partial<CorpBasicInfoFront>
  loadingTime: number
}

// 企业详情页-基本信息--工商信息基础表
class CompanyInfo extends React.Component<CompanyInfoProps, CompanyInfoState> {
  static contextType = GlobalContext
  context!: React.ContextType<typeof GlobalContext>

  private loadingInter: any

  constructor(props: CompanyInfoProps) {
    super(props)
    this.state = {
      en_corpInfo: {},
      loadingTime: 5,
    }
    this.loadingInter = null
  }

  componentDidMount = () => {
    this.loadingInter = setInterval(() => {
      this.setState({ loadingTime: this.state.loadingTime - 1 })
      if (this.state.loadingTime < 0) {
        this.setState({ loadingTime: 0 })
        clearInterval(this.loadingInter)
        this.loadingInter = null
      }
    }, 1000)
    // const qsParam = parseQueryString()
    // const fromPage = qsParam['fromPage'] || null
    // this.fromShfic = fromPage == wftCommon.fromPage_shfic ? true : false
  }

  showFeedBackModel = () => {
    const { baseInfo } = this.props.company
    openFeedbackModal(baseInfo?.corp_name)
  }

  shouldComponentUpdate = (nextProps: CompanyInfoProps, nextState: CompanyInfoState) => {
    if (Object.entries(nextProps.company.baseInfo).length !== Object.entries(this.props.company.baseInfo).length) {
      if (window.en_access_config && !Object.entries(this.state.en_corpInfo).length) {
        const nextBaseInfo = { ...nextProps.company.baseInfo }
        delete nextBaseInfo.corp
        const corp_name_zh = nextBaseInfo.corp_name
        const usednames_zh = nextBaseInfo.usednames
        const state_zh = nextBaseInfo.state
        wftCommon.translateService(nextBaseInfo, (res) => {
          res.usednames = usednames_zh
          res.corp_name = corp_name_zh
          res.state_zh = state_zh
          this.setState({
            en_corpInfo: res,
          })
        })
        nextProps.company.baseInfo.corp = nextProps.company.baseInfo
      }
      return true
    }
    if (
      Object.entries(nextProps.company.corpHeaderInfo).length !==
      Object.entries(this.props.company.corpHeaderInfo).length
    ) {
      return true
    }
    if (Object.entries(nextState.en_corpInfo).length !== Object.entries(this.state.en_corpInfo).length) {
      return true
    }
    if (nextProps.company.corpArea !== this.props.company.corpArea) {
      return true
    }
    if (nextState.loadingTime <= 0) {
      return true
    }
    return false
  }

  render() {
    const { baseInfo, corpHeaderInfo } = this.props.company
    let loadingState = true
    if (baseInfo.corp_type_id) {
      // 获取到了企业基础信息
      loadingState = false
    } else if (!this.state.loadingTime) {
      // 加载超5s 也将load重置
      loadingState = false
    } else if (!this.props.companycode) {
      // 加载超5s 也将load重置
      loadingState = false
    }

    console.log('🚀 ~ CompanyInfo ~ render ~ baseInfo:', baseInfo)
    return (
      <CompanyInfoDisplay
        baseInfo={baseInfo}
        corpHeaderInfo={corpHeaderInfo}
        onClickFeedback={this.showFeedBackModel}
        isLoading={loadingState}
        enCorpInfo={this.state.en_corpInfo}
        data-uc-id="bhSNcvDRbM"
        data-uc-ct="companyinfodisplay"
      />
    )
  }
}

const mapStateToProps = (state: IState) => {
  return {
    company: state.company,
  }
}

const mapDispatchToProps = (_dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompanyInfo))
