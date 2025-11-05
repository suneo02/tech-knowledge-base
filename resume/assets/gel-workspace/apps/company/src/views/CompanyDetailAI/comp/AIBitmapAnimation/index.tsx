import { AliceBitmapAnimation } from '@wind/alice-bitmap-animation'
import liuguang from '@/assets/imgs/f5_header_animation_1.png' // 一半是圆角的精灵图
import liuguangQurate from '@/assets/imgs/AI_FLASH.png'
import React, { useState } from 'react'
/**
 * ALice定制的精灵图序列帧动画组件，支持圆角精灵图和半圆角精灵图
 * @param {Object} props - 组件属性
 * @param {number} props.width - 精灵图宽度
 * @param {number} props.height - 精灵图高度
 * @param {boolean} props.isQurate - 是否使用圆角精灵图
 * @param {string} props.className - 类名
 *
 **/

export const AliceBitAnimation = ({
  isQurate = true,
  className,
  style,
}: {
  isQurate?: boolean
  className?: string
  style?: React.CSSProperties
}) => {
  if (isQurate) {
    return (
      <BitmapAnimation imageSrc={liuguangQurate} width={136} height={44} fps={10} className={className} style={style} />
    )
  } else {
    return <BitmapAnimation imageSrc={liuguang} width={94} height={36} fps={10} className={className} style={style} />
  }
}

/**
 * 精灵图序列帧动画组件
 * @param {Object} props - 组件属性
 * @param {number} props.width - 精灵图宽度
 * @param {number} props.height - 精灵图高度
 * @param {string} props.imageSrc - 精灵图路径
 * @param {string} props.className - 类名
 *
 **/
export const BitmapAnimation = ({
  width = 94,
  height = 36,
  imageSrc = liuguangQurate,
  fps = 10,
  className,
  style,
}: {
  width?: number
  height?: number
  imageSrc?: string
  fps?: number
  className?: string
  style?: React.CSSProperties
  [key: string]: any
}) => {
  return (
    <div className={`ai-bitmap-animation ${className}`} style={{ height: `${height}px`, ...style }}>
      <AliceBitmapAnimation imageSrc={imageSrc} frameWidth={width} frameHeight={height} fps={fps} width="0px" />
    </div>
  )
}
