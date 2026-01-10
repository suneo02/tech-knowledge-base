import { PAGE_ROUTES } from '../../../constants/routes';
import { AIChatHistory } from 'gel-api';

/**
 * 检查会话是否包含报告实体
 */
export const hasReportEntity = (conversation: Partial<AIChatHistory>): boolean => {
  return conversation.entities?.some(entity => entity.entityType === 'report') ?? false;
};

/**
 * 根据会话内容决定跳转路径
 * @param conversation 会话对象
 * @param defaultPath 默认跳转路径（通常是聊天页面）
 * @returns 应该跳转的路径
 */
export const getNavigationPath = (
  conversation: Partial<AIChatHistory> | undefined,
  defaultPath: string
): string => {
  if (!conversation) return defaultPath;
  
  if (hasReportEntity(conversation)) {
    const reportEntity = conversation.entities?.find(entity => entity.entityType === 'report');
    if (reportEntity?.entityCode) {
      return `${PAGE_ROUTES.REPORT_DETAIL}/${reportEntity.entityCode}`;
    }
  }
  
  return defaultPath;
};

/**
 * 处理会话点击跳转
 * @param navigate react-router的navigate函数
 * @param conversationItems 会话列表
 * @param conversationId 当前点击的会话ID
 * @param defaultPath 默认跳转路径模板，应包含${id}占位符
 */
export const handleConversationNavigation = (
  navigate: (path: string) => void,
  conversationItems: Partial<AIChatHistory>[],
  conversationId: string,
  defaultPath: string = '/chat/${id}'
): void => {
  const conversation = conversationItems.find(item => item.groupId === conversationId);
  const navigationPath = getNavigationPath(conversation, defaultPath.replace('${id}', conversationId));
  navigate(navigationPath);
};