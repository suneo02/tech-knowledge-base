/**
 * chat page 的 cde modal 集合 组件
 */
import { createWFCSuperlistRequestFcs } from '@/api/handleFcs'
import { useRequest } from 'ahooks'
import { CDEFilterCfgProvider, CDEMeasureDefaultForSL, MeasuresProvider } from 'cde'
import { getCDEFilterResPayload } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { FC } from 'react'
import { CDEFilterPreviewModal } from '../component/FilterPreviewModal'
import { useFetchCDEConfig } from '../hooks/CDEConfig'
import { fetchPoints, useAppDispatch } from '@/store'

interface ChatCDEModalsProps {
  actionModal: 'cde' | 'monitor' | 'monitorPreview' | string | undefined
  setActionModal: (actionModal: 'cde' | 'monitor' | undefined) => void
  tableId: string
  sheetId?: number
  onAddFinish?: (res: Awaited<ReturnType<typeof addDataToSheetFunc>>) => void
  canAddCdeToCurrent?: boolean
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const Content: FC<ChatCDEModalsProps> = ({
  actionModal,
  setActionModal,
  tableId,
  sheetId,
  onAddFinish,
  canAddCdeToCurrent,
}) => {
  const dispatch = useAppDispatch()
  // const { tableId } = useChatRoomSuperContext()
  // 获取 cde 配置
  useFetchCDEConfig(['cde', 'monitor', 'monitorPreview'].includes(actionModal || ''))

  const { run: addDataToSheet, loading } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: (res) => {
      onAddFinish?.(res)
      dispatch(fetchPoints())
    },
    onError: console.error,
    manual: true,
  })
  const onFinish = (cdeDescription: string, cdeFilterCondition: getCDEFilterResPayload) => {
    addDataToSheet({
      tableId,
      sheetId,
      dataType: 'CDE_FILTER',
      cdeDescription,
      cdeFilterCondition,
      enablePointConsumption: 1,
    })
  }
  return (
    <>
      <CDEFilterPreviewModal
        open={actionModal === 'cde'}
        close={() => setActionModal(undefined)}
        onFinish={onFinish}
        confirmLoading={loading}
        confirmText="添加至表格"
        canAddCdeToCurrent={canAddCdeToCurrent}
      />
      {/* TODO 监控后端没上，前端先注释隐藏 */}
      {/* <CDEMonitorModal
        open={actionModal === 'monitor'}
        close={() => setActionModal(undefined)}
        // TODO 获取监控描述
        getCDEMonitorDesc={() => ''}
      />
      <CDEMonitorPreview
        open={actionModal === 'monitorPreview'}
        close={() => setActionModal(undefined)}
        // TODO 替换为真实值
        filters={[]}
        measures={[]}
      /> */}
    </>
  )
}

export const ChatCDEModals: FC<ChatCDEModalsProps> = (props) => {
  return (
    <ErrorBoundary>
      <CDEFilterCfgProvider>
        {/* 这一层是为了 监控回显筛选项，从而数据预览, 提供 measures 及预览字段 */}
        <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
          <Content {...props} />
        </MeasuresProvider>
      </CDEFilterCfgProvider>
    </ErrorBoundary>
  )
}
