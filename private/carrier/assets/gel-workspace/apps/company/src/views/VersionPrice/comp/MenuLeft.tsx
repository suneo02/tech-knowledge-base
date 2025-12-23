import React from 'react'
import intl from '../../../utils/intl'
import './MenuLeft.less'

export const VersionPriceMenuLeft = ({ className, menuArr, onMenuClick, currentIndex }) => (
  <div className={`version-price-left-menu ${className}`}>
    {menuArr.map((i, index) => (
      <a
        onClick={() => onMenuClick(i, index)}
        className={currentIndex === index ? 'sel' : ''}
        data-uc-id="yPEoixswzo"
        data-uc-ct="a"
      >
        {intl(i.langKey, i.title)}
      </a>
    ))}
  </div>
)
