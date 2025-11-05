import React, { FC, useState } from 'react'
import styles from './style/index.module.less'
import { Modal } from '@wind/wind-ui'

export const ImgWithModal: FC<{
  src: string
  width?: number
  height?: number
  className?: string
}> = ({ src, width, height, className }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <img
        onClick={() => setOpen(true)}
        src={src}
        width={width}
        height={height}
        className={` ${className} ${styles['img-with-modal']}`}
        alt=""
      />
      {/* @ts-expect-error ttt*/}
      <Modal visible={open} footer={null} width={'auto'} onCancel={() => setOpen(false)}>
        <img src={src} width={'auto'} height={'auto'} className={` ${className} ${styles['img-in-modal']}`} alt="" />
      </Modal>
    </>
  )
}
