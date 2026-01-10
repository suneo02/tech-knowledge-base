import { ETable } from '@/components/ETable'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { pickByLanguage } from '@/utils/langSource'
import { DoubleRightO, CloseO } from '@wind/icons'
import { Button, Skeleton, Tooltip } from '@wind/wind-ui'
import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { useEffect } from 'react'
import Toolbar from './Toolbar'
const TabContent = ({ tabKey, height }: { tabKey: string; height?: number }) => {
  return (
    <div>
      <ETable tabKey={tabKey} height={height} />
    </div>
  )
}

const Right = ({
  showChat,
  setShowChat,
  height,
}: {
  showChat?: boolean
  setShowChat?: (show: boolean) => void
  height?: number
}) => {
  const STRINGS = {
    SHOW_LEFT: pickByLanguage({ cn: '显示左侧', en: 'Show Left', jp: 'Show Left' }),
  }
  const { activeSheetId, setActiveSheetId, sheetInfos, sheetRefs, deleteSheet } = useSuperChatRoomContext()
  useEffect(() => {
    setActiveSheetId(sheetInfos?.[0]?.sheetId.toString())
  }, [sheetInfos])

  const items: TabsProps['items'] = sheetInfos.map((sheetInfo, index) => {
    const id = sheetInfo.sheetId.toString()
    const count = sheetRefs[id]?.dataSource?.length ?? sheetInfo?.total ?? 0
    const isFirst = index === 0
    // const canDelete = !(isFirst && count === 0) 等待后端接口好了再放开这个
    const canDelete = !isFirst
    const showCount = !(isFirst && count === 0)
    const name = sheetInfo.sheetName ?? ''

    const labelName = name.length > 10 ? name.slice(0, 10) + '...' : name
    const labelNode =
      name.length > 10 ? (
        <Tooltip title={name}>
          <span>
            {labelName}
            {showCount ? `(${count})` : ''}
          </span>
        </Tooltip>
      ) : (
        <span>{showCount ? `${labelName}(${count})` : labelName}</span>
      )

    return {
      key: id,
      label: (
        <>
          {labelNode}
          {canDelete ? (
            <Button
              type="text"
              onClick={() => deleteSheet?.(id)}
              size="small"
              // @ts-expect-error wind-icon
              icon={<CloseO style={{ fontSize: 14 }} />}
              style={{ marginInlineStart: 4 }}
            />
          ) : null}
        </>
      ),
      children: <TabContent tabKey={id} height={height} />,
    }
  })

  if (sheetInfos.length === 0) {
    return <Skeleton animation />
  }
  return (
    <div style={{ padding: 2, maxHeight: '100%' }}>
      <Tabs
        // style={{ height: `calc(${height}px - 40px)` }}
        tabBarStyle={{ marginBlockStart: 0, marginBlockEnd: 4 }}
        items={items}
        activeKey={activeSheetId}
        onChange={setActiveSheetId}
        type="card"
        tabBarExtraContent={{
          left: !showChat ? (
            <Tooltip title={STRINGS.SHOW_LEFT} placement="right">
              <div
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => setShowChat?.(true)}
              >
                {/* @ts-expect-error wind-icon */}
                <Button icon={<DoubleRightO />} onClick={() => setShowChat?.(true)} type="text" />
              </div>
            </Tooltip>
          ) : null,
          right: <Toolbar showIndicator showAutoWrap showSearch />,
        }}
      />
    </div>
  )
}

export default Right
