import React from 'react';
import { t } from 'gel-util/intl';

/**
 * 企业库页面占位符
 *
 * @description 企业库功能暂未实现，此为占位符页面
 * @since 1.0.0
 */
export const Company: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{t('', '我的企业库')}</h1>
      <p>{t('', '企业库功能正在开发中，敬请期待...')}</p>
    </div>
  );
};