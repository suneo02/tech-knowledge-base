import { useEffect, useState } from 'react'
import { getVipInfo } from '../../lib/utils'
import intl from '../../utils/intl'

/**
 * 国内版与海外版共同使用的hook
 */
export const useVersionPriceCommonHook = () => {
  const { isVip, isSvip } = getVipInfo()
  const [isVipUser, setIsVipUser] = useState(isVip || isSvip)
  const [isVipSelected, setIsVipSelected] = useState(false) // 当前选择的类型是vip还是

  // 当前选中的menu
  const [currentIndex, setCurrentIndex] = useState(0)

  const [isSticky, setIsSticky] = useState(false)

  const domIsInViewPort = (el) => {
    const screenHeight = window.innerHeight
    const { top } = el?.getBoundingClientRect()
    return top <= screenHeight - 20
  }
  const translateIntl = () => {
    if (window.en_access_config) {
      let elements = document.querySelectorAll('[langKey]')
      elements.forEach((e) => {
        // @ts-expect-error attributes is not a valid prop for Element
        let langkey = e.attributes.langkey.value
        // @ts-expect-error innerText is not a valid prop for Element
        e.innerText = intl(langkey)
      })
    }
  }

  useEffect(() => {
    setIsVipUser(isVip || isSvip)
  }, [isVip, isSvip])
  useEffect(() => {
    translateIntl()
    const price_table_header = document.querySelector('.price-table-header')
    let elements = document.querySelectorAll('.tit-price')
    const handleWheel = () => {
      let currentIndexTemp
      elements.forEach((e, index) => {
        if (domIsInViewPort(e)) {
          currentIndexTemp = index
        }
      })
      setCurrentIndex(currentIndexTemp)

      const { top } = price_table_header?.getBoundingClientRect()
      setIsSticky(top <= 36)
    }

    document.addEventListener('wheel', handleWheel)
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return {
    isVipUser,
    setIsVipUser,
    isVipSelected,
    setIsVipSelected,
    currentIndex,
    setCurrentIndex,
    isSticky,
    setIsSticky,
    domIsInViewPort,
    translateIntl,
  }
}
