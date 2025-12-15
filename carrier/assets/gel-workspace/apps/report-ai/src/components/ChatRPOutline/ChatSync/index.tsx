import { useRPOutlineContext } from '@/context';
import { rpOutlineActions } from '@/store/rpOutline';
import { FC, useEffect } from 'react';
import { useAppDispatch } from '../../../store';

/**
 * RPOutline 聊天消息同步组件
 *
 * @description 将 rawMessages 同步到 Redux store，parsedMessages 将由 selector 派生
 */
export const RPOutlineChatSync: FC = () => {
  // 获取聊天相关的状态和方法
  const { rawMessages } = useRPOutlineContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rpOutlineActions.setAgentMessages({ rawMessages }));
  }, [rawMessages, dispatch]);

  return null;
};
