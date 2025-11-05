import { MiniFilled, MiniFilledHover } from '@/assets/icon'
import MiniQRCode from '@/assets/image/mini-qrcode.png'
import { Image, Space, Tooltip } from 'antd'
import styles from './index.module.less'

export const WelcomeMiniProgram: React.FC = () => {
  return (
    <Space style={{ width: '100%' }}>
      <Tooltip
        title={
          <>
            <Image src={MiniQRCode} alt="alice" />
            <div style={{ color: '#333', fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 12 }}>
              <p>扫码关注小程序</p>
              <p>随时随地向我提问</p>
            </div>
          </>
        }
        placement="bottomRight"
        color="white"
      >
        <div className={styles['mini-filled-wrapper']}>
          <MiniFilled className={styles['mini-filled']} style={{ width: 32, height: 32 }} />
          <MiniFilledHover className={styles['mini-filled-hover']} style={{ width: 32, height: 32 }} />
        </div>
      </Tooltip>
    </Space>
  )
}
