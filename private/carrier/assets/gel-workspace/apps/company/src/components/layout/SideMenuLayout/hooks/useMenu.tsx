import { ReportTemplate } from '@/api/paths'
import { createRequest } from '@/api/request'
import { ApiCodeForWfc } from '@/api/types'
import { IframeMessageProps } from '@/utils/iframe/index'
import { ReportHomeIframeAction } from '@/utils/iframe/paths/report'
import { Button, Input, message, Modal } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MenuItemProps, MenuParams } from '../types'

interface UseMenuOptions {
  initialMenu: MenuItemProps[]
  globalParams?: MenuParams
  onMenuSelect?: (item: MenuItemProps, selected: boolean) => void
  defaultActiveKey?: React.Key
}

interface UseMenuReturn {
  activeItem: MenuItemProps
  contextParams: MenuParams
  menu: MenuItemProps[]
  menuCache: React.MutableRefObject<MenuCache>
  handleMenuSelect: (item: MenuItemProps, selected: boolean) => Promise<void>
  updateGlobalParams: (params: MenuParams) => void
  updateMenuCache: (key: string, cache: MenuItemCache) => void
  handleMessageChange: (res: IframeMessageProps) => void
  handleDeleteTemplateData: (id: React.Key, activeKey: React.Key) => void
}

interface MenuCache {
  [key: string]: MenuItemCache
}

interface MenuItemCache {
  params?: MenuParams
  templateChildren?: MenuItemProps[]
}

