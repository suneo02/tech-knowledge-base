import { isDev } from '@/utils';
import { createStockCodeAwareMarkdownRenderer } from 'ai-ui';
import MarkdownIt from 'markdown-it';

export const md: MarkdownIt = createStockCodeAwareMarkdownRenderer(isDev);
