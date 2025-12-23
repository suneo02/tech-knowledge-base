import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { Alert, Button, Select, InputNumber, Space, Card, Row, Col, Tabs, Badge, Divider } from 'antd'
import { useEffect, useState } from 'react'
import styles from './DebugPanel.module.less'
import DataOperationPanel from './DataOperationPanel'

const { Option } = Select
const { TabPane } = Tabs

const DebugPanel = () => {
  const {
    activeSheetId,
    setActiveSheetId,
    scrollToCell,
    refreshTab,
    isTabLoaded,
    cancelAllRequests,
    sheetInfos,
    sheetRefs,
  } = useSuperChatRoomContext()
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [scrollWhenActivated, setScrollWhenActivated] = useState<{
    tabKey: string
    position: 'top' | 'bottom' | number
  } | null>(null)

  // 自定义控制状态
  const [selectedTab, setSelectedTab] = useState<string>('')
  const [scrollDirection, setScrollDirection] = useState<'horizontal' | 'vertical'>('vertical')
  const [scrollPosition, setScrollPosition] = useState<'start' | 'end' | 'custom'>('end')
  const [customRow, setCustomRow] = useState<number>(0)
  const [customCol, setCustomCol] = useState<number>(0)

  // Get current table instance
  const currentTableInstance = selectedTab ? sheetRefs[selectedTab] : null

  // 初始化选中的tab
  useEffect(() => {
    if (sheetInfos && sheetInfos.length > 0 && !selectedTab) {
      setSelectedTab(sheetInfos[0]?.sheetId?.toString() || '')
    }
  }, [sheetInfos, selectedTab])

  useEffect(() => {
    if (scrollWhenActivated && scrollWhenActivated.tabKey === activeSheetId) {
      scrollToCell(scrollWhenActivated.tabKey, { row: 9999, col: 0 })
      setScrollWhenActivated(null)
    }
  }, [activeSheetId, scrollWhenActivated, scrollToCell])

  const handleAction = (message: string, action: () => boolean) => {
    const result = action()
    const finalMessage = result ? message : `${message} (但 Tab 未加载，操作被忽略)`
    setActionStatus(finalMessage)
    setTimeout(() => setActionStatus(null), 3000)
  }

  const handleCancelAction = (message: string, action: () => void) => {
    action()
    setActionStatus(message)
    setTimeout(() => setActionStatus(null), 3000)
  }

  const handleSwitchAndScroll = (tabKey: string, position: 'bottom' | 'top' | number = 'bottom') => {
    setScrollWhenActivated({ tabKey, position })
    setActiveSheetId(tabKey)
    setActionStatus(`已请求切换到 Tab ${tabKey} 并滚动`)
    setTimeout(() => setActionStatus(null), 3000)
  }

  // 获取tab名称
  const getTabName = (sheetId: string) => {
    const sheet = sheetInfos?.find((sheet) => sheet.sheetId?.toString() === sheetId)
    return sheet?.sheetName || 'Unknown Tab'
  }

  // 自定义滚动处理
  const handleCustomScroll = () => {
    if (!selectedTab) return

    let row = 0
    let col = 0

    if (scrollDirection === 'vertical') {
      if (scrollPosition === 'start') {
        row = 1
        col = 0
      } else if (scrollPosition === 'end') {
        row = 9999
        col = 0
      } else {
        row = customRow
        col = 0
      }
    } else {
      if (scrollPosition === 'start') {
        row = 0
        col = 2
      } else if (scrollPosition === 'end') {
        row = 0
        col = 9999
      } else {
        row = 0
        col = customCol
      }
    }

    const tabName = getTabName(selectedTab)
    const direction = scrollDirection === 'vertical' ? '垂直' : '水平'
    const position =
      scrollPosition === 'custom' ? `自定义位置 (${row}, ${col})` : scrollPosition === 'start' ? '开始位置' : '结束位置'

    handleAction(`已请求 ${tabName} ${direction}滚动到${position}`, () => scrollToCell(selectedTab, { row, col }))
  }

  // 自定义切换tab
  const handleCustomSwitch = () => {
    if (!selectedTab) return

    const tabName = getTabName(selectedTab)
    setActiveSheetId(selectedTab)
    setActionStatus(`已切换到 ${tabName}`)
    setTimeout(() => setActionStatus(null), 3000)
  }

  // 自定义刷新tab
  const handleCustomRefresh = () => {
    if (!selectedTab) return

    const tabName = getTabName(selectedTab)
    handleAction(`已请求刷新 ${tabName}`, () => refreshTab(selectedTab))
  }

  // 自定义取消请求
  const handleCustomCancel = () => {
    if (!selectedTab) return

    const tabName = getTabName(selectedTab)
    handleCancelAction(`已取消 ${tabName} 的所有请求`, () => cancelAllRequests(selectedTab))
  }

  // 获取加载状态数量
  const getLoadedCount = () => {
    return sheetInfos?.filter((sheet) => isTabLoaded(sheet.sheetId?.toString())).length || 0
  }

  const totalCount = sheetInfos?.length || 0

  return (
    <div className={styles.debugPanel}>
      <div className={styles.header}>
        <h3>🛠️ 调试控制面板</h3>
        <Badge count={`${getLoadedCount()}/${totalCount}`} showZero color="#52c41a" />
      </div>

      <Tabs defaultActiveKey="basic" className={styles.tabs}>
        <TabPane tab="基础操作" key="basic">
          <div className={styles.tabContent}>
            {/* Tab选择器 */}
            <Card title="📋 选择工作表" size="small" className={styles.selectorCard}>
              <Row gutter={16} align="middle">
                <Col span={16}>
                  <Select
                    value={selectedTab}
                    onChange={setSelectedTab}
                    style={{ width: '100%' }}
                    placeholder="选择要操作的Tab"
                  >
                    {sheetInfos?.map((sheet) => (
                      <Option key={sheet.sheetId?.toString()} value={sheet.sheetId?.toString()}>
                        {sheet.sheetName} {sheet.sheetId && `(${sheet.sheetId})`}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <div className={styles.tabStatus}>
                    {selectedTab ? (
                      isTabLoaded(selectedTab) ? (
                        <span className={styles.loaded}>✅ 已加载</span>
                      ) : (
                        <span className={styles.unloaded}>❌ 未加载</span>
                      )
                    ) : (
                      <span className={styles.unselected}>未选择</span>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 基础操作 */}
            <Card title="🎯 基础操作" size="small" className={styles.operationCard}>
              <Row gutter={[8, 8]}>
                <Col span={6}>
                  <Button type="primary" onClick={handleCustomSwitch} disabled={!selectedTab} block>
                    切换Tab
                  </Button>
                </Col>
                <Col span={6}>
                  <Button onClick={handleCustomRefresh} disabled={!selectedTab} block>
                    刷新数据
                  </Button>
                </Col>
                <Col span={6}>
                  <Button danger onClick={handleCustomCancel} disabled={!selectedTab} block>
                    取消请求
                  </Button>
                </Col>
                <Col span={6}>
                  <Button disabled block>
                    更多操作
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* 滚动控制 */}
            <Card title="📐 滚动控制" size="small" className={styles.scrollCard}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <div className={styles.controlGroup}>
                    <label>滚动方向:</label>
                    <Select value={scrollDirection} onChange={setScrollDirection} style={{ width: '100%' }}>
                      <Option value="vertical">垂直滚动</Option>
                      <Option value="horizontal">水平滚动</Option>
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.controlGroup}>
                    <label>滚动位置:</label>
                    <Select value={scrollPosition} onChange={setScrollPosition} style={{ width: '100%' }}>
                      <Option value="start">开始位置</Option>
                      <Option value="end">结束位置</Option>
                      <Option value="custom">自定义位置</Option>
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  {scrollPosition === 'custom' && (
                    <div className={styles.controlGroup}>
                      <label>自定义位置:</label>
                      <Space>
                        <InputNumber
                          min={0}
                          placeholder="行"
                          value={customRow}
                          onChange={(val) => setCustomRow(val || 0)}
                          style={{ width: '70px' }}
                        />
                        <InputNumber
                          min={0}
                          placeholder="列"
                          value={customCol}
                          onChange={(val) => setCustomCol(val || 0)}
                          style={{ width: '70px' }}
                        />
                      </Space>
                    </div>
                  )}
                </Col>
              </Row>
              <Button type="primary" onClick={handleCustomScroll} disabled={!selectedTab} block>
                执行滚动
              </Button>
            </Card>
          </div>
        </TabPane>

        <TabPane tab="数据操作" key="data">
          <div className={styles.tabContent}>
            <DataOperationPanel table={currentTableInstance} setActionStatus={setActionStatus} />
          </div>
        </TabPane>

        <TabPane tab="高级功能" key="advanced">
          <div className={styles.tabContent}>
            <Card title="🚧 功能开发中" size="small">
              <div className={styles.comingSoon}>
                <p>🔧 即将支持的功能：</p>
                <ul>
                  <li>自定义脚本执行</li>
                  <li>批量操作录制</li>
                  <li>操作历史记录</li>
                  <li>性能监控</li>
                  <li>调试日志查看</li>
                  <li>API接口测试</li>
                </ul>
                <p style={{ color: '#999', marginTop: 16 }}>这些功能正在开发中，敬请期待...</p>
              </div>
            </Card>
          </div>
        </TabPane>

        <TabPane tab="快捷操作" key="quick">
          <div className={styles.tabContent}>
            <Card title="⚡ 预设快捷操作" size="small">
              <div className={styles.quickActions}>
                <Button
                  onClick={() => handleSwitchAndScroll(sheetInfos?.[2]?.sheetId?.toString(), 'bottom')}
                  disabled={!sheetInfos?.[2]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  切换到第三个tabs,且滚动到最底部
                </Button>
                <Button
                  onClick={() =>
                    handleAction('已请求刷新 Tab 1', () => refreshTab(sheetInfos?.[0]?.sheetId?.toString()))
                  }
                  disabled={!sheetInfos?.[0]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  刷新第一个tabs
                </Button>
                <Button
                  onClick={() =>
                    handleAction('已请求刷新 Tab 2', () => refreshTab(sheetInfos?.[1]?.sheetId?.toString()))
                  }
                  disabled={!sheetInfos?.[1]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  刷新第二个tabs
                </Button>
                <Button
                  onClick={() => {
                    handleAction('已请求刷新 Tab 3', () => refreshTab(sheetInfos?.[2]?.sheetId?.toString()))
                    handleSwitchAndScroll(sheetInfos?.[3]?.sheetId?.toString(), 'bottom')
                  }}
                  disabled={!sheetInfos?.[2]?.sheetId || !sheetInfos?.[3]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  刷新第三个tabs,切换到第四个tabs,且滚动到最底部
                </Button>
                <Button
                  onClick={() =>
                    handleAction('已请求滚动 Tab 1', () =>
                      scrollToCell(sheetInfos?.[0]?.sheetId?.toString(), { row: 9999, col: 0 })
                    )
                  }
                  disabled={!sheetInfos?.[0]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  第一个tabs,滚动到最底部
                </Button>
                <Button
                  onClick={() =>
                    handleAction('已请求滚动 Tab 1', () =>
                      scrollToCell(sheetInfos?.[0]?.sheetId?.toString(), { row: 0, col: 9999 })
                    )
                  }
                  disabled={!sheetInfos?.[0]?.sheetId}
                  style={{ marginBottom: 8 }}
                  block
                >
                  第一个tabs,滚动到最右部
                </Button>
                <Button
                  onClick={() =>
                    handleCancelAction('已取消 Tab 1 的所有请求', () =>
                      cancelAllRequests(sheetInfos?.[0]?.sheetId?.toString())
                    )
                  }
                  disabled={!sheetInfos?.[0]?.sheetId}
                  danger
                  style={{ marginBottom: 8 }}
                  block
                >
                  取消Tab 1的所有请求
                </Button>
                <Button
                  onClick={() =>
                    handleCancelAction('已取消 Tab 2 的所有请求', () =>
                      cancelAllRequests(sheetInfos?.[1]?.sheetId?.toString())
                    )
                  }
                  disabled={!sheetInfos?.[1]?.sheetId}
                  danger
                  block
                >
                  取消Tab 2的所有请求
                </Button>
              </div>
            </Card>
          </div>
        </TabPane>
      </Tabs>

      {/* 状态显示 */}
      <div className={styles.statusSection}>
        <Divider orientation="left">📊 工作表状态</Divider>
        <div className={styles.statusGrid}>
          {sheetInfos?.map((sheet) => (
            <div key={sheet.sheetId?.toString()} className={styles.statusItem}>
              <span className={styles.sheetName}>{sheet.sheetName}</span>
              <span className={isTabLoaded(sheet.sheetId?.toString()) ? styles.loaded : styles.unloaded}>
                {isTabLoaded(sheet.sheetId?.toString()) ? '✅ 已加载' : '❌ 未加载'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {actionStatus && <Alert message={actionStatus} type="info" showIcon className={styles.alert} />}
    </div>
  )
}

export default DebugPanel
