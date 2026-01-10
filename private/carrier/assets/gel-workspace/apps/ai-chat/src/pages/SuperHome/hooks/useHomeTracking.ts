import { postPointBuried } from '@/utils/common/bury'
import { getDeviceType, getOSSystem, getPageSource } from '@/utils/common/device'
import { getUrlSearchValue } from 'gel-util/common'
import { useEffect } from 'react'

export const useHomeTracking = () => {
  const from = getUrlSearchValue('from')

  useEffect(() => {
    postPointBuried('922604570271', {
      from,
      os_system: getOSSystem(),
      device_type: getDeviceType(),
      page_source: getPageSource(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
