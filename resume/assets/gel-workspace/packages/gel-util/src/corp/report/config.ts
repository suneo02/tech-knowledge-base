import { isEn } from '@/intl'
import { TIntl } from '@/types/intl'
import { CorpBasicNum, CorpBasicNumStock } from 'gel-types'

export enum ECorpReport {
  EquityPenetrationSixLayer, // 股权穿透报告-6层
  EquityPenetrationTwelveLayer, // 股权穿透分析报告 12 层
  EquityPenetrationUnlimited, // 股权穿透 无限穿透报告
  EquityPenetrationAnalysisRP, // 股权穿透分析报告

  CorpCreditRP, // 企业信用报告
  /**
   * @deprecated
   */
  CorpKYCRP, // 企业 KYC 报告
  InvestmentPenetrationRP, // 投资穿透报告
  RelatedPartyRP, // 关联方认定
  InnovationCapabilityRP, // 科创能力报告
  DDRP, // 尽职调查 报告
}

export const getCompanyReportConfig = (
  t: TIntl
): Record<
  ECorpReport,
  {
    pdfCmd?: string // 下载 cmd
    type?: string // 兼容旧代码
    demoFileId?: number // 下载演示文件的 id
    ifSvip?: boolean // 是否需要 svip
    title: string
    tips: string
    downModuleId?: number // 下载该报告的埋点
    sampleBuryId?: number // 查看样例报告的埋点
    modelNum?: keyof CorpBasicNum | keyof CorpBasicNumStock
    sampleFileName?: string
    sampleFilePath?: string
  }
> => {
  return {
    [ECorpReport.EquityPenetrationSixLayer]: {
      pdfCmd: 'createtrackdoctask',
      type: 'share',
      downModuleId: 922602101012,
      sampleBuryId: 922602101011,
      demoFileId: 1173319566,
      modelNum: 'shareHolderTree',
      title: t('437158', '股权穿透报告Excel版'),
      tips: t('397318', '深度核查股东结构，表格展示层级和链路更清晰，默认6层股东穿透'),
    },
    [ECorpReport.EquityPenetrationTwelveLayer]: {
      pdfCmd: 'download/createtask/tracingStockLevel',
      title: t('390314', '股权穿透报告-12层'),
      tips: t('397320', '层层挖掘股东信息，默认12层股东穿透'),
      modelNum: 'shareHolderTree',
      sampleFileName: '小米科技有限责任公司-股权穿透报告-12层.xlsx',
      sampleFilePath: 'EquityPenetrationTwelveLayerSample.xlsx',
    },
    [ECorpReport.EquityPenetrationUnlimited]: {
      title: isEn() ? t('222470', '股权穿透报告') + ' - Super ' : '股权穿透报告 - 无限穿透',
      tips: t('349577', '无限穿透股东信息，应穿尽穿，一穿到底'),
    },
    [ECorpReport.CorpCreditRP]: {
      pdfCmd: 'createcorppdf',
      title: t('338873', '企业深度信用报告'),
      tips: t('349573', '全维度呈现企业信用信息'),
      downModuleId: 922602101009,
      sampleBuryId: 922602101008,
    },
    [ECorpReport.EquityPenetrationAnalysisRP]: {
      pdfCmd: 'createsharepdf',
      title: t('224217', '股权穿透分析报告'),
      tips: t('438535', '层层挖掘企业股东信息，默认6层股东穿透'),
      modelNum: 'shareHolderTree',
      downModuleId: 922602101014,
      sampleBuryId: 922602101013,
    },
    [ECorpReport.CorpKYCRP]: {
      title: '企业 KYC 报告',
      tips: '',
      pdfCmd: 'createmarketguidetask',
    },
    [ECorpReport.InvestmentPenetrationRP]: {
      pdfCmd: 'createtrackdoctask',
      modelNum: 'foreign_invest_num',
      title: t('390315', '投资穿透报告Excel版'),
      tips: t('390335', '深度投资穿透，表格展示层级和链路，默认6层投资穿透'),
      downModuleId: 922602101016,
      sampleBuryId: 922602101015,
    },
    [ECorpReport.RelatedPartyRP]: {
      pdfCmd: 'createiporelationdoc',
      title: t('390334', '关联方认定报告'),
      tips: t('390336', '依据最新法律法规，深度探查企业关联关系'),
      downModuleId: 922602101018,
      sampleBuryId: 922602101017,
    },

    [ECorpReport.InnovationCapabilityRP]: {
      pdfCmd: 'download/createtask/technologicalScore',
      title: t('390313', '科创能力报告'),
      tips: t('399478', '根据企业基本信息、金融行为、知识产权等综合评估企业的科技创新能力'),
      ifSvip: true,
      modelNum: 'technologicalInnovationCount',
      downModuleId: 922602101127,
      sampleBuryId: 922602101128,
    },
    [ECorpReport.DDRP]: {
      title: t('391693', '尽职调查报告-在线编辑'),
      tips: t('397319', '全面深度开展企业尽调，支持在线预览和自定义尽调报告章节顺序及财务数据 告章节顺序及财务数据'),
    },
  }
}
