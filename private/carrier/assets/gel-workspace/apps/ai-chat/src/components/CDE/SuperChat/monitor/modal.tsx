import { createSuperlistRequest } from '@/api/handle'
import { useRequest } from 'ahooks'
import { Modal, Tabs } from 'antd'
import { ApiCodeForWfc, SuperListCdeMonitor } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { FC } from 'react'
import { useFetchCDEConfig } from '../../hooks/CDEConfig'
import { MonitorGroupDynamic } from './MonitorGroupDynamic'
import { MonitorGroupSetting } from './MonitorGroupSetting'
import { SuperListCdeMonitorProvider, useSuperListCdeMonitor } from './ctx'

export const Content: FC<{
  open: boolean
  close: () => void
  getCDEMonitorDesc: (monitor: SuperListCdeMonitor) => string
}> = ({ open, close, getCDEMonitorDesc }) => {
  useFetchCDEConfig(open)
  const { setMonitorList, setTotalCount } = useSuperListCdeMonitor()
  const { run, loading } = useRequest(createSuperlistRequest('cde/getMonitorList'), {
    onSuccess: (data) => {
      if (data && data.ErrorCode === ApiCodeForWfc.SUCCESS && data.Data) {
        setMonitorList(data.Data.list)
        setTotalCount(data.Data.count)
      }
    },
    onError: console.error,
  })

  return (
    <Modal open={open} onCancel={close} width={800} footer={null} loading={loading}>
      <Tabs
        defaultActiveKey="setting"
        items={[
          {
            key: 'dynamic',
            label: '监控更新动态',
            children: <MonitorGroupDynamic onRefresh={run} getCDEMonitorDesc={getCDEMonitorDesc} />,
          },
          // {
          //   key: 'setting',
          //   label: '监控设置',
          //   children: <MonitorGroupSetting onRefresh={run} />,
          // },
        ]}
        onChange={(key) => {
          console.log('key', key)
        }}
      />
    </Modal>
  )
}

export const CDEMonitorModal: FC<{
  open: boolean
  close: () => void
  getCDEMonitorDesc: (monitor: SuperListCdeMonitor) => string
}> = (props) => {
  return (
    <ErrorBoundary>
      <SuperListCdeMonitorProvider>
        <Content {...props} />
      </SuperListCdeMonitorProvider>
    </ErrorBoundary>
  )
}
