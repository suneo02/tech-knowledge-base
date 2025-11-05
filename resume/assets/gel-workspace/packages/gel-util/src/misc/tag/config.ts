import { t } from 'i18next'
import { TagsModule } from './module'
import { TagColors, TagSizes, TagTypes } from './type'

export const TagCfgByModuleMap: Partial<
  Record<
    TagsModule,
    {
      color: TagColors
      type: TagTypes
      size?: TagSizes
      // 标签固定展示的内容
      content?: string
    }
  >
> = {
  [TagsModule.COMPANY]: {
    color: 'color-2',
    type: 'primary',
  },
  [TagsModule.COMPANY_PRODUCT]: {
    color: 'color-1',
    type: 'primary',
  },
  [TagsModule.FEATURE_COMPANY]: {
    color: 'color-2',
    type: 'primary',
  },
  [TagsModule.STOCK]: {
    color: 'color-2',
    type: 'primary',
  },
  [TagsModule.GROUP]: {
    color: 'color-2',
    type: 'primary',
  },

  [TagsModule.RISK]: {
    color: 'color-4',
    type: 'primary',
  },
  [TagsModule.RANK_DICT]: {
    color: 'color-5',
    type: 'primary',
  },
  [TagsModule.ULTIMATE_BENEFICIARY]: {
    color: 'color-3',
    type: 'primary',
    size: 'mini',
    content: t('138180', '最终受益人'),
  },
  [TagsModule.ACTUAL_CONTROLLER]: {
    color: 'color-2',
    type: 'primary',
    size: 'mini',
  },
  [TagsModule.RELATED_PARTY]: {
    color: 'color-1',
    type: 'primary',
    size: 'mini',
  },
  [TagsModule.IS_CHANGE_NAME]: {
    color: 'color-3',
    type: 'primary',
    size: 'mini',
    content: t('349497', '已更名'),
  },
  [TagsModule.TENDER_WINNER]: {
    color: 'color-2',
    type: 'primary',
    size: 'mini',
    content: t('257676', '中标'),
  },
  [TagsModule.TENDER_LOSER]: {
    color: 'color-3',
    type: 'primary',
    size: 'mini',
    // TODO
    content: t('454814', '未中标'),
  },
}
