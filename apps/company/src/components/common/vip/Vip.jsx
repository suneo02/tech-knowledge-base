import vipImg from '@/assets/imgs/vip@2x.png'
import { Tooltip } from '@wind/wind-ui'
import './vip.less'

const Vip = () => {
  return (
    <Tooltip placement="right" title="VIP" getPopupContainer={(trigger) => trigger.parentElement}>
      <span className="vip-container">
        <img src={vipImg} alt="" />
      </span>
    </Tooltip>
  )
}

export default Vip
