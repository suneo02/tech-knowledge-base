import React from 'react'
import alice from '@/assets/icons/icon-alice.png'
import aliceCircle from '@/assets/icons/alice-circle.png'

export const AliceIcon = ({ width = 40, height = 40, ...props }: any) => {
  return <img style={{ width, height }} src={alice} {...props} />
}

export const AliceIconCircle = ({ width = 40, height = 40, ...props }: any) => {
  return <img style={{ width, height }} src={aliceCircle} {...props} />
}
