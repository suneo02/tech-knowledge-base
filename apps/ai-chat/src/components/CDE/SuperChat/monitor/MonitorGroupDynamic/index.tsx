import { Empty, Typography } from 'antd'
import { SuperListCdeMonitor } from 'gel-api'
import React from 'react'
import { useSuperListCdeMonitor } from '../ctx'
import styles from './index.module.less'

const { Text } = Typography

const MonitorDetail: React.FC<{
  monitor: SuperListCdeMonitor | undefined
  getCDEMonitorDesc: (monitor: SuperListCdeMonitor) => string
}> = ({ monitor, getCDEMonitorDesc }) => {
  if (!monitor) {
    return null
  }

  const queryText = useMemo(() => {
    return getCDEMonitorDesc(monitor)
  }, [monitor.superQueryLogic])

  return (
    <div className={styles.monitorDetail}>
      <div className={styles.monitorDetailBody}>
        <div className={styles.monitorDetailHeader}>
          <Text ellipsis={{ tooltip: monitor.subName }}>{monitor.subName}</Text>
          <Tag color="blue">{monitor.count}</Tag>
        </div>
        <div>
          <Text
            ellipsis={{
              tooltip: queryText,
            }}
          >
            {queryText}
          </Text>
        </div>
      </div>
      {/* TODO 筛选项信息 */}
      <div className={styles.monitorDetailFooter}>
        <div className={styles.monitorDetailUpdateTextWrapper}>
          <Text className={styles.monitorDetailUpdateText}>
            最后更新:{new Date(monitor.lastUpdateTime).toLocaleString()}
          </Text>
        </div>
        <Button className={styles.monitorDetailButton}>查看详情</Button>
      </div>
    </div>
  )
}

export const MonitorGroupDynamic: React.FC<{
  onRefresh: () => void
  getCDEMonitorDesc: (monitor: SuperListCdeMonitor) => string
}> = ({ getCDEMonitorDesc }) => {
  const { monitorList, totalCount } = useSuperListCdeMonitor()

  return (
    <div className={styles.monitorGroupDynamic}>
      <p className={styles.monitorGroupDynamicTitle}>
        {monitorList && monitorList.length > 0 && <Text>{`变化情况：所有筛选组新增企业${totalCount}家`}</Text>}
      </p>
      {monitorList && monitorList.length > 0 ? (
        <div className={styles.monitorGroupDynamicMonitorList}>
          {monitorList.map((monitor) => (
            <MonitorDetail key={monitor.id} monitor={monitor} getCDEMonitorDesc={getCDEMonitorDesc} />
          ))}
        </div>
      ) : (
        <Empty description="暂无监控数据" />
      )}
    </div>
  )
}
