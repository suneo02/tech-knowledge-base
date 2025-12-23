import React from 'react'
import { useSuperListCdeMonitor } from '../ctx'
import { MonitorGroupSettingContent } from './content'

export const MonitorGroupSetting: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const { monitorList, subMail } = useSuperListCdeMonitor()

  return <MonitorGroupSettingContent list={monitorList} subMail={subMail} onRefresh={onRefresh} />
}
