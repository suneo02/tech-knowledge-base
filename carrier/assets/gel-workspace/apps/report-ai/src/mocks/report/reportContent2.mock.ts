import { MessageParsedReportContent } from '@/types';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { RPChapter } from 'gel-api';

export const outlineMock: RPChapter[] = [
  { chapterId: 1, title: '第一章 概述', children: [], writingThought: '第一章 概述' },
  { chapterId: 2, title: '第二章 技术方案', children: [], writingThought: '第二章 技术方案' },
  { chapterId: 3, title: '第三章 结论', children: [], writingThought: '第三章 结论' },
];

// 新的 MessageInfo 格式，可直接作为 composeReportContent 的入参
export const messagesMock: MessageInfo<MessageParsedReportContent>[] = [
  {
    id: 'msg-sec-1',
    message: {
      role: 'aiReportContent',
      content: '# 第一章 概述\n\n章节 1 初始内容',
      status: 'pending',
      chapterId: '1',
    },
    status: 'success',
  },
  {
    id: 'msg-sec-2',
    message: {
      role: 'aiReportContent',
      content: '# 第二章 技术方案\n\n章节 2 初始内容',
      status: 'receiving',
      chapterId: '2',
    },
    status: 'success',
  },
  {
    id: 'msg-sec-3',
    message: {
      role: 'aiReportContent',
      content: '# 第三章 结论\n\n章节 3 初始内容',
      status: 'finish',
      chapterId: '3',
    },
    status: 'success',
  },
];
