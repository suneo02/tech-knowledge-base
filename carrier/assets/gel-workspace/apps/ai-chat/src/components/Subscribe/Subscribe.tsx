import { Form } from 'antd'
import { t } from 'gel-util/intl'
import SubscribeList from './components/List'
import styles from './index.module.less'
import { Alert, Button, Divider, Input, Result, Skeleton, message } from '@wind/wind-ui'
import React, { useState, useEffect } from 'react'
import { EditO, LoadingO, RightO } from '@wind/icons'
import { createWFCSuperlistRequestFcs } from '@/api'
import { useRequest } from 'ahooks'
import { GetSubscriptionListResponse } from 'gel-api'
import { postPointBuried } from '@/utils/common/bury'

/**
 * 订阅组件的属性接口
 */
interface SubscribeProps {
  /** 取消按钮回调 */
  onCancel?: () => void
  /** 提交成功回调 */
  onSubmit?: () => void
  /** 取消订阅回调 */
  onDismiss?: () => void
  /** 跳转到订阅设置的回调 */
  onGoToSetting?: () => void
  /** 是否显示底部操作区 */
  showFooter?: boolean
  /** 预览模式 - 不可操作，只展示数据 */
  preview?: boolean
  /** 表格ID */
  tableId: string
}

/**
 * 订阅表单的数据结构
 */
interface SubscribeFormValues {
  /** 推送邮箱地址 */
  email: string
}

/** 组件样式前缀 */
const PREFIX = 'subscribe'

/** 国际化文本常量 */
const STRINGS = {
  EMAIL: t('464140', '推送邮箱'),
  TOTAL: (total: number) => t('464104', '共{{total}}个筛选条件组', { total }),
  EMAIL_REQUIRED: t('464204', '请输入正确的邮箱'),
  SUBMIT: t('257732', '开启订阅'),
  CANCEL: t('19405', '取消'),
  CLOSE_MODAL: t('464105', '关闭弹窗'),
  UPDATE: t('272472', '更新'),
  SETTING: t('464198', '订阅设置'),
  INFO: t('464196', '订阅后，我们将根据当前表格存在的筛选条件组，定期推送最新符合条件的企业给您'),
  INFO_PREVIEW: (total: number) => t('464109', '基于您的订阅设置，发现符合条件的企业新增{{total}}行', { total }),
  INFO_NO_DATA: t('464110', '基于您的订阅设置，未发现符合条件的新增企业'),
  DISSMISS: t('229017', '取消订阅'),
  TABLE_NAME: t('464197', '订阅表格名称：'),
  SUCCESS_SUBSCRIBE: t('261905', '订阅成功'),
  ERROR_SUBSCRIBE: t('464214', '订阅失败'),
  SUCCESS_UPDATE_EMAIL: t('464136', '已更新邮箱'),
  ERROR_UPDATE_EMAIL: t('428223', '更新邮箱失败'),
  SUCCESS_CANCEL_SUBSCRIBE: t('229019', '已取消订阅'),
  ERROR_CANCEL_SUBSCRIBE: t('428209', '取消订阅失败'),
  NO_SUBSCRIBE_OPTIONS: t('464152', '暂无可订阅筛选项'),
  NO_SUBSCRIBE_OPTIONS_PREVIEW: t('464174', '未发现新动态')
} as const

/** API 接口定义 */
const API = {
  /** 获取订阅基本详情 */
  getSubscribeInfo: createWFCSuperlistRequestFcs('superlist/excel/getSubSuperListCriterion'),
  /** 开启/关闭订阅 */
  updateSubscribeInfo: createWFCSuperlistRequestFcs('superlist/excel/updateSubSuperListCriterion'),
} as const

/**
 * 订阅管理组件
 *
 * 此组件支持两种模式：
 * 1. 预览模式（preview=true）：展示订阅动态，只读模式
 * 2. 设置模式（preview=false）：完整的订阅管理功能
 *
 * 主要功能包括：
 * - 获取和显示订阅信息
 * - 邮箱地址管理（显示、编辑、验证）
 * - 筛选条件列表展示
 * - 订阅状态切换（开启/关闭）
 * - 数据状态处理（加载、空数据、错误）
 */
