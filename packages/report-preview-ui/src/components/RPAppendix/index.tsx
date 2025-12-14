import { useIntl } from 'gel-ui'
import styles from './index.module.less'

export const RPAppendix: React.FC<{
  content: string[]
}> = ({ content }) => {
  const t = useIntl()
  return (
    <>
      <div className={styles['report-appendix-title']}>{t('451098', '附录')}</div>
      {content.map((item, index) => (
        <div key={index} className={styles['report-appendix-line']}>
          {item}
        </div>
      ))}
    </>
  )
}
