import { BaiFenSites, jumpToRimeUrl, jumpToWindUrl, RimeTargetType, WindType } from '@/handle/link'

export const industry = [
  [
    {
      title: 'WIND行业',
      dataIndex: 'windIndustry',
      enTitle: 'WIND Industry',
      download: {
        fileName: 'Wind全球行业分类标准（2024版）.pdf',
        filePath: 'Wind-Global-Industry-Classification-Standard(2024Edition).pdf',
      },
    },
  ],
  [
    {
      title: 'WIND产业链',
      dataIndex: 'windIndustryChain',
      enTitle: 'WIND Industry Chain',
      onClick: () => {
        jumpToWindUrl({ type: WindType.IndustrialChainHome })
      },
      cellOnClick: (cellData) => {
        jumpToWindUrl({ type: WindType.IndustrialChainDetail, id: cellData.id })
      },
    },
  ],

  [
    {
      title: '战略性新兴产业',
      dataIndex: 'strategicEmergingIndustry',
      enTitle: 'Strategic Emerging Industry',
      download: {
        fileName: '战略性新兴产业分类（2018）.doc',
        filePath: 'ClassificationOfStrategicEmergingIndustries(2018).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().strategicIndustries)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().strategicIndustries, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '高技术产业（制造业）',
      dataIndex: 'highTechManufacturing',
      enTitle: 'Hightech Manufacturing Industry',
      download: {
        fileName: '高技术产业（制造业）分类（2017）.doc',
        filePath: 'ClassificationOfHighTechIndustries(Manufacturing)(2017).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().highTechManufacturing)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().highTechManufacturing, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '高技术产业（服务业）',
      dataIndex: 'highTechService',
      enTitle: 'Hightech Service Industry',
      download: {
        fileName: '高技术产业（服务业）分类（2018）.doc',
        filePath: 'ClassificationOfHighTechIndustries(Services)(2018).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().highTechService)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().highTechService, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '知识产权（专利）密集型产业',
      dataIndex: 'intellectualPropertyIndustry',
      enTitle: 'Intellectual Property(IP)-Intensive Industries',
      download: {
        fileName: '知识产权（专利）密集型产业统计分类（2019）.doc',
        filePath: 'StatisticalClassificationOfIntellectualProperty(Patent)IntensiveIndustries(2019).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().intellectualPropertyIndustry)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().intellectualPropertyIndustry, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '绿色低碳转型产业',
      dataIndex: 'greenLowCarbonIndustry',
      enTitle: 'EcoShift Enterprise Search',
      download: {
        fileName: '绿色低碳转型产业指导目录（2024年版）.pdf',
        filePath: 'GuidanceCatalogueForGreenAndLowCarbonTransitionIndustries(2024Edition).pdf',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().greenLowCarbonIndustry)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().greenLowCarbonIndustry, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '农业及相关产业',
      dataIndex: 'agricultureRelatedIndustry',
      enTitle: 'Agriculture and Related Industries',
      download: {
        fileName: '农业及相关产业统计分类（2020）.doc',
        filePath: 'StatisticalClassificationOfAgricultureAndRelatedIndustries(2020).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().agricultureRelatedIndustry)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().agricultureRelatedIndustry, { nodeId: cellData.id })
      },
    },
  ],
  [
    {
      title: '养老产业',
      dataIndex: 'elderlyIndustry',
      enTitle: 'Aging Industry',
      download: {
        fileName: '养老产业统计分类（2020）.docx',
        filePath: 'StatisticalClassificationOfElderlyCareIndustry(2020).docx',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().elderlyIndustry)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().elderlyIndustry, { nodeId: cellData.id })
      },
    },
  ],

  [
    {
      title: '数字经济及其核心产业',
      dataIndex: 'digitalEconomyIndustry',
      enTitle: 'Digital Economy Core Industry',
      download: {
        fileName: '数字经济及核心产业统计分类（2021）.docx',
        filePath: 'StatisticalClassificationOfDigitalEconomyAndCoreIndustries(2021).doc',
      },
      onClick: () => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().digitalEconomyIndustry)
      },
      cellOnClick: (cellData) => {
        BaiFenSites().jumpToBaiFenUrl(BaiFenSites().digitalEconomyIndustry, { nodeId: cellData.id })
      },
    },
  ],
  [
    {
      title: '来觅赛道',
      enTitle: 'Rime Track',
      dataIndex: 'laimiTrack',
      onClick: () => {
        jumpToRimeUrl({ type: RimeTargetType.VERTICAL_HOME })
      },
      cellOnClick: (cellData) => {
        jumpToRimeUrl({ type: RimeTargetType.VERTICAL, id: cellData.id })
      },
    },
  ],
]
