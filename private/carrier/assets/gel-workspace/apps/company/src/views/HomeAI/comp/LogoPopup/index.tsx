import React, { useEffect, useState } from 'react'
import rectImg from '../../../../assets/imgs/rect.jpg'

export const LogoPopup: React.FC = () => {
  const [imgHover, setImgHover] = useState(false)
  const [imgPos, setImgPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const handleMouseOver = () => {
      setImgHover(true)
      const logo = document.querySelector('.logo')
      if (logo) {
        const rect = logo.getBoundingClientRect()
        setImgPos({
          top: rect.bottom,
          left: rect.left,
        })
      }
    }

    const handleMouseOut = () => {
      setImgHover(false)
    }

    const logoElement = document.querySelector('.logo')
    if (logoElement) {
      logoElement.addEventListener('mouseover', handleMouseOver)
      logoElement.addEventListener('mouseout', handleMouseOut)
    }

    return () => {
      if (logoElement) {
        logoElement.removeEventListener('mouseover', handleMouseOver)
        logoElement.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [])

  if (!imgHover) return null

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: imgPos.top,
        left: imgPos.left,
      }}
    >
      <div
        style={{
          width: 500,
          height: 400,
        }}
      >
        <img src={rectImg} style={{ width: '100%' }} alt="Logo Popup" />
      </div>
    </div>
  )
}
