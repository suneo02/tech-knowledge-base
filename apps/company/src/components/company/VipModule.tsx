/**
 * VipModule 组件入口文件
 *
 * 该文件作为VipModuleNew组件的统一导出入口，保持向后兼容性
 *
 * @see 设计文档: ../docs/auth/membership-permissions-interaction.md
 * @see 实现文件: VipModuleNew.tsx
 */

// 导出 VipModuleNew 的组件
export { VipModule } from './VipModuleNew'

// 为 lazy import 提供 default export
export { VipModule as default } from './VipModuleNew'
