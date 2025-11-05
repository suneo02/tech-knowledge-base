import * as companyActions from '@/actions/company'
import { CompanyReportModal } from '@/components/company/intro/report'
import { IState } from '@/reducers/type'
import React, { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PREFIX } from '.'
import { OperatorHeader } from './comp/OperatorHeader'
import CompanyDetail, { ScrollContainerClass } from './CompanyDetail'
import styles from './index.module.less'

export const LayoutHeader = memo(
  ({
    showRight,
    onShowRight,
  }: {
    showRight?: boolean
    onShowRight?: (props: boolean | ((prev: boolean) => boolean)) => void
  }) => {
    const dispatch = useDispatch()

    // 导出报告弹窗
    const [showReportModal, setShowReportModal] = useState(false)

    // 从 Redux 获取公司基本信息和收藏状态
    const companyState = useSelector((state: IState) => state.company)
    console.log('🚀 ~ companyState:', companyState)
    const { corp_id, corp_old_id } = companyState?.baseInfo || {}
    const collectState = !!companyState?.collectState || false
    const entityName =
      (companyState?.baseInfo as any)?.corp?.chinese_abbr || (companyState?.corpHeaderInfo as any)?.corp_name
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
      <div className={styles[`${PREFIX}-header`]}>
        <OperatorHeader
          entityName={entityName}
          companyCode={companyCode}
          collectState={collectState}
          setCollectState={setCollectState}
          backTopWrapClass={ScrollContainerClass}
          onClickReport={handleReportClick}
          onAliceClick={toggleAiSider}
          showRight={showRight}
        />

        {/* <div>
          <div>
            width: {size?.width}px, height: {size?.height}px
          </div>
  
          <Button type="primary" onClick={() => onShowRight(true)}>
            Show Right
          </Button>
        </div> */}

        <CompanyReportModal
          open={showReportModal}
          setOpen={(open) => {
            setShowReportModal(open)
          }}
          companycode={companyCode}
          companyid={corp_old_id}
          onClickCallHelp={() => {}}
          company={companyState}
          basicNum={companyState?.basicnum}
        />
      </div>
    )
  }
)

LayoutHeader.displayName = 'LayoutHeader'

export const Left: React.FC = () => {
  return (
    <div className={`${styles[`${PREFIX}-left`]}`}>
      <CompanyDetail />
    </div>
  )
}
