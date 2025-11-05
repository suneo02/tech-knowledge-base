import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import { FilterForm } from '../components/FilterForm'
import Select from '../components/FilterForm/FilterItem/basic/Select'
import TagsInput from '../components/FilterForm/FilterItem/basic/TagsInput'
import { registerComponent } from '../components/FilterForm/types'

// Register basic components needed for the composite filter
registerComponent('tagsInput', TagsInput)
registerComponent('select', Select)

// This mock represents the raw configuration received from the backend.
const mockApiResponse = {
  categoryType: '3',
  categoryOrder: 1,
  category: '所属行业/产业',
  categoryId: '3',
  newFilterItemList: [
    {
      itemId: 213,
      itemType: '10',
      itemName: '战略性新兴产业',
      extraOptions: [
        {
          label: '置信度：严',
          value: 'strict',
        },
        {
          label: '置信度：较严',
          value: 'moderate',
        },
        {
          label: '置信度：宽',
          value: 'lenient',
        },
      ],
      selfDefine: 0,
      itemOption: [],
      confidence: 'lenient',
      itemField: 'strategicNewIndustry',
      logicOption: 'any',
      hasExtra: false,
      parentId: 0,
      isVip: 0,
    },
    {
      itemId: 90,
      itemType: 'logicalKeywordFilter',
      itemName: '国民经济行业分类',
      selfDefine: 0,
      itemOption: [],
      itemField: 'industry_code',
      logicOption: 'prefix',
      hasExtra: false,
      parentId: 0,
      isVip: 0,
    },
    {
      itemId: 222,
      itemType: '0',
      itemName: '高技术产业（制造业）',
      selfDefine: 0,
      itemOption: [],
      itemField: 'highTechManufacturingIndustry',
      logicOption: 'any',
      hasExtra: false,
      parentId: 0,
      isVip: 1,
    },
    {
      itemId: 223,
      itemType: '10',
      itemName: '高技术产业（服务业）',
      extraOptions: [
        {
          label: '置信度：严',
          value: 'strict',
        },
        {
          label: '置信度：较严',
          value: 'moderate',
        },
      ],
      selfDefine: 0,
      itemOption: [],
      confidence: 'moderate',
      itemField: 'highTechServiceIndustry',
      logicOption: 'any',
      hasExtra: false,
      parentId: 0,
      isVip: 1,
    },
  ],
}

// This represents the type of a single item from the backend's newFilterItemList.
interface BackendFilterItem {
  itemId: number
  itemType: string
  itemName: string
  extraOptions?: Array<{ label: string; value: string }>
  [key: string]: any
}

export default {
  title: 'Components/FilterForm_GEL_企业库',
  component: FilterForm,
  argTypes: {
    onFinish: { action: 'submitted' },
    onValuesChange: { action: 'values changed' },
  },
} as Meta

const Template: StoryFn = (args) => <FilterForm {...args} config={mockApiResponse.newFilterItemList} />

export const FromCompositionMap = Template.bind({})
FromCompositionMap.args = {
  initialValues: {
    '213': {
      confidence: 'lenient',
      value: [['33701591905']],
      // value: ['tag1', 'tag2'],
    },
    '90': {
      logic: 'any',
      value: ['keyword1'],
    },
    '222': {
      value: ['a basic input'],
    },
  },
}
FromCompositionMap.storyName = '置信度'
