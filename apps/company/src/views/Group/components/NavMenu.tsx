/**
 * 快捷导航栏 可搭配展示详情页使用
 * Created by Calvin
 *
 * @format
 */
// @ts-nocheck
import { Skeleton, Tree } from '@wind/wind-ui'
import { useScrollUtils } from '../scroll'
import { setExpandedKeys, setSelectedNode, setUpdateSelected } from '../../../actions/group.js'
import { connect } from 'react-redux'
import { treeData } from '../demoTableData'

const GoupNavMenu = ({ selectedNode, setUpdateSelected, setSelectedNode }) => {
  const { scrollToView } = useScrollUtils()

  const onSelect = (id) => {
    setUpdateSelected(false)
    setSelectedNode(id)
    scrollToView(id).then(() => {
      console.log('滚动事件结束')
      setUpdateSelected(true)
    })
  }

  return (
    <div className="navMenu">
      {treeData?.length ? (
        <Tree className="tree" treeData={treeData} onSelect={onSelect} selectedKeys={selectedNode} onExpand={setExpandedKeys}></Tree>
      ) : (
        <Skeleton loading animation style={{ height: 300, width: '100%' }}></Skeleton>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  selectedNode: state.group.selectedNode,
  list: state.group.list,
  expandedKeys: state.group.expandedKeys,
})

const mapDispatchToProps = (dispatch) => ({
  setUpdateSelected: (param) => dispatch(setUpdateSelected(param)),
  setSelectedNode: (node) => dispatch(setSelectedNode(node)),
  setExpandedKeys: (node) => dispatch(setExpandedKeys(node)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GoupNavMenu)
