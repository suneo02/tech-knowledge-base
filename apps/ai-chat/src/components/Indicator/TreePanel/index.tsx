import { createWFCSuperlistRequestFcs } from '@/api'
import { fetchPoints, useAppDispatch, useAppSelector } from '@/store'
import { fetchIndicatorTree, selectIndicatorTree, selectIndicatorTreeLoading } from '@/store/incicator'
import { Modal } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { ErrorBoundary } from 'gel-ui'
import {
  convertIndicatorKeysToClassificationList,
  IndicatorTreePanelScroll,
  useIndicatorTreePanelScroll,
} from 'indicator'
import { isEmpty } from 'lodash'
import { FC, useEffect } from 'react'
import styles from './index.module.less'

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const fetchSelectedIndicatorFunc = createWFCSuperlistRequestFcs('superlist/excel/selectedIndicator')

export const IndicatorTreePanelLocal: FC<{
  open: boolean
  close: () => void
  onFinish: () => void
  width?: string
  height?: string
  tableId: string
  sheetId?: number
}> = ({ open, close, width = '1080px', height = '800px', onFinish, tableId, sheetId }) => {
  const dispatch = useAppDispatch()
  const indicatorPanelScrollRef = useIndicatorTreePanelScroll()
  const indicatorTree = useAppSelector(selectIndicatorTree)
  const indicatorTreeLoading = useAppSelector(selectIndicatorTreeLoading)

  const { run: addDataToSheet, loading: addDataLoading } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: () => {
      message.success('新增成功')
      onFinish?.()
      dispatch(fetchPoints())
    },
    manual: true,
  })

  const { run: fetchSelectedIndicator, loading: fetchSelectedIndicatorLoading } = useRequest<
    Awaited<ReturnType<typeof fetchSelectedIndicatorFunc>>,
    Parameters<typeof fetchSelectedIndicatorFunc>
  >(fetchSelectedIndicatorFunc, {
    onSuccess: (res) => {
      if (res.Data?.indicatorKeyList && !isEmpty(res.Data.indicatorKeyList)) {
        indicatorPanelScrollRef.setSelectedIndicators(new Set(res.Data.indicatorKeyList.map(Number)))
      }
    },
    onError: (e) => {
      console.error(e)
      message.error(`获取指标失败: ${e?.message}`)
    },
    manual: true,
  })

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
    addDataToSheet({
      tableId,
      sheetId,
      dataType: 'INDICATOR_FILTER',
      classificationList: convertIndicatorKeysToClassificationList(indicatorTree, checkedIndicators),
      pageNo: 1,
      // 暂时前端写死
      pageSize: 5000,
      enablePointConsumption: 1,
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
      {/* @ts-expect-error wind-ui */}
      <Modal
        className={styles.modal}
        visible={open}
        onCancel={close}
        footer={null}
        width={width}
        height={height}
        title="列指标选择"
        draggable={false}
      >
        <IndicatorTreePanelScroll
          ref={indicatorPanelScrollRef.getTreeRef()}
          onConfirm={handleConfirm}
          close={close}
          indicatorTree={indicatorTree ?? []}
          loading={indicatorTreeLoading || fetchSelectedIndicatorLoading}
          confirmLoading={addDataLoading}
        />
      </Modal>
    </ErrorBoundary>
  )
}
