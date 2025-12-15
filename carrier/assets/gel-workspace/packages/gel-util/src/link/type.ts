import { LinkModule, LinkParams } from './config'

export type GetLinkParams<T extends LinkModule> = T extends keyof LinkParams ? LinkParams[T] : never

export type GetLinkParamKey<T extends LinkModule> = T extends keyof LinkParams ? keyof LinkParams[T] : never
