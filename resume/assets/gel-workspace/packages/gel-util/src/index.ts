/**
 * gel-util 现已完全改为子模块导入方式
 *
 * 请将：
 * import { something } from 'gel-util'
 *
 * 修改为：
 * import { something } from 'gel-util/[module]'
 *
 * 子模块列表：
 * - env: 环境相关函数 (getWSID, isDev, usedInClient, WindSessionHeader 等)
 * - intl: 国际化相关 (i18n, t, getLocale, SupportedLocale 等)
 * - link: 链接生成 (generateUrlByModule, LinkModule 等)
 * - format: 格式化函数 (formatTime, formatMoney, numberFormat 等)
 * - translate: 翻译相关函数
 * - corp: 企业相关函数和类型 (TCorpArea 等)
 * - config: 配置相关
 * - corpConfig: 企业配置相关
 * - download: 下载相关函数 (downloadFileToLocal 等)
 * - typeUtil: 类型工具
 * - hooks: React Hooks (useUrlState 等)
 *
 * 如果不确定某个函数属于哪个模块，请查看相应模块的index.ts文件
 */

// 抛出明确的错误，防止误用
throw new Error('不能再从主入口导入 gel-util，请使用子模块导入方式。例如: import { getWSID } from "gel-util/env"')
