import Search from '@/components/ETable/Search'
import User from '@/components/layout/Page/User'
import GenerateAIColumn from '@/components/VisTable/components/Modal/GenerateAIColumn'
import { useSmartFill } from '@/components/VisTable/context/SmartFillContext'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import TableNameEditor from '@/pages/ProgressGuardDemo/Right/Toolbar/TableNameEditor'
import { TableActionsDropdown } from '@/pages/VisTable/components/TableActionsDropdown'
import SubscribeButton from '@/pages/VisTable/components/toolbar/SubscribeButton'
import { HomeO } from '@wind/icons'
import { Button, Divider } from '@wind/wind-ui'
import { AiModelEnum } from 'gel-api'
import { AutoWrapButton } from './AutoWrap'
import { FindCompany } from './FindCompany'
import { FindIndicator } from './FindIndicator'
import styles from './index.module.less'
// import { t } from 'gel-util/intl'
import { pickByLanguage } from '@/utils/langSource'
import { AIBox } from 'gel-ui'
import { t } from 'gel-util/intl'

const PREFIX = 'toolbar'

// const STRINGS = {
//   AI_GENERATE_COLUMN: t('464155', 'AI生成列'),
// }

interface ToolbarProps {
  showCompany?: boolean // 找企业按钮
  showAiGenerateColumn?: boolean // AI生成列按钮
  showIndicator?: boolean // 新增列按钮
  showSearch?: boolean // 搜索按钮
  showSubscribe?: boolean // 订阅按钮
  showUser?: boolean // 用户按钮
  showTableNameEditor?: boolean // 表格名称编辑器
  showGroup?: boolean // 分组按钮
  showHome?: boolean // 首页按钮
  showDownload?: boolean // 下载按钮
  showAutoWrap?: boolean // 自动换行按钮
}

const Toolbar = ({
  showCompany,
  showAiGenerateColumn,
  showIndicator,
  // showBatchExtractionIndicator,
  showSearch,
  showSubscribe,
  showUser,
  showTableNameEditor,
  // showGroup,
  showHome,
  showDownload,
  showAutoWrap,
}: ToolbarProps) => {
  const AIGC = pickByLanguage({ cn: 'AI生成列', en: 'AI Gen-Column', jp: 'AI Generate Column' })

  const { tableId, activeSheetId, searchInstances, addDataToCurrentSheet, tableInfo, sheetRefs } =
    useSuperChatRoomContext()
  const { openSmartFillModal, isModalOpen, closeSmartFillModal } = useSmartFill()
  const searchInstance = searchInstances[activeSheetId]
  const navigate = useNavigateWithLangSource()
  const disabled = !sheetRefs?.[activeSheetId]

  /**
   * AI生成列按钮
   */
  const AiGenerateColumnButton = ({ disabled }: { disabled?: boolean }) => {
    return (
      <>
        <Button
          data-id="super-excel-ai-generate-column"
          onClick={() => openSmartFillModal()}
          className={`${styles[`${PREFIX}-ai-generate-button`]}`}
          // icon={<AiC />}
          disabled={disabled}
          type="text"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AIBox size="small" />
            {AIGC}
          </div>
        </Button>
      </>
    )
  }

  if (!tableId) return null

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-title`]}>
        {showHome ? (
          <>
            <Button
              // @ts-expect-error wind-icon
              icon={<HomeO />}
              onClick={() => {
                navigate('/super')
              }}
              // type="text"
              style={{ marginInlineStart: 6, marginInlineEnd: 6 }}
            >
              <span>{t('273158', '返回首页')}</span>
            </Button>
            <Divider type="vertical" style={{ marginInlineStart: 4, marginInlineEnd: 12 }} />
          </>
        ) : null}

        {/* <Divider type="vertical" style={{ marginInlineStart: 4, marginInlineEnd: 12 }} /> */}
        {showTableNameEditor ? <TableNameEditor tableId={tableId} initialName={tableInfo?.tableName ?? ''} /> : null}
      </div>

      <div className={`${styles[`${PREFIX}-actions`]}`}>
        {/* <Group /> */}
        {showAiGenerateColumn ? (
          <>
            <AiGenerateColumnButton disabled={disabled} />
            <GenerateAIColumn
              open={isModalOpen}
              onCancel={closeSmartFillModal}
              onOk={() => console.log('ok')}
              mentionsOptions={
                sheetRefs?.[activeSheetId]?.columns?.map((sheet) => ({
                  value: sheet.title,
                  label: sheet.title,
                  field: sheet.field,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                })) || ([] as any)
              }
              initParams={{
                aiModel: AiModelEnum.ALICE,
                enableLinkTool: true,
                enableWindBrowser: true,
                enableWindDPU: true,
                // runType:  RunTypeEnum.RUN_TOP_10
              }}
              columns={
                sheetRefs?.[activeSheetId]?.columns?.map((sheet) => ({
                  label: sheet.title,
                  key: sheet.field,
                  value: sheet.title,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                })) as any
              }
            />
          </>
        ) : null}
        {showCompany ? (
          <FindCompany
            // @ts-expect-error
            onFinish={addDataToCurrentSheet('bottom')}
            sheetId={activeSheetId}
            tableId={tableId}
            disabled={disabled}
          />
        ) : null}
        {showIndicator ? (
          <>
            {/* <Divider type="vertical" /> */}
            <FindIndicator
              // @ts-expect-error
              onFinish={addDataToCurrentSheet('right')}
              sheetId={activeSheetId}
              tableId={tableId}
              disabled={disabled}
            />
          </>
        ) : null}
        {/* {showIndicator ? (
          <FindIndicator onFinish={addDataToCurrentSheet('right')} sheetId={activeSheetId} tableId={tableId} />
        ) : null} */}
        {showSubscribe ? <SubscribeButton tableId={tableId} /> : null}
        {showDownload ? <TableActionsDropdown tableId={tableId} disabled={disabled} /> : null}
        {showAutoWrap ? (
          <>
            <Divider type="vertical" />
            <AutoWrapButton sheetRef={sheetRefs?.[activeSheetId]} disabled={disabled} />
          </>
        ) : null}
        {showSearch && searchInstance ? (
          <>
            <Divider type="vertical" />
            <Search searchInstance={searchInstance} tabKey={activeSheetId} />
          </>
        ) : null}
        {showUser ? (
          <>
            <Divider type="vertical" />
            <User showCoins from="super-info" />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Toolbar
