// @ts-nocheck
import { createSuperlistRequest } from '@/api/handle'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Empty, Form, Input, Switch, Typography, message } from 'antd'
import { ApiCodeForWfc, SuperListCdeMonitor } from 'gel-api'
import { FC, useMemo, useState } from 'react'
import styles from './index.module.less'
const { Text, Paragraph } = Typography

const MonitorSetting: React.FC<{
  monitor: SuperListCdeMonitor
  getCDESubscribeText: (monitor: SuperListCdeMonitor) => string
  onRefresh?: () => void
}> = ({ monitor, getCDESubscribeText, onRefresh }) => {
  const { run: updateMonitorDetail } = useRequest(createSuperlistRequest('cde/updateMonitorDetail'), {
    onError: (e) => {
      console.error(e)
      message.error('更新失败')
    },
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('更新成功')
        onRefresh?.()
      } else {
        message.error('更新失败')
      }
    },
    manual: true,
  })
  const queryText = useMemo(() => {
    return getCDESubscribeText(monitor)
  }, [monitor.superQueryLogic])
  return (
    <div className={styles.monitorSetting}>
      <div className={styles.monitorSettingBody}>
        <div className={styles.monitorSettingHeader}>
          <Text ellipsis={{ tooltip: monitor.subName }}>{monitor.subName}</Text>

          {/* 一个开关，用来控制是否推送 */}
          <Switch
            value={monitor.subPush}
            onChange={(value) => {
              updateMonitorDetail({
                subPush: value,
                ...monitor,
              })
            }}
          />
        </div>
      </div>
      <div className={styles.monitorSettingFooter}>
        <Paragraph ellipsis={{ rows: 2, tooltip: queryText }}>{queryText}</Paragraph>
      </div>
    </div>
  )
}

export const MonitorGroupSettingContent: FC<{
  list?: SuperListCdeMonitor[]
  subMail?: string
  getCDESubscribeText?: (monitor: SuperListCdeMonitor) => string
  onRefresh?: () => void
}> = ({ list, subMail, getCDESubscribeText, onRefresh }) => {
  const [subMailEdit, setSubMailEdit] = useState<string>(subMail)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { run: updateSubMail } = useRequest(createSuperlistRequest('cde/updatePushEmail'), {
    onError: (e) => {
      console.error(e)
      message.error('更新失败')
    },
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('更新成功')
        onRefresh?.()
      } else {
        message.error('更新失败')
      }
    },
    manual: true,
  })

  const { run: updateMonitorAll } = useRequest(createSuperlistRequest('cde/updateMonitorAll'), {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
        message.success('更新成功')
        onRefresh?.()
      } else {
        message.error('更新失败')
      }
    },
    onError: (e) => {
      console.error(e)
      message.error('更新失败')
    },
    manual: true,
  })
  const ifAllOpen = list?.every((monitor) => monitor.subPush)
  return (
    <div>
      <div className={styles.monitorGroupSettingHeader}>
        <Form layout="horizontal" className={styles.emailForm}>
          {isEditing ? (
            <div className={styles.emailEditMode}>
              <Input placeholder="请输入邮箱" value={subMailEdit} onChange={(e) => setSubMailEdit(e.target.value)} />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => {
                  // Save logic will be implemented by the user
                  setIsEditing(false)
                  updateSubMail({
                    email: subMailEdit,
                  })
                }}
              />
            </div>
          ) : (
            <div className={styles.emailDisplayMode}>
              <Text>{subMail}</Text>
              <Button type="text" icon={<EditOutlined />} onClick={() => setIsEditing(true)} />
            </div>
          )}
        </Form>
      </div>
      {list && list.length > 0 ? (
        <div className={styles.monitorGroupSettingContent}>
          <div className={styles.monitorGroupSettingContentHeader}>
            <span>{`共${list.length}个筛选组，已开启${list.filter((monitor) => monitor.subPush).length}个监控`}</span>
            <Button
              disabled={ifAllOpen}
              onClick={() => {
                updateMonitorAll({
                  // TODO 需要获取当前 tableId
                  tableId: '',
                  subPush: !ifAllOpen,
                })
              }}
            >
              {ifAllOpen ? '全部关闭' : '全部开启'}
            </Button>
          </div>
          <div className={styles.monitorGroupSettingMonitorList}>
            {list.map((monitor) => (
              <MonitorSetting key={monitor.id} monitor={monitor} getCDESubscribeText={getCDESubscribeText} />
            ))}
          </div>
        </div>
      ) : (
        <Empty description="暂无监控数据" />
      )}
    </div>
  )
}
