import { TagColors } from './type'

export const getPublicSentimentTagColorAndType = (
  emotion: string | undefined,
  level: number | undefined
): { color: TagColors } => {
  switch (emotion) {
    case '负面':
      switch (level) {
        case 3: {
          return {
            color: 'color-6',
          }
        }
        case 4: {
          return {
            color: 'color-2',
          }
        }
        case 5: {
          return {
            color: 'color-4',
          }
        }
      }
      break
    case '中性':
      return {
        color: 'color-9',
      }
    default:
  }
  return {
    color: 'color-3',
  }
}
