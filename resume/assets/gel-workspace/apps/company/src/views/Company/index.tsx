import React, { useEffect, useRef } from 'react'
import { useCorpStore } from '@/store/company.ts'
import { getCorpCodeByUrl } from '../../handle/corp/misc.ts'
import { debounce } from 'lodash'
import { CorpContent } from '@/views/Company/comp/content.tsx'
import '@/components/layout/styles/layoutNavAndScrollContent.less'
import { CompanyDetailContext } from '@/views/Company/ctx.ts'
import styles from './style/index.module.less'

const Company = () => {
  const corpCodeByUrl = getCorpCodeByUrl()
  const { init, basicInfo } = useCorpStore()

  useEffect(() => {
    init(corpCodeByUrl)
  }, [])

  const corpRef = useRef(null)
  const contentRef = useRef(null)
  const selectedKeysHash = useRef(null)

  const { setSelectedKeys } = useCorpStore()

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
    if (corpRef.current) corpRef.current.addEventListener('wheel', handleScroll)
    return () => {
      if (corpRef.current) corpRef.current.removeEventListener('wheel')
    }
  }, [])

  return (
    <div className={` layout-nav-and-scroll-content ${styles['corp-new']}`} ref={corpRef}>
      <CompanyDetailContext.Provider
        value={{
          corpCode: corpCodeByUrl,
          basicInfo,
        }}
      >
        <CorpContent ref={contentRef} />
      </CompanyDetailContext.Provider>
    </div>
  )
}

export default Company
