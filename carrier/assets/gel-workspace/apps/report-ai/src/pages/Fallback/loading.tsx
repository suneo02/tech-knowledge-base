import { Spin } from '@wind/wind-ui';

/**
 * 加载组件
 *
 * @description 提供全屏加载状态显示，用于路由懒加载时的过渡
 * @since 1.0.0
 */
export const Loading: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );
};
