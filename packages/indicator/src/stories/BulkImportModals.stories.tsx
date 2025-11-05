import { axiosInstanceClient } from '@/apiClient'
import { transformIndicatorImportData } from '@/BulkImport'
import { IndicatorProvider } from '@/ctx/indicatorCfg'
import { Meta, StoryObj } from '@storybook/react'

import { ApiCodeForWfc, createSuperlistRequestWithAxios, IndicatorCorpMatchItem } from 'gel-api'

import { IndicatorBulkImportData } from '../BulkImport/FileUpload/utils'
import { BulkImportModals } from '../BulkImport/modal'
import { corpMatchMockFromFile, corpMatchMockFromText } from './mock/corpMatchMock'
import { corpSearchMock } from './mock/searchMock'

// 生成匹配数据的辅助函数
const generateMatchData = (matchPatterns: boolean[]) => {
  const companyMatchList = matchPatterns.map((isMatched, index) => ({
    queryText: isMatched ? `91100000710935038${index}` : `未匹配公司${index}`,
    corpId: isMatched ? `10576236${index}` : null,
    corpName: isMatched ? `测试公司${index}` : null,
    engName: isMatched ? `Test Company ${index}` : null,
    creditCode: isMatched ? `91100000710935038${index}` : null,
    artificialPerson: isMatched ? '张三' : null,
    formerName: null,
    source: isMatched ? 1 : null,
    matched: isMatched ? 1 : 0,
  }))

  const successNum = matchPatterns.filter(Boolean).length
  const errorNum = matchPatterns.length - successNum

  return {
    companyMatchList,
    successNum,
    errorNum,
    cnNum: successNum,
    hongkongNum: 0,
    twNum: 0,
  }
}

// 生成API响应的辅助函数
const generateApiResponse = (matchPatterns: boolean[]) => ({
  Data: generateMatchData(matchPatterns),
  ErrorCode: ApiCodeForWfc.SUCCESS,
  ErrorMessage: '',
  status: '200',
  Page: {
    CurrentPage: 1,
    PageSize: 10,
    Records: matchPatterns.length,
    TotalPage: 1,
  },
})

const defaultArgs = {
  open: true,
  handleOk: (data: IndicatorCorpMatchItem[], excelData?: IndicatorBulkImportData[]) => {
    console.log('Matched companies:', data)
    console.log('Excel data:', excelData)
    console.log('transformed', transformIndicatorImportData(data, excelData))
  },
  handleCancel: () => {
    console.log('Modal cancelled')
  },
  isEn: false,
  searchCompanies: corpSearchMock,
}

const meta: Meta<typeof BulkImportModals> = {
  title: 'BulkImport/BulkImportModals',
  component: BulkImportModals,
  decorators: [
    (Story) => (
      <IndicatorProvider>
        <Story />
      </IndicatorProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof BulkImportModals>

// 全部匹配成功的场景
export const AllMatchSuccess: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([true, true, true, true, true]),
  },
}

// 全部匹配失败的场景
export const AllMatchFailed: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([false, false, false, false, false]),
  },
}

// 第一个匹配成功，之后的匹配失败
export const FirstSuccessOthersFailed: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([true, false, false, false, false]),
  },
}

// 第一个匹配失败，之后的匹配成功
export const FirstFailedOthersSuccess: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([false, true, true, true, true]),
  },
}

// 中间的匹配成功，开始和结束匹配失败
export const MiddleSuccessEdgesFailed: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([false, true, true, true, false]),
  },
}

// 中间的匹配失败，开始和结束匹配成功
export const MiddleFailedEdgesSuccess: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse([true, false, false, false, true]),
  },
}

// 大量数据
export const LargeData: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => generateApiResponse(Array(200).fill(true)),
  },
}

export const FromText: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => ({
      Data: corpMatchMockFromText,
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMessage: '',
      status: '200',
      Page: {
        CurrentPage: 1,
        PageSize: 10,
        Records: corpMatchMockFromText.companyMatchList.length,
        TotalPage: 1,
      },
    }),
  },
}

export const FromFile: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: async () => ({
      Data: corpMatchMockFromFile,
      ErrorCode: ApiCodeForWfc.SUCCESS,
      ErrorMessage: '',
      status: '200',
      Page: {
        CurrentPage: 1,
        PageSize: 10,
        Records: corpMatchMockFromFile.companyMatchList.length,
        TotalPage: 1,
      },
    }),
  },
}

export const ProdRequest: Story = {
  args: {
    ...defaultArgs,
    matchCompanies: createSuperlistRequestWithAxios(axiosInstanceClient, 'company/match'),
    searchCompanies: createSuperlistRequestWithAxios(axiosInstanceClient, 'company/search'),
  },
}
