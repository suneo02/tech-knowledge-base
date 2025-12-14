import aliceChatHi from '@/assets/gif/AliceChatHi.gif'
import classNames from 'classnames'
import styles from './index.module.less'
import { AliceLogo, SuperListGradientText } from 'gel-ui'
import { t } from 'gel-util/intl'
import { pickByLanguage } from '@/utils/langSource'

interface LogoSectionProps {
  className?: string
}
const PREFIX = 'home-logo-section'
const STRINGS = {
  TITLE: t('149697', '企业库'),
  SLOGAN: t('466154', '我是{{alice}}，摆脱{{count}}筛选项，一句话找企业', {
    alice: <SuperListGradientText>{t('466155', '全球企业库Alice')}</SuperListGradientText>,
    count: <SuperListGradientText>1000+</SuperListGradientText>,
  }),
}
export const HomeLogoSection: React.FC<LogoSectionProps> = (props) => {
  // 多语言词条

  const slogen = (total: React.ReactNode) => {
    return pickByLanguage({
      cn: <>摆脱{total}筛选项，一句话找企业</>,
      en: <>remove {total} filters, one click to get a list</>,
      jp: <>remove {total} filters, one click to get a list</>,
    })
  }

  // const number1000 = '1000'.split('')
  const { className } = props || {}
  return (
    <div className={classNames(styles[`${PREFIX}-container`], className)}>
      <div className={styles[`${PREFIX}-logo-left`]}>
        <div className={styles[`${PREFIX}-logo-container`]}>
          <AliceLogo width={110} height={110} />
        </div>
      </div>

      <div className={styles.logoRight}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <img className={styles.logoHi} src={aliceChatHi} draggable={false} alt="Hi" />
          </div>
          {/* <div style={{ paddingInlineStart: 14 }}>
            我是 <SuperListGradientText>一句话找企业</SuperListGradientText>
          </div> */}
        </div>
        <div className={styles.logoDesc}>{STRINGS.SLOGAN}</div>
      </div>
    </div>
  )
}
