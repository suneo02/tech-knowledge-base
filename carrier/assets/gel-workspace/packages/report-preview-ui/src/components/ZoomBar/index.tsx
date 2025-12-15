import { MinusO, PlusO } from '@wind/icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'

const ZOOM_BAR_BUTTON_SIZE = 24

interface ZoomBarProps {
  initialZoom?: number
  minZoom?: number
  maxZoom?: number
  onChange?: (zoomPercent: number) => void
}

export const ZoomBar: React.FC<ZoomBarProps> = ({ initialZoom = 100, minZoom = 50, maxZoom = 150, onChange }) => {
  const [currentZoom, setCurrentZoom] = useState(initialZoom)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const zoomBarRef = useRef<HTMLSpanElement>(null)
  const dragStartRef = useRef<{ x: number; left: number } | null>(null)

  const getMoveArea = useCallback(() => {
    if (!zoomBarRef.current || !sliderRef.current) return 0
    return zoomBarRef.current.clientWidth - sliderRef.current.clientWidth
  }, [])

  const setZoom = useCallback(
    (percent: number, position?: number) => {
      const constrainedPercent = Math.max(minZoom, Math.min(maxZoom, percent))
      setCurrentZoom(constrainedPercent)

      if (sliderRef.current) {
        const moveArea = getMoveArea()
        const newPosition = position !== undefined ? position : (constrainedPercent / 100 - 0.5) * moveArea
        sliderRef.current.style.left = `${newPosition}px`
      }

      onChange?.(constrainedPercent / 100)
    },
    [getMoveArea, maxZoom, minZoom, onChange]
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!sliderRef.current) return

    setIsDragging(true)
    const left = parseInt(sliderRef.current.style.left || '0')
    dragStartRef.current = { x: e.clientX, left }
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const moveArea = getMoveArea()
      let newLeft = dragStartRef.current.left + deltaX

      // Constrain to valid range
      newLeft = Math.max(0, Math.min(moveArea, newLeft))

      // Update zoom
      const zoomPercent = Math.ceil((newLeft / moveArea + 0.5) * 100)
      setZoom(zoomPercent, newLeft)
    },
    [isDragging, getMoveArea, setZoom]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
  }, [])

  const handleZoomBarClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (e.target !== zoomBarRef.current) return

      const rect = zoomBarRef.current.getBoundingClientRect()
      const clickPosition = e.clientX - rect.left
      const moveArea = getMoveArea()
      const zoomPercent = Math.ceil((clickPosition / moveArea + 0.5) * 100)
      setZoom(zoomPercent, clickPosition)
    },
    [getMoveArea, setZoom]
  )

  const handleReduceClick = useCallback(() => {
    const newZoom = Math.max(minZoom, currentZoom - 10)
    setZoom(newZoom)
  }, [currentZoom, minZoom, setZoom])

  const handleEnlargeClick = useCallback(() => {
    const newZoom = Math.min(maxZoom, currentZoom + 10)
    setZoom(newZoom)
  }, [currentZoom, maxZoom, setZoom])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className={styles.zoom}>
      <button
        type="button"
        className={styles['zoom-button']}
        onClick={handleReduceClick}
        style={{ width: ZOOM_BAR_BUTTON_SIZE, height: ZOOM_BAR_BUTTON_SIZE }}
      >
        <MinusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      </button>
      <span ref={zoomBarRef} className={styles['zoom-bar']} title="缩放" onClick={handleZoomBarClick}>
        <div ref={sliderRef} className={styles['zoom-silder']} onMouseDown={handleMouseDown} style={{ left: '50px' }} />
      </span>
      <button
        type="button"
        className={styles['zoom-button']}
        onClick={handleEnlargeClick}
        style={{ width: ZOOM_BAR_BUTTON_SIZE, height: ZOOM_BAR_BUTTON_SIZE }}
      >
        <PlusO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      </button>
      <span className={styles['zoom-text']}>{currentZoom}%</span>
    </div>
  )
}
