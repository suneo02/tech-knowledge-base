import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef } from 'react'
import { FilterForm, FilterFormRef } from '../components/FilterForm'
import { comprehensiveMockConfig, comprehensiveInitialValues } from '../components/FilterForm/config/comprehensiveMock'
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
} from '../components/FilterForm/config/mock'
import { fn } from '@storybook/test'

const meta: Meta<typeof FilterForm> = {
  title: 'Components/FilterForm',
  component: FilterForm,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof meta>

const InteractiveFilterForm = () => {
  const formRef = useRef<FilterFormRef>(null)

  const handleGetValues = () => {
    if (formRef.current) {
      const submissionValues = formRef.current.getSubmissionValues()
      const displayValues = formRef.current.getDisplayValues()
      console.log('Submission Values:', submissionValues)
      alert('已打印到 Console, Submission Values: ' + JSON.stringify(submissionValues))
      console.log('Display Values:', displayValues)
    }
  }

  return (
    <div>
      <FilterForm ref={formRef} config={mockFilterConfig} />
    </div>
  )
}

export const Default: Story = {
  render: () => <InteractiveFilterForm />,
}

export const WithInitialValues: Story = {
  args: {
    config: mockFilterConfig,
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-搜索',
}

export const AreaValues: Story = {
  args: {
    config: mockAreaFilterConfig,
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-地区',
}

export const IndustryValues: Story = {
  args: {
    config: mockIndustryFilterConfig,
    onValuesChange: fn(),
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
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-基础',
}

export const RelationValues: Story = {
  args: {
    config: mockRelationFilterConfig,
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-关联',
}

export const BuildValues: Story = {
  args: {
    config: mockBuildFilterConfig,
    onValuesChange: fn(),
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
    onValuesChange: fn(),
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
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-知识产权',
}

export const MediaValues: Story = {
  args: {
    config: mockMediaFilterConfig,
  },
  name: '企业数据浏览器-媒体账号',
}

export const BidValues: Story = {
  args: {
    config: mockBidFilterConfig,
    onValuesChange: fn(),
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
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-榜单名录',
}

export const RiskValues: Story = {
  args: {
    config: mockRiskFilterConfig,
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '企业数据浏览器-风险',
}

export const ComprehensiveTest: Story = {
  args: {
    config: comprehensiveMockConfig,
    initialValues: comprehensiveInitialValues,
    onValuesChange: fn(),
    onFinish: fn(),
  },
  name: '最全面测试用例',
}
