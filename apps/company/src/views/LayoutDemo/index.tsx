import React, { useRef, useState } from 'react'
import styles from './index.module.less'
import { useSize } from 'ahooks'
import { Button } from '@wind/wind-ui'

const PREFIX = 'layout-demo'

const WindHeight = () => {
  const [showWind, setShowWind] = useState(true)
  return showWind && <div className={styles[`${PREFIX}-wind-height`]} onClick={() => setShowWind(!showWind)}></div>
}

const LayoutHeader = ({ onShowRight, inner }: { onShowRight?: (props: boolean) => void; inner?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  return (
    <div ref={ref} className={styles[`${PREFIX}-header${inner ? '-inner' : ''}`]}>
      <div>
        <div>
          width: {size?.width}px, height: {size?.height}px
        </div>

        <Button type="primary" onClick={() => onShowRight(true)}>
          Show Right
        </Button>
      </div>
    </div>
  )
}

const Menu = () => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  return (
    <div ref={ref} className={styles[`${PREFIX}-menu`]}>
      <p>
        width: {size?.width}px, height: {size?.height}px
      </p>
      <div className={styles[`${PREFIX}-menu-content`]}>
        {Array.from({ length: 100 }).map((_, index) => (
          <p key={index}>{index}</p>
        ))}
      </div>
    </div>
  )
}

const Scrollbar = () => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  return (
    <div ref={ref} className={styles[`${PREFIX}-scrollbar`]}>
      <div className={styles[`${PREFIX}-scrollbar-content`]}>
        <p style={{ textAlign: 'right' }}>
          width: {size?.width}px, height: {size?.height}px
        </p>
        <div>
          {Array.from({ length: 100 }).map((_, index) => (
            <div
              key={index}
              style={{
                height: '100px',
                marginBlockEnd: 12,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {index}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles[`${PREFIX}-content`]}>{children}</div>
}

interface LeftProps {
  showRight: boolean
  onShowRight: () => void
}

const Left: React.FC<LeftProps> = ({ showRight, onShowRight }) => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={styles[`${PREFIX}-left`]}>
      {showRight && <LayoutHeader inner onShowRight={onShowRight} />}
      <div className={styles[`${PREFIX}-left-content`]}>
        <Content>
          <Menu />
          <Scrollbar />
        </Content>
      </div>
    </div>
  )
}

interface RightProps {
  width: string | null
  onWidthChange: (props: '50%' | '25%') => void
  onShowRight: (props: boolean) => void
}

const Right: React.FC<RightProps> = ({ width, onWidthChange, onShowRight }) => {
  if (!width) return null

  const dynamicStyle: React.CSSProperties = {
    minWidth: '360px',
    flexShrink: 0,
    flexBasis: width,
  }

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  return (
    <div ref={ref} className={styles[`${PREFIX}-right`]} style={dynamicStyle}>
      <div className={styles[`${PREFIX}-controls`]}>
        <Button onClick={() => onWidthChange('50%')} type="primary">
          Set Right 50%
        </Button>
        <Button onClick={() => onWidthChange('25%')} type="primary">
          Set Right 25%
        </Button>
        <Button onClick={() => onShowRight(false)} type="primary">
          Hide Right
        </Button>
      </div>
      <p>
        width: {size?.width}px, height: {size?.height}px
      </p>
    </div>
  )
}

export const LayoutDemo: React.FC = () => {
  const [showRight, setShowRight] = useState(true)
  const [rightWidth, setRightWidth] = useState<'50%' | '25%'>('25%')

  const handleShowRight = () => {
    setShowRight(true)
    if (!rightWidth) {
      setRightWidth('25%')
    }
  }

  return (
    <div>
      <WindHeight />
      {/* Control buttons can be placed here or inside Header/Content */}

      <div className={styles[`${PREFIX}-container`]}>
        {!showRight && <LayoutHeader onShowRight={setShowRight} />}
        <Left showRight={showRight} onShowRight={handleShowRight} />
        {showRight && <Right width={rightWidth} onWidthChange={setRightWidth} onShowRight={setShowRight} />}
        {/* <Content>Content Area</Content> */}
      </div>
      {/* <Menu /> */}
    </div>
  )
}
export default LayoutDemo
