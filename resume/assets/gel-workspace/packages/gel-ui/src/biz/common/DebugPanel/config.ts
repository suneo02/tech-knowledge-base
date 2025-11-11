// 环境配置项接口
export interface EnvConfigItemProps {
  name: string
  host: string // 实际转发地址
  proxy: string // 代理路径
}

// 环境配置
export const DEV_ENV_CONFIG: EnvConfigItemProps[] = [
  {
    name: '当前环境',
    host: '',
    proxy: '',
  },
  {
    name: '上海主站nginx代理',
    host: 'https://114.80.154.45',
    proxy: '/api/xsh',
  },
  {
    name: '南京主站nginx代理',
    host: 'https://180.96.8.44',
    proxy: '/api/xnj',
  },
  {
    name: '体验站nginx代理',
    host: 'https://10.100.244.57',
    proxy: '/api/xexp',
  },
  {
    name: '测试站nginx代理',
    host: 'https://180.96.8.173',
    proxy: '/api/xtest',
  },
  {
    name: '上海主站直连',
    host: 'https://114.80.154.45',
    proxy: 'https://114.80.154.45',
  },
  {
    name: '南京主站直连',
    host: 'https://180.96.8.44',
    proxy: 'https://180.96.8.44',
  },
  {
    name: '体验站直连',
    host: 'https://114.80.213.47',
    proxy: 'https://114.80.213.47',
  },
  {
    name: '测试站直连',
    host: 'https://180.96.8.173',
    proxy: 'https://180.96.8.173',
  },
]
