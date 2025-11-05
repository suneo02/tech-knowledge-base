import { createWFCSuperlistRequestFcs, requestToDownloadFcs, requestToWFCSuperlistFcs } from '@/api'
import { Button, Divider, Dropdown, Input, Menu, message, Modal, Result, Spin, Tooltip } from '@wind/wind-ui'
import { Tabs } from 'antd'
import { TabsProps } from 'antd/lib'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { SheetInfo } from '@/contexts/ChatRoom/TChatRoomSuperCtx'
import { FOLDER_IDS } from '@/pages/MyFile/utils/navigation'
import { generateUniqueName } from '@/utils/common/data'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { FolderOpenO, SwapO } from '@wind/icons'
import TableNameEditor from './components/TableNameEditor'
import './index.less'
import User from '@/components/layout/Page/User'
import { VisTableContainer, type ContainerRefreshParams } from './components/VisTableContainer'
import { getActiveSheet, saveActiveSheet } from './utils/localStorage'
import { useModal } from '@/components/GlobalModalProvider'
import { useRequest } from 'ahooks'

// localStorage存储键常量
// const ACTIVE_SHEET_STORAGE_KEY = 'visTable_activeSheet'
const PREFIX = 'vis-table'

// 函数用于存储当前活跃的tableId和sheetId到localStorage
// const saveActiveSheet = (tableId: string, sheetId: number | string) => { ... }

// 函数用于从localStorage获取之前存储的tableId和sheetId
// const getActiveSheet = (currentTableId: string) => { ... }

export interface VisTableRefType {
  refresh: (params?: { sheets?: number[] }) => void
}

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

