import { RPChapter } from 'gel-api';

export const outlineMock2: RPChapter[] = [
  {
    writingThought: '公司基本信息和发展历程',
    chapterId: 1,
    title: '公司概览',
  },
  {
    writingThought: '行业整体状况和发展趋势',
    chapterId: 2,
    title: '行业分析',
    children: [
      {
        writingThought: '行业市场规模和增长情况',
        chapterId: 21,
        title: '市场规模',
      },
      {
        writingThought: '行业竞争格局和主要参与者',
        chapterId: 22,
        title: '竞争格局',
      },
      {
        writingThought: '政策环境和监管要求',
        chapterId: 23,
        title: '政策环境',
      },
    ],
  },
  {
    writingThought: '企业财务状况和经营能力',
    chapterId: 3,
    title: '财务分析',
    children: [
      {
        writingThought: '企业营收情况和增长趋势',
        chapterId: 31,
        title: '营收情况',
      },
      {
        writingThought: '企业盈利能力和利润结构',
        chapterId: 32,
        title: '盈利能力',
      },
      {
        writingThought: '企业偿债能力和债务结构',
        chapterId: 33,
        title: '偿债能力',
      },
      {
        writingThought: '企业现金流状况和资金管理',
        chapterId: 34,
        title: '现金流',
      },
    ],
  },
  {
    writingThought: '企业管理团队和治理结构',
    chapterId: 4,
    title: '管理层与公司治理',
    children: [
      {
        writingThought: '核心管理团队成员分析',
        chapterId: 41,
        title: '管理团队',
      },
      {
        writingThought: '公司治理结构和机制',
        chapterId: 42,
        title: '治理结构',
      },
    ],
  },
  {
    writingThought: '企业面临的主要风险分析',
    chapterId: 5,
    title: '风险评估',
    children: [
      {
        writingThought: '市场环境变化带来的风险',
        chapterId: 51,
        title: '市场风险',
      },
      {
        writingThought: '政策变化对企业的影响',
        chapterId: 52,
        title: '政策风险',
      },
      {
        writingThought: '技术变革带来的挑战',
        chapterId: 53,
        title: '技术风险',
      },
      {
        writingThought: '信用违约和资金安全风险',
        chapterId: 54,
        title: '信用风险',
      },
    ],
  },
  {
    writingThought: '投资结论和建议',
    chapterId: 6,
    title: '结论与建议',
  },
];
