import { Card } from '@wind/wind-ui'
import intl from '../../utils/intl'
import './FeturedCard.less'
import { wftCommon } from '../../utils/utils'
import { RightO } from '@wind/icons'

const FeturedCard = (props) => {
  const { data, onClick, children, style, unit = ['138901', '家'] } = props
  const { objectName, objectId, count, description, source, updatefreq, bizDate, type } = data

  return (
    <Card
      style={style}
      title={
        <span
          dangerouslySetInnerHTML={{
            __html: objectName || '--',
          }}
        ></span>
      }
      styleType="block"
      extra={
        <span>
          <a>
            {wftCommon.formatMoney(count, [4, ' ']) || '--'} {intl(unit[0], unit[1])}
            <RightO data-uc-id="2sZxoCvZMfT" data-uc-ct="righto" />
          </a>{' '}
        </span>
      }
      className="card"
      onClick={() => onClick(props)}
    >
      <div className="description">{children || <p title={description}>{description || '--'}</p>}</div>
    </Card>
  )
}

export default FeturedCard
