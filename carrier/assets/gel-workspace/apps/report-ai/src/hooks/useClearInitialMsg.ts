import { useClearInitialMsgWithSearchParams } from 'gel-ui';
import { useSearchParams } from 'react-router-dom';

export const useClearInitialMsg = (initialMessage: string | null) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useClearInitialMsgWithSearchParams(initialMessage, searchParams, setSearchParams);
};
