import path from 'path'

const ROOT_DIR = process.cwd()

export const config = [
  {
    target: path.join(ROOT_DIR, 'apps/super-agent'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/superAgent'),
    namespace: 'superAgent',
  },
  {
    target: path.join(ROOT_DIR, 'packages/gel-ui/src/common/WindHeader'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/windHeader'),
    namespace: 'windHeader',
  },
  {
    target: path.join(ROOT_DIR, 'apps/ai-chat'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/aiChat'),
    namespace: 'aiChat',
  },
  {
    target: path.join(ROOT_DIR, 'apps/company'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/company'),
    namespace: 'company',
  },
  {
    target: path.join(ROOT_DIR, 'packages/ai-ui'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/aiUi'),
    namespace: 'aiUi',
  },
  {
    target: path.join(ROOT_DIR, 'packages/cde'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/cde'),
    namespace: 'cde',
  },
  {
    target: path.join(ROOT_DIR, 'apps/report-print'),
    locales: path.join(ROOT_DIR, 'packages/gel-util/src/locales/namespaces/reportPrint'),
    namespace: 'reportPrint',
  },
]
