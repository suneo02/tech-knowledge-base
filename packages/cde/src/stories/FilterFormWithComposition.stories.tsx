import { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import React, { useRef } from 'react'
import { FilterForm } from '../components/CdeForm'

import { Button } from 'antd'
import {
  mockAreaFilterConfig,
  mockBasicFilterConfig,
  mockBidFilterConfig,
  mockBuildFilterConfig,
  mockFeatureFilterConfig,
  mockFilterConfig,
  mockIndustryFilterConfig,
  mockIPFilterConfig,
  mockMediaFilterConfig,
  mockQualificationFilterConfig,
  mockRelationFilterConfig,
  mockRiskFilterConfig,
} from '../__mocks__/form/filterConfig.mock'

export default {
  title: 'Components/FilterForm_GEL_企业库',
  component: FilterForm,
  argTypes: {
    onFinish: { action: 'submitted' },
    onValuesChange: { action: 'values changed' },
    ref: { action: 'ref' },
  },
} as Meta<typeof FilterForm>

type Story = StoryObj<typeof FilterForm>

export const WithInitialValues: Story = {
  args: {
    config: mockFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: (values) => {
      console.log('onFinish', values)
    },
  },
  render: (args) => {
    const ref = useRef<any>(null)
    return (
      <div>
        <FilterForm {...args} ref={ref} />
        <div>
          <Button onClick={() => ref?.current?.resetFields()}>重置</Button>
          <Button onClick={() => ref?.current?.submit()}>提交</Button>
        </div>
      </div>
    )
  },
  name: '企业数据浏览器-搜索',
}

export const AreaValues: Story = {
  args: {
    config: mockAreaFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: (values) => {
      console.log('onFinish', values)
    },
    initialValues: [
      {
        field: 'data_from',
        itemId: 78,
        logic: 'any',
        title: '机构类型',
        value: ['298010000,298020000,298040000'],
      },
      {
        field: 'govlevel',
        itemId: 77,
        logic: 'any',
        title: '营业状态',
        value: ['存续'],
      },
      {
        itemId: 89,
        logic: 'prefix',
        value: ['03030101', '0301010117', '0301010110', '0301040105', '03010413'],
        title: '地区',
        field: 'area_code',
      },
    ],
  },
  name: '企业数据浏览器-地区',
}

export const IndustryValues: Story = {
  args: {
    config: mockIndustryFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-所属行业/产业',
}

export const BasicValues: Story = {
  args: {
    config: mockBasicFilterConfig,
    initialValues: {
      77: {
        value: ['存续'],
      },
      78: {
        value: ['298010000,298020000,298040000'],
      },
      '12': {
        value: '20250603-',
      },
      '37': {
        value: '-20250611',
      },
    },
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-基础',
}

export const RelationValues: Story = {
  args: {
    config: mockRelationFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-关联',
}

export const BuildValues: Story = {
  args: {
    config: mockBuildFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-企业发展',
}

export const QualificationValues: Story = {
  args: {
    config: mockQualificationFilterConfig,
    initialValues: {
      '22': {
        value: 'true',
      },
      '23': {
        value: [
          '912030001',
          '912030002',
          '912030003',
          '68886719',
          '68886720',
          '68886721',
          '68886722',
          '68886723',
          '68886724',
          '68886726',
        ],
      },
      '98': {
        value: 'true',
      },
      '99': {
        value: ['建筑资质1', '建筑资质2', '建筑资质3'],
      },
      '100': {
        value: 'true',
      },
      '104': {
        value: 'true',
      },
      '105': {
        value: ['7053813502', '7053813246'],
      },
      '113': {
        value: 'true',
      },
      '114': {
        value: '107002008',
      },
      '115': {
        value: '',
      },
      '134': {
        value: 'true',
      },
      '135': {
        value: '',
      },
      '137': {
        value: 'true',
      },
      '143': {
        value: 'true',
      },
      '144': {
        value: ['1', '2', '3', '4', '5'],
      },
      '145': {
        value: '20250612-20250623',
      },
      '153': {
        value: 'true',
      },
      '154': {
        value: 'true',
      },
      '155': {
        value: ['化妆品生产许可内容1', '化妆品生产许可内2'],
      },
      '156': {
        value: [
          'vehicleAppr',
          'saltAppr',
          '5GBaseStationAppr',
          'monitoringChemicalProductionAppr',
          'monitoringChemicalOperatingAppr',
          'produceVehicleCompanyAppr',
        ],
      },
      '157': {
        value: 'true',
      },
      '158': {
        value: 'true',
      },
      '159': {
        value: '',
      },
      '160': {
        value: 'false',
      },
      '161': {
        value: 'false',
      },
    },
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-资质许可',
}

export const IPValues: Story = {
  args: {
    config: mockIPFilterConfig,
    initialValues: {
      '24': {
        value: ['商标注册申请中'],
      },

      '28': {
        value: 'true',
      },
      '30': {
        value: [null, 1],
      },
    },
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-知识产权',
}

export const MediaValues: Story = {
  args: {
    config: mockMediaFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-媒体账号',
}

export const BidValues: Story = {
  args: {
    config: mockBidFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-招投标',
}

export const FeatureValues: Story = {
  args: {
    config: mockFeatureFilterConfig,
    initialValues: {
      138: {
        logic: 'all',

        value: [
          {
            objectName: '高新技术企业',
            objectId: '2010202098|108020101',
            certYear: 0,
            id: '2010202098|108020101',
            name: '高新技术企业',
            validDate: 1,
            objectDate: '20250603-',
          },
          {
            objectName: '科技小巨人企业',
            objectId: '2010202479|108020113',
            certYear: 1,
            id: '2010202479|108020113',
            name: '科技小巨人企业',
            validDate: 0,
            selfDefine: 0,
            itemOption: [],
          },
          {
            objectName: '科技型中小企业',
            objectId: '2010202470|108020102',
            certYear: 1,
            id: '2010202470|108020102',
            name: '科技型中小企业',
            validDate: 1,
            objectDate: '-20250605',
          },
          {
            objectName: '专精特新小巨人企业',
            objectId: '2010100370|108020119',
            certYear: 0,
            id: '2010100370|108020119',
            name: '专精特新小巨人企业',
            validDate: 1,
            objectDate: '20250602-20250606',
          },
        ],

        title: '科技型企业名录',
        field: 'corpListDetailQueryLogic',
      },
    },
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-榜单名录',
}

export const RiskValues: Story = {
  args: {
    config: mockRiskFilterConfig,
    onValuesChange: (values, allValues) => {
      console.log('onValuesChange', values, allValues)
    },
    onFinish: fn(),
  },
  name: '企业数据浏览器-风险',
}
