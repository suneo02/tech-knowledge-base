import { useEffect, useState } from 'react'
import { getVipInfo } from '@/lib/utils'

export const useUserVipState = () => {
  const userVipInfo = getVipInfo()
  const [vipState, setVipState] = useState([])
  useEffect(() => {
    const arr = []
    if (userVipInfo?.isVip) arr.push('vip')
    if (userVipInfo?.isSvip) arr.push('svip')
    setVipState(arr)
  }, [userVipInfo?.isVip, userVipInfo?.isSvip])

  return {
    vipState,
    setVipState,
  }
}
