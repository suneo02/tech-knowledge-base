import { SaveO } from '@wind/icons'
import { Button, Card, Divider, message, Radio } from '@wind/wind-ui'
import React, { useState } from 'react'
import { loaclDevManager } from '../utils/storage'

interface PermissionSwitchPanelProps {
  onSave?: () => void
}

export const PermissionSwitchPanel: React.FC<PermissionSwitchPanelProps> = ({ onSave }) => {
  const [permission, setPermission] = useState<string>(loaclDevManager.get('GEL_DEV_PERMISSION') ?? 'clear')
  const [overseas, setOverseas] = useState<string>(loaclDevManager.get('GEL_DEV_OVERSEAS') ?? 'clear')

  const handleChange = (value: string) => {
    setPermission(value)
  }

  const handleSave = () => {
    if (permission === 'clear') {
      loaclDevManager.remove('GEL_DEV_PERMISSION')
      message.success('已清除权限覆盖，恢复后端权限，页面将在1秒后刷新...')
    } else {
      loaclDevManager.set('GEL_DEV_PERMISSION', permission)
      message.success('权限覆盖已保存，页面将在1秒后刷新...')
    }

    if (overseas === 'clear') {
      loaclDevManager.remove('GEL_DEV_OVERSEAS')
    } else {
      loaclDevManager.set('GEL_DEV_OVERSEAS', overseas)
    }
    if (onSave) onSave()
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <Card size="small" title="权限切换">
      <Radio.Group value={permission} onChange={(e) => handleChange(e.target.value)} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Radio value="clear">跟随后端（不覆盖）</Radio>
          <Radio value="svip">SVIP</Radio>
          <Radio value="vip">VIP</Radio>
          <Radio value="none">普通</Radio>
        </div>
      </Radio.Group>

      <Divider style={{ margin: '12px 0' }} />
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>海外标识</div>
      <Radio.Group value={overseas} onChange={(e) => setOverseas(e.target.value)} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Radio value="clear">跟随后端（不覆盖）</Radio>
          <Radio value="overseas">海外用户</Radio>
          <Radio value="domestic">国内用户</Radio>
        </div>
      </Radio.Group>
      <Divider style={{ margin: '12px 0' }} />
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
        此权限仅影响前端展示效果，不影响后端数据权限与接口校验。
      </div>
      <Button
        type="primary"
        icon={<SaveO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onClick={handleSave}
        style={{ width: '100%', marginTop: '12px' }}
      >
        保存权限配置
      </Button>
    </Card>
  )
}
