import { ReactNode, useState } from 'react'
import { Button } from '@wind/wind-ui'
import { DownO, UpO } from '@wind/icons'
import { postPointBuried } from '@/utils/common/bury'

interface DataSourceSectionProps {
  leftContent: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
}

const DataSourceSection = ({ leftContent, children, defaultExpanded }: DataSourceSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  return (
    <div style={{ width: '100%', marginBlock: 12 }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>{leftContent}</div>
        <Button
          type="text"
          onClick={() => {
            postPointBuried('922604570323', { action: expanded ? '收起' : '展开' })
            setExpanded(!expanded)
          }}
        >
          {expanded ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {/* @ts-expect-error wind-icon */}
              <UpO />
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {/* @ts-expect-error wind-icon */}
              <DownO />
            </span>
          )}
        </Button>
      </div>
      <div
        style={{
          transition: 'max-height 0.2s ease-in-out, padding 0.2s ease-in-out',
          maxHeight: expanded ? 1200 : 0,
          overflow: 'hidden',
          padding: expanded ? '8px 0 0' : '0',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default DataSourceSection
