import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { RPChapter } from 'gel-api';
import { AIMessageReportContent } from 'gel-ui';

// 模拟流式输出的章节内容
export const streamingChapters: RPChapter[] = [
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
    ],
  },
];

// 创建流式消息数据
export const createStreamingMessages = (): MessageInfo<AIMessageReportContent>[] => {
  const messages: MessageInfo<AIMessageReportContent>[] = [];

  // 章节 1 的内容
  const chapter1Content = `
根据当前可获取的信息，目前企业库中暂无相关的参考数据和参考资料，因此无法提供具体的公司概览内容。以下为一般性的公司概览结构说明，供参考：


- 公司名称
- 成立时间
- 注册地
- 法定代表人
- 公司性质（如：有限责任公司、股份有限公司等）
- 主营业务


由于当前缺乏具体数据，以上内容仅为框架性描述。如需生成具体章节内容，建议补充相关企业信息或查阅权威资料。`;

  // 章节 2.1 的内容
  const chapter2_1Content = `

根据当前可获取的信息，关于"市场规模"的章节内容无法生成，原因如下：


建议后续补充以下信息以便生成完整的"市场规模"章节内容：

- 具体行业（如：新能源、人工智能、零售等）
- 目标区域（如：中国、北美、欧洲等）
- 数据时间范围（如：2024年、2025年Q2等）

如需进一步协助，请提供更详细的信息。`;

  // 章节 2.2 的内容
  const chapter2_2Content = `

竞争格局是分析一个行业或市场的重要组成部分，它反映了市场中主要参与者之间的关系、市场份额的分布以及行业内的竞争程度。以下是对竞争格局的详细分析：

市场集中度是衡量市场竞争程度的重要指标，通常通过以下两个指标进行分析：
`;

  // 章节 3.1 的内容
  const chapter3_1Content = `

根据当前提供的信息，关于"营收情况"的章节内容无法生成，原因如下：


建议后续补充以下信息以便生成完整的"营收情况"章节内容：

- 具体企业名称
- 行业类别
- 时间范围（如：2024年、2025年Q2等）

如需进一步协助，请提供更详细的信息。`;

  // 章节 3.2 的内容
  const chapter3_2Content = `

盈利能力是企业财务分析中的核心指标，它反映了企业在经营活动中创造利润的能力。以下是对盈利能力的详细分析：

- 产品结构和质量
- 成本控制能力
- 经营管理效率
- 技术创新能力

通过系统的盈利能力分析，可以全面了解企业的盈利状况，为投资决策和经营管理提供重要参考。`;

  const createChapterMessages = (content: string, chapterId: string) => {
    const words = content.split(' ');
    let currentContent = '';

    words.forEach((word, index) => {
      currentContent += word + ' ';
      messages.push({
        id: `msg-${chapterId}-${index}`,
        message: {
          role: 'aiReportContent',
          content: currentContent.trim(),
          status: index === words.length - 1 ? 'finish' : 'receiving',
          chapterId: chapterId,
        },
        status: 'success',
      });
    });
  };

  // 按顺序创建各章节的流式消息
  createChapterMessages(chapter1Content, '1');
  createChapterMessages(chapter2_1Content, '2.1');
  createChapterMessages(chapter2_2Content, '2.2');
  createChapterMessages(chapter3_1Content, '3.1');
  createChapterMessages(chapter3_2Content, '3.2');

  return messages;
};

// 导出流式消息数据
export const streamingMessages = createStreamingMessages();
