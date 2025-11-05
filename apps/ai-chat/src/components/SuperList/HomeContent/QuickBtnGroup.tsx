import DataBrowserEyeSrc from '@/assets/image/cde-find-corp.png'
import UploadFileImgSrc from '@/assets/image/upload-clue-excel.png'
import classNames from 'classnames'
import styles from './style/quickBtnGroup.module.less'

export const QuickBtnGroup: React.FC<{
  className?: string
  onClickCDE: () => void
  onClickUpload: () => void
  uploadLoading?: boolean
  cdeLoading?: boolean
}> = ({ className, onClickCDE, onClickUpload, uploadLoading, cdeLoading }) => {
  const QuickBtnCfg = [
    {
      id: 'cde',
      icon: <img src={DataBrowserEyeSrc} className={styles['quick-btn-item-icon']} alt="智能搜索企业" />,
      text: '智能搜索企业',
      desc: '基于海量企业数据，智能识别企业特征，快速定位目标企业，支持模糊匹配和多维度筛选',
      onClick: onClickCDE,
      loading: cdeLoading,
    },
    {
      id: 'upload',
      icon: <img src={UploadFileImgSrc} className={styles['quick-btn-item-icon']} alt="批量导入数据" />,
      text: '批量导入数据',
      desc: '支持excel格式一键导入，快速构建企业分析表格',
      onClick: onClickUpload,
      loading: uploadLoading,
    },
  ]
  return (
    <div className={classNames(styles['quick-btn-group'], className)}>
      {QuickBtnCfg.map((btn) => (
        <div
          key={btn.id}
          className={classNames(styles['quick-btn-item'], { [styles.loading]: btn.loading })}
          onClick={() => !btn.loading && btn.onClick()}
        >
          <div className={styles.quickBtnItemLeft}>{btn.icon}</div>
          <div className={styles.quickBtnItemRight}>
            <p className={styles['quick-btn-item-text']}>{btn.text}</p>
            <p className={styles['quick-btn-item-desc']}>{btn.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
