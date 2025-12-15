const VIP_TYPE = {
  VIP: 'VIP',
  SVIP: 'SVIP',
  FREE: 'FREE',
} as const

export type VIPType = (typeof VIP_TYPE)[keyof typeof VIP_TYPE]

export const isVIPType = (type: string): type is VIPType => {
  return Object.values(VIP_TYPE).includes(type as VIPType)
}
