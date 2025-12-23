import { IBuryPointConfig } from '@/api/pointBuried/config/type.ts'
import { PageModuleEnum } from '@/api/pointBuried/module.ts'

const pageName = 'PC-图谱平台'

const shareholdStructureCfg: IBuryPointConfig[] = [
  {
    moduleId: 922602100300, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权结构图Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100347, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权结构图-保存图片',
    opActive: 'click',
  },
  {
    moduleId: 922602100348, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权结构图-隐藏显示持股比例',
    opActive: 'click',
  },
  {
    moduleId: 922602100349, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权结构图-刷新',
    opActive: 'click',
  },
  {
    moduleId: 922602100361, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权结构图-加载页面',
    opActive: 'click',
  },
]
const equityPenetrationCfg: IBuryPointConfig[] = [
  {
    moduleId: 922602100370,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100371,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602100372,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-保存图片',
    opActive: 'click',
  },
  {
    moduleId: 922602100374,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-刷新',
    opActive: 'click',
  },
  {
    moduleId: 922602100987,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-点击切换图表样式',
    opActive: 'click',
  },
  {
    moduleId: 922602100988,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-点击展开节点',
    opActive: 'click',
  },
  {
    moduleId: 922602100989,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '股权穿透图-点击导出',
    opActive: 'click',
  },
]

const financingAtlasCfg: IBuryPointConfig[] = [
  {
    moduleId: 922602100301,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '融资图谱Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100362, // TODO 重复
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '融资图谱Tab',
    opActive: 'click',
  },
]

const beneficiaryAtlasCfg: IBuryPointConfig[] = [
  {
    moduleId: 922602100993,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '受益人图谱-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602100994,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '受益人图谱tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100995,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '受益人图谱-点击切换受益人',
    opActive: 'click',
  },
  {
    moduleId: 922602100996,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '受益人图谱-保存图片',
    opActive: 'click',
  },
  {
    moduleId: 922602100997,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '受益人图谱-刷新',
    opActive: 'click',
  },
]

const outboundInvestmentCfg: IBuryPointConfig[] = [
  {
    moduleId: 922602100998,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100999,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602101000,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图-点击切换图表样式',
    opActive: 'click',
  },
  {
    moduleId: 922602101001,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图-保存图片',
    opActive: 'click',
  },
  {
    moduleId: 922602101002,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图-点击导出',
    opActive: 'click',
  },
  {
    moduleId: 922602101003,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '对外投资图-点击展开节点',
    opActive: 'click',
  },
]

const relationshipProbing: IBuryPointConfig[] = [
  {
    moduleId: 922602100662, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关系探查-企业',
    opActive: 'click',
  },
  {
    moduleId: 922602100663, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关系探查-人物',
    opActive: 'click',
  },
  {
    moduleId: 922602100664, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关系探查-企业-人物',
    opActive: 'click',
  },
  {
    moduleId: 922602100665, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关系探查-企业-企业',
    opActive: 'click',
  },
  {
    moduleId: 922602100666, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关系探查-人物-人物',
    opActive: 'click',
  },
]
export const KGBuryConfigList: IBuryPointConfig[] = [
  ...shareholdStructureCfg,
  ...equityPenetrationCfg,
  ...financingAtlasCfg,
  ...beneficiaryAtlasCfg,
  ...outboundInvestmentCfg,
  ...relationshipProbing,
  {
    moduleId: 922602100299,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '企业图谱Tab',
    opActive: 'click',
  },

  {
    moduleId: 922602100302,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关系Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100303,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似实控人Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100304,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '融资历程Tab',
    opActive: 'click',
  },
  {
    moduleId: 922602100341,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-保存图片',
    opActive: 'click',
  },
  {
    moduleId: 922602100342, // TODO
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-勾选只看比例大于%的股权关系',
    opActive: 'click',
  },

  {
    moduleId: 922602100353,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关系图-点击企业列表按钮',
    opActive: 'click',
  },
  {
    moduleId: 922602100354,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关联图谱-点击隐藏显示属性按钮',
    opActive: 'click',
  },
  {
    moduleId: 922602100355,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关系图-点击保存图片按钮',
    opActive: 'click',
  },
  {
    moduleId: 922602100356,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关系图-点击刷新按钮',
    opActive: 'click',
  },
  {
    moduleId: 922602100360,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '企业图谱-加载页面',
    opActive: 'click',
  },

  {
    moduleId: 922602100363,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '疑似关系图-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602100364,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '实控人图谱-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602100365,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '融资历程-加载页面',
    opActive: 'click',
  },

  {
    moduleId: 922602100761, // todo
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-选择人',
    opActive: 'click',
  },
  {
    moduleId: 922602100891,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关联方图谱-加载页面',
    opActive: 'enter',
  },
  {
    moduleId: 922602100949,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '企业图谱平台首页',
    opActive: 'enter',
  },
  {
    moduleId: 922602100956,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关联方图谱-点击判定规则',
    opActive: 'click',
  },
  {
    moduleId: 922602100957,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关联方图谱-点击导出',
    opActive: 'click',
  },
  {
    moduleId: 922602100958,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '关联方图谱-点击保存图片',
    opActive: 'click',
  },

  {
    moduleId: 922602100990,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-加载页面',
    opActive: 'click',
  },
  {
    moduleId: 922602100991,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-点击探查',
    opActive: 'click',
  },
  {
    moduleId: 922602100992,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '查关系-保存图片',
    opActive: 'click',
  },

  {
    moduleId: 922602101004,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '多对一触达tab',
    opActive: 'click',
  },
  {
    moduleId: 922602101005,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '多对一触达-加载页面',
    opActive: 'click',
  },

  {
    moduleId: 922602101006,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '多对一触达-点击查触达路径',
    opActive: 'click',
  },
  {
    moduleId: 922602101007,
    pageId: PageModuleEnum.KG_PLATFORM,
    pageName,
    describe: '多对一触达-保存图片',
    opActive: 'click',
  },
]
