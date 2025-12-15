import React, { useState, useMemo } from 'react'
import Table from '@wind/wind-ui-table'
import { getTableLocale } from '@/components/company/table/handle'
import { useAIChartData } from '../../hooks/useChartData'
import ChartEmpty from '@/views/Charts/comp/chartEmpty'
import { AIGRAPH_EXCEL_SHEET_KEYS, AIGraphExcelSheetKey } from '../../types'
import { cellConfig, sheetColumnIdsMap } from './config'
import EditableCell from './editableCell'
import { CloseO, DataEditO, PlusO, SaveO } from '@wind/icons'
import { Modal, Button } from '@wind/wind-ui'
import useTableData from '../../hooks/useTableData'
import { getGraphTypeValue } from '../../utils'
import { useUpdateEffect } from 'ahooks'
import { useAIChartsStore } from '../../store'
import useGenerateGraph from '../../hooks/useGenerateGraph'

/**
 * @description AI图谱Excel数据组件
 * @param {AIGraphExcelSheetKey} sheetType - 列表类型
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsExcelSheet = ({ sheetType, fetching }: { sheetType: AIGraphExcelSheetKey; fetching: boolean }) => {
  const {
    setEditMode,
    editMode,
    activeChatId,
    currentVersion,
    setChangedTableValueMap,
    reverseEditMode,
    addChangedTableValue,
    deleteTempChangedTableValueByRowId,
    recordDeletedChangedTableValue,
    recordUpdatedChangedTableValue,
  } = useAIChartsStore()
  const {
    graphConfig,
    graphRelations,
    setGraphRelations,
    graphNodeList,
    setGraphNodeList,
    handleResetTableData,
    handleUpdateTableCellData,
  } = useTableData()
  const { handleModifyChartSheetData } = useGenerateGraph()

  useUpdateEffect(() => {
    setEditMode(false)
    setChangedTableValueMap({})
  }, [activeChatId, currentVersion])

  const locale = getTableLocale(!fetching)

  // 将图表数据转换为节点表格数据
  const tableDataForNode = React.useMemo(() => {
    if (!graphNodeList || !graphNodeList.length) return []

    const data = graphNodeList.map((node: any, index: number) => {
      const properties = node?.properties || {}
      return {
        key: node.rowId,
        rowId: node.rowId,
        rowIndex: index,
        nodeId: node.nodeId,
        nodeName: node?.nodeName || '--',
        nodeType: node?.nodeType || '',
        registerStatus: properties?.registerStatus || '',
        isListedOrBondIssuer: properties?.isListedOrBondIssuer,
        country: properties?.country || '',
        province: properties?.province || '',
        city: properties?.city || '',
        district: properties?.district || '',
        nationalStandardIndustryCategory: properties?.nationalStandardIndustryCategory || '',
        nationalStandardIndustryClass: properties?.nationalStandardIndustryClass || '',
        nationalStandardIndustrySubclass: properties?.nationalStandardIndustrySubclass || '',
        nationalStandardIndustryType: properties?.nationalStandardIndustryType || '',
      }
    })

    return data
  }, [graphNodeList])

  // 将图表数据转换为基础表格数据
  const tableDataForBasic = React.useMemo(() => {
    return [
      {
        graphType: getGraphTypeValue(graphConfig.type, graphConfig.layout),
        graphName: graphConfig?.name || '',
        mergeSameNameNodes: graphConfig?.mergeSameNameNodes,
        groupByRelationType: graphConfig?.groupByRelationType,
        defaultGroupCount: graphConfig?.defaultGroupCount || 10,
        fisheyeEffect: graphConfig?.fisheyeEffect,
        enableNodeJump: graphConfig?.enableNodeJump,
      },
    ]
  }, [graphConfig])

  // 将图表数据转换为关系表格数据
  const tableDataForRelation = React.useMemo(() => {
    if (!graphRelations) return []
    const data = graphRelations.map((relation: any, index: number) => {
      return {
        key: relation.rowId,
        rowId: relation.rowId,
        rowIndex: index,
        fromNodeName: relation?.fromNodeName || '--',
        toNodeName: relation?.toNodeName || '--',
        relationshipType: relation?.relationshipType || '',
        relationship: relation?.relationship || '',
      }
    })
    return data
  }, [graphRelations])

  function handleDeleteClick(rowId: string, rowIndex: number) {
    Modal.info({
      title: '温馨提示',
      content: <div>请确认是否删除该条行数据？</div>,
      okText: '确认',
      onOk: () => {
        // 如果删除的是刚新增的数据,删除此条数据的更新记录
        if (rowId.includes('temp-row-id')) {
          deleteTempChangedTableValueByRowId(rowId)
        } else {
          recordDeletedChangedTableValue(rowId, rowIndex, sheetType)
        }

        if (sheetType === AIGRAPH_EXCEL_SHEET_KEYS.NODE) {
          setGraphNodeList((prev) => {
            const next = prev.filter((node) => node.rowId !== rowId)
            return next
          })
          return
        }
        setGraphRelations((prev) => {
          const next = prev.filter((relation) => relation.rowId !== rowId)
          return next
        })
      },
    })
  }

  function handleUpdate(rowId: string, columnId: string, val: any, rowIndex: number) {
    recordUpdatedChangedTableValue(rowId, rowIndex, sheetType, columnId, val)
    handleUpdateTableCellData(sheetType, rowId, columnId, val)
  }

  const newColumns = useMemo(() => {
    const columnIds = sheetColumnIdsMap[sheetType]
    return columnIds.map((columnId) => {
      const config = cellConfig[columnId]
      return {
        title: config.name,
        dataIndex: columnId,
        width: config.width,
        ...config,
        render: (text: any, record: any, index: number) => {
          if (columnId === 'index') {
            return record.rowIndex + 1
          }
          if (columnId === 'operation') {
            return (
              <Button
                type="link"
                onClick={() => {
                  handleDeleteClick(record.rowId, record.rowIndex)
                }}
                disabled={!editMode}
              >
                删除
              </Button>
            )
          }
          // 不同图谱类型，对应有不可编辑的配置
          const disabledColumnIds = cellConfig['graphType'].options.find(
            (o) => o.key === tableDataForBasic[0]?.['graphType']
          )?.disabled
          return (
            <EditableCell
              cellConfig={config}
              value={text}
              editMode={editMode}
              disabled={disabledColumnIds?.includes(columnId)}
              handleValueChange={(value) => {
                const rowId = sheetType === AIGRAPH_EXCEL_SHEET_KEYS.BASIC ? 'config' : record.rowId
                handleUpdate(rowId, columnId, value, record.rowIndex)
              }}
            />
          )
        },
      }
    })
  }, [sheetType, editMode, tableDataForBasic])

  const newData = useMemo(() => {
    if (sheetType === AIGRAPH_EXCEL_SHEET_KEYS.NODE) {
      return tableDataForNode
    } else if (sheetType === AIGRAPH_EXCEL_SHEET_KEYS.BASIC) {
      return tableDataForBasic
    } else {
      return tableDataForRelation
    }
  }, [sheetType, tableDataForNode, tableDataForBasic, tableDataForRelation])

  function handleAddClick() {
    const randomRowId = `temp-row-id-${new Date().getTime()}`
    addChangedTableValue(randomRowId, { action: 'add', sheetType })
    if (sheetType === AIGRAPH_EXCEL_SHEET_KEYS.NODE) {
      setGraphNodeList((prev) => {
        const next = [...prev]
        next.unshift({
          rowId: randomRowId,
          nodeName: '',
        })
        return next
      })
      return
    }
    setGraphRelations((prev) => {
      const next = [...prev]
      next.unshift({
        rowId: randomRowId,
        fromNodeName: '',
        toNodeName: '',
        relationShip: '',
        relationShipType: '',
      })
      return next
    })
  }

  function handleCancelClick() {
    setEditMode(false)
    setChangedTableValueMap({})
    handleResetTableData(sheetType)
  }

  return (
    <>
      {!fetching && (!graphRelations || !graphRelations?.length) ? (
        <ChartEmpty />
      ) : (
        <div style={{ height: '100%' }}>
          <div style={{ display: 'flex', margin: '6px 0 16px 0' }}>
            {!editMode ? (
              <Button
                icon={<DataEditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={reverseEditMode}
              >
                修改
              </Button>
            ) : (
              <>
                <Button
                  style={{ marginRight: '8px' }}
                  icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  onClick={handleCancelClick}
                >
                  取消
                </Button>
                {sheetType !== AIGRAPH_EXCEL_SHEET_KEYS.BASIC && (
                  <Button
                    style={{ marginRight: '8px' }}
                    icon={<PlusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    onClick={handleAddClick}
                  >
                    新增
                  </Button>
                )}
                <Button
                  type="primary"
                  style={{ marginRight: '8px' }}
                  icon={<SaveO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  onClick={handleModifyChartSheetData}
                >
                  保存
                </Button>
              </>
            )}
          </div>
          <div>
            <Table
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: false,
              }}
              columns={newColumns}
              loading={fetching}
              dataSource={newData}
              rowKey={(record) => record.rowId}
              style={{ width: '100%' }}
              locale={locale}
              bordered="dotted"
              scroll={{ y: 'calc(100vh - 240px)' }}
              data-uc-id="y4LiKirBwu"
              data-uc-ct="table"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AIChartsExcelSheet
