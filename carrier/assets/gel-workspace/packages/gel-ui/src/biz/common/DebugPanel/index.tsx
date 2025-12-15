import { SettingO } from '@wind/icons'
import { Button, Divider } from '@wind/wind-ui'
import React, { useState } from 'react'
import { DevModeConfigPanel } from './components/DevModeConfigPanel'
import { useEnvConfig } from './hooks/useEnvConfig'
export { loaclDevManager } from './utils/storage'
import './index.less'

export const DebugPanel: React.FC<{
  style?: React.CSSProperties
}> = ({ style }) => {
  const [open, setOpen] = useState(false)

  // 使用自定义 hooks
  const { apiPrefixDev, sessionIdDev, setApiPrefixDev, setSessionIdDev, handleSaveDevConfig } = useEnvConfig()

  return (
    <>
      <Button
        icon={<SettingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onClick={() => setOpen(true)}
        className="debug-panel-trigger"
        style={style}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: open ? '320px' : '0',
          height: '100vh',
          backgroundColor: '#fff',
          borderLeft: '1px solid #d9d9d9',
          transition: 'width 0.3s',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        {open && (
          <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
            >
              <h3 style={{ margin: 0 }}>调试面板</h3>
              <Button type="text" onClick={() => setOpen(false)}>
                ✕
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DevModeConfigPanel
                apiPrefixDev={apiPrefixDev}
                sessionIdDev={sessionIdDev}
                onApiPrefixChange={setApiPrefixDev}
                onSessionIdChange={setSessionIdDev}
                onSave={handleSaveDevConfig}
              />

              <Divider style={{ margin: '12px 0' }} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DebugPanel
