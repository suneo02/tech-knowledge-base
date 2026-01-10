import type { ThemeConfig } from 'antd'

/**
 * Wind 主题
 */
export const DEFAULT_WIND_THEME: ThemeConfig = {
  token: {
    colorPrimary: '#0596b3',
    borderRadius: 4,
    colorLink: 'var(--font-color-1)',
    colorLinkHover: '#00aec7',
    colorLinkActive: '#05809e',
  },
  components: {
    Typography: {
      colorLink: 'var(--font-color-1)',
      colorLinkHover: 'var(--click-5)',
      colorLinkActive: 'var(--click-7)',
    },
    Table: {
      headerBorderRadius: 0,
      headerBg: 'var(--basic-13)',
      cellPaddingBlockSM: 2,
    },
    Pagination: {
      borderRadius: 2,
      colorPrimary: 'var(--click-6)',
      colorPrimaryHover: 'var(--click-6)',
      colorPrimaryActive: 'var(--click-6)',
    },
    Form: {
      labelColor: 'var(--gray-1)',
    },
    Spin: {
      colorPrimary: 'var(--click-6)',
    },
    Button: {
      colorPrimary: 'var(--click-6)',
      colorPrimaryHover: 'var(--click-6)',
      colorPrimaryActive: 'var(--click-6)',
    },
  },
}
