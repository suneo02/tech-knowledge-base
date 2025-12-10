import { ApiCodeForWfc, RPChapter, RPDetailChapter, TRequestToChat } from 'gel-api';
import { uniqueId } from 'lodash-es';
import { outlineMock4 } from '../reportOutline/reportContent4.mock';

// 生成唯一ID的函数，与系统保持一致
const generateId = (prefix: string = 'mock'): number => {
  return Number(uniqueId(`${prefix}-`).replace(`${prefix}-`, ''));
};

// 部分完成的章节数据
export const partialChapters: RPChapter[] = [
  {
    title: '市场概述',
    writingThought: '本章将介绍当前市场的基本情况和主要趋势...',
    chapterId: generateId('chapter'),
    children: [
      {
        title: '市场规模',
        writingThought: '根据最新数据显示，市场规模达到...',
        chapterId: generateId('chapter'),
        children: [],
      },
      {
        title: '市场趋势',
        writingThought: '近年来市场呈现以下主要趋势...',
        chapterId: generateId('chapter'),
        children: [],
      },
    ],
  },
  {
    title: '竞争分析',
    writingThought: '本章将深入分析主要竞争对手的情况...',
    chapterId: generateId('chapter'),
    children: [],
  },
];

// 大型报告数据
export const largeChapters: RPDetailChapter[] = Array.from({ length: 10 }, (_, index) => ({
  title: `章节${index + 1}`,
  writingThought: `这是第${index + 1}章的内容，包含详细的分析和说明...`,
  chapterId: generateId('chapter'),
  children: Array.from({ length: 5 }, (_, subIndex) => ({
    title: `子章节${subIndex + 1}`,
    writingThought: `这是第${index + 1}章第${subIndex + 1}个子章节的内容...`,
    chapterId: generateId('chapter'),
    children: [],
  })),
}));

type ReportQuery = TRequestToChat<'report/query'>;

// 不同场景的 API 响应数据

export const mockApiResponses: Record<string, Awaited<ReturnType<ReportQuery>>> = {
  // 默认场景 - 报告已完成
  default: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    Data: {
      id: 'mock-report-id',
      name: '2024年市场分析报告',
      chapters: outlineMock4,
    },
  },

  // 加载场景 - 报告正在生成中
  loading: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    Data: {
      id: 'loading-report-id',
      name: '',
      chapters: [],
    },
  },

  // 部分完成场景 - 报告部分章节已完成
  partial: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    Data: {
      id: 'partial-report-id',
      name: '2024年市场分析报告',
      chapters: partialChapters,
    },
  },

  // 错误场景 - 报告加载失败
  error: {
    ErrorCode: ApiCodeForWfc.USE_FORBIDDEN_GATEWAY,
  },

  // 空报告场景 - 没有章节内容
  empty: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    Data: {
      id: 'empty-report-id',
      name: '空报告',
      chapters: [],
    },
  },

  // 大型报告场景 - 包含更多章节内容
  large: {
    ErrorCode: ApiCodeForWfc.SUCCESS,
    Data: {
      id: 'large-report-id',
      name: '大型市场分析报告',
      chapters: largeChapters,
    },
  },

  // 网络错误场景
  networkError: {
    ErrorCode: ApiCodeForWfc.DEFAULT_ERROR,
  },

  // 超时场景
  timeout: {
    ErrorCode: ApiCodeForWfc.DEFAULT_ERROR,
  },
};

// 获取指定场景的 mock 数据
export const getMockData = (scenario: keyof typeof mockApiResponses) => {
  return mockApiResponses[scenario];
};

// 生成用于浏览器 mock 的 JavaScript 代码
export const generateMockScript = (scenario: keyof typeof mockApiResponses) => {
  const data = mockApiResponses[scenario];
  return `
// 复制以下代码到浏览器控制台来 mock 接口
// 或者使用 Requestly 等浏览器扩展

// 方法1: 使用 fetch 拦截
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('report/query')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(${JSON.stringify(data, null, 2)})
    });
  }
  return originalFetch.apply(this, args);
};

// 方法2: 使用 XMLHttpRequest 拦截
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  if (typeof url === 'string' && url.includes('report/query')) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        Object.defineProperty(this, 'responseText', {
          value: JSON.stringify(${JSON.stringify(data, null, 2)})
        });
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'readyState', { value: 4 });
        this.dispatchEvent(new Event('readystatechange'));
      }
    });
  }
  return originalXHROpen.call(this, method, url, ...args);
};

console.log('Mock 已设置，场景: ${scenario}');
  `.trim();
};
