import { ReportOutlineData } from 'gel-api';

export const rpOutlineMock1: ReportOutlineData = {
  reportId: '98',
  outlineName: '小米科技有限责任公司',
  chapters: [
    {
      children: [],
      chapterId: 2181,
      writingThought: '',
      title: '小米科技有限责任公司',
    },
    {
      children: [
        {
          children: [],
          chapterId: 2183,
          writingThought:
            '1. 字段提取 - 收集企业名称、统一社会信用代码、注册资本、成立日期、法定代表人、注册地址、经营范围\n2. 企业性质识别 - 判断企业类型（如有限责任公司、股份有限公司等）\n3. 基本信息描述 - 形成企业的基础背景说明',
          title: '年08月20日',
        },
        {
          children: [
            {
              children: [],
              chapterId: 2185,
              writingThought:
                '1. 字段提取 - 获取股东名称、持股比例、出资方式、出资时间\n2. 股权穿透分析 - 明确实际控制人及股权层级关系\n3. 股东背景简述 - 描述主要股东的业务背景及与企业的关联性',
              title: '工商信息',
            },
            {
              children: [],
              chapterId: 2186,
              writingThought:
                '1. 字段提取 - 收集近三年营业收入、净利润、资产负债率、毛利率、净利率、总资产周转率\n2. 趋势对比 - 分析营收与利润的同比增长情况\n3. 比率诊断 - 评估盈利能力、偿债能力及运营效率\n4. 行业对标 - 与同行业企业财务指标进行横向对比\n5. 结论撰写 - 形成企业财务状况评价结论',
              title: '所属行业/产业',
            },
            {
              children: [
                {
                  children: [],
                  chapterId: 2188,
                  writingThought:
                    '1. 字段提取 - 梳理主要产品/服务、产能利用率、订单满足率、交付准时率\n2. 产能分析 - 评估当前产能与市场需求的匹配情况\n3. 交付评估 - 分析交付准时率对客户满意度的影响\n4. 订单满足率分析 - 判断企业在市场中的响应能力\n5. 结论撰写 - 识别企业运营效率及改进空间',
                  title: '工商登记',
                },
              ],
              chapterId: 2187,
              writingThought: '',
              title: '股东信息',
            },
            {
              children: [
                {
                  children: [],
                  chapterId: 2190,
                  writingThought:
                    '1. 字段提取 - 采集企业名称、注册资本、成立日期、法定代表人等工商基础信息\n2. 组织分析 - 简要分析企业性质（国有、民营、外资等）\n3. 结构梳理 - 梳理企业经营范围和业务板块\n4. 背景总结 - 形成企业基本概况描述',
                  title: '股东及出资信息',
                },
                {
                  children: [],
                  chapterId: 2191,
                  writingThought:
                    '1. 字段提取 - 收集近三年营业收入、毛利率、存货周转率等财务数据\n2. 趋势对比 - 对比近三年营收和毛利率变化趋势\n3. 比率诊断 - 分析毛利率与行业水平的对比情况\n4. 周转效率评估 - 评估存货周转率与行业平均水平\n5. 结论撰写 - 形成企业财务状况综合评价',
                  title: '股权变更信息',
                },
              ],
              chapterId: 2189,
              writingThought: '',
              title: '企业公示',
            },
            {
              children: [],
              chapterId: 2192,
              writingThought:
                '1. 字段提取 - 收集产能利用率、订单满足率、交付准时率等经营指标\n2. 专项分析 - 分析产能利用率与目标产能的差距\n3. 需求匹配 - 评估订单满足率与市场需求匹配度\n4. 交付能力评估 - 分析交付准时率对客户满意度的影响\n5. 结论撰写 - 形成企业运营效率和客户响应能力评估',
              title: '纳税人信息',
            },
          ],
          chapterId: 2184,
          writingThought: '',
          title: '企业基本情况',
        },
      ],
      chapterId: 2182,
      writingThought: '',
      title: '尽职调查报告',
    },
  ],
};
