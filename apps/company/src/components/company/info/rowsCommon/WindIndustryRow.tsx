import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import { Tree } from '@wind/wind-ui'
import React from 'react'
import { TitleAttachmentRender, makeTree } from '../comp/misc'
import { ICorpBasicInfoFront } from '../handle'

export const corpInfoWindIndustryRow = (fromShfic: boolean): HorizontalTableCol<ICorpBasicInfoFront> => ({
  title: <TitleAttachmentRender />,
  dataIndex: 'industryWindFold',
  render: (_txt, backData) => {
    const data = backData.industryWindFold
    if (!data) return '--'
    const list = data.split('-')
    const treeStr = [{ title: list[0], key: '0-0' }]
    let tmp: any = treeStr[0]
    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        const k = '-0'
        tmp.children = []
        const item = { title: list[i], key: tmp.key + k }
        makeTree(tmp, item)
        tmp = item
      }
    }
    return (
      <Tree
        className="corp-industry-tree"
        showLine={true}
        defaultExpandedKeys={fromShfic ? [] : [tmp.key]}
        treeData={treeStr}
      />
    )
  },
})
