import { useEffect } from 'react';
import { useReportDetailContext } from '../../../context/ReportDetail';
import { useReportContentDispatch } from '../../../store/reportContentStore';
import { rpContentActions } from '../../../store/reportContentStore/slice';

// ChatSync.tsx（Context -> RTK 的单向同步器）
export function ChatSync({ id }: { id: string | undefined }) {
  const { parsedRPContentMessages } = useReportDetailContext();
  const dispatch = useReportContentDispatch();
  useEffect(() => {
    dispatch(rpContentActions.setParsedRPContentMessages(parsedRPContentMessages));
  }, [dispatch, id, parsedRPContentMessages]);
  return null;
}
