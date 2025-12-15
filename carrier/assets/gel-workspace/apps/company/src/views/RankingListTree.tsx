import { Breadcrumb, Card, Col, Input, Row, Tree } from '@wind/wind-ui'
import React from 'react'
import { connect } from 'react-redux'
import * as RankingListActions from '../actions/rankingList'
import { getRankingListType, rankingListSearch } from '../api/rankingListApi'
import { MyIcon } from '../components/Icon'
import RankingCard from '../components/RankingCard'

import './RankingListTree.less'

// 榜单名录列表
class RankingListTree extends React.Component<any, any> {
  timer: any
  $translation: any

  constructor(props) {
    super(props)
    this.state = {
      // 查询输入框
      keyword: props.location.state ? props.location.state.keyword : '',
      // 菜单树选中的节点name
      currMenu: props.location.state ? props.location.state.currMenu : '科技型企业名录',
      // 菜单树选中的节点key
      selectedKeys: [],
      treeData: [],
    }
    // 输入后延时一秒查询词条
    this.timer = null
    if (this.state.currMenu) {
      // 如果查询单个榜单，先查询菜单树
      // modify it later
      this.props.getRankingListType()
      //   this.props.getRankingListType().then(() => {
      //   console.log('this.props', this.props)
      //   console.log('res', res)
      // 选中查询的菜单项

      //     const { treeMenu } = this.props.rankingList;
      //     treeMenu.forEach((item, index) => {
      //       if (item.type === this.state.currMenu) {
      //         console.log(index)
      //         this.setState({ selectedKeys: [`${index}`] });
      //       }
      //     });
      //     this.treeSearch();
      //   });
    } else {
      this.treeSearch()
    }
  }

  componentDidMount = () => {}

  componentWillUnmount = () => {
    this.timer && clearTimeout(this.timer)
  }

  inputChange = (e) => {
    this.setState({ keyword: e.target.value, currMenu: '', selectedKeys: [] })
  }

  treeSearch = (pageNum = 1, pageSize = 10) => {
    const { keyword, currMenu } = this.state
    this.props.treeSearch({
      pageNum,
      pageSize,
      key: keyword,
      typeName: currMenu,
    })
  }

  setType = ([index], { selected }) => {
    if (index === '企业名录') {
      // 取消选中，查询全部
      this.setState({ currMenu: '', selectedKeys: [] }, () => {
        this.treeSearch()
      })
      return
    }
    this.setState({ selectedKeys: [index] })
    if (!selected) {
      // 取消选中，查询全部
      this.setState({ currMenu: '' }, () => {
        this.treeSearch()
      })
      return
    }
    // console.log(index)
    // 查询对应菜单
    const { treeMenu } = this.props.rankingList.contents
    this.setState({ currMenu: treeMenu[index].type }, () => {
      this.treeSearch()
    })
  }

  onChange = (page, pageSize) => {
    this.treeSearch(page, pageSize)
  }

  getTreeMenuData = (menu, res) => {
    menu.forEach((item, index) => {
      if (item.type === 'list') {
        if (item.children) {
          res.push({
            title: item.objectName,
            key: item.currentCode,
            children: [],
          })
          this.getTreeMenuData(item.children, res[index].children)
        } else {
          res.push({
            title: item.objectName + '(' + item.total + ')',
            key: item.currentCode,
            children: [],
          })
        }
      } else {
        if (item.children) {
          if (item.children[0] && item.children[0].children) {
            res.push({
              title: item.objectName,
              key: item.currentCode,
              children: [],
            })
            this.getTreeMenuData(item.children, res[index].children)
          } else {
            res.push({
              title: item.objectName + '(' + item.total + ')',
              key: item.currentCode,
              children: [],
            })
            res[index].childKey = []
            this.getTreeMenuData(item.children, res[index].childKey)
          }
        } else {
          res.push(item.currentCode)
        }
      }
    })
    return res
  }

  formatterTreeMenu = () => {
    const { rankingList } = this.props
    const { treeMenu } = rankingList
    let originTree = []
    if (treeMenu.contents) {
      this.getTreeMenuData(treeMenu.contents, originTree)
    }
    return originTree
  }

  nodeClickHanlder = (code, full) => {
    // console.log('code', code)
    // console.log('full', full)
  }

  render() {
    const { keyword, selectedKeys, treeData } = this.state
    const { treeList } = this.props.rankingList
    const { treeMenu } = this.props.rankingList.contents ? this.props.rankingList.contents : this.props.rankingList
    const { pageNum, pageSize, total } = this.props.rankingList.treeListPagination

    // console.log('this.props.rankingList', this.props.rankingList)

    return (
      <div className="rankingListTree">
        <div className="pageTitle">
          <Breadcrumb data-uc-id="2VXh5xcITDT" data-uc-ct="breadcrumb">
            <Breadcrumb.Item
              onClick={() => {
                this.props.history.push('/rankList')
              }}
              data-uc-id="FdAV9NnT3I_"
              data-uc-ct="breadcrumb"
            >
              {this.$translation(315079)}
            </Breadcrumb.Item>
            <Breadcrumb.Item data-uc-id="YRFCkDP7rGP" data-uc-ct="breadcrumb">
              {this.$translation(315081)}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Input.Search
            placeholder={this.$translation(261032)}
            value={keyword}
            onChange={this.inputChange}
            onPressEnter={() => this.treeSearch()}
            prefix={<MyIcon name="find" />}
            data-uc-id="GDi2nhgkfmd"
            data-uc-ct="input"
          />
        </div>
        <div style={{ padding: '12px 16px' }}>
          <Row gutter={15} className="container">
            <Col className="left_menu">
              <Card size="small" className="rankingListInfo">
                <Tree
                  treeData={this.formatterTreeMenu()}
                  onSelect={this.nodeClickHanlder}
                  defaultExpandAll={true}
                  data-uc-id="7ua8wfHpVto"
                  data-uc-ct="tree"
                />
              </Card>
            </Col>
            <Col className="main_content">
              {treeMenu &&
                treeMenu.list &&
                treeMenu.list.map((item, index) => <RankingCard info={item} index={index} />)}
            </Col>
          </Row>
        </div>
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
    treeSearch: (data) => {
      rankingListSearch(data).then((res) => {
        dispatch(RankingListActions.treeSearch({ ...res, ...data }))
      })
    },
    getRankingListType: () => {
      return getRankingListType().then((res) => {
        dispatch(RankingListActions.getRankingListType(res))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankingListTree)
