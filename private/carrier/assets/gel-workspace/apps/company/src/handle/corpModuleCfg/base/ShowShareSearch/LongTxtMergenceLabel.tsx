import { ShareholderBreakthroughCombined } from 'gel-types'
import { AutoExpandable } from 'gel-ui'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SharePathRenderer } from './SharePathRenderer'

const BODYOFFSETTOP = 18

interface LongTxtMergenceLabelProps {
  data: ShareholderBreakthroughCombined['shareRoute']
  expand?: (params: {
    code?: string
    id?: string
    callback: (data: ShareholderBreakthroughCombined['shareRoute']) => void
  }) => void
  id?: string
  code?: string
  rowType?: string
  // Backward compatibility if needed, though we plan to remove usage of txt
  txt?: string
}

const LongTxtMergenceLabel: React.FC<LongTxtMergenceLabelProps> = (props) => {
  const { data, expand, id, code, rowType } = props
  const [currentData, setCurrentData] = useState(data)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  const handleExpand = async () => {
    if (loading) return

    if (expand) {
      setLoading(true)
      return new Promise<void>((resolve) => {
        expand({
          code,
          id,
          callback: (newData) => {
            if (newData && newData.length > 0) {
              setCurrentData(newData)
            }
            setLoading(false)
            resolve()
          },
        })
      })
    }
  }

  const handleCollapse = () => {
    const showShareSearch = document.querySelector('#showShareSearch')
    const companyTab = document.querySelector(`.companyTab`)
    const companyBody = document.querySelector('.companyBody')

    if (showShareSearch && companyTab && companyBody) {
      const tableOffsetTop =
        // @ts-expect-error ttt
        showShareSearch.offsetTop +
        // @ts-expect-error ttt
        companyTab.offsetTop +
        BODYOFFSETTOP
      companyBody.scrollTo({
        top: tableOffsetTop,
        behavior: 'instant',
      })
    }
  }

  return (
    <Box>
      <AutoExpandable maxLines={2} onExpand={handleExpand} onCollapse={handleCollapse}>
        <SharePathRenderer data={currentData} rowType={rowType} />
      </AutoExpandable>
    </Box>
  )
}

const Box = styled.div``

export default LongTxtMergenceLabel
