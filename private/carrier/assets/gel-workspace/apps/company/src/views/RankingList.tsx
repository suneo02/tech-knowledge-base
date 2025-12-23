import { Button, Card, Col, Input, List, Row } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../actions/rankingList'
import {
  addSearchHistory,
  addVisitHistory,
  deleteAllSearchHistory,
  deleteAllVisitHistory,
  deleteOneVisitHistory,
  getSearchHistory,
  getVisitHistory,
  rankingListSearch,
  rankingListSuggest,
} from '../api/rankingListApi'
import { MyIcon } from '../components/Icon'
import RankingCard from '../components/RankingCard'
import { showHighLight } from '../lib/utils'

import intl from '@/utils/intl'
import './RankingList.less'

type Props = {
  rankingList: {
    suggestList: any[]
    suggestTotal: number
    inputSearchRes: any[]
    searchHistory: any[]
    visitHistory: any[]
  }
  rankingListSuggest: (params: any) => void
  deleteOneVisitHistory: (params: any) => void
  addSearchHistory: (params: any) => void
  addVisitHistory: (params: any) => void
  deleteAllSearchHistory: (params: any) => void
  deleteAllVisitHistory: (params: any) => void
  getSearchHistory: (params: any) => void
  getVisitHistory: (params: any) => void
  rankingListSearch: (params: any) => void
  history: any
  inputSearch: (params: any) => void
}

type State = {
  inputValue: string
  inputFocusState: boolean
}
// 招投标
class RankingList extends React.Component<Props, State> {
  timer: ReturnType<typeof setTimeout>
  orderTypeMap: Record<string, string>
  $translation: any

  constructor(props) {
    super(props)
    this.state = {
      // 搜索框文案
      inputValue: '',
      // 搜索框选中状态
      inputFocusState: false,
    }
    // 输入后延时一秒查询词条
    this.timer = null
    this.orderTypeMap = {
      1: '{"sort_date":"desc"}',
      2: '{"sort_date":"desc"}',
      3: '{"sort_date":"asc"}',
      4: '{"project_budget_money":"desc"}',
      5: '{"project_budget_money":"asc"}',
    }
    this.props.rankingListSuggest({
      pageNum: 1,
      pageSize: 6,
      // key: "",
      // name: "",
      // typeName: "",
    })
  }

  componentDidMount = () => {
    // this.props.getVisitHistory();
    // this.props.getSearchHistory();
  }

  componentWillUnmount = () => {
    this.timer && clearTimeout(this.timer)
  }

  historyDelete = (e, index) => {
    e.stopPropagation()
    this.props.deleteOneVisitHistory(index + 1)
  }

  toDetail = (ranking, type) => {
    // console.log(ranking, type)
    // type=1 搜索 type=2 历史
    const { id, name } = ranking
    if (type === 1) {
      this.props.addSearchHistory({
        id,
        name,
      })
      // 后端已处理，加入浏览历史
      // this.props.addVisitHistory({
      //   id,
      //   name,
      // });
    } else if (type === 2) {
      this.props.addVisitHistory({
        id,
        name,
      })
    }
    // 跳转
    this.props.history.push('/rankingListDetail', {
      directoryId: id,
      directoryName: name,
    })
  }

