import { MenuListItem } from '@visactor/vtable/es/ts-types'
import { MenuKey } from '../types/menuTypes'
import { Column, SourceTypeEnum } from 'gel-api'

// 菜单项配置
const getColumnMenuItems = (column?: Column): MenuListItem[] => {
  const { editor, initSourceType, isFrozen } = column || {}
  const items = [
    {
      text: '重命名列',
      // icon: { svg: deepthinkIcon },
      menuKey: MenuKey.COLUMN_RENAME,
      disabled: !editor,
    },
    {
      text: 'AI生成列',
      // icon: { svg: deepthinkIcon },
      menuKey: MenuKey.COLUMN_ADD_AI,
    },
    // {
    //   text: '编辑列',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: 'edit-column',
    //   children: [
    //     {
    //       text: '文本',
    //       menuKey: MenuKey.COLUMN_EDIT_TEXT,
    //     },
    //     {
    //       text: '日期',
    //       menuKey: MenuKey.COLUMN_EDIT_DATE,
    //     },
    //     {
    //       text: '数字',
    //       menuKey: MenuKey.COLUMN_EDIT_NUMBER,
    //     },
    //   ],
    // },
    {
      text: '编辑AI列',
      // icon: { svg: deepthinkIcon },
      menuKey: MenuKey.COLUMN_EDIT_AI,
      disabled: initSourceType !== SourceTypeEnum.AI_GENERATE_COLUMN,
    },
    {
      text: '运行列',
      // icon: { svg: deepthinkIcon },
      menuKey: 'run-column',
      disabled:
        !(
          initSourceType === SourceTypeEnum.CDE ||
          initSourceType === SourceTypeEnum.INDICATOR ||
          initSourceType === SourceTypeEnum.AI_CHAT ||
          initSourceType === SourceTypeEnum.AI_GENERATE_COLUMN
        ) || isFrozen,
      children: [
        {
          text: '运行待处理行',
          menuKey: MenuKey.COLUMN_RUN_PENDING,
        },
        {
          text: '运行全部',
          menuKey: MenuKey.COLUMN_RUN_ALL,
        },
      ],
    },
    // {
    //   text: '复制',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.COLUMN_COPY,
    // },
    // {
    //   text: '向左插入',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.COLUMN_INSERT_LEFT,
    // },
    // {
    //   text: '向右插入',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.COLUMN_INSERT_RIGHT,
    // },
    // {
    //   text: '筛选列',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.COLUMN_FILTER,
    // },
    // {
    //   text: '排序',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: 'sort-column',
    //   children: [
    //     {
    //       text: 'A-Z排序',
    //       menuKey: MenuKey.COLUMN_SORT_ASC,
    //     },
    //     {
    //       text: 'Z-A排序',
    //       menuKey: MenuKey.COLUMN_SORT_DESC,
    //     },
    //   ],
    // },
    // {
    //   text: '隐藏/显示',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.COLUMN_TOGGLE_DISPLAY,
    // },
    {
      text: '删除列',
      // icon: { svg: deepthinkIcon },
      menuKey: MenuKey.COLUMN_DELETE,
    },
  ]
  return items.filter((item) => !item.disabled)
}

const getCellMenuItems = (): MenuListItem[] => {
  return [
    // {
    //   text: '向上添加行',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.ROW_INSERT_ABOVE,
    // },
    // {
    //   text: '向下添加行',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.ROW_INSERT_BELOW,
    // },
    {
      text: '删除行',
      // icon: { svg: deepthinkIcon },
      menuKey: MenuKey.ROW_DELETE,
    },

    // {
    //   text: '添加到对话',
    //   icon: { svg: deepthinkIcon },
    //   menuKey: MenuKey.CHAT_ADD,
    // },
  ]
}

export { getColumnMenuItems, getCellMenuItems }
