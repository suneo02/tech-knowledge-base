// 部署配置模块

const { getStagingEnv } = require('./env-config')

/**
 * 应用配置定义
 */
const APPS_CONFIG = {
  company: {
    name: 'Company',
    buildCommand: 'turbo build:staging --filter=company',
    sourceDir: 'apps/company/build',
    deployDir: 'Company',
    description: 'Company 主应用',
  },
  'ai-chat': {
    name: 'AI Chat',
    buildCommand: 'turbo build:staging --filter=ai-chat',
    sourceDir: 'apps/ai-chat/dist',
    deployDir: 'ai',
    description: 'AI 聊天应用',
  },
  'report-ai': {
    name: 'Report AI',
    buildCommand: 'turbo build:staging --filter=report-ai',
    sourceDir: 'apps/report-ai/dist',
    deployDir: 'reportai',
    description: 'Report AI 应用',
  },
  'report-preview': {
    name: 'Report Preview',
    buildCommand: 'turbo build:staging --filter=report-preview',
    sourceDir: 'apps/report-preview/dist',
    deployDir: 'reportpreview',
    description: '报告预览应用',
  },
  'report-print': {
    name: 'Report Print',
    buildCommand: 'turbo build:staging --filter=report-print',
    sourceDir: 'apps/report-print/dist',
    deployDir: 'reportprint',
    description: '报告打印应用',
  },
  'wind-zx': {
    name: 'Wind ZX',
    buildCommand: 'turbo build:staging --filter=wind-zx',
    sourceDir: 'apps/wind-zx/dist',
    deployDir: 'windzx',
    description: 'Wind ZX 官网',
  },
}

/**
 * 部署配置
 */
const DEPLOY_CONFIG = {
  repoUrl: 'http://10.106.51.205/yxlu.calvin/Company.git',
  sourcePath: '/home/deploy/source/frontend/Company',
  deployPath: '/var/www/Wind.WFC.Enterprise.Web/PC.Front',
  branch: 'staging',
  verbose: false,
  clearCache: false,
  get env() {
    return getStagingEnv()
  },
  apps: APPS_CONFIG,
}

/**
 * 创建可配置的部署配置
 * @param {object} overrides - 覆盖配置
 * @returns {object} 合并后的配置
 */
function createDeployConfig(overrides = {}) {
  return {
    ...DEPLOY_CONFIG,
    ...overrides,
    apps: { ...APPS_CONFIG, ...overrides.apps },
  }
}

module.exports = {
  APPS_CONFIG,
  DEPLOY_CONFIG,
  createDeployConfig,
}
