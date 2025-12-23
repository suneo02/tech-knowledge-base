import { SaveO } from '@wind/icons'
import { Button, Card, Divider, Input, Radio } from '@wind/wind-ui'
import React from 'react'
import { DEV_ENV_CONFIG } from '../config'

interface DevModeConfigPanelProps {
  apiPrefixDev: string | undefined
  sessionIdDev: string | undefined
  onApiPrefixChange: (value: string) => void
  onSessionIdChange: (value: string) => void
  onSave: () => void
}

export const DevModeConfigPanel: React.FC<DevModeConfigPanelProps> = ({
  apiPrefixDev,
  sessionIdDev,
  onApiPrefixChange,
  onSessionIdChange,
  onSave,
}) => {
  return (
    <Card size="small" title="开发模式配置">
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>API Prefix 配置</div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '4px', fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>预设 API Prefix</div>
          <Radio.Group
            value={apiPrefixDev}
            onChange={(e) => {
              onApiPrefixChange(e.target.value)
            }}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DEV_ENV_CONFIG.map((option) => (
                <Radio key={option.proxy} value={option.proxy}>
                  {option.name} {option.host}
                </Radio>
              ))}
            </div>
          </Radio.Group>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>WSID 配置</div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ marginBottom: '4px', fontSize: '12px', color: 'rgba(0,0,0,0.65)' }}>自定义 WSID</div>
          <Input
            value={sessionIdDev}
            onChange={(e) => onSessionIdChange(e.target.value)}
            placeholder="输入自定义的 WSID"
            style={{ width: '100%' }}
          />
        </div>

        <Button
          type="primary"
          icon={<SaveO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          onClick={onSave}
          style={{ width: '100%', marginTop: '12px' }}
        >
          保存开发模式配置
        </Button>
      </div>
    </Card>
  )
}
