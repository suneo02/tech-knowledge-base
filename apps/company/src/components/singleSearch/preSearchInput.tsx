import { Input } from '@wind/wind-ui'
import { SearchHistoryParsed } from 'gel-api'
import React from 'react'
import { connect } from 'react-redux'
import { getPreCorpSearchNew } from '../../api/homeApi'
import { getCompanyName } from '../../api/searchListApi'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import styles from './preSearch.module.less'
import './preSearchInput.less'

let serachtimer

interface PreSearchInputProps {
  historyList: SearchHistoryParsed
  onChange: () => void
  placeholder: string
  state?: string[]
  onRef?: (ref: any) => void
  style?: React.CSSProperties
}

interface PreSearchInputState {
  pageno: number
  pagesize: number
  preKeyword: string
  preList: any[]
  showPre: string[]
  getCode: string[]
  historySearch: string[]
  queryHisShow: string
  queryPreShow: string
  warning: boolean
}

class PreSearchInput extends React.Component<PreSearchInputProps, PreSearchInputState> {
  private preRef: React.RefObject<HTMLSpanElement>

  constructor(props) {
    super(props)
    this.state = {
      pageno: 0,
      pagesize: 10,
      preKeyword: '',
      preList: [],
      showPre: [],
      getCode: [],
      historySearch: props.historyList || [], // 从props接收历史记录
      queryHisShow: 'none',
      queryPreShow: 'block',
      warning: false,
    }
    this.preRef = React.createRef()
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.state !== prevProps.state) {
      this.setState(
        {
          getCode: this.props.state || [],
        },
        () => {
          if (this.state.getCode.length > 0) {
            this.setState(
              {
                showPre: [],
              },
              () => this.getCorpName(this.state.getCode)
            )
          } else {
            this.setState({
              showPre: [],
            })
          }
        }
      )
    }
    // 当历史记录更新时更新state
    if (this.props.historyList !== prevProps.historyList && this.props.historyList) {
      this.setState({
        historySearch: this.props.historyList.map((item) => item.name) || [],
      })
    }
  }

  componentDidMount = () => {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }

  deleteAllPre = () => {
    this.setState({
      showPre: [],
    })
  }

  getCorpName = (codeArr) => {
    for (let i = 0; i < codeArr.length; i++) {
      const param = {
        companycode: codeArr[i],
      }
      getCompanyName(param).then((res) => {
        const { showPre } = this.state
        if (res && res.Data) {
          if (res.Data.companyName) {
            const item = res.Data.companyName + '|' + codeArr[i]
            showPre.push(item)
            this.setState({
              showPre: showPre,
            })
          }
        }
      })
    }
  }

  addPre = (name, id) => {
    const code = id ? id : ''
    const item = name + '|' + code
    const { showPre } = this.state
    if (showPre.length > 0) {
      let flag = 0
      for (let i = 0; i < showPre.length; i++) {
        if (showPre[i].indexOf(item) == -1) {
          flag = 1
        } else {
          flag = 0
          break
        }
      }
      if (flag) {
        showPre.push(item)
      }
    } else {
      showPre.push(item)
    }
    this.setState({
      showPre: showPre,
      preList: [],
      preKeyword: '',
      warning: false,
    })
    this.props?.onChange()
  }

  preSearchChange = (e) => {
    if (e.target.value) {
      this.setState({ preKeyword: e.target.value, queryHisShow: 'none', warning: false }, () => {
        clearTimeout(serachtimer)
        serachtimer = setTimeout(() => {
          const param = {
            queryText: this.state.preKeyword,
            pageSize: 5,
          }
          this.getSearch(param)
        }, 500)
      })
    } else {
      this.setState({
        preKeyword: e.target.value,
        preList: [],
        queryHisShow: 'block',
      })
    }
  }

  deletePre = (item) => {
    const { showPre } = this.state
    const newList = showPre.filter((value) => value !== item)
    this.setState({
      showPre: newList,
    })
    this.props.onChange()
  }

  getSearch = (param) => {
    getPreCorpSearchNew(param).then((data) => {
      if (data && data.ErrorCode == '0' && data.Data && data.Data.corplist && data.Data.corplist.length > 0) {
        this.setState({
          preList: data.Data.corplist.map((i) => ({
            ...i,
            name: i.corp_name,
            id: i.corp_id,
          })),
        })
      }
    })
  }

  preProcessing = (item) => {
    let highLitKey = ''
    let corp_name = ''
    corp_name = item.name
    if (item.highlight) {
      highLitKey = Object.keys(item.highlight)[0]
    }
    switch (highLitKey) {
      case 'corp_name':
        corp_name = item.highlight['corp_name']
        break
      default:
        break
    }
    return (
      <div
        dangerouslySetInnerHTML={{ __html: corp_name }}
        className="prelist-item"
        onClick={() => this.addPre(item.name, item.id)}
        data-uc-id="YPz1LzECef"
        data-uc-ct="div"
      ></div>
    )
  }

  pushHis2Show = (item) => {
    const { showPre } = this.state
    if (showPre.length > 0) {
      let flag = 0
      for (let i = 0; i < showPre.length; i++) {
        if (showPre[i].indexOf(item) == -1) {
          flag = 1
        } else {
          flag = 0
          break
        }
      }
      if (flag) {
        showPre.push(item)
        this.props.onChange()
      }
    } else {
      showPre.push(item)
      this.props.onChange()
    }
    this.setState({
      showPre: showPre,
      warning: false,
    })
  }

  retrievalWarning = () => {
    const { preKeyword, showPre } = this.state
    if (showPre.length == 0 && preKeyword.length > 0) {
      this.setState({
        warning: true,
      })
      return false
    } else {
      return true
    }
  }

  render() {
    const { historySearch, queryHisShow, queryPreShow } = this.state

    return (
      <div className="" style={this.props?.style || {}}>
        <div className="preSeachResult">
          <div className="searchResult">
            {this.state.showPre && this.state.showPre.length > 0
              ? this.state.showPre.map((item, index) => {
                  return (
                    <span ref={this.preRef} className="pre-company" key={index}>
                      <span
                        onClick={() => wftCommon.linkCompany('Bu3', item.split('|')[1])}
                        data-uc-id="PL35JkMyXd"
                        data-uc-ct="span"
                      >
                        {item.split('|')[0]}
                      </span>
                      <i onClick={() => this.deletePre(item)} data-uc-id="e3SWEOpaWy" data-uc-ct="i">
                        X
                      </i>
                    </span>
                  )
                })
              : null}
          </div>
          <Input
            size="large"
            value={this.state.preKeyword}
            placeholder={this.props.placeholder}
            onChange={this.preSearchChange}
            allowClear
            onFocus={() =>
              this.setState({ queryHisShow: this.state.preKeyword ? 'none' : 'block', queryPreShow: 'block' })
            }
            onBlur={() => {
              setTimeout(() => {
                this.setState({
                  queryHisShow: 'none',
                  queryPreShow: 'none',
                })
              }, 500)
            }}
            data-uc-id="UjcLpYe9a"
            data-uc-ct="input"
          />
          <div className="historySearch" style={{ display: queryHisShow }}>
            {historySearch && historySearch.length > 0 ? <div>{intl('437396', '历史搜索')}</div> : null}
            {historySearch && historySearch.length > 0
              ? historySearch.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        this.pushHis2Show(item)
                      }}
                      data-uc-id="FgAjZ7tUUK"
                      data-uc-ct="div"
                      data-uc-x={index}
                    >
                      {item.split('|')[0]}
                    </div>
                  )
                })
              : null}
          </div>
        </div>
        {this.state.warning ? <span style={{ color: 'red' }}>请选择正确的企业名称</span> : null}
        <div className={`searchList ${styles['pre-search--list']}`} style={{ display: queryPreShow }}>
          {this.state?.preList?.length
            ? this.state.preList.map((item) => {
                return this.preProcessing(item)
              })
            : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = () => {}

const mapDispatchToProps = () => {}

export default connect(mapStateToProps, mapDispatchToProps)(PreSearchInput)
