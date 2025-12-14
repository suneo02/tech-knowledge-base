// @ts-nocheck
import { ChatDetailTurn } from 'gel-api';

/**
 * 简单的聊天记录 - 用于调试大纲功能
 * 只包含一个简单的问答，大纲结构精简（只有 3 个一级章节）
 */
export const chatDetailTurnListSimple: ChatDetailTurn[] = [
  {
    think: '',
    questionsID: 'simple-question-001',
    data: {
      result: {
        suggest: {
          items: [
            {
              docId: '626220451',
              docType: '1',
              chunk: {
                readtimes: '45',
                sitename: '和讯',
                publishdate: '2025-03-18T14:34:33Z',
                'sitename-01': 'Hexun',
                title: '人工智能行业发展趋势',
                extrainfo: '人工智能技术正在快速发展，应用场景不断扩大。',
              },
              windcode: '626220451',
              source_type: '1',
              'sitename-01': 'Hexun',
              doc_type: '1',
              type: 'N',
              doc_id: '626220451',
              content: '人工智能技术正在快速发展，应用场景不断扩大，包括自然语言处理、计算机视觉、机器学习等领域。',
              score: '20.9392',
              docIdEncry: '4D30BED10C9F1528F46AFAD2A0A41E67',
              sourceType: 'es',
              sitename: '和讯',
              publishdate: '2025-03-18 14:34:33',
              text: '人工智能行业发展趋势',
              publish_date: '2025-03-18 14:34:33',
              seq: 1,
              searchSum: 3,
            },
          ],
        },
        content: {
          data: [
            {
              rawSentence: '人工智能行业的主要应用领域有哪些？',
              Headers: [
                {
                  DataType: 'string',
                  Id: '0',
                  Name: '应用领域',
                },
                {
                  DataType: 'string',
                  Id: '1',
                  Name: '描述',
                },
              ],
              Content: [
                ['自然语言处理', '文本理解、机器翻译、对话系统'],
                ['计算机视觉', '图像识别、目标检测、人脸识别'],
                ['机器学习', '预测分析、推荐系统、异常检测'],
              ],
              Total: 3,
              NewName: '人工智能主要应用领域',
              id: 'Step1report-simple',
            },
          ],
          datasource: '5',
          rawSentenceID: 'simple-question-001',
          model: {
            Expression: 'report name=simple',
            ExpendTime: '1000',
          },
          text: '',
        },
      },
      gelData: [],
      message: 'Success.',
    },
    reportData: {
      outline: {
        reportId: 'simple-report-001',
        outlineName: '人工智能行业分析报告',
        chapters: [
          {
            chapterId: 1,
            title: '自然语言处理',
            writingThought: '介绍自然语言处理技术的发展现状和应用场景',
            keywords: ['NLP', '文本理解', '机器翻译'],
            children: [],
          },
          {
            chapterId: 2,
            title: '计算机视觉',
            writingThought: '分析计算机视觉技术在各行业的应用',
            keywords: ['图像识别', '目标检测', '人脸识别'],
            children: [],
          },
          {
            chapterId: 3,
            title: '机器学习',
            writingThought: '探讨机器学习算法和实际应用案例',
            keywords: ['预测分析', '推荐系统', '异常检测'],
            children: [],
          },
        ],
      },
    },
    createTime: '2025-03-21 10:00:00',
    groupId: 'simple-group-001',
    answers:
      '### 人工智能行业的主要应用领域\n\n人工智能技术正在快速发展，主要应用领域包括：\n\n| 应用领域 | 描述 |\n| --- | --- |\n| 自然语言处理 | 文本理解、机器翻译、对话系统 |\n| 计算机视觉 | 图像识别、目标检测、人脸识别 |\n| 机器学习 | 预测分析、推荐系统、异常检测 |\n\n这些技术正在改变各行各业的运作方式。',
    questions: '人工智能行业的主要应用领域有哪些？',
    questionStatus: '1',
  },
];