export const useMenu = ({
  initialMenu,
  globalParams,
  onMenuSelect,
  defaultActiveKey,
}: UseMenuOptions): UseMenuReturn => {
  // 状态管理
  const [activeItem, setActiveItem] = useState<MenuItemProps>({} as MenuItemProps)
  const [contextParams, setContextParams] = useState<MenuParams>(globalParams || {})
  const [menu, setMenu] = useState<MenuItemProps[]>(initialMenu)
  const menuCache = useRef<MenuCache>({})

  // 当前激活的模板API缓存
  const currentTemplateCacheItem = useRef<Map<string, MenuItemProps[]>>(new Map())
  // const templateCache = useRef<Map<string, MenuItemProps[]>>(new Map())

  // 获取初始模板数据
  const getInitialTemplate = useCallback(() => {
    const templateNode = initialMenu.find((item) => item.key === 'template')
    return templateNode?.children || []
  }, [initialMenu])

  // 更新模板节点
  const updateTemplateNode = useCallback((children: MenuItemProps[]) => {
    setMenu((prevMenu) => {
      return prevMenu.map((item) => {
        if (item.key === 'template') {
          return {
            ...item,
            children: [...children].sort((a, b) => String(b.key).localeCompare(String(a.key))), // 按时间倒序排序
          }
        }
        return item
      })
    })
  }, [])

  // 更新全局参数
  const updateGlobalParams = useCallback((params: MenuParams) => {
    setContextParams((prev) => ({
      ...prev,
      ...params,
    }))
  }, [])

  // 更新菜单项缓存
  const updateMenuCache = useCallback(
    (key: string, cache: MenuItemCache) => {
      menuCache.current = {
        ...menuCache.current,
        [key]: {
          ...menuCache.current[key],
          ...cache,
        },
      }
      console.log('已加入缓存', menuCache.current)

      // 如果当前菜单项是激活项，更新其状态
      if (activeItem.key === key) {
        setActiveItem((prev) => ({
          ...prev,
          ...(cache.params && { params: { ...prev.params, ...cache.params } }),
          ...(cache.templateChildren && { children: cache.templateChildren }),
        }))
      }
    },
    [activeItem.key]
  )

  // 处理模板 API
  const handleTemplateApi = useCallback(
    async (item: MenuItemProps) => {
      if (!item.templateApi) {
        console.log('step1,获取templateApi', item.templateApi)
        // 如果没有templateApi，使用初始模板数据
        // currentTemplateApi.current = null
        updateTemplateNode(getInitialTemplate())
        return item
      }

      // 检查是否有缓存
      if (currentTemplateCacheItem.current.get(String(item.key))) {
        console.log('step2,检查是否有缓存', currentTemplateCacheItem.current)
        const cachedChildren = currentTemplateCacheItem.current.get(String(item.key))
        updateTemplateNode(cachedChildren)
        return item
      }

      // 检查缓存
      if (menuCache.current[item.key]?.templateChildren) {
        console.log('step3,检查缓存', menuCache.current)
        const cachedChildren = menuCache.current[item.key].templateChildren!
        updateTemplateNode(cachedChildren)
        return item
      }

      try {
        const api = createRequest({ noExtra: true })
        const { Data } = await api(item.templateApi as any, { params: item.templateParams })
        const data = Data.map((res) => ({
          title: res.name,
          key: res.id,
          params: { templateId: res.id, setting: res.setting },
          type: res.type,
          enableDelete: true,
        }))

        // 更新缓存和当前模板API
        // updateMenuCache(String(item.key), { templateChildren: data })
        currentTemplateCacheItem.current.set(String(item.key), data)
        updateTemplateNode(data)
        return item
      } catch (error) {
        console.error('Failed to fetch template data:', error)
        return item
      }
    },
    [updateMenuCache, getInitialTemplate, updateTemplateNode]
  )

  const handleUpdateTemplateData = useCallback(
    async (data: ReportTemplate) => {
      const api = createRequest({ noExtra: true })
      const { ErrorCode, Data } = await api('download/common/saveReportTemplate', {
        params: data,
      })
      if (ErrorCode === ApiCodeForWfc.OVER_LIMIT) {
        Modal.error({
          content: '保存失败, 模板已上限',
        })
        return
      } else if (ErrorCode !== ApiCodeForWfc.SUCCESS) {
        Modal.error({
          content: '保存失败',
        })
        return
      }
      message.success('更新成功')
      const newChild = {
        title: Data.name,
        key: Data?.id || new Date().getTime().toString(),
        params: {
          templateId: Data?.id || new Date().getTime().toString(),
          setting: Data.setting,
        },
        type: Data.type,
        enableDelete: true,
      }
      // 获取当前模板数据
      const currentTemplateChildren = menu.find((item) => item.key === 'template')?.children || []
      let updatedChildren
      if (currentTemplateChildren?.length && currentTemplateChildren.some((res) => res.key === newChild.key)) {
        updatedChildren = currentTemplateChildren.map((res) => (res.key === newChild.key ? newChild : res))
      } else {
        updatedChildren = [newChild, ...currentTemplateChildren]
      }

      // 如果有当前激活的模板API，更新其缓存
      // updateMenuCache(String(activeItem.key), { templateChildren: updatedChildren })
      currentTemplateCacheItem.current.set(String(activeItem.key), updatedChildren)
      updateTemplateNode(updatedChildren)
    },
    [activeItem?.key, menu]
  )

  const handleDeleteTemplateData = useCallback(
    async (id: React.Key, activeKey: React.Key) => {
      console.log('handleDeleteTemplateData key', activeKey)
      const api = createRequest({ noExtra: true })
      const { Data } = await api('download/common/deleteReportTemplate', {
        params: { id },
      })
      if (!Data) {
        message.error('删除失败')
        return
      }
      message.success('删除成功')

      let updatedChildren
      if (currentTemplateCacheItem?.current?.get(String(activeKey))) {
        updatedChildren = currentTemplateCacheItem?.current
          ?.get(String(activeKey))
          ?.filter((item) => String(item.key) !== String(id))
      } else {
        const currentTemplateChildren = menu.find((item) => item.key === 'template')?.children || []
        updatedChildren = currentTemplateChildren.filter((item) => String(item.key) !== String(id))
      }

      // 如果有当前激活的模板API，更新其缓存
      // updateMenuCache(String(activeItem.key), { templateChildren: updatedChildren })
      currentTemplateCacheItem.current.set(String(activeKey), updatedChildren)
      updateTemplateNode(updatedChildren)
    },
    [activeItem, menu]
  )

  // TODO 把成功事件传入即可，里面的action踢出去，处理消息变更（报告模板）
  const handleMessageChange = useCallback(
    async ({ action, payload }: IframeMessageProps) => {
      console.log('handleMessageChange', action, payload)
      if (action === ReportHomeIframeAction.SAVE_REPORT_TEMPLATE_DATA) {
        const _param = payload as ReportTemplate
        console.log('🚀 ~ _param:', _param)
        if (!_param?.id) {
          const modal = Modal.info({
            title: '新增模板',
            content: (
              <Form
                onFinish={(values) => {
                  handleUpdateTemplateData({ ..._param, ...values })
                  modal.destroy()
                }}
              >
                <Form.Item name="name">
                  <Input placeholder="请输入模板名称" data-uc-id="4iymueZkAE" data-uc-ct="input" />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  data-uc-id="VaP9vHIYeR"
                  data-uc-ct="button"
                >
                  确定
                </Button>
              </Form>
            ),
            className: 'modal-hide-footer',
            maskClosable: true,
          })
          return
        }
        handleUpdateTemplateData(_param)
      }
      // if (action === ReportHomeIframeAction.DELETE_REPORT_TEMPLATE_DATA) {
      //   handleDeleteTemplateData(payload?.id)
      // }

      // // 更新模板节点
      // updateTemplateNode(updatedChildren)
    },
    [menu, handleUpdateTemplateData]
  )

  // 处理菜单选择
  const handleMenuSelect = useCallback(
    async (item: MenuItemProps, selected: boolean) => {
      if (item.disabled) return

      // 处理模板API
      if (item.templateApi) {
        await handleTemplateApi(item)
      }

      // 只处理当前展示的内容传递参数，自身不进行任何内容渲染
      if (item.params) {
        updateMenuCache(String(activeItem.key), {
          params: selected ? { ...item.params } : {},
        })
      } else {
        setActiveItem(item)
        // 处理模板API
        if (!item.templateApi) setMenu(initialMenu)
      }

      onMenuSelect?.(item, selected)
    },
    [handleTemplateApi, updateMenuCache, onMenuSelect]
  )

  // 初始化选中菜单
  useEffect(() => {
    console.log(defaultActiveKey)
    if (defaultActiveKey) {
      setMenu(initialMenu)
      const findItem = (items: MenuItemProps[]): MenuItemProps | null => {
        for (const item of items) {
          if (item.key === defaultActiveKey) return item
          if (item.children) {
            const found = findItem(item.children)
            if (found) return found
          }
        }
        return null
      }
      const found = findItem(initialMenu)
      console.log('🚀 ~ useEffect ~ found:', found)
      if (found) {
        handleMenuSelect(found, true)
      }
    }
  }, [])

  return {
    activeItem,
    contextParams,
    menu,
    menuCache,
    handleMenuSelect,
    updateGlobalParams,
    updateMenuCache,
    handleMessageChange,
    handleDeleteTemplateData,
  }
}
