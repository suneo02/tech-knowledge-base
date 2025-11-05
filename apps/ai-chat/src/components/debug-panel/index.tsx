import { envConfig, EnvConfigItemProps, EnvType, getApiBaseUrl, getProxyPrefix, NEW_WORKFLOW } from '@/config/env'
import { local } from '@/utils/storage'
import { BugOutlined, InfoCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Collapse, Divider, Drawer, Input, message, Select, Space, Switch, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { LanguageSwitcher } from '../LanguageSwitcher'
import './index.less'

interface UserRole {
  key: string
  name: string
  color: string
}

// API信息接口
interface ApiInfo {
  baseUrl: string
  proxyPrefix: string
  sessionId?: string
}

const USER_ROLES: UserRole[] = [
  { key: 'admin', name: '管理员', color: 'red' },
  { key: 'vip', name: 'VIP用户', color: 'gold' },
  { key: 'user', name: '普通用户', color: 'blue' },
]

const TEST_ACCOUNTS = [
  { label: '测试账号1', value: 'test1', role: 'admin' },
  { label: '测试账号2', value: 'test2', role: 'vip' },
  { label: '测试账号3', value: 'test3', role: 'user' },
]

// 环境对应的颜色
const ENV_COLORS: Record<EnvType, string> = {
  [EnvType.NJ]: 'green',
  [EnvType.PROD]: 'green',
  [EnvType.TEST]: 'orange',
  [EnvType.EXP]: 'blue',
  [EnvType.SH]: 'purple',
  [EnvType.DEV]: 'cyan',
  [EnvType.DEV2]: 'magenta',
  [EnvType.GKY]: 'volcano',
  [EnvType.LOCAL_PROXY_PROD]: 'red',
  [EnvType.LOCAL_PROXY_DEV]: 'red',
}

// 环境分类
const MAIN_ENVS = [EnvType.PROD, EnvType.TEST, EnvType.EXP, EnvType.SH, EnvType.NJ, EnvType.LOCAL_PROXY_PROD]
const DEV_ENVS = [EnvType.DEV, EnvType.DEV2, EnvType.GKY, EnvType.LOCAL_PROXY_DEV]

// 环境配置类型
interface EnvSetting {
  mainEnv: EnvType | null
  devEnv: EnvType | null
  sessionIds: Record<EnvType, string>
}

export const DebugPanel: React.FC<{
  style?: React.CSSProperties
}> = ({ style }) => {
  const [open, setOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string>()
  const [enabledRoles, setEnabledRoles] = useState<Set<string>>(new Set(['user']))
  const [apiInfo, setApiInfo] = useState<ApiInfo[]>([])
  const [tableId, setTableId] = useState<string>((local.get('tableId') as string) || '')

  // 环境配置
  const [envSettings, setEnvSettings] = useState<EnvSetting>({
    mainEnv: null,
    devEnv: null,
    sessionIds: {} as Record<EnvType, string>,
  })

  // 初始化每个环境类型的默认sessionId
  const initSessionIds = (): Record<EnvType, string> => {
    const result: Record<EnvType, string> = {} as Record<EnvType, string>

    // 从localStorage获取保存的sessionId映射
    const savedSessionIds = (local.get('sessionIds') as Record<EnvType, string>) || {}

    // 初始化每个环境的sessionId，优先使用保存的值，否则使用默认值
    envConfig.forEach((env) => {
      result[env.type] = savedSessionIds[env.type] || env.sessionId
    })

    return result
  }

  // 输出API调用信息
  const logApiInfo = (env?: EnvConfigItemProps) => {
    const baseUrl = env?.host || getApiBaseUrl()
    const proxyPrefix = env?.proxy || getProxyPrefix()
    const fullApiUrl = `${baseUrl}${proxyPrefix}`
    const sessionId = env?.sessionId || ''

    console.log('=== 当前API调用信息 ===')
    console.log('基础URL:', baseUrl)
    console.log('代理前缀:', proxyPrefix)
    console.log('完整API地址:', fullApiUrl)
    console.log('会话ID:', sessionId)
    console.log('=====================')

    // 获取主环境和开发环境的信息
    const mainEnvInfo = envSettings.mainEnv ? envConfig.find((e) => e.type === envSettings.mainEnv) : null

    const devEnvInfo = envSettings.devEnv ? envConfig.find((e) => e.type === envSettings.devEnv) : null

    const apiInfoArray: ApiInfo[] = []

    // 添加主环境信息
    if (mainEnvInfo) {
      apiInfoArray.push({
        baseUrl: mainEnvInfo.host,
        proxyPrefix: mainEnvInfo.proxy,
        sessionId: envSettings.sessionIds[mainEnvInfo.type] || mainEnvInfo.sessionId,
      })
    }

    // 添加开发环境信息
    if (devEnvInfo) {
      apiInfoArray.push({
        baseUrl: devEnvInfo.host,
        proxyPrefix: devEnvInfo.proxy,
        sessionId: envSettings.sessionIds[devEnvInfo.type] || devEnvInfo.sessionId,
      })
    }

    // 如果没有任何环境信息，则使用当前环境
    if (apiInfoArray.length === 0 && env) {
      apiInfoArray.push({
        baseUrl,
        proxyPrefix,
        sessionId,
      })
    } else if (apiInfoArray.length === 0) {
      apiInfoArray.push({
        baseUrl: getApiBaseUrl(),
        proxyPrefix: getProxyPrefix(),
        sessionId: '',
      })
    }

    setApiInfo(apiInfoArray)

    return { baseUrl, proxyPrefix, fullApiUrl }
  }

  // 初始化环境和会话ID
  useEffect(() => {
    // 初始化所有环境的sessionId
    const sessionIds = initSessionIds()

    // 从localStorage获取当前选中的环境
    const savedMainEnv = local.get('mainEnv') as EnvConfigItemProps | null

    const newSettings: EnvSetting = {
      mainEnv: savedMainEnv?.type || envConfig[0].type,
      devEnv: null,
      sessionIds,
    }

    if (!savedMainEnv) {
      saveEnvConfig(newSettings)
    }
    setEnvSettings(newSettings)
    // 输出当前环境的API信息
    const currentEnv = local.get('mainEnv') as EnvConfigItemProps | null
    if (currentEnv) {
      logApiInfo(currentEnv)
    } else {
      // 如果没有保存的环境，也输出默认的API信息
      logApiInfo()
    }
  }, [])

  const handleRoleToggle = (role: string, checked: boolean) => {
    const newRoles = new Set(enabledRoles)
    if (checked) {
      newRoles.add(role)
    } else {
      newRoles.delete(role)
    }
    setEnabledRoles(newRoles)
    // TODO: 调用权限更新接口
  }

  const handleAccountChange = (value: string) => {
    setSelectedAccount(value)
    // TODO: 调用账号切换接口
  }

  // 处理主环境选择
  const handleMainEnvSelect = (envType: EnvType, checked: boolean) => {
    if (checked) {
      setEnvSettings((prev) => ({
        ...prev,
        mainEnv: envType,
      }))
    } else if (envSettings.mainEnv === envType) {
      setEnvSettings((prev) => ({
        ...prev,
        mainEnv: null,
      }))
    }
  }

  // 处理开发环境选择
  const handleDevEnvSelect = (envType: EnvType, checked: boolean) => {
    if (checked) {
      setEnvSettings((prev) => ({
        ...prev,
        devEnv: envType,
      }))
    } else if (envSettings.devEnv === envType) {
      setEnvSettings((prev) => ({
        ...prev,
        devEnv: null,
      }))
    }
  }

  // 处理SessionId变更
  const handleSessionIdChange = (envType: EnvType, value: string) => {
    setEnvSettings((prev) => ({
      ...prev,
      sessionIds: {
        ...prev.sessionIds,
        [envType]: value,
      },
    }))
  }

  // 保存环境配置
  const saveEnvConfig = (newSettings?: EnvSetting) => {
    const { mainEnv, devEnv, sessionIds } = newSettings || envSettings

    console.log('🚀 ~ saveEnvConfig ~ newSettings:', envSettings)

    if (!mainEnv && !devEnv) {
      message.warning('请至少选择一个环境')
      return
    }

    // 保存所有环境的sessionId
    local.set('sessionIds', sessionIds)

    // 保存主环境配置
    if (mainEnv) {
      const mainEnvConfig = envConfig.find((env) => env.type === mainEnv)
      if (mainEnvConfig) {
        const customMainEnv: EnvConfigItemProps = {
          ...mainEnvConfig,
          sessionId: sessionIds[mainEnv] || mainEnvConfig.sessionId,
        }
        local.set('mainEnv', customMainEnv)
      }
    } else {
      local.remove('mainEnv')
    }

    // 保存开发环境配置
    if (devEnv) {
      const devEnvConfig = envConfig.find((env) => env.type === devEnv)
      if (devEnvConfig) {
        const customDevEnv: EnvConfigItemProps = {
          ...devEnvConfig,
          sessionId: sessionIds[devEnv] || devEnvConfig.sessionId,
        }
        local.set('devEnv', customDevEnv)
      }
    } else {
      local.remove('devEnv')
    }

    // 默认使用开发环境作为当前环境，如果没有开发环境则使用主环境
    const currentEnv = devEnv
      ? envConfig.find((env) => env.type === devEnv)
      : mainEnv
        ? envConfig.find((env) => env.type === mainEnv)
        : null

    if (currentEnv) {
      const customCurrentEnv: EnvConfigItemProps = {
        ...currentEnv,
        sessionId: sessionIds[currentEnv.type] || currentEnv.sessionId,
      }

      // 保存到localStorage
      local.set('env', customCurrentEnv)

      // 输出API调用信息
      logApiInfo(customCurrentEnv)

      message.success(`环境配置已保存，页面将在1秒后刷新...`)

      // // 延迟1秒后刷新页面，让用户看到提示信息
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      message.error('未能找到有效的环境配置')
    }
  }

  // 渲染环境配置面板
  const renderEnvConfigPanel = (
    envTypes: EnvType[],
    selectedEnv: EnvType | null,
    onEnvSelect: (envType: EnvType, checked: boolean) => void
  ) => (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 环境选择列表 */}
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>选择环境</div>
      {envConfig
        .filter((env) => envTypes.includes(env.type))
        .map((env) => (
          <div key={env.type} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Checkbox checked={selectedEnv === env.type} onChange={(e) => onEnvSelect(env.type, e.target.checked)} />
              <Tag color={ENV_COLORS[env.type]} style={{ margin: '0 8px' }}>
                {env.name}
              </Tag>
              <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>{env.host}</span>
            </div>
            <div style={{ marginLeft: '24px' }}>
              <Input
                placeholder="会话ID (SessionID)"
                value={envSettings.sessionIds[env.type] || ''}
                onChange={(e) => handleSessionIdChange(env.type, e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        ))}
    </Space>
  )

  return (
    <>
      <Button icon={<BugOutlined />} onClick={() => setOpen(true)} className="debug-panel-trigger" style={style} />
      <Drawer title="调试面板" placement="right" onClose={() => setOpen(false)} open={open} width={320}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <LanguageSwitcher />
          <Space>
            <label htmlFor="">tableId:</label>
            <Input
              value={tableId}
              onChange={(ev) => {
                setTableId(ev.target.value)
                local.set('tableId', ev.target.value)
              }}
            ></Input>
          </Space>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tag color="blue">是否异步流程</Tag>
            <Switch
              checked={NEW_WORKFLOW}
              onChange={(checked) => {
                local.set('newWorkflow', checked)
                window.location.reload()
              }}
            />
          </div>

          {/* 环境切换 */}
          <Collapse defaultActiveKey={['1', '2']}>
            <Collapse.Panel header="主环境配置" key="1">
              <Card size="small" title="主环境配置（主站、测试站等）">
                {renderEnvConfigPanel(MAIN_ENVS, envSettings.mainEnv, handleMainEnvSelect)}
              </Card>
            </Collapse.Panel>
            <Collapse.Panel header="本地调试环境配置" key="2">
              <Card size="small" title="本地调试环境配置">
                {renderEnvConfigPanel(DEV_ENVS, envSettings.devEnv, handleDevEnvSelect)}
              </Card>
            </Collapse.Panel>
          </Collapse>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => {
              saveEnvConfig()
            }}
            style={{ width: '100%', marginTop: '12px' }}
          >
            保存环境配置
          </Button>

          {/* API信息显示 */}
          {apiInfo.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'rgba(0,0,0,0.65)',
                border: '1px dashed #d9d9d9',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <InfoCircleOutlined style={{ marginRight: '4px' }} />
                <span>当前API信息：</span>
              </div>
              <div style={{ marginLeft: '16px' }}>
                {apiInfo.map((info, index) => {
                  // 确定当前环境类型的名称
                  let envName = index === 0 ? '主环境' : '本地调试环境'

                  // 从配置中查找对应URL的环境，以获取更精确的名称
                  const matchedEnv = envConfig.find(
                    (env) => env.host === info.baseUrl && env.proxy === info.proxyPrefix
                  )

                  if (matchedEnv) {
                    envName = `${envName} (${matchedEnv.name})`
                  }

                  return (
                    <div key={index} style={{ marginBottom: index < apiInfo.length - 1 ? '8px' : '0' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{envName}:</div>
                      <div>基础URL: {info.baseUrl}</div>
                      <div>代理前缀: {info.proxyPrefix}</div>
                      <div>完整地址: {`${info.baseUrl}${info.proxyPrefix}`}</div>
                      {info.sessionId && <div>会话ID: {info.sessionId}</div>}
                      {index < apiInfo.length - 1 && <Divider style={{ margin: '4px 0' }} />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Divider style={{ margin: '12px 0' }} />

          {/* 权限切换 */}
          <Card size="small" title="权限切换">
            <Space direction="vertical" style={{ width: '100%' }}>
              {USER_ROLES.map((role) => (
                <div key={role.key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Tag color={role.color}>{role.name}</Tag>
                  <Switch
                    checked={enabledRoles.has(role.key)}
                    onChange={(checked) => handleRoleToggle(role.key, checked)}
                  />
                </div>
              ))}
            </Space>
          </Card>

          <Divider style={{ margin: '12px 0' }} />

          {/* 账号切换 */}
          <Card size="small" title="账号切换">
            <Select
              value={selectedAccount}
              onChange={handleAccountChange}
              options={TEST_ACCOUNTS}
              style={{ width: '100%' }}
              placeholder="选择测试账号"
            />
          </Card>
        </Space>
      </Drawer>
    </>
  )
}

export default DebugPanel
