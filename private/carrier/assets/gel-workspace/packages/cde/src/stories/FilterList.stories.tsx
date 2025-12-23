import { CDEFilterItemUser } from '@/types'
import { Meta, StoryObj } from '@storybook/react'
import { Button, Card } from '@wind/wind-ui'

import { useState } from 'react'
import { filterCfg } from './mock/filterCfg'

import { CDEFilterCfgProvider, MeasuresProvider, useCDEFilterCfgCtx } from '@/ctx'
import { CDEFilterList, useCDEFilterList } from '@/FilterList'
import { CDEMeasureDefaultForSL } from '@/FilterRes'
import { getCDEFiltersTextUtil } from '@/handle'
import { ApiCodeForWfc } from 'gel-api'

// Mock getFilterItemById function for stories

// 创建一个装饰器组件来管理 CDEFilterPanel 的状态
const FilterCategoryPanelDecorator: Meta<typeof CDEFilterList>['decorators'] = (Story, context) => {
  const ref = useCDEFilterList()

  const [filters, setFilters] = useState<CDEFilterItemUser[]>([])
  const { getFilterItemById, codeMap } = useCDEFilterCfgCtx()

  return (
    <div style={{ width: '800px' }}>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button
            onClick={() => {
              ref.resetFilters()
            }}
          >
            重置筛选
          </Button>
        </div>
        <div>
          <h4>当前筛选条件：</h4>
          <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(filters, null, 2)}
            <br />
            {getCDEFiltersTextUtil(filters, getFilterItemById, codeMap)}
          </pre>
        </div>
      </Card>
      <Story
        args={{
          style: {
            minHeight: '400px',
            minWidth: '800px',
          },
          ...context.args,
          ref: ref.getCurrent(),
          onFilterChange: setFilters,
        }}
      />
    </div>
  )
}

const meta: Meta<typeof CDEFilterList> = {
  title: 'panel/FilterList',
  component: CDEFilterList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    FilterCategoryPanelDecorator,
    (Story, context) => {
      return (
        <CDEFilterCfgProvider filterCfgDefault={filterCfg}>
          <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
            <Story args={context.args} />
          </MeasuresProvider>
        </CDEFilterCfgProvider>
      )
    },
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CDEFilterList>

// 空状态 - 无关键词
export const Empty: Story = {
  args: {},
}

export const SearchFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[0],
    initialFilters: [
      {
        title: '企业名称',
        itemId: 1,
        logic: 'any',
        field: 'corp_name',
        value: ['小米'],
      },
    ],
  },
}

export const RegionFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[1],
  },
}

export const IndustryFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[2],
  },
}

export const XXIndustryFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[3],
  },
}

export const BaseInfoFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[4],
  },
}

// 构成关系
export const ConstructRelationFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[5],
  },
}

// 企业发展
export const EnterpriseDevelopmentFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[6],
  },
}

// 资质许可
export const QualificationFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[7],
  },
}

// 知识产权
export const IntellectualPropertyFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[8],
  },
}

// 媒体账号
export const MediaAccountFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[9],
  },
}

// 招投标
export const TenderFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[10],
  },
}

// 榜单名录
export const ListFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[11],
    initialFilters: [
      {
        title: '科技型企业名录',
        itemId: 138,
        logic: 'any',
        field: 'corpListDetailQueryLogic',
        value: [
          {
            label: '高新技术企业',
            objectName: '高新技术企业',
            value: '2010202098|108020101',
            objectId: '2010202098|108020101',
            certYear: 0,
            id: '2010202098|108020101',
            name: '高新技术企业',
            validDate: 1,
          },
        ],
      },
    ],
    getCorpListPresearch: async () => {
      return {
        ErrorCode: ApiCodeForWfc.SUCCESS,
        ErrorMessage: 'success',
        status: '200',
        Page: {
          CurrentPage: 1,
          PageSize: 10,
          Records: 10,
          TotalPage: 1,
        },
        Data: [
          {
            _score: 0,
            category: '科技型企业名录',
            objectId: '2010202471',
            objectName: '专精特新中小企业',
            priority: 0,
            showOriginalName: false,
            type: 'list',
            updatefreq: 0,
          },
          {
            _score: 0,
            category: '科技型企业名录',
            objectId: '2010100370',
            objectName: '专精特新小巨人企业',
            priority: 0,
            showOriginalName: false,
            type: 'list',
            updatefreq: 0,
          },
          {
            _score: 0,
            category: '科技型企业名录',
            objectId: '2010202505',
            objectName: '重点专精特新小巨人企业',
            priority: 0,
            showOriginalName: false,
            type: 'list',
            updatefreq: 0,
          },
          {
            _score: 0,
            category: '科技型企业名录',
            objectId: '2010202470',
            objectName: '科技型中小企业',
            priority: 0,
            showOriginalName: false,
            type: 'list',
            updatefreq: 0,
          },
          {
            _score: 0,
            category: '科技型企业名录',
            objectId: '2010202479',
            objectName: '科技小巨人企业',
            priority: 0,
            showOriginalName: false,
            type: 'list',
            updatefreq: 0,
          },
        ],
      }
    },
  },
}

// 风险
export const RiskFilters: Story = {
  args: {
    currentFilterConfig: filterCfg[12],
  },
}
