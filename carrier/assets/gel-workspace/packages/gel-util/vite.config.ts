/// <reference types="vite/client" />
import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import copy from 'rollup-plugin-copy'
import { ConfigEnv, defineConfig, UserConfig, type PluginOption } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * 动态收集 src 目录下的所有子目录作为入口点
 * @returns 返回一个对象，键为目录名称，值为该目录下 index.ts 文件的绝对路径
 *
 * 功能说明：
 * 1. 扫描 src 目录下的所有直接子目录
 * 2. 将每个子目录的 index.ts 文件作为入口点
 * 3. 入口点名称为目录名称
 * 4. 这样可以保持模块级别的导入，同时避免过多的入口点
 *
 * 示例：
 * - src/format/index.ts -> { "format": "/path/to/src/format/index.ts" }
 * - src/common/index.ts -> { "common": "/path/to/src/common/index.ts" }
 * - src/hooks/index.ts -> { "hooks": "/path/to/src/hooks/index.ts" }
 */
function getEntries() {
  const entries: Record<string, string> = {}
  const srcDir = resolve(__dirname, 'src') // 获取 src 目录的绝对路径

  // 读取 src 目录下的所有项目
  const items = readdirSync(srcDir)

  for (const item of items) {
    const fullPath = resolve(srcDir, item)
    const stat = statSync(fullPath)

    // 只处理目录，跳过文件和测试目录
    if (
      stat.isDirectory() &&
      !item.startsWith('__test__') &&
      !item.startsWith('__tests__') &&
      !item.startsWith('node_modules')
    ) {
      const indexPath = resolve(fullPath, 'index.ts')

      // 检查该目录下是否存在 index.ts 文件
      try {
        const indexStat = statSync(indexPath)
        if (indexStat.isFile()) {
          // 使用目录名作为入口点名称
          entries[item] = indexPath
        }
      } catch {
        // 如果 index.ts 文件不存在，跳过该目录
        console.warn(`Warning: ${item} 目录下没有找到 index.ts 文件，跳过该入口点`)
      }
    }
  }

  return entries
}

export default defineConfig(
  ({ mode }: ConfigEnv): UserConfig => ({
    logLevel: 'warn',
    plugins: [
      dts({
        outDir: ['dist/types'],
        include: ['src'],
        exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      }),
      copy({
        targets: [
          {
            src: 'src/intl/locales/*.json',
            dest: 'dist/locales',
          },
          {
            src: 'src/locales/namespaces/*.json',
            dest: 'dist/locales/namespaces',
          },
        ],
        hook: 'writeBundle',
      }) as unknown as PluginOption,
    ],
    build: {
      emptyOutDir: false, // 确保每次构建前清空目录
      minify: mode === 'development' ? false : 'esbuild', // 开发环境不压缩，生产环境使用 esbuild 压缩
      lib: {
        entry: getEntries(),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['qs', 'react', 'react-dom', 'axios', 'path-browserify', 'gel-api'],
        output: {
          // 确保正确的文件命名模式
          entryFileNames: `[name].mjs`,
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        // 启用 tree-shaking
        treeshake: true,
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@locales': resolve(__dirname, 'src/locales'),
      },
    },
    json: {
      stringify: true,
    },
  })
)
