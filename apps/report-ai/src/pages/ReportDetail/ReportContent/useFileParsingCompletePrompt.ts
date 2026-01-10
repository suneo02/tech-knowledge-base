import { useFullDocGeneration, useRPDetailSelector } from '@/store/reportContentStore';
import { selectIsGlobalBusy, selectPendingFileIds } from '@/store/reportContentStore/selectors';
import { Modal } from '@wind/wind-ui';
import { useEffect, useRef } from 'react';

/**
 * 监听文件解析状态，当所有文件解析完成时提示用户是否生成全文
 * 直接从 Redux store 读取所需状态
 */
export const useFileParsingCompletePrompt = () => {
  // 直接从 Redux 获取状态
  const pendingFileIds = useRPDetailSelector(selectPendingFileIds);
  const isGlobalBusy = useRPDetailSelector(selectIsGlobalBusy);
  const { startGeneration } = useFullDocGeneration();

  const prevPendingCountRef = useRef<number>(pendingFileIds.length);

  useEffect(() => {
    const hadPending = prevPendingCountRef.current > 0;
    const nowNoPending = pendingFileIds.length === 0;

    if (hadPending && nowNoPending && !isGlobalBusy) {
      Modal.confirm({
        title: '文件解析完成',
        content: '文件解析好了，是否确认生成全文？',
        okText: '生成全文',
        cancelText: '取消',
        onOk: () => {
          startGeneration();
        },
      });
    }

    prevPendingCountRef.current = pendingFileIds.length;
  }, [pendingFileIds, isGlobalBusy, startGeneration]);
};
