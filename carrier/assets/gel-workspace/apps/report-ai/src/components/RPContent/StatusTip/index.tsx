import { CheckCircleO, CloseCircleO } from '@wind/icons';
import { WriterLoading } from 'gel-ui';
import { FC } from 'react';
import './style.less';

type TipStatus = 'default' | 'loading' | 'stop' | 'fail' | 'complete';

export const StatusTip: FC<{
  icon?: React.ReactNode;
  content: React.ReactNode;
  status: TipStatus;
  customNode: React.ReactNode;
  contentClassName?: string;
}> = ({ icon, content, status = 'default', customNode, contentClassName }) => {
  const getIcon = () => {
    let icon: React.ReactNode | null = null;
    switch (status) {
      case 'default':
        break;
      case 'loading':
        icon = <WriterLoading />;
        break;
      case 'stop':
        break;
      case 'fail':
        icon = (
          <CloseCircleO className="stop-icon" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        );
        break;
      case 'complete':
        icon = (
          <CheckCircleO className="complete-icon" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        );
        break;
    }
    return icon;
  };
  return (
    <div className="status-tip">
      <div className="left-div">
        {status && <div className="status-icon-div">{icon || getIcon()}</div>}
        <div className={contentClassName ? `status-content-div ${contentClassName}` : 'status-content-div'}>
          {content}
        </div>
      </div>
      {customNode}
    </div>
  );
};
