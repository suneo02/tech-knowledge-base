import { createWFCSuperlistRequestFcs } from '@/api'
import { confirmUsage, isUsageAcknowledged } from '@/components/Modal/confirm'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { fetchPoints, useAppDispatch, useAppSelector } from '@/store'
import { fetchIndicatorTree, selectIndicatorTree, selectIndicatorTreeLoading } from '@/store/incicator'
import { postPointBuried } from '@/utils/common/bury'
import { CloseO } from '@wind/icons'
import { Button, Modal } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { AddDataToSheetResponse, CustomerPointCountByColumnIndicatorRequest } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { t } from 'gel-util/intl'
import {
  convertIndicatorKeysToClassificationList,
  IndicatorTreePanelScroll,
  useIndicatorTreePanelScroll,
} from 'indicator'
import { FC, useEffect } from 'react'
import styles from './index.module.less'
// import { CModal } from '@/components/Modal'

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const fetchSelectedIndicatorFunc = createWFCSuperlistRequestFcs('superlist/excel/selectedIndicator')

const precheckFunc = createWFCSuperlistRequestFcs('superlist/excel/customerPointCountByColumnIndicator')

const PREFIX = 'indicator-tree-panel'
const STRINGS = {
  TITLE: t('464148', '新增列'),
  ONLY_CHINA: t('355864', '仅限中国大陆企业筛选'),
}

export const IndicatorTreePanelLocal: FC<{
  open: boolean
  close: () => void
  onFinish: (res: AddDataToSheetResponse['data']) => void
  width?: string
  height?: string
  tableId: string
  sheetId?: number
}> = ({ open, close, onFinish, tableId, sheetId }) => {
  const dispatch = useAppDispatch()
  const indicatorPanelScrollRef = useIndicatorTreePanelScroll()
  const indicatorTree = useAppSelector(selectIndicatorTree)
  const indicatorTreeLoading = useAppSelector(selectIndicatorTreeLoading)
  const { sheetRefs, activeSheetId } = useSuperChatRoomContext()

  const { run: addDataToSheet, loading: addDataLoading } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: (res) => {
      if (res.Data) {
        message.success('新增成功')
        onFinish?.(res?.Data?.data)
        dispatch(fetchPoints())
      }
    },
    manual: true,
  })

  const { run: fetchSelectedIndicator, loading: fetchSelectedIndicatorLoading } = useRequest<
    Awaited<ReturnType<typeof fetchSelectedIndicatorFunc>>,
    Parameters<typeof fetchSelectedIndicatorFunc>
  >(fetchSelectedIndicatorFunc, {
    onSuccess: (res) => {
      const list = res?.Data?.indicatorKeyList || []
      indicatorPanelScrollRef.setSelectedIndicators(new Set(list.map(Number)))
    },
    onError: (e) => {
      console.error(e)
      message.error(`获取指标失败: ${e?.message}`)
    },
    manual: true,
  })

  const precheck = async (classificationList: CustomerPointCountByColumnIndicatorRequest['classificationList']) => {
    const res = await precheckFunc({
      sheetId: sheetId ?? 0,
      classificationList,
      tableId,
    })
    return res.Data?.pointTotal ?? 0
  }

  useEffect(() => {
    // sheet id 变化时，在打开 modal 时获取指标
    if (open && sheetId) {
      fetchSelectedIndicator({
        sheetId,
      })
    }
  }, [sheetId, open])

  const handleConfirm = (checkedIndicators: Set<number>) => {
    if (!indicatorTree) {
      message.error('指标树加载失败')
      return
    }
    postPointBuried('922604570309', {
      content: convertIndicatorKeysToClassificationList(indicatorTree, checkedIndicators)
        .map((item) => item.displayName)
        .join(','),
    })

    const executeRunAll = () => {
      addDataToSheet({
        tableId,
        sheetId,
        dataType: 'INDICATOR_FILTER',
        classificationList: convertIndicatorKeysToClassificationList(indicatorTree, checkedIndicators),
        pageNo: 1,
        // 暂时前端写死
        pageSize: 5000, // @ts-expect-error ttt
        enablePointConsumption: 1,
      })
    }

    if (isUsageAcknowledged('ADD_COLUMN')) {
      executeRunAll()
      return
    }

    confirmUsage({
      modalType: 'ADD_COLUMN',
      onOk: () => executeRunAll(),
    })
  }

  useEffect(() => {
    if (open && !indicatorTree) {
      dispatch(fetchIndicatorTree())
    }
  }, [open])

  useEffect(() => {
    // 关闭时重置
    if (!open) {
      indicatorPanelScrollRef.reset()
    }
  }, [open])

  return (
    <ErrorBoundary>
      <Modal
        className={styles.modal}
        visible={open}
        onCancel={close}
        footer={null}
        width={'80vw'}
        // height={height}
        // title="新增列选择"
        draggable={false}
        closable={false}
        bodyStyle={{
          padding: 0,
        }}
      >
        <div className={styles[`${PREFIX}-container`]}>
          <div className={styles[`${PREFIX}-header`]}>
            <h3>{STRINGS.TITLE}</h3>

            {/* @ts-expect-error wind-ui 类型错误 */}
            <Button type="text" size="small" onClick={close} icon={<CloseO />}></Button>
          </div>
          <div className={styles[`${PREFIX}-body`]}>
            <IndicatorTreePanelScroll
              ref={indicatorPanelScrollRef.getTreeRef()}
              onConfirm={handleConfirm}
              close={close}
              indicatorTree={indicatorTree ?? []}
              loading={indicatorTreeLoading || fetchSelectedIndicatorLoading}
              confirmLoading={addDataLoading}
              onPrecheck={precheck}
              rowLength={sheetRefs?.[activeSheetId]?.dataSource?.length ?? 0}
            />
          </div>
        </div>
      </Modal>
    </ErrorBoundary>
  )
}
