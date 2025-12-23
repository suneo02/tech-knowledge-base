import { Button, Result } from '@wind/wind-ui';

/**
 * 404 页面组件
 *
 * @description 提供页面未找到时的错误显示界面
 * @since 1.0.0
 */
export const NotFound: React.FC = () => (
  <Result
    status={404}
    extra={<Button style={{ width: 82 }}>返回</Button>}
    title={'页面失踪了'}
    subTitle={'您浏览的页面失踪了, 请返回上一级页面吧'}
  />
);
