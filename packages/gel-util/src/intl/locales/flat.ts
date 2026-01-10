const LAZY_CN = import.meta.glob('./iml_cn_*.json') as Record<string, () => Promise<any>>
const LAZY_EN = import.meta.glob('./iml_en_*.json') as Record<string, () => Promise<any>>

export const loadFlatDict = async (locale: 'zh-CN' | 'en-US') => {
  const mods = locale === 'zh-CN' ? LAZY_CN : LAZY_EN
  const dict: Record<string, string> = {}
  const tasks: Array<Promise<void>> = []
  for (const loader of Object.values(mods)) {
    tasks.push(
      loader().then((mod) => {
        const data = (mod && 'default' in mod ? (mod as any).default : (mod as any)) || {}
        Object.assign(dict, data)
      })
    )
  }
  await Promise.all(tasks)
  return dict
}
