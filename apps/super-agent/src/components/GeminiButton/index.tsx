import React, { useEffect, useRef, useState, forwardRef } from 'react'
import styles from './index.module.less'

interface GeminiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export const GeminiButton = forwardRef<HTMLButtonElement, GeminiButtonProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const boundsRef = useRef<DOMRect | null>(null)
    const animationRef = useRef<number>()
    const mousePosRef = useRef({ x: 0, y: 0 })

    // Merge refs
    useEffect(() => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(internalRef.current)
      } else {
        ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = internalRef.current
      }
    }, [ref])

    useEffect(() => {
      if (!isHovering) return

      const updateCoordinates = () => {
        if (boundsRef.current && internalRef.current) {
          const x = mousePosRef.current.x - boundsRef.current.left
          const y = mousePosRef.current.y - boundsRef.current.top
          internalRef.current.style.setProperty('--x', `${x}px`)
          internalRef.current.style.setProperty('--y', `${y}px`)
        }
        animationRef.current = requestAnimationFrame(updateCoordinates)
      }

      animationRef.current = requestAnimationFrame(updateCoordinates)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [isHovering])

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (!internalRef.current) return
      setIsHovering(true)
      boundsRef.current = internalRef.current.getBoundingClientRect()

      let clientX, clientY
      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = (e as React.MouseEvent).clientX
        clientY = (e as React.MouseEvent).clientY
      }

      mousePosRef.current = { x: clientX, y: clientY }

      // Immediate update to prevent flash
      const x = clientX - boundsRef.current.left
      const y = clientY - boundsRef.current.top
      internalRef.current.style.setProperty('--x', `${x}px`)
      internalRef.current.style.setProperty('--y', `${y}px`)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isHovering) return
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (!isHovering) return
      mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!internalRef.current) return

      // Create ripple effect
      const bounds = internalRef.current.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const y = e.clientY - bounds.top

      const ripple = document.createElement('span')
      ripple.className = styles.ripple
      const size = Math.max(bounds.width, bounds.height) * 2
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${x - size / 2}px`
      ripple.style.top = `${y - size / 2}px`

      internalRef.current.appendChild(ripple)

      ripple.addEventListener('animationend', () => {
        ripple.remove()
      })

      onClick?.(e)
    }

    // Handle resize
    useEffect(() => {
      const handleResize = () => {
        if (isHovering && internalRef.current) {
          boundsRef.current = internalRef.current.getBoundingClientRect()
        }
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [isHovering])

    return (
      <button
        ref={internalRef}
        className={`${styles['gemini-btn']} ${className || ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        {...props}
      >
        <span className={styles.content}>{children}</span>
      </button>
    )
  }
)

GeminiButton.displayName = 'GeminiButton'
