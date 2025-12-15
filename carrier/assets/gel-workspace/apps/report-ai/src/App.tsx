import { XProvider } from '@ant-design/x';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { DebugPanel, ErrorBoundary, primaryColor } from 'gel-ui';
import { clientInitWSID } from 'gel-util/env';
import { i18n } from 'gel-util/intl';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './router';
import { store } from './store';
import { isDev, isStaging } from './utils/env.ts';

/**
 * 预加载关键路由
 *
 * @description 当用户停留在页面上一段时间后预加载主要路由
 * @since 1.0.0
 */
const preloadRoutes = (): (() => void) => {
  // 当用户停留在页面上一段时间后预加载主要路由
  const timeout = setTimeout(() => {
    import('./pages/ChatOutline/index.tsx');
    // 预加载关键样式
    import('./components/ChatRPOutline/messages/index.tsx');
    import('./components/ChatRPLeft/messages/index.tsx');
    import('./components/ChatCommon/ChatRoles/index.ts');
  }, 200);

  return () => clearTimeout(timeout);
};

/**
 * 应用根组件
 *
 * @description 提供应用的主要布局和配置，包括国际化、主题、路由等
 * @since 1.0.0
 */
export const App: React.FC = () => {
  // const { i18n } = useTranslation()

  // 根据当前语言选择 Ant Design 的语言包
  const antdLocale = useMemo(() => {
    return i18n.language === 'zh-CN' ? zhCN : enUS;
  }, [i18n.language]);

  useEffect(() => {
    // 初始化 WebSocket ID
    clientInitWSID();
    // 预加载关键路由
    const cleanup = preloadRoutes();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ConfigProvider
          locale={antdLocale}
          theme={{
            token: {
              colorPrimary: primaryColor,
            },
          }}
        >
          <XProvider>
            <RouterProvider router={router} />
            {(isDev || isStaging) && <DebugPanel />}
          </XProvider>
        </ConfigProvider>
      </Provider>
    </ErrorBoundary>
  );
};
