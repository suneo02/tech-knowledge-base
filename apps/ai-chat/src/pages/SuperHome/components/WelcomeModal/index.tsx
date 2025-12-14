import { selectVipStatus, useAppSelector, VipStatusEnum } from '@/store'
import { CheckO, CloseO, GiftO, StarO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { Modal, Table, TableColumnProps, Tag } from 'antd'
import { t } from 'gel-util/intl'
import { useMemo } from 'react'
import styles from './index.module.less'

const PREFIX = 'welcome-modal'

const STRINGS = {
  HEADER_TITLE: t('464234', '一句话找企业'),
  BETA_TAG: t('464218', '内测邀请'),
  HEADER_DESC: t('464139', '恭喜您获得「一句话找企业」内测版本的特邀体验资格!'),
  CARD_TITLE_DESC: t(
    '464219',
    '超级名单Alice帮助您通过问答方式快速筛选企业名单，并对企业进行批量AI分析和数据查询，有效提升营销拓客的工作效率。'
  ),
  INTRO_TEXT: t(
    '464129',
    '我们帮助您一句话高效筛选企业名单，并对每家企业进行AI分析和信息提取，采用积分模式助您低成本、灵活使用核心功能。'
  ),
  CARD_TITLE: t('464106', '内测期间积分赠送规则'),
  ACTIONS_TEXT: t('464193', '立即体验功能'),
  FOOTER_TEXT: t('464099', '以上积分赠送规则仅限内测活动期间，活动结束后赠送积分将被清空。我司保留最终解释权。'),
  CURRENT_LEVEL: t('464137', '当前等级'),
  DAILY_POINTS: t('464166', '每日赠送积分'),
  LEVEL: t('464206', '账号等级'),
  EXPORT: t('472307', '导出权限'),
}

const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
  const vipStatus = useAppSelector(selectVipStatus)
  const currentLevel = useMemo(() => getLevelByVip(vipStatus), [vipStatus])

  const columns = useMemo<TableColumnProps<any>[]>(
    () => [
      {
        title: STRINGS.LEVEL,
        dataIndex: 'level',
        key: 'level',
        className: `${styles.tableCell} ${styles.levelCell}`,
        render: (level: string, record: any) => (
          <span>
            {record.product} {level}
            {level === currentLevel && (
              <Tag color="gold" style={{ marginLeft: 8 }}>
                {STRINGS.CURRENT_LEVEL}
              </Tag>
            )}
          </span>
        ),
      },
      {
        title: STRINGS.DAILY_POINTS,
        dataIndex: 'points',
        key: 'points',
        className: `${styles.tableCell} ${styles.pointsCell}`,
        align: 'right',
      },
      {
        title: STRINGS.EXPORT,
        dataIndex: 'export',
        key: 'export',
        className: `${styles.tableCell} ${styles.exportCell}`,
        align: 'center',
        render: (enable: boolean) =>
          enable ? (
            <CheckO
              style={{ color: 'var(--green-6)' }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ) : (
            <CloseO
              style={{ color: 'var(--red-6)' }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ),
      },
    ],
    [currentLevel]
  )

  const data = useMemo(() => TABLE_DATA, [])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={true}
      wrapClassName={styles[`${PREFIX}-wrapper`]}
      width={672}
      centered
    >
      <div className={styles[`${PREFIX}-modal-content`]}>
        <div className={styles[`${PREFIX}-header`]}>
          <div className={styles[`${PREFIX}-header-bg-element1`]}></div>
          <div className={styles[`${PREFIX}-header-bg-element2`]}></div>
          <h2 className={styles[`${PREFIX}-header-title`]}>
            {STRINGS.HEADER_TITLE}・{STRINGS.BETA_TAG}
          </h2>
          <div className={styles[`${PREFIX}-header-desc`]}>
            <div>{STRINGS.HEADER_DESC}</div>
            <div>{STRINGS.CARD_TITLE_DESC}</div>
          </div>
          <div className={styles[`${PREFIX}-header-decorator`]}>
            {/* @ts-expect-error wind-ui-icon */}
            <StarO />
          </div>
        </div>

        <div className={styles[`${PREFIX}-content`]}>
          <div className={styles[`${PREFIX}-points-card`]}>
            <h3 className={styles[`${PREFIX}-card-title`]}>
              {/* @ts-expect-error wind-ui-icon */}
              <GiftO className={styles[`${PREFIX}-card-title-icon`]} />
              {STRINGS.CARD_TITLE}
            </h3>
            <Table rowKey="key" columns={columns} dataSource={data} pagination={false} size="large" />
            <div className={styles[`${PREFIX}-remark`]}>
              <p>{STRINGS.FOOTER_TEXT}</p>
            </div>
          </div>

          <div className={styles[`${PREFIX}-actions`]}>
            <Button
              variant="alice"
              type="primary"
              size="large"
              onClick={onClose}
              style={{ width: '100%', maxWidth: '100%', fontSize: 18 }}
            >
              {STRINGS.ACTIONS_TEXT}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { WelcomeModal }

// --- 辅助函数 ---
const getLevelByVip = (status: VipStatusEnum) => {
  if (status === VipStatusEnum.SVIP) return t('222418', 'SVIP版')
  if (status === VipStatusEnum.VIP) return t('222417', 'VIP版')
  return t('312753', '免费版')
}

// --- 静态内容 ---
const TABLE_DATA = [
  { key: '1', product: t('422073', '全球企业库'), level: t('222418', 'SVIP版'), points: '20,000', export: true },
  { key: '2', product: t('422073', '全球企业库'), level: t('222417', 'VIP版'), points: '5,000', export: true },
  { key: '3', product: t('422073', '全球企业库'), level: t('312753', '免费版'), points: '5,000', export: false },
]

// --- 类型 ---
interface WelcomeModalProps {
  open: boolean
  onClose: () => void
}
