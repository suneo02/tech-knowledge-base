import React from 'react';

import { md } from '@/libs/markdown';
import { getWsid, isDev } from '@/utils';
import { AIAnswerMarkdownViewer } from 'ai-ui';
import { WithDPUList, WithRAGList } from 'gel-api';
import { entWebAxiosInstance } from '../../../api/entWeb';

// 配置 markdown-it

interface MarkdownProps extends Partial<WithDPUList>, Partial<WithRAGList> {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = (props) => {
  return (
    <AIAnswerMarkdownViewer
      {...props}
      wsid={getWsid()}
      isDev={isDev}
      entWebAxiosInstance={entWebAxiosInstance}
      md={md}
    />
  );
};
