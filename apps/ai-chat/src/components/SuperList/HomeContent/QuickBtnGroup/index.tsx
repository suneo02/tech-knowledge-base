import DataBrowserEyeSrc from '@/assets/image/cde-find-corp.png'
import UploadFileImgSrc from '@/assets/image/upload-clue-excel.png'
import { Spin } from '@wind/wind-ui'
import classNames from 'classnames'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'

interface QuickBtnGroupProps {
  className?: string
  onClickCDE: () => void
  onClickUpload: () => void
  uploadLoading?: boolean
  cdeLoading?: boolean
}

const PREFIX = 'quick-btn-group'

const STRINGS = {
  CDE_TEXT: t('431119', '企业高级筛选'),
  CDE_DESC: t('464123', '基于海量企业数据，智能识别企业特征，快速定位目标企业，支持模糊匹配和多维度筛选'),
  UPLOAD_TEXT: t('', '批量导入查询'),
  UPLOAD_DESC: t('464145', '支持 excel 格式一键导入，快速构建企业分析表格，自动适配数据格式，批量处理更高效'),
  BUTTON_SUFFIX: t('464146', '敬请期待'),
}

const CardButton = ({
  icon,
  text,
  desc,
  onClick,
  loading,
  suffix,
}: {
  icon: string
  text: string
  desc: string
  onClick: () => void
  loading?: boolean
  suffix?: string
}) => (
  <div className={styles[`${PREFIX}-card-button`]} onClick={!loading ? onClick : undefined}>
    {/* @ts-expect-error Wind-ui */}
    <Spin spinning={!!loading}>
      <div className={styles[`${PREFIX}-btn-content`]}>
        <img src={icon} alt={text} className={styles[`${PREFIX}-btn-icon`]} />
        <div className={styles[`${PREFIX}-btn-text`]}>
          <div className={styles[`${PREFIX}-btn-title`]}>
            {text}
            {suffix && (
              <div
                className={
                  suffix === 'Beta' ? styles[`${PREFIX}-btn-title-beta-tag`] : styles[`${PREFIX}-btn-title-tag`]
                }
              >
                {suffix}
              </div>
            )}
          </div>
          <span className={styles[`${PREFIX}-btn-desc`]}>{desc}</span>
        </div>
      </div>
    </Spin>
  </div>
)

export const QuickBtnGroup: FC<QuickBtnGroupProps> = ({
  className,
  onClickCDE,
  onClickUpload,
  uploadLoading,
  cdeLoading,
}) => {
  return (
    <div className={classNames(styles[`${PREFIX}-container`], className)}>
      <CardButton
        icon={DataBrowserEyeSrc}
        text={STRINGS.CDE_TEXT}
        desc={STRINGS.CDE_DESC}
        onClick={onClickCDE}
        loading={cdeLoading}
      />
      <CardButton
        icon={UploadFileImgSrc}
        text={STRINGS.UPLOAD_TEXT}
        desc={STRINGS.UPLOAD_DESC}
        onClick={onClickUpload}
        loading={uploadLoading}
        suffix={STRINGS.BUTTON_SUFFIX}
      />
    </div>
  )
}
