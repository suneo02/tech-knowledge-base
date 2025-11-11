import { message } from '@wind/wind-ui';
import { t } from 'gel-util/intl';
import { postPointBuried } from '../../../api/service/bury';

interface UseConversationActionsParams {
  roomId: string;
  isChating: boolean;
  onRoomIdChange: (id: string) => void;
  onAddConversation: () => void;
  loadMoreItems?: () => void;
  setShowFavorites?: (show: boolean) => void;
}

export const useConversationActions = ({
  roomId,
  isChating,
  onRoomIdChange,
  onAddConversation,
  setShowFavorites,
}: UseConversationActionsParams) => {
  const handleConversationClick = (key: string) => {
    setShowFavorites?.(false);
    if (key === roomId) return;

    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'));
    } else {
      postPointBuried('922610370016');
      onRoomIdChange(key);
    }
  };

  const handleAddConversation = () => {
    setShowFavorites?.(false);
    if (isChating) {
      message.error(t('421523', '请等待当前对话结束'));
    } else {
      postPointBuried('922610370017');
      onAddConversation();
    }
  };

  return {
    handleConversationClick,
    handleAddConversation,
  };
};
