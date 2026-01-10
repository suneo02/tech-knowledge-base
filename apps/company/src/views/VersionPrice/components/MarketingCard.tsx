import { Button, Card } from '@wind/wind-ui'
import { BaiFenSites } from 'gel-util/link'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'

export const MarketingCard = () => {
  return (
    <Card className="product-intro-card">
      <div className="intro-header corp-header ">{intl('479176', '营销版（百分企业）')}</div>
      <div className="intro-main">
        <div className="product-intro-li-price">{intl('479158', 'AI驱动对公营销')}</div>
        <div className="product-intro-li-text">{intl('479159', '助力高效精准获客')}</div>
        <div className="product-intro-li-btn">
          <Button
            className="btn"
            style={{
              backgroundColor: '#57a3f6',
              color: '#fff',
              transform: 'scale(1.1)',
            }}
            onClick={() => {
              const path = BaiFenSites({ isBaiFenTerminal: wftCommon.isBaiFenTerminal() }).authDesc
              if (path) {
                window.open(path)
              }
            }}
            data-uc-id="Md0QlkJF0Yd"
            data-uc-ct="button"
          >
            {intl('479177', '查看权限')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
