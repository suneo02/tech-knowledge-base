/**
 * 企业详情页AI增强版 - 主容器组件
 *
 * 负责协调上(顶部操作栏)、左(企业详情内容)、右(AI面板)三个区域的布局和状态管理
 *
 * @see ../../docs/CorpDetail/layout-container.md - 主容器布局设计文档
 * @see ../../docs/CorpDetail/design.md - 整体架构设计文档
 */

import { selectCorpNameIntl } from '@/reducers/company'
import { isFromF9 } from 'gel-util/env'
import { useSearchParams } from 'gel-util/hooks'
import { EIsSeparate } from 'gel-util/link'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { LAYOUT_DETAIL_AI_PREFIX } from './constant'
import styles from './index.module.less'
import { LayoutHeader, Left } from './Left'
import { Right } from './Right'

export const CompanyDetailAIRight: React.FC = () => {
  // 从 Redux 获取公司基本信息和收藏状态
  const companyState = useSelector((state: any) => state.company)
  const { corp_name } = companyState?.baseInfo || {}

  const corpNameIntl = useSelector((state: any) => selectCorpNameIntl(state))

  //  F9，且屏幕宽度小于 1600px 时，右侧栏默认隐藏
  const isF9 = isFromF9()
  const isSmallScreen = window.innerWidth < 1600
  const [showRight, setShowRight] = useState<boolean>(!(isF9 && isSmallScreen))
  const [rightWidth, setRightWidth] = useState<'50%' | '25%'>('25%')

  useSearchParams('isSeparate', String(EIsSeparate.True))

  return (
    <div className={`${styles[`${LAYOUT_DETAIL_AI_PREFIX}-container`]}`}>
      <LayoutHeader
        onShowRight={setShowRight}
        showRight={showRight}
        corpNameIntl={corpNameIntl}
        data-uc-id="ydUPPEeLnk"
        data-uc-ct="layoutheader"
      />
      <div className={styles[`${LAYOUT_DETAIL_AI_PREFIX}-content`]}>
        <Left />
        <Right
          entityName={corp_name}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onShowRight={setShowRight}
          showRight={showRight}
          data-uc-id="lPOdGT_rv8"
          data-uc-ct="right"
        />
      </div>
    </div>
  )
}
export default CompanyDetailAIRight