const VisTablePage = forwardRef<VisTableRefType, { tableId: string }>(({ tableId }, ref) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<TabsProps['items']>([])
  const listRef = useRef(list)
  useEffect(() => {
    listRef.current = list
  }, [list])
  const { setTableId, conversationId, setSheetList, setActiveTableSheetsVersion } = useChatRoomSuperContext()
  const [error, setError] = useState<string>('')
  const [addSheetLoading, setAddSheetLoading] = useState<boolean>(false)
  const [deleteSheetLoading, setDeleteSheetLoading] = useState<boolean>(false)
  const [activeKey, setActiveKey] = useState<string>('')
  const [existingSheetNames, setExistingSheetNames] = useState<string[]>([])
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null)
  const [editingSheetName, setEditingSheetName] = useState<string>('')
  const [editSheetLoading, setEditSheetLoading] = useState<boolean>(false)
  const [originalSheetName, setOriginalSheetName] = useState<string>('')
  // 存储表格名称用于初始化
  const [initialTableName, setInitialTableName] = useState<string>('')
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)

  // 表格容器refs存储
  const containerRefs = useRef<Record<string, { refresh: (params?: ContainerRefreshParams) => void }>>({})

  const handleDataImported = (sheetId: number | string) => {
    const sheetIdStr = String(sheetId)
    const sheetExists = listRef.current?.some((item) => item.key === sheetIdStr)
    console.log('🚀 ~ handleDataImported ~ sheetExists:', sheetExists)

    if (sheetExists) {
      // 切换到目标tab
      setActiveKey(sheetIdStr)

      // 保存当前活跃的tableId和sheetId到localStorage
      saveActiveSheet(tableId, sheetIdStr)

      // 调用对应容器组件的刷新方法
      const containerRef = containerRefs.current[sheetIdStr]
      if (containerRef && typeof containerRef.refresh === 'function') {
        containerRef.refresh({
          sheets: [Number(sheetIdStr)],
        })
      }

      // 设置临时key强制组件刷新
      setList((prevList) => {
        if (!prevList) return []
        return prevList.map((item) => {
          if (item.key === sheetIdStr) {
            return {
              ...item,
              key: `${item.key}-${Date.now()}`, // 临时更新key触发重渲染
              children: (
                <VisTableContainer
                  tableId={tableId}
                  sheetId={Number(sheetIdStr)}
                  onDataImported={() => handleDataImported(sheetIdStr)}
                  ref={(ref) => registerContainerRef(sheetIdStr, ref)}
                />
              ),
            }
          }
          return item
        })
      })

      // 恢复正确的key
      setTimeout(() => {
        setList((prevList) => {
          if (!prevList) return prevList
          return prevList.map((item) => {
            if (item.key.startsWith(`${sheetIdStr}-`)) {
              return {
                ...item,
                key: sheetIdStr,
              }
            }
            return item
          })
        })
      }, 100)
    } else {
      getTableInfo(tableId, conversationId).then(() => {
        setActiveKey(sheetIdStr)
      })
    }
  }

  // 注册容器引用
  const registerContainerRef = (
    sheetId: string,
    ref: { refresh: (params?: ContainerRefreshParams) => void } | null
  ) => {
    if (ref) {
      containerRefs.current[sheetId] = ref
    }
  }

  // 暴露刷新方法给父组件
  useImperativeHandle(ref, () => ({
    refresh: (params) => {
      console.log('通过ref调用刷新方法:', params)

      if (params?.sheets && params.sheets.length > 0) {
        // 检查指定的sheets是否都在当前list中
        const sheetsToRefresh = params.sheets
        const currentSheetIds = (list || []).map((item) => Number(item.key))
        const allSheetsExist = sheetsToRefresh.every((sheetId) => currentSheetIds.includes(sheetId))

        if (allSheetsExist) {
          // 如果所有sheet都存在，切换到第一个要刷新的sheet
          const targetSheetId = String(sheetsToRefresh[0])

          // 切换到目标tab
          setActiveKey(targetSheetId)

          // 保存当前活跃的tableId和sheetId到localStorage
          saveActiveSheet(tableId, targetSheetId)

          // 调用对应容器组件的刷新方法
          sheetsToRefresh.forEach((sheetId) => {
            const containerRef = containerRefs.current[String(sheetId)]
            if (containerRef && typeof containerRef.refresh === 'function') {
              containerRef.refresh({
                sheets: [sheetId],
              })

              // 设置临时key强制组件刷新
              setList((prevList) => {
                if (!prevList) return prevList
                return prevList.map((item) => {
                  if (item.key === String(sheetId)) {
                    return {
                      ...item,
                      key: `${item.key}-${Date.now()}`, // 临时更新key触发重渲染
                      children: (
                        <VisTableContainer
                          tableId={tableId}
                          sheetId={Number(sheetId)}
                          onDataImported={() => handleDataImported(sheetId)}
                          ref={(ref) => registerContainerRef(String(sheetId), ref)}
                        />
                      ),
                    }
                  }
                  return item
                })
              })

              // 恢复正确的key
              setTimeout(() => {
                setList((prevList) => {
                  if (!prevList) return prevList
                  return prevList.map((item) => {
                    if (item.key.startsWith(`${sheetId}-`)) {
                      return {
                        ...item,
                        key: String(sheetId),
                      }
                    }
                    return item
                  })
                })
              }, 100)
            }
          })
        } else {
          // 如果有sheet不存在，需要重新获取表格信息
          getTableInfo(tableId, conversationId).then(() => {
            setActiveKey(String(sheetsToRefresh[0]))
          })
        }
      } else {
        // 否则刷新所有sheets
        getTableInfo(tableId, conversationId)
      }
    },
  }))

  // 更新URL参数
  // const updateUrlParams = (sId: string) => {
  //   navigate(`?sheetId=${sId}`, { replace: true })
  // }

  const getTableInfo = async (currentTableId: string, currentConversationId: string) => {
    setLoading(true)
    try {
      const res = await requestToWFCSuperlistFcs('superlist/excel/getTableInfo', {
        tableId: currentTableId,
        conversationId: currentConversationId,
      })
      if (!res || !res.Data || !res.Data.sheetInfos) {
        setError('获取表格信息失败或格式不正确')
        setLoading(false)
        setList([])
        setSheetList([])
        setActiveTableSheetsVersion((prev) => prev + 1)
        return
      }
      setLoading(false)

      // 获取保存的活跃Sheet信息
      const savedActiveSheet = getActiveSheet(currentTableId)
      const firstSheetInfo = res.Data.sheetInfos[0]
      let targetSheetId: number | string | undefined = firstSheetInfo?.sheetId

      if (savedActiveSheet?.sheetId) {
        const sheetExists = res.Data.sheetInfos.some((s) => String(s.sheetId) === String(savedActiveSheet.sheetId))
        if (sheetExists) {
          targetSheetId = savedActiveSheet.sheetId
        }
      }

      if (targetSheetId === undefined && firstSheetInfo) {
        targetSheetId = firstSheetInfo.sheetId
      } else if (targetSheetId === undefined) {
        console.warn('No sheets found in table info and no saved active sheet.')
        setList([])
        setSheetList([])
        setActiveTableSheetsVersion((prev) => prev + 1)
        setInitialTableName(res.Data.tableName || '')
        setExistingSheetNames([])
        setActiveKey('')
        setError('')
        return
      }

      setActiveKey(String(targetSheetId))
      setInitialTableName(res.Data.tableName || '') // Ensure tableName is not undefined
      const sheetNames = res.Data.sheetInfos.map((sheet) => sheet.sheetName || '未命名')
      setExistingSheetNames(sheetNames)

      const newTabListItems = res.Data.sheetInfos.map((sheetInfo) => ({
        key: String(sheetInfo.sheetId),
        label: sheetInfo.sheetName || '未命名',
        closable: false,
        children: (
          <VisTableContainer
            tableId={currentTableId}
            sheetId={Number(sheetInfo.sheetId)}
            onDataImported={() => handleDataImported(sheetInfo.sheetId)}
            ref={(containerRefVal) => registerContainerRef(String(sheetInfo.sheetId), containerRefVal)}
          />
        ),
      }))
      setList(newTabListItems)

      // 更新context
      const newSheetListForContext: SheetInfo[] = res.Data.sheetInfos.map((s) => ({
        id: String(s.sheetId),
        name: s.sheetName || '未命名',
      }))
      setSheetList(newSheetListForContext)
      setActiveTableSheetsVersion((prev) => prev + 1)

      // 保存当前活跃的tableId和sheetId到localStorage
      saveActiveSheet(currentTableId, String(targetSheetId))
      setError('')
    } catch (error: unknown) {
      console.error('获取表格信息失败:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('获取表格信息时发生未知错误')
      }
      setLoading(false)
      setList([])
      setSheetList([])
      setActiveTableSheetsVersion((prev) => prev + 1)
    }
  }

  // 用于添加sheet的函数
  const addSheetApi = async (sheetName: string) => {
    const { Data } = await requestToWFCSuperlistFcs('superlist/excel/addSheet', {
      tableId,
      sheetName,
    })
    return Data.data
  }

  // 用于更新sheet名称的函数
  const updateSheetApi = async (sheetId: number | string, sheetName: string) => {
    const { Data } = await requestToWFCSuperlistFcs('superlist/excel/updateSheet', {
      sheetId: Number(sheetId),
      sheetName,
    })
    return Data
  }

  // 提交新增sheet表单
  const handleAddSheetSubmit = async (values: { sheetName: string }) => {
    if (!tableId) {
      message.error('表格ID不存在')
      return
    }
    try {
      const sheetName = values.sheetName
      setAddSheetLoading(true)
      const sheetId = await addSheetApi(sheetName)
      const newSheetTabItem = {
        key: String(sheetId),
        label: sheetName,
        children: (
          <VisTableContainer
            tableId={tableId}
            sheetId={sheetId}
            onDataImported={() => handleDataImported(sheetId)}
            ref={(containerRefVal) => registerContainerRef(String(sheetId), containerRefVal)}
          />
        ),
        closable: false,
      }
      const updatedTabList = [...(list || []), newSheetTabItem]
      setList(updatedTabList)
      setActiveKey(String(sheetId))
      setExistingSheetNames([...existingSheetNames, sheetName])
      saveActiveSheet(tableId, sheetId)
      const newSheetListForContext: SheetInfo[] = updatedTabList.map((item) => ({
        id: String(item.key),
        name: item.label as string,
      }))
      setSheetList(newSheetListForContext)
      setActiveTableSheetsVersion((prev) => prev + 1)
      message.success('新增Sheet成功')
    } catch (error: unknown) {
      console.error('新增Sheet失败:', error)
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('新增Sheet失败: 未知错误类型')
      }
    } finally {
      setAddSheetLoading(false)
    }
  }

  // 处理双击编辑sheet名称
  const handleDoubleClickSheet = (targetKey: string, label: string) => {
    setEditingSheetId(targetKey)
    setEditingSheetName(label)
    setOriginalSheetName(label) // 保存原始名称，便于取消时恢复
  }

  // 保存编辑后的sheet名称
  const handleSaveSheetName = async () => {
    if (!editingSheetId || !editingSheetName.trim()) {
      setEditingSheetId(null)
      return
    }
    if (
      existingSheetNames.some(
        (name) =>
          name === editingSheetName &&
          (list || []).find((item) => item.key === editingSheetId)?.label !== editingSheetName
      )
    ) {
      message.error('Sheet名称已存在')
      return
    }
    setEditSheetLoading(true)
    try {
      await updateSheetApi(editingSheetId, editingSheetName)
      const originalLabel = (list || []).find((item) => item.key === editingSheetId)?.label as string
      const updatedTabList = (list || []).map((item) => {
        if (item.key === editingSheetId) {
          return { ...item, closable: false, label: editingSheetName }
        }
        return item
      })
      setList(updatedTabList)
      setExistingSheetNames((prevNames) => prevNames.map((name) => (name === originalLabel ? editingSheetName : name)))
      const newSheetListForContext: SheetInfo[] = updatedTabList.map((item) => ({
        id: String(item.key),
        name: item.label as string,
      }))
      setSheetList(newSheetListForContext)
      setActiveTableSheetsVersion((prev) => prev + 1)
      message.success('更新Sheet名称成功')
    } catch (error: unknown) {
      console.error('更新Sheet名称失败:', error)
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('更新Sheet名称失败: 未知错误类型')
      }
    } finally {
      setEditSheetLoading(false)
      setEditingSheetId(null)
    }
  }

  // 取消编辑sheet名称
  const handleCancelEditSheetName = () => {
    setEditingSheetName(originalSheetName)
    setEditingSheetId(null)
  }

  // 删除sheet
  const handleDeleteSheet = async (targetKey: string) => {
    if (!tableId) {
      message.error('表格ID不存在')
      return
    }

    const currentList = list || []
    // 检查是否只剩最后一个sheet
    if (currentList.length <= 1) {
      message.warning('无法删除最后一个Sheet')
      return
    }

    // 获取要删除的Sheet项和名称
    const deleteIndex = currentList.findIndex((item) => item.key === targetKey)
    if (deleteIndex === -1) return // 未找到对应的Sheet

    const sheetToDelete = currentList[deleteIndex]
    const sheetName = typeof sheetToDelete?.label === 'string' ? sheetToDelete.label : '未命名'

    // 显示确认删除弹窗
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除Sheet "${sheetName}" 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setDeleteSheetLoading(true)
        try {
          // 调用API删除sheet
          await requestToWFCSuperlistFcs('superlist/excel/deleteSheet', { sheetId: Number(targetKey) })
          const updatedTabList = currentList.filter((_, index) => index !== deleteIndex)
          setList(updatedTabList)
          delete containerRefs.current[targetKey]
          if (sheetName) {
            setExistingSheetNames(existingSheetNames.filter((name) => name !== sheetName))
          }
          if (updatedTabList.length > 0) {
            if (activeKey === targetKey) {
              const newActiveIndex = deleteIndex > 0 ? deleteIndex - 1 : 0
              const newActiveKey = String(updatedTabList[newActiveIndex].key)
              setActiveKey(newActiveKey)
              saveActiveSheet(tableId, newActiveKey)
            }
          }
          const newSheetListForContext: SheetInfo[] = updatedTabList.map((item) => ({
            id: String(item.key),
            name: item.label as string,
          }))
          setSheetList(newSheetListForContext)
          setActiveTableSheetsVersion((prev) => prev + 1)
          message.success('删除Sheet成功')
        } catch (error: unknown) {
          console.error('删除Sheet失败:', error)
          if (error instanceof Error) {
            message.error(error.message)
          } else {
            message.error('删除Sheet失败: 未知错误类型')
          }
        } finally {
          setDeleteSheetLoading(false)
        }
      },
    })
  }

  // 自定义Tab标签渲染逻辑
  const renderTabLabel = (key: string, label: React.ReactNode) => {
    if (editingSheetId === key) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Input
            autoFocus
            value={editingSheetName}
            onChange={(e) => setEditingSheetName(e.target.value)}
            onPressEnter={handleSaveSheetName}
            // onBlur={handleCancelEditSheetName}
            style={{ width: 100, marginRight: 4, height: 22 }}
            disabled={editSheetLoading}
          />
          <Tooltip title="保存">
            <Button
              type="text"
              size="small"
              style={{ color: '#52c41a' }}
              icon={<CheckOutlined />}
              onClick={handleSaveSheetName}
              disabled={editSheetLoading}
            />
          </Tooltip>
          <Tooltip title="取消">
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              style={{ color: '#ff4d4f' }}
              onClick={handleCancelEditSheetName}
              disabled={editSheetLoading}
            />
          </Tooltip>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span onDoubleClick={() => handleDoubleClickSheet(key, String(label))}>{label}</span>
        <Dropdown
          overlay={
            <div style={{ padding: '5px 10px' }}>
              <Button type="text" icon={<EditOutlined />} onClick={() => handleDoubleClickSheet(key, String(label))}>
                重命名
              </Button>
              <br />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: '#ff4d4f' }}
                onClick={() => handleDeleteSheet(key)}
              >
                删除
              </Button>
            </div>
          }
          trigger={['hover']}
        >
          <EllipsisOutlined style={{ marginLeft: 4, fontSize: 14, color: '#999' }} />
        </Dropdown>
      </div>
    )
  }

  // 处理Tab列表项，增加双击编辑功能
  const enhancedTabItems = list?.map((item) => ({
    ...item,
    label: renderTabLabel(item.key as string, item.label),
    // 在编辑模式下禁用删除按钮
    closable: editingSheetId !== item.key && item.closable,
  }))

  useEffect(() => {
    if (!tableId) return

    // 设置当前tableId
    setTableId(tableId)

    // 获取表格信息
    getTableInfo(tableId, conversationId)
  }, [tableId, conversationId])

  const addIcon = addSheetLoading ? <LoadingOutlined /> : <PlusOutlined />

  // 处理下载文件
  const handleDownloadFile = async () => {
    if (!tableId) {
      message.error('表格ID不存在')
      return
    }
    try {
      setDownloadLoading(true)
      await requestToDownloadFcs(
        'download/createtask/superlistexcel',
        { tableName: initialTableName || '表格数据' },
        { appendUrl: tableId, headers: { 'Content-Type': 'multipart/form-data' } }
      )
      message.success('文件已开始下载，正在前往我的下载查看...')
      setTimeout(() => {
        const myDownloadUrl = `#/super/my-file?folder=${FOLDER_IDS.DOWNLOADS}`
        window.open(myDownloadUrl, '_blank')
      }, 1000)
    } catch (error: unknown) {
      console.error('下载文件失败:', error)
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('下载文件失败: 未知错误类型')
      }
    } finally {
      setDownloadLoading(false)
    }
  }

  const { openModal } = useModal()
  const { run: addDataToSheet } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: (_res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = { Data: { data: [{ sheetId: (_res as unknown as any)?.Data?.data[0] }] } }

      message.success('导入成功')
      handleDataImported(res.Data.data[0].sheetId)
    },
    manual: true,
  })

  const menu = (
    // @ts-expect-error windUI
    <Menu>
      <Menu.Item onClick={handleDownloadFile} disabled={downloadLoading}>
        {downloadLoading ? <LoadingOutlined /> : null}
        下载文件
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          openModal('bulkImportHome', {
            onFinish: (res) => {
              addDataToSheet({
                tableId,
                dataType: 'CLUE_EXCEL',
                sheetId: Number(activeKey),
                clueExcelCondition: res,
                enablePointConsumption: 1,
              })
            },
          })
        }}
      >
        上传文件
      </Menu.Item>
    </Menu>
  )

  return (
    // @ts-expect-error windUI
    <Spin spinning={loading || addSheetLoading || deleteSheetLoading || editSheetLoading}>
      {error ? (
        <Result title={error} subTitle="抱歉，服务器出错了" />
      ) : (
        <div className={`${PREFIX}-container`}>
          <div className={`${PREFIX}-header`}>
            <TableNameEditor tableId={tableId} initialName={initialTableName} onNameChange={setInitialTableName} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown overlay={menu} placement="bottomLeft">
                {/* @ts-expect-error wind-icon */}
                <Button type="text" icon={<FolderOpenO />}>
                  操作
                </Button>
              </Dropdown>
              <Divider type="vertical" style={{ marginInlineStart: 0, marginInlineEnd: 0 }} />
              {/* <Button type="text" icon={<PlusOutlined />}>
                监控设置
              </Button> */}
              <Divider type="vertical" style={{ marginInlineStart: 0, marginInlineEnd: 0 }} />
              <User showCoins />
            </div>
          </div>
          <div className={`${PREFIX}-content`}>
            <div>
              <Tabs
                activeKey={activeKey}
                onChange={(key) => {
                  setActiveKey(key)
                  saveActiveSheet(tableId, key)
                }}
                type={editingSheetId ? 'card' : 'editable-card'}
                className={`${PREFIX}-tabs`}
                tabBarStyle={{
                  backgroundColor: '#fff',
                }}
                tabPosition={'bottom'}
                items={enhancedTabItems}
                addIcon={addIcon}
                // @ts-expect-error wind-icon
                more={{ icon: <SwapO /> }}
                tabBarExtraContent={{
                  right: editingSheetId ? null : (
                    <Button
                      type="text"
                      icon={addIcon}
                      onClick={() =>
                        handleAddSheetSubmit({ sheetName: generateUniqueName({ name: 'Sheet', list, key: 'label' }) })
                      }
                    />
                  ),
                }}
                onEdit={(targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
                  if (action === 'add') {
                    console.log('🚀 ~ onEdit ~ 新增sheet:', targetKey)
                    handleAddSheetSubmit({ sheetName: generateUniqueName({ name: 'Sheet', list, key: 'label' }) })
                  } else if (!editingSheetId) {
                    // 只有在非编辑模式下才允许删除
                    console.log('🚀 ~ onEdit ~ 删除sheet:', targetKey)
                    handleDeleteSheet(targetKey as string)
                  }
                }}
              ></Tabs>
            </div>
          </div>
        </div>
      )}
    </Spin>
  )
})

export default VisTablePage
