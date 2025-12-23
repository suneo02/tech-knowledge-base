import { entWebAxiosInstance } from '@/api/entWeb';
import { Conversations, ConversationsProps } from '@ant-design/x';
import { Spin } from '@wind/wind-ui';
import classNames from 'classnames';
import { getConversationMenu, getGroupableConfig } from 'gel-ui';
import { createIntersectionObserver } from 'gel-util/common';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.module.less';

interface InfiniteScrollConversationsProps {
  items?: ConversationsProps['items'];
  hasMore?: boolean;
  loading?: boolean;
  loadMoreItems: () => void;
  activeKey: string;
  onReload?: () => void;
  onActiveChange: (key: string) => void;
  onDeleteConversation?: (id: string) => void;
  className?: string;
  conversationClassName?: string;
  infiniteScrollClassName?: string;
}

export const InfiniteScrollConversations: React.FC<InfiniteScrollConversationsProps> = ({
  items,
  hasMore,
  loading,
  loadMoreItems,
  activeKey,
  onActiveChange,
  onDeleteConversation,
  className,
  conversationClassName,
  infiniteScrollClassName,
}: InfiniteScrollConversationsProps) => {
  const loadMoreRef = useRef(null);
  const [itemsList, setItemsList] = useState<ConversationsProps['items']>([]);

  const { observable } = createIntersectionObserver(
    () => {
      loadMoreItems?.();
    },
    undefined,
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  // 当items变化时，更新itemsList
  useEffect(() => {
    setItemsList(items);
  }, [items]);

  const menuConfig = getConversationMenu({
    onDelete: onDeleteConversation,
    entWebAxiosInstance,
    enableFavorite: false,
    enableRename: false,
  });

  useEffect(() => {
    if (loadMoreRef.current) {
      observable.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observable.unobserve(loadMoreRef.current);
    };
  }, [loading]);

  return (
    <div className={classNames(styles.scrollContainer, className)} id="scrollableDiv">
      <InfiniteScroll
        className={infiniteScrollClassName}
        style={{ height: '100%' }}
        next={loadMoreItems}
        hasMore={hasMore ?? false}
        dataLength={itemsList?.length ?? 0}
        loader={
          <div ref={loadMoreRef} style={{ textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <Conversations
          items={itemsList}
          className={classNames(styles.conversations, conversationClassName)}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
          menu={menuConfig}
          groupable={getGroupableConfig()}
          style={{
            color: '#333',
          }}
          styles={{
            item: {
              color: '#333',
            },
          }}
        />
      </InfiniteScroll>
    </div>
  );
};
