import { register, TYPES } from '@visactor/vtable'
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors'
import {
  addIcon,
  aiIcon,
  chatIcon,
  companyIcon,
  dropdownIcon,
  editIcon,
  indexIcon,
  runIcon,
  userIcon,
} from '../../config'
import { IconTypeEnum } from '../../types/iconTypes'

export const useRegister = () => {
  // 注册图标
  const registerIcon = () => {
    register.icon(IconTypeEnum.AI, {
      type: 'svg',
      svg: aiIcon,
      width: 18,
      height: 18,
      name: IconTypeEnum.AI,
      positionType: TYPES.IconPosition.left,
      marginRight: 4,
    })
    register.icon(IconTypeEnum.COMPANY, {
      type: 'svg',
      svg: companyIcon,
      width: 20,
      height: 20,
      name: IconTypeEnum.COMPANY,
      positionType: TYPES.IconPosition.left,
      marginRight: 4,
      tooltip: {
        title: '列数据源：企业数据浏览器',
      },
    })
    register.icon(IconTypeEnum.AI_CHAT, {
      type: 'svg',
      svg: chatIcon,
      width: 16,
      height: 16,
      name: IconTypeEnum.AI_CHAT,
      positionType: TYPES.IconPosition.left,
      marginRight: 4,
      tooltip: {
        title: '列数据源：AI对话',
      },
    })
    register.icon(IconTypeEnum.USER, {
      type: 'svg',
      svg: userIcon,
      width: 16,
      height: 16,
      name: IconTypeEnum.USER,
      positionType: TYPES.IconPosition.left,
      marginRight: 4,
      tooltip: {
        title: '列数据源：用户',
      },
    })

    register.icon('dropdownIcon', {
      name: 'dropdown',
      type: 'svg',
      positionType: TYPES.IconPosition.right,
      funcType: TYPES.IconFuncTypeEnum.dropDown,
      width: 18,
      height: 18,
      svg: dropdownIcon,
      marginLeft: 10,
    })
    register.icon(IconTypeEnum.EDIT, {
      type: 'svg',
      svg: editIcon,
      width: 12,
      height: 12,
      name: IconTypeEnum.EDIT,
      positionType: TYPES.IconPosition.absoluteRight,
      visibleTime: 'mouseenter_cell',
    })
    register.icon(IconTypeEnum.RUN, {
      type: 'svg',
      svg: runIcon,
      width: 18,
      height: 18,
      name: IconTypeEnum.RUN,
      positionType: TYPES.IconPosition.absoluteRight,
      visibleTime: 'mouseenter_cell',
      cursor: 'pointer',
    })
    register.icon(IconTypeEnum.ADD, {
      type: 'svg',
      svg: addIcon,
      width: 18,
      height: 18,
      name: IconTypeEnum.ADD,
      cursor: 'pointer',
      positionType: TYPES.IconPosition.inlineFront,
      // tooltip: {
      //   title: '添加一列至末尾',
      // },
    })
    register.icon(IconTypeEnum.INDEX, {
      type: 'svg',
      svg: indexIcon,
      width: 16,
      height: 16,
      name: IconTypeEnum.INDEX,
      positionType: TYPES.IconPosition.left,
      marginRight: 4,
      tooltip: {
        title: '列数据源：指标',
      },
    })
  }
  // 注册编辑器
  const registerEditors = () => {
    const inputEditor = new InputEditor()
    const textareaEditor = new TextAreaEditor()
    const dateInputEditor = new DateInputEditor()
    const listEditor = new ListEditor({ values: ['女', '男'] })

    register.editor('input', inputEditor)
    register.editor('textarea', textareaEditor)
    register.editor('date', dateInputEditor)
    register.editor('select', listEditor)
  }
  useEffect(() => {
    registerIcon()
    registerEditors()
  }, [])
}
