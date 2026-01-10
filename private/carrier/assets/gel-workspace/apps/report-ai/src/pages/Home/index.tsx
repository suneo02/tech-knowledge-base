import { RPOutlineChatSenderCB } from '@/components/ChatCommon/Sender/type';
import { initialMessageKeyMap, WelcomeSection } from 'gel-ui';
import qs from 'qs';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSenderReport, ReportTemplateList } from '../../components';
import { useExpandedSidebar } from '../../hooks/usePageSidebar';
import styles from './index.module.less';

/**
 * 首页组件
 *
 * @description 提供应用的主页界面，包含欢迎区域和聊天发送器
 * @since 1.0.0
 */
export const Home: React.FC = () => {
  useExpandedSidebar();
  const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * 处理发送消息的回调函数
   *
   * @description 当用户发送消息时，导航到聊天页面并传递初始消息
   * @param msg - 用户输入的消息内容
   * @param think - 深度思考参数
   */
  const handleSendMessage: RPOutlineChatSenderCB = async (input) => {
    try {
      const queryString = qs.stringify({
        [initialMessageKeyMap.initialMsg]: input.content,
        [initialMessageKeyMap.initialFiles]: input.files ? JSON.stringify(input.files) : undefined,
        [initialMessageKeyMap.initialRefFiles]: input.refFiles ? JSON.stringify(input.refFiles) : undefined,
      });
      navigate(`/chat/?${queryString}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.homeContent} ref={modalRef}>
      <div className={styles.homeContentInner}>
        <WelcomeSection className={styles.homeLogoSection} customRoleText="是你的智能报告助手" />

        <ChatSenderReport className={styles.chatSender} sendMessage={handleSendMessage} />
      </div>
      <ReportTemplateList className={styles.reportTemplateList} />
    </div>
  );
};
