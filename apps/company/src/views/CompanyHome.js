import { Spin } from '@wind/wind-ui'
import { useEffect } from 'react'
import { TreeModuleName, useGroupStore } from '../store/group'
import GroupContentNew from './Group/components/ContentNew'

export default () => {
  const { treeModeInit, basicInfo } = useGroupStore()

  useEffect(() => {
    treeModeInit(TreeModuleName.Company)
  }, [])

  const spinning = !(basicInfo?.typeCode || basicInfo?.corp_name)

  return (
    <Spin spinning={spinning} style={{ position: 'absolute', inset: 0, maxHeight: '100vh', width: '100%' }}>
      <GroupContentNew />
    </Spin>
  )
}
