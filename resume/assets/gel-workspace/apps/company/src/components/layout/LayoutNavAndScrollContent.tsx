/**
 * page 集团系
 * Created by Calvin
 *
 * @format
 */
import FloatBar from '@/components/common/floatBar/FloatBar.tsx'
import '@/components/layout/styles/layoutNavAndScrollContent.less'
import { useGroupStore } from '@/store/group.ts'
import GroupContentNew from '@/views/Group/components/ContentNew.tsx'
import { debounce } from 'lodash'
import React, { useEffect, useRef } from 'react'
import LayoutNavMenu from './navMenu.tsx'

const LayoutNavAndScrollContent = ({ moduleName }) => {
  const layoutNavAndScrollContentRef = useRef(null)
  const contentRef = useRef(null)
  const selectedKeysHash = useRef(null)

  const { treeModeInit, setSelectedKeys, basicInfo, pointBuried } = useGroupStore()

  const findNodesAtTop = (index?) => {
    const nodes = contentRef.current.querySelectorAll('.node-item-children')
    if (index || index === 0) {
      const element = nodes[index]
      if (selectedKeysHash.current === element.attributes.id?.value) return // 节点缓存
      selectedKeysHash.current = element.attributes.id.value
      setSelectedKeys([element.attributes.id.value])
      return
    }
    nodes.forEach((element) => {
      if (!element?.attributes?.id) return
      const { top, bottom } = element?.getBoundingClientRect?.()
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
    treeModeInit(moduleName)
    if (layoutNavAndScrollContentRef.current)
      layoutNavAndScrollContentRef.current.addEventListener('wheel', handleScroll)
    return () => {
      if (layoutNavAndScrollContentRef.current) layoutNavAndScrollContentRef.current.removeEventListener('wheel')
    }
  }, [])

  useEffect(() => {
    if (!basicInfo?.id) return
    pointBuried({ opActive: 'enter', currentId: basicInfo.id, currentPage: window.location.href })
  }, [basicInfo.id])

  return (
    <div className="layout-nav-and-scroll-content" ref={layoutNavAndScrollContentRef}>
      <div>
        <LayoutNavMenu />
        {/*@ts-expect-error ttt*/}
        <GroupContentNew ref={contentRef} />
        <FloatBar target={layoutNavAndScrollContentRef.current} scrollToTopFinish={() => findNodesAtTop(0)}></FloatBar>
      </div>
    </div>
  )
}

export default LayoutNavAndScrollContent
