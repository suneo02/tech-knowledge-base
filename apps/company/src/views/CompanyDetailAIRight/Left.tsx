/**
 * 企业详情页左侧区域组件
 *
 * 包含顶部操作栏(LayoutHeader)和企业详情核心内容区域
 * LayoutHeader负责顶部操作控制，Left组件负责左侧内容区域布局
 *
 * @see ../../docs/CorpDetail/layout-left.md - 左侧区域设计文档
 * @see ../../docs/CorpDetail/layout-header.md - 顶部操作栏设计文档
 * @see ../../docs/CorpDetail/layout-middle.md - 企业详情核心设计文档
 */

import * as companyActions from '@/actions/company'
import { withContactManager } from '@/components/company/ContactManager/ContactManagerButton'
import { IState } from '@/reducers/type'
import { getCorpNameOriginalByBaseAndCardInfo } from 'gel-util/misc'
import React, { lazy, memo, Suspense, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OperatorHeader } from './comp/OperatorHeader'
import CompanyDetail, { ScrollContainerClass } from './CompanyDetail'
import { LAYOUT_DETAIL_AI_PREFIX } from './constant'
import styles from './index.module.less'

// 懒加载 CompanyReportModal 组件 - 优化首屏加载性能
// 只有在用户点击报告按钮时才会动态加载该组件
const CompanyReportModal = lazy(() =>
  import('@/components/company/intro/report').then((module) => ({
    default: module.CompanyReportModal,
  }))
)

export const LayoutHeader = memo(
  withContactManager(
    ({
      showRight,
      onShowRight,
      onContactManager,
      corpNameIntl,
    }: {
      showRight?: boolean
      onShowRight?: (props: boolean | ((prev: boolean) => boolean)) => void
      onContactManager?: () => void
      corpNameIntl: string
    }) => {
      const dispatch = useDispatch()

      // 导出报告弹窗
      const [showReportModal, setShowReportModal] = useState(false)

      // 从 Redux 获取公司基本信息和收藏状态
      const companyState = useSelector((state: IState) => state.company)

      const { corp_id, corp_old_id } = companyState?.baseInfo || {}
      const collectState = !!companyState?.collectState || false
      const entityName = getCorpNameOriginalByBaseAndCardInfo(companyState?.baseInfo, companyState?.corpHeaderInfo)
      const companyCode = corp_id || '' // 获取企业ID

      // 更新收藏状态的函数
      const setCollectState = useCallback(
        (state) => {
          dispatch(companyActions.setCollectState(state))
        },
        [dispatch]
      )

      // 切换AI侧边栏可见性
      const toggleAiSider = useCallback(
        (show: boolean) => {
          onShowRight(show)
        },
        [onShowRight]
      )

      const handleReportClick = useCallback(() => {
        setShowReportModal(true)
      }, [])

      return (
        <div className={styles[`${LAYOUT_DETAIL_AI_PREFIX}-header`]}>
          <OperatorHeader
            entityName={entityName}
            companyCode={companyCode}
            collectState={collectState}
            setCollectState={setCollectState}
            backTopWrapClass={ScrollContainerClass}
            onClickReport={handleReportClick}
            onAliceClick={toggleAiSider}
            showRight={showRight}
            corpNameIntl={corpNameIntl}
            corpHeaderInfo={companyState?.corpHeaderInfo}
            data-uc-id="C25wZAkyf8"
            data-uc-ct="operatorheader"
          />
          {showReportModal && (
            <Suspense fallback={<div></div>}>
              <CompanyReportModal
                open={showReportModal}
                setOpen={(open) => {
                  setShowReportModal(open)
                }}
                companycode={companyCode}
                companyid={corp_old_id}
                onClickCallHelp={() => {
                  onContactManager?.()
                }}
                company={companyState}
                basicNum={companyState?.basicnum}
                data-uc-id="1i0jZ9BzlY"
                data-uc-ct="companyreportmodal"
              />
            </Suspense>
          )}
        </div>
      )
    }
  )
)

LayoutHeader.displayName = 'LayoutHeader'

export const Left: React.FC<{}> = () => {
  return (
    <div className={`${styles[`${LAYOUT_DETAIL_AI_PREFIX}-left`]}`}>
      <CompanyDetail />
    </div>
  )
}
