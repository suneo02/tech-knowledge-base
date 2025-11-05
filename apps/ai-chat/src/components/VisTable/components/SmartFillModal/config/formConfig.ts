import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import { FieldConfig } from '../components/ConfigurableForm'
import { InputField } from '../types'
import { AiModelEnum } from 'gel-api'

export enum RunTypeEnum {
  RUN_TOP_10 = '10',
  RUN_ALL = 'all',
  SAVE_BUT_NOT_RUN = 'save',
}

const defaultFieldConfigs: FieldConfig[] = [
  {
    name: 'aiModel',
    type: 'select',
    required: true,
    options: [
      { label: '大语言模型  Alice', value: AiModelEnum.ALICE },
      // { label: '大语言模型  DeepseekV3.0', value: AiModelEnum.DEEPSEEK_V3 },
    ],
    placeholder: '请选择模型',
    group: '模型',
    runType: RunTypeEnum.RUN_ALL,
  },
]

/**
 * 获取表单字段配置
 * @returns 表单字段配置数组
 */
export const getFormFieldConfigs = (): FieldConfig[] => {
  return [
    ...defaultFieldConfigs,
    {
      name: 'prompt',
      type: 'mentions',
      required: true,
      placeholder: '输入@引用列',
      description: '输入@引用列，模型会根据列名生成提示语',
      rows: 8,
      group: '提示语',
    },
    {
      name: 'enableLinkTool',
      label: '联网提取网页数据',
      type: 'switch',
      description: '协助整理网页公开信息，提升效率。',
      credits: 5,
      // group: '工具',
    },
    {
      name: 'enableWindBrowser',
      label: 'Wind资讯浏览',
      type: 'switch',
      description: '了解企业动态与行业资讯，提供参考。',
      // group: '工具',
    },
    {
      name: 'enableWindDPU',
      label: 'Wind数据查询',
      type: 'switch',
      description: '查看企业与行业数据，支持分析参考。',
      // group: '工具',
    },
    {
      name: 'runType',
      options: [
        { label: '运行前10条(敬请期待)', value: RunTypeEnum.RUN_TOP_10, disabled: true },
        { label: '全部运行', value: RunTypeEnum.RUN_ALL },
        { label: '保存但不运行', value: RunTypeEnum.SAVE_BUT_NOT_RUN },
      ],
      // label: '联网提取网页数据',
      type: 'radio',
      group: '运行选择',
    },
    // {
    //   name: 'enableAutoUpdate',
    //   label: '自动更新',
    //   type: 'switch',
    //   description: '注意：当数据更新时将自动扣除积分',
    //   descriptionColor: 'red',
    //   group: '更新设置',
    // },
  ]
}

export const getReadOnlyFieldConfigs = (inputFields: InputField[], columns: ExtendedColumnDefine[]): FieldConfig[] => {
  return inputFields.length > 0
    ? [
        ...defaultFieldConfigs.map((config) => ({
          ...config,
          disabled: true,
        })),

        ...getInputFieldMappingConfigs(inputFields, columns),
        {
          name: 'enableLinkTool',
          label: '联网提取网页数据',
          type: 'switch',
          description: '如果关闭此选项我们将基于万得全球企业库的数据为您生成答案',
          disabled: true,
          // group: '工具',
        },
        {
          name: 'enableWindBrowser',
          label: 'Wind资讯浏览',
          type: 'switch',
          description: '了解企业动态与行业资讯，提供参考。',
          disabled: true,
          // group: '工具',
        },
        {
          name: 'enableWindDPU',
          label: 'Wind数据查询',
          type: 'switch',
          description: '查看企业与行业数据，支持分析参考。',
          disabled: true,
          // group: '工具',
        },
      ]
    : []
}

/**
 * 获取输入字段映射配置
 * @param inputFields 输入字段配置
 * @returns 输入字段映射的表单字段配置数组
 */
export const getInputFieldMappingConfigs = (
  inputFields: InputField[],
  columns: ExtendedColumnDefine[]
): FieldConfig[] => {
  console.log('🚀 ~ getInputFieldMappingConfigs:', columns)
  return inputFields.map(({ title, required, placeholder, description }) => ({
    name: `mapping_${title}`,
    label: title,
    type: 'select',
    placeholder,
    description,
    required: required,
    options: columns.map((col) => ({ label: col.title, value: col.field, icon: col.headerIcon })),
    group: '请选择一列用于提示语填充',
  }))
}
