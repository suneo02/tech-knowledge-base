// 图片弹窗广告

import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from 'gel-util/storage'
import { useEffect, useState } from 'react'
import { pointBuriedNew } from '../../api/configApi'
/**
 * 一个浮动的圆形按钮组件，可以使用JavaScript对象的属性来设置其位置和大小，位置相对于第一个开启定位的父元素。
 *
 * @param {Object} props - 组件的属性。
 * @param {Object} props.btn - 一个包含按钮位置和大小的对象。
 * @param {string} props.btn.top - 按钮顶部的位置。
 * @param {string} props.btn.right - 按钮右侧的位置。
 * @param {string} props.btn.bottom - 按钮底部的位置。
 * @param {string} props.btn.left - 按钮左侧的位置。
 * @param {string} props.btn.width - 按钮的宽度。
 * @param {string} props.btn.height - 按钮的高度。
 * @param {Function} props.onClick - 点击按钮时执行的函数。
 *
 * @returns {JSX.Element} - 表示浮动按钮的React元素。
 */
const FloatBtn = ({ btn, onClick }) => {
  const { top, right, bottom, left, width, height } = btn

  const positionStyle = {
    top,
    right,
    bottom,
    left,
    width,
    height,
  }
  return (
    <button
      style={{
        position: 'absolute',
        borderRadius: `${width / 2}px`,
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        ...positionStyle,
      }}
      onClick={onClick}
      data-uc-id="D_bdan-QV7"
      data-uc-ct="button"
    ></button>
  )
}

export const advertisementKey = 'advertisement'

/**
 * 一个广告组件，可以显示图片和控制按钮(关闭和跳转)。
 *
 * @param {string} imageUrl - 广告图片的URL。
 * @param {number} expiry - 广告expiry时间内展示一次(单位h)。
 * @param {string} [width='415px'] - 广告图片的宽度。
 * @param {string} [height='444px'] - 广告图片的高度。
 * @param {Object} [colseBtn={width: 28, height: 28, top: 2, right: 12}] - 关闭按钮的位置和大小。
 * @param {Object} [linkBtn={width: 96, height: 96, left: 155, top: 262}] - 链接按钮的位置和大小。
 * @param {Function} onJump - 点击链接按钮时执行的函数。
 * @param {Function} onClose - 点击关闭按钮时执行的函数。
 *
 * @returns {JSX.Element} - 表示广告的React元素。
 */
const Advertisement = ({
  imageUrl,
  expiry,
  width = '415px',
  height = '444px',
  colseBtn = {
    width: 28,
    height: 28,
    top: 2,
    right: 12,
  },
  linkBtn = {
    width: 96,
    height: 96,
    left: 155,
    top: 262,
  },
  onJump,
  onClose = undefined,
}) => {
  const [showAd, setShowAd] = useState(true)

  useEffect(() => {
    if (!expiry) return
    // expiry时间内(没过期)只展示一次
    const overdue = getLocalStorageWithExpiry(advertisementKey)
    if (!overdue) {
      setLocalStorageWithExpiry(advertisementKey, `${expiry}小时`, expiry) // 一天有效期
    } else {
      setShowAd(false)
    }
  }, [])

  const handleClose = () => {
    setShowAd(false)
    onClose && onClose()
  }

  const handleJump = () => {
    pointBuriedNew('922602100960', {
      opEntity: '促销活动-首页弹窗点击',
    })
    setShowAd(false)
    onJump && onJump()
  }

  if (!showAd) {
    return null
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          width,
          height,
        }}
      >
        <img src={imageUrl} alt="Advertisement" />
        <FloatBtn btn={colseBtn} onClick={handleClose} data-uc-id="6_gEb7ZMsn" data-uc-ct="floatbtn"></FloatBtn>
        <FloatBtn btn={linkBtn} onClick={handleJump} data-uc-id="Q4SoHg1Lto" data-uc-ct="floatbtn"></FloatBtn>
      </div>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
      />
    </div>
  )
}

export default Advertisement
