import { Common } from '@/utils'
import { isDeveloper } from '@/utils/common'
import { intlNoIndex } from '@/utils/intl'
import cn from 'classnames'
import React from 'react'

export const LayoutTreeNodeTitle = (node) => (
  <span className={cn('layout-tree-node-title', `level-${node.level}`)}>
    {isDeveloper ? (
      node.isVip ? (
        <div className="nav-vip">V</div>
      ) : node.isSvip ? (
        <div className="nav-vip">S</div>
      ) : null
    ) : null}
    {node.titleId ? intlNoIndex(node.titleId) : node.title || ''}
    {node.num ? <span className="num">{node.num ? `（${Common.formatNumber(node.num)}）` : null}</span> : null}
  </span>
)
