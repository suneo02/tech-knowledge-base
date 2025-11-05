import intl from '../../../utils/intl'
import './MenuLeft.less'

export const VersionPriceMenuLeft = ({ className, menuArr, onMenuClick, currentIndex }) => (
  <div className={`version-price-left-menu ${className}`}>
    {menuArr.map((i, index) => (
      <a onClick={() => onMenuClick(i, index)} className={currentIndex === index ? 'sel' : ''}>
        {intl(i.langKey, i.title)}
      </a>
    ))}
  </div>
)
