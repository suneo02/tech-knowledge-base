/**
 * page 集团系
 * Created by Calvin
 *
 * @format
 */
// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import { useGroupStore } from '../../store/group'
import { debounce } from 'lodash'
import GroupContentNew from './components/ContentNew'
import GroupNavMenuNew from './components/NavMenuNew'
import './groupNew.less'

/** @deprecated */
const GroupNew = () => {
  const groupRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectedKeysHash = useRef(null)
  // const positionHash = useRef(null); // 通过位置参数来确认是否要禁用滚动事件

  const { treeModeInit, setSelectedKeys } = useGroupStore()

  const findNodesAtTop = () => {
    const nodes = contentRef.current.querySelectorAll('.node-item-children')
    nodes.forEach((element) => {
      if (!element?.attributes?.id) return
      const { top, bottom } = element.getBoundingClientRect()
      if (top <= 0 && bottom >= 0) {
        if (selectedKeysHash.current === element.attributes.id?.value) return // 节点缓存
        selectedKeysHash.current = element.attributes.id.value
        setSelectedKeys([element.attributes.id.value])
      }
    })
  }

  const handleScroll = debounce(() => {
    findNodesAtTop()
  }, 200)

  useEffect(() => {
    treeModeInit()
    // setTreeData()
    if (groupRef.current) groupRef.current.addEventListener('wheel', handleScroll)
    return () => {
      if (groupRef.current) groupRef.current.removeEventListener('wheel')
    }
  }, [])

  return (
    <div className="group-container" ref={groupRef}>
      <div>
        <GroupNavMenuNew />
        <GroupContentNew ref={contentRef} />
      </div>
    </div>
  )
}

export default GroupNew
