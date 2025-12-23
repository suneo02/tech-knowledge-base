// 预发布环境变量配置
const STAGING_ENV = {
  NODE_ENV: 'production', // 使用生产级别构建（重要：确保代码压缩和优化）
  DEPLOY_TARGET: 'staging', // 部署目标环境（用于 company 应用的 Webpack 构建）
  DEPLOY_ENV: 'staging', // 部署环境标识
  BUILD_ENV: 'staging', // 构建环境标识
  APP_ENV: 'staging', // 应用环境标识
  VITE_APP_ENV: 'staging', // Vite 应用环境
  VITE_NODE_ENV: 'production', // Vite 使用生产模式
  VITE_BUILD_ENV: 'staging', // Vite 构建环境标识
  VITE_MODE: 'staging', // Vite 模式（用于 import.meta.env.MODE）
}

// 获取预发布环境配置
function getStagingEnv() {
  return STAGING_ENV
}

// 获取环境变量字符串
function getEnvString() {
  return Object.entries(STAGING_ENV)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')
}

module.exports = {
  STAGING_ENV,
  getStagingEnv,
  getEnvString,
}
