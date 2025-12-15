import { Button } from '@wind/wind-ui';
import { StopIcon, useIntl } from 'gel-ui';
import { FC } from 'react';
import { StatusTip } from '../../RPContent/StatusTip';
// styles moved to public/rpGenerating.css and injected into TinyMCE iframe

export const AliceGenerating: FC<{
  onStop?: () => void;
}> = ({ onStop }) => {
  const t = useIntl();
  return (
    <div className={'rpgen-top-div'}>
      <StatusTip
        status={'loading'}
        content={t('Alice正在生成内容....', 'Alice正在生成内容....')}
        customNode={
          <div className={'rpgen-custom-node-div'}>
            <Button onClick={onStop} icon={<StopIcon />}>
              {t('停止', '停止')}
            </Button>
          </div>
        }
      />
    </div>
  );
};
