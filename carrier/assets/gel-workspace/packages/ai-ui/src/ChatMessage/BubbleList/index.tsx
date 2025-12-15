import { Bubble } from '@ant-design/x'
// @ts-expect-error ttt
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import cn from 'classnames'

interface BubbleListProps {
  items: any[]
  roles: any
  className?: string
  [key: string]: any
}

export const VirtualBubbleList: React.FC<BubbleListProps> = ({ items, roles, className, ...props }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 估计每个消息的高度
    overscan: 5, // 预渲染的消息数量
  })

  return (
    <div ref={parentRef} className={className} style={{ height: '100%', overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Bubble.List items={[items[virtualRow.index]]} roles={roles} {...props} />
          </div>
        ))}
      </div>
    </div>
  )
}