const Subscribe: React.FC<SubscribeProps> = ({
  onCancel,
  onSubmit,
  onDismiss,
  onGoToSetting,
  showFooter = true,
  preview,
  tableId,
}) => {
  const [form] = Form.useForm<SubscribeFormValues>()
  const [total, setTotal] = useState<number | null>(null)
  const [list, setList] = useState<GetSubscriptionListResponse['list']>()
  const [subPush, setSubPush] = useState<boolean>(false)
  const [tableName, setTableName] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const [operationType, setOperationType] = useState<'subscribe' | 'updateEmail' | 'cancelSubscribe' | null>(null)

  /**
   * 获取订阅信息
   * 包括邮箱、订阅状态、筛选条件列表等
   */
  const getSubscribeInfo = async () => {
    try {
      const res = await API.getSubscribeInfo({ tableId, dynamic: !!preview })

      if (res.Data) {
        setTotal(res.Data.totalNewCompany || 0)
        const email = res.Data.mail || ''
        setCurrentEmail(email)
        setList(res.Data.list || [])
        setSubPush(res.Data.subPush || false)
        setTableName(res.Data.tableName || '')
        // 如果没有邮箱，默认进入编辑模式
        setIsEditing(!email)
      }
    } catch (error) {
      console.error('获取订阅信息失败:', error)
    }
  }

  /**
   * 更新订阅信息的请求Hook
   * 支持开启/关闭订阅、更新邮箱等操作
   */
  const { run: updateSubscribeInfo, loading: updateSubscribeInfoLoading } = useRequest(API.updateSubscribeInfo, {
    manual: true,
    onSuccess: () => {
      // 根据操作类型显示不同的成功提示
      if (operationType === 'subscribe') {
        message.success(STRINGS.SUCCESS_SUBSCRIBE)
        onSubmit?.()
      } else if (operationType === 'cancelSubscribe') {
        message.success(STRINGS.SUCCESS_CANCEL_SUBSCRIBE)
        onDismiss?.()
        onCancel?.()
      } else if (operationType === 'updateEmail') {
        message.success(STRINGS.SUCCESS_UPDATE_EMAIL)
      }

      // 重置操作类型
      setOperationType(null)
    },
    onError: () => {
      if (operationType === 'subscribe') {
        message.error(STRINGS.ERROR_SUBSCRIBE)
      } else if (operationType === 'cancelSubscribe') {
        message.error(STRINGS.ERROR_CANCEL_SUBSCRIBE)
      } else if (operationType === 'updateEmail') {
        message.error(STRINGS.ERROR_UPDATE_EMAIL)
      }
    },
  })

  // ==================== 生命周期 Hook ====================

  /** 组件挂载时获取订阅信息 */
  useEffect(() => {
    getSubscribeInfo()
  }, [])

  /** 监听编辑状态变化，自动设置表单值 */
  useEffect(() => {
    if (isEditing && currentEmail) {
      // 使用 setTimeout 确保 Form.Item 已经渲染完成
      setTimeout(() => {
        form.setFieldValue('email', currentEmail)
      }, 0)
    }
  }, [isEditing, currentEmail, form])

  // ==================== 事件处理函数 ====================

  /**
   * 处理订阅提交
   * 根据当前订阅状态决定是开启还是关闭订阅
   */
  const handleSubmit = () => {
    if (subPush) {
      // 当前已订阅，执行取消订阅操作
      setOperationType('cancelSubscribe')
      updateSubscribeInfo({
        tableId,
        mail: form.getFieldValue('email') || currentEmail,
        subPush: !subPush,
      })
      return
    }

    // 当前未订阅，先验证表单再开启订阅
    form.validateFields().then((values) => {
      postPointBuried('922604570313')
      setOperationType('subscribe')
      updateSubscribeInfo({
        tableId,
        mail: values.email || currentEmail,
        subPush: !subPush,
      })
    })
  }

  /** 处理取消操作 */
  const handleCancel = () => {
    form.resetFields()
    onCancel?.()
  }

  /** 进入邮箱编辑模式 */
  const handleEditEmail = () => {
    postPointBuried('922604570312')
    setIsEditing(true)
  }

  /** 确认更新邮箱 */
  const handleUpdateEmail = () => {
    form.validateFields().then((values) => {
      setCurrentEmail(values.email)
      setIsEditing(false)
      // 更新邮箱信息到服务器
      setOperationType('updateEmail')
      updateSubscribeInfo({
        tableId,
        mail: values.email,
        subPush,
      })
    })
  }

  /** 取消邮箱编辑 */
  const handleCancelEdit = () => {
    setIsEditing(false)
    form.setFieldsValue({ email: currentEmail })
  }

  /** 处理取消订阅操作 */
  const handleDismiss = () => {
    setOperationType('cancelSubscribe')
    updateSubscribeInfo({
      tableId,
      mail: currentEmail,
      subPush: false,
    })
  }

  // ==================== 渲染函数 ====================

  /**
   * 渲染预览模式头部
   * 显示订阅动态信息和跳转设置按钮
   */
  const renderPreviewHeader = () => (
    <Alert
      message={
        <div className={styles[`${PREFIX}-header-content`]}>
          {!total && total !== 0 ? (
            // @ts-expect-error wind-ui 类型错误
            <LoadingO />
          ) : total === 0 ? (
            STRINGS.INFO_NO_DATA
          ) : (
            STRINGS.INFO_PREVIEW(total)
          )}

          <Button type="link" onClick={() => onGoToSetting?.()}>
            {/* @ts-expect-error wind-ui 类型错误 */}
            {STRINGS.SETTING} <RightO style={{ fontSize: 14 }} />
          </Button>
        </div>
      }
      type="info"
      showIcon
    />
  )

  /**
   * 渲染邮箱显示/编辑区域
   */
  const renderEmailSection = () => (
    <div className={styles[`${PREFIX}-email-section`]}>
      <Form form={form} className={styles[`${PREFIX}-email-form`]}>
        {!isEditing && currentEmail ? (
          <div className={styles[`${PREFIX}-email-display`]}>
            <label>{STRINGS.EMAIL}：</label>
            <span>{currentEmail}</span>
            {/* @ts-expect-error wind-ui 类型错误 */}
            <EditO onClick={handleEditEmail} style={{ marginLeft: 8 }} />
          </div>
        ) : (
          <Form.Item
            name="email"
            label={STRINGS.EMAIL}
            rules={[{ type: 'email', message: STRINGS.EMAIL_REQUIRED, required: true }]}
          >
            <Input style={{ width: 240 }} />
          </Form.Item>
        )}
      </Form>
      {isEditing && currentEmail && (
        <div className={styles[`${PREFIX}-email-actions`]}>
          <Button onClick={handleUpdateEmail} type="primary">
            {STRINGS.UPDATE}
          </Button>
          <Button onClick={handleCancelEdit}>{STRINGS.CANCEL}</Button>
        </div>
      )}
    </div>
  )

  /**
   * 渲染设置模式头部
   * 显示订阅说明、表格信息和邮箱设置
   */
  const renderSettingHeader = () => (
    <>
      <Alert message={<div className={styles[`${PREFIX}-header-content`]}>{STRINGS.INFO}</div>} type="info" showIcon />

      <div className={styles[`${PREFIX}-table-info`]}>
        <h4>
          <label htmlFor="">{STRINGS.TABLE_NAME}</label>
          {tableName}
        </h4>
      </div>
      {renderEmailSection()}
    </>
  )

  /**
   * 渲染头部内容
   * 根据是否为预览模式选择不同的渲染方式
   */
  const renderHeader = () => {
    return preview ? renderPreviewHeader() : renderSettingHeader()
  }

  /**
   * 渲染筛选条件内容区域
   * 根据数据状态显示不同内容：加载中、无数据、有数据
   */
  const renderContent = () => {
    // 数据加载中
    if (list === undefined) {
      return <Skeleton animation />
    }

    // 有数据时显示列表
    if (list.length > 0) {
      return (
        <div className={styles[`${PREFIX}-content`]}>
          <div className={styles[`${PREFIX}-content-header`]}>{STRINGS.TOTAL(list.length)}</div>
          <div className={styles[`${PREFIX}-content-list`]}>
            <SubscribeList list={list} preview={preview} />
          </div>
        </div>
      )
    }

    // 无数据时显示空状态
    return (
      <div className={styles[`${PREFIX}-no-data`]}>
        <div className={styles[`${PREFIX}-no-data-content`]}>
          <Result
            status="no-data"
            title={preview ? STRINGS.NO_SUBSCRIBE_OPTIONS_PREVIEW : STRINGS.NO_SUBSCRIBE_OPTIONS}
          />
        </div>
      </div>
    )
  }

  /**
   * 渲染底部操作区域
   * 根据订阅状态显示不同的操作按钮
   */
  const renderFooter = () => {
    if (!showFooter || preview) {
      return null
    }

    return (
      <div className={styles[`${PREFIX}-footer`]}>
        <div className={styles[`${PREFIX}-footer-actions`]}>
          <Button onClick={handleCancel}>{STRINGS.CLOSE_MODAL}</Button>
          {!subPush ? (
            <Button type="primary" onClick={handleSubmit} loading={updateSubscribeInfoLoading}>
              {STRINGS.SUBMIT}
            </Button>
          ) : (
            <Button type="primary" onClick={handleDismiss} loading={updateSubscribeInfoLoading}>
              {STRINGS.DISSMISS}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ==================== 主渲染 ====================

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {/* 头部信息区域 */}
      <div className={styles[`${PREFIX}-header`]}>{renderHeader()}</div>

      <Divider />

      {/* 主要内容区域 */}
      {renderContent()}

      {/* 底部操作区域 */}
      {renderFooter()}
    </div>
  )
}

/**
 * 订阅组件
 *
 * 功能特性：
 * - 支持预览模式和设置模式
 * - 动态显示订阅状态和筛选条件
 * - 邮箱编辑和验证
 * - 订阅开启/关闭操作
 * - 响应式设计和错误处理
 *
 * @example
 * ```tsx
 * // 预览模式 - 显示订阅动态
 * <Subscribe
 *   tableId="123"
 *   preview={true}
 *   onGoToSetting={() => // console.log('跳转设置')}
 * />
 *
 * // 设置模式 - 订阅管理
 * <Subscribe
 *   tableId="123"
 *   preview={false}
 *   onSubmit={() => // console.log('订阅成功')}
 *   onCancel={() => // console.log('取消操作')}
 * />
 * ```
 */
export default Subscribe
export type { SubscribeProps, SubscribeFormValues }