  inputChange = (e) => {
    this.setState({ inputValue: e.target.value })
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.inputSearch({
        key: e.target.value,
        pageNum: 1,
        pageSize: 5,
      })
    }, 1000)
  }

  // 带keyword进入全部名单页
  search = () => {
    this.props.history.push('/rankingListTree', { keyword: this.state.inputValue })
  }

  render() {
    const { inputValue, inputFocusState } = this.state
    const { suggestList, suggestTotal, inputSearchRes, searchHistory, visitHistory } = this.props.rankingList
    return (
      <div className="rankingList">
        <Row gutter={16}>
          <Col className="main_content">
            <Card size="small">
              <h2>{this.$translation(260265)}</h2>
              <div className="inputBox">
                <Input
                  placeholder={this.$translation(315077)}
                  onChange={this.inputChange}
                  value={inputValue}
                  onFocus={() => {
                    this.setState({ inputFocusState: true })
                  }}
                  onBlur={() => {
                    // 延时隐藏，响应下拉项的点击事件
                    setTimeout(() => {
                      this.setState({ inputFocusState: false })
                    }, 300)
                  }}
                  data-uc-id="Ejv5szICfso"
                  data-uc-ct="input"
                />
                {!inputValue && searchHistory.length > 0 && inputFocusState && (
                  <Card
                    className="searchComplete"
                    size="small"
                    title={
                      <p>
                        {this.$translation(225291)}
                        <MyIcon
                          onClick={this.props.deleteAllSearchHistory}
                          title={this.$translation(149222)}
                          name="Delete_666"
                          data-uc-id="rvZtD3sUcbr"
                          data-uc-ct="myicon"
                        />
                      </p>
                    }
                  >
                    <List
                      dataSource={searchHistory}
                      renderItem={(item, index) => (
                        <p
                          onClick={() => this.toDetail(item, 1)}
                          key={index}
                          data-uc-id={`gqEyfjYSCbJ${index}`}
                          data-uc-ct="p"
                          data-uc-x={index}
                        >
                          {item.name ? item.name.trim() : ''}
                        </p>
                      )}
                    />
                  </Card>
                )}
                {inputValue && inputSearchRes.length > 0 && inputFocusState && (
                  <div className="searchComplete">
                    <List
                      dataSource={inputSearchRes}
                      renderItem={(item, index) => (
                        <p
                          onClick={() => this.toDetail({ id: item.directoryId, name: item.directoryName }, 1)}
                          key={index}
                          data-uc-id={`wJKINU-a3Xb${index}`}
                          data-uc-ct="p"
                          data-uc-x={index}
                        >
                          {item.directoryName ? showHighLight(item.directoryName.trim(), inputValue) : ''}
                        </p>
                      )}
                    />
                  </div>
                )}
                <Button type="primary" onClick={this.search} data-uc-id="GMQJkrhNu3k" data-uc-ct="button">
                  {this.$translation(315076)}
                </Button>
              </div>
              <p className="subtitle">
                {intl('317175', '推荐榜单')}
                <a
                  onClick={() => {
                    this.props.history.push('/rankingListTree')
                  }}
                  data-uc-id="5qEcV2oJNB8"
                  data-uc-ct="a"
                >
                  {this.$translation(265595)}
                </a>
              </p>
              <div className="recommondCardList">
                {suggestList.map((item, index) => (
                  <RankingCard info={item} index={index} />
                ))}
              </div>
              {/* <List
                grid={{ gutter: 10, column: 2 }}
                dataSource={suggestList}
                renderItem={(item, index) => (
                  <List.Item>
                    <RankingCard info={item} index={index} />
                  </List.Item>
                )}
              /> */}
              <Button
                className="more"
                onClick={() => {
                  this.props.history.push('/rankingListTree')
                }}
                data-uc-id="isaYVT-Zw4s"
                data-uc-ct="button"
              >{`查看全部${suggestTotal}个榜单名录`}</Button>
            </Card>
          </Col>
          {/* <Col className="right_box history">
            <Card size="small" title={<p>{this.$translation(108694)}
              {visitHistory.length > 0 && <MyIcon onClick={this.props.deleteAllVisitHistory} title={this.$translation(149222)} name="Delete_666" />}
            </p>}>
              <List
                locale={{
                  emptyText: renderEmptyData(0, this.$translation)
                }}
                dataSource={visitHistory}
                renderItem={(item, index) =>
                  <p onClick={() => this.toDetail(item, 2)} key={index}>
                    {item.name ? item.name.trim() : ""}
                    <a onClick={(e) => this.historyDelete(e, index)}>{this.$translation(19853)}</a>
                  </p>
                }
              />
            </Card>
          </Col> */}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rankingList: state.rankingList,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addSearchHistory: (data) => {
      addSearchHistory(data).then((res) => {
        dispatch(RankingListActions.addSearchHistory(Object.assign(data, res)))
      })
    },
    getSearchHistory: (data) => {
      getSearchHistory().then((res) => {
        dispatch(RankingListActions.getSearchHistory(res))
      })
    },
    deleteAllSearchHistory: (data) => {
      deleteAllSearchHistory().then((res) => {
        dispatch(RankingListActions.deleteAllSearchHistory(res))
      })
    },
    addVisitHistory: (data) => {
      addVisitHistory(data).then((res) => {
        dispatch(RankingListActions.addVisitHistory(Object.assign(data, res)))
      })
    },
    getVisitHistory: (data) => {
      getVisitHistory().then((res) => {
        dispatch(RankingListActions.getVisitHistory(res))
      })
    },
    deleteAllVisitHistory: (data) => {
      deleteAllVisitHistory().then((res) => {
        dispatch(RankingListActions.deleteAllVisitHistory(res))
      })
    },
    deleteOneVisitHistory: (data) => {
      deleteOneVisitHistory(data).then((res) => {
        dispatch(RankingListActions.deleteOneVisitHistory(Object.assign({ index: data - 1 }, res)))
      })
    },
    rankingListSuggest: (data) => {
      rankingListSuggest(data).then((res) => {
        dispatch(RankingListActions.rankingListSuggest(res))
      })
    },
    inputSearch: (data) => {
      rankingListSearch(data).then((res) => {
        dispatch(RankingListActions.inputSearch(res))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingList)
