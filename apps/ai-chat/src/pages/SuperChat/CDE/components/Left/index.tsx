import { useCDEModal } from '@/components/CDE/component/Search'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { fetchFilterCategories, fetchPoints, selectFilterCategories, useAppDispatch } from '@/store'
import { DoubleLeftO, PlusO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import { CDEFormBizValues, CDEFormConfigItem } from 'cde'
import { AliceLogo } from 'gel-ui'
import { useSelector } from 'react-redux'
import { FilterDisplay } from './components/FilterDisplay'
import styles from './index.module.less'
import { t } from 'gel-util/intl'
import { postPointBuried } from '@/utils/common/bury'

const PREFIX = 'super-chat-cde-left'
const STRINGS = {
  TITLE: t('431119', '企业高级筛选'),
  HIDE_LEFT: t('464211', '隐藏左侧'),
  ADD_FILTER_CONDITION: t('257741', '添加筛选条件'),
}
export const Left = ({ setShowChat }: { setShowChat: (show: boolean) => void }) => {
  const { tableInfo, tableId, sheetInfos, addDataToCurrentSheet, refreshTableInfo } = useSuperChatRoomContext()
  const [filterList, setFilterList] = useState<CDEFormConfigItem[]>([])
  const dispatch = useAppDispatch()
  const reduxFilterCategories = useSelector(selectFilterCategories)

  // const { cdeFilter } = useCdeContext()

  const [CDEModal, contextHolder] = useCDEModal()
  useEffect(() => {
    dispatch(fetchFilterCategories())
  }, [dispatch])

  const showCDEModal = () => {
    postPointBuried('922604570292')
    CDEModal.show({
      initialValues: tableInfo?.cdeFilter as CDEFormBizValues[],
      tableId,
      sheetId: sheetInfos?.[0]?.sheetId.toString(),
      onOk: (sheetInfos) => {
        refreshTableInfo?.()
        // @ts-expect-error ttt
        addDataToCurrentSheet('bottom')(sheetInfos)
        CDEModal.hide()
        dispatch(fetchPoints())
      },
    })
  }

  useEffect(() => {
    // 将reduxFilterCategories里面的配置平铺并按照MOCK存在的itemId进行筛选
    const flatList = reduxFilterCategories?.flatMap((item) => item.newFilterItemList)
    const filteredList = flatList?.filter(
      (item) => item && tableInfo?.cdeFilter.some((res) => res.itemId === item.itemId)
    )

    if (!filteredList) {
      setFilterList([])
      return
    }

    // 根据 itemId 去重，保留最后一次出现的元素
    const uniqueMap = new Map()
    filteredList.forEach((item) => {
      if (item && item.itemId) {
        uniqueMap.set(item.itemId, item)
      }
    })
    const uniqueList = Array.from(uniqueMap.values())

    setFilterList(uniqueList as CDEFormConfigItem[])
  }, [reduxFilterCategories, tableInfo?.cdeFilter])

  return (
    <>
      <div className={styles[`${PREFIX}-container`]}>
        <div className={styles[`${PREFIX}-container-home`]}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AliceLogo style={{ marginInlineEnd: 8 }} width={28} height={28} />
            <span style={{ fontSize: 14, color: 'var(--basic-6)' }}>{STRINGS.TITLE}</span>
          </div>
          <Tooltip title={STRINGS.HIDE_LEFT} placement="left">
            {/* @ts-expect-error wind-icon */}
            <Button icon={<DoubleLeftO />} onClick={() => setShowChat?.(false)} type="text" />
          </Tooltip>
        </div>

        <div className={styles[`${PREFIX}-container-header`]}>
          <Button
            className={styles[`${PREFIX}-container-header-button`]}
            // @ts-expect-error wind-ui
            icon={<PlusO />}
            size="large"
            onClick={() => showCDEModal()}
          >
            {STRINGS.ADD_FILTER_CONDITION}
          </Button>
        </div>
        <div className={styles[`${PREFIX}-container-content`]} onClick={() => showCDEModal()}>
          <FilterDisplay config={filterList} initialValues={tableInfo?.cdeFilter as CDEFormBizValues[]} />
        </div>
      </div>
      {contextHolder}
    </>
  )
}
