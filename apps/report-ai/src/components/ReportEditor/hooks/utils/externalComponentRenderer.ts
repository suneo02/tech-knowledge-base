/**
 * 外部组件渲染器工具
 *
 * @description 统一管理编辑器外部渲染的 React 组件（按钮、加载动画、预览等）
 * 提供容器创建、实例管理、清理等通用能力
 */

import type { CSSProperties } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  applyStylesToElement,
  createContainer,
  createGlobalOverlayContainer,
  deferredCleanup,
  generateUniqueId,
  safeRemoveElement,
} from './editorDomUtils';

/**
 * 外部组件实例
 */
export interface ExternalComponentInstance {
  /** 容器元素 */
  container: HTMLElement;
  /** React Root */
  root: Root;
  /** 实例标识（可选） */
  id?: string;
}

/**
 * 全局容器配置
 */
export interface GlobalContainerConfig {
  /** 容器 ID */
  id: string;
  /** 容器类名 */
  className: string;
  /** z-index */
  zIndex?: number;
}

/**
 * 实例容器配置
 */
export interface InstanceContainerConfig {
  /** 容器类名 */
  className: string;
  /** 容器样式 */
  styles?: CSSProperties;
}

/**
 * 外部组件渲染器
 *
 * @description 管理单个类型的外部组件（如 AIGC 按钮、加载动画等）
 */
export class ExternalComponentRenderer<K = string> {
  private globalContainer: HTMLElement | null = null;
  private instances = new Map<K, ExternalComponentInstance>();
  private globalConfig: GlobalContainerConfig;

  constructor(globalConfig: GlobalContainerConfig) {
    this.globalConfig = globalConfig;
  }

  /**
   * 获取或创建全局容器
   */
  getOrCreateGlobalContainer(): HTMLElement {
    if (this.globalContainer && document.body.contains(this.globalContainer)) {
      return this.globalContainer;
    }

    const container = createGlobalOverlayContainer(
      this.globalConfig.id,
      this.globalConfig.className,
      this.globalConfig.zIndex ?? 10000
    );

    document.body.appendChild(container);
    this.globalContainer = container;

    return container;
  }

  /**
   * 获取或创建实例
   */
  getOrCreateInstance(key: K, config: InstanceContainerConfig): ExternalComponentInstance {
    const existing = this.instances.get(key);
    if (existing) {
      // 确保容器在全局容器中
      const globalContainer = this.getOrCreateGlobalContainer();
      if (!globalContainer.contains(existing.container)) {
        globalContainer.appendChild(existing.container);
      }
      return existing;
    }

    // 创建新实例
    const globalContainer = this.getOrCreateGlobalContainer();
    const container = createContainer(config.className, config.styles);
    globalContainer.appendChild(container);

    const root = createRoot(container);
    const instance: ExternalComponentInstance = {
      container,
      root,
      id: String(key),
    };

    this.instances.set(key, instance);
    return instance;
  }

  /**
   * 获取实例
   */
  getInstance(key: K): ExternalComponentInstance | undefined {
    return this.instances.get(key);
  }

  /**
   * 显示实例
   */
  showInstance(key: K): void {
    const instance = this.instances.get(key);
    if (instance) {
      instance.container.style.removeProperty('display');
    }
  }

  /**
   * 隐藏实例
   */
  hideInstance(key: K): void {
    const instance = this.instances.get(key);
    if (instance) {
      instance.container.style.display = 'none';
    }
  }

  /**
   * 隐藏除指定实例外的所有实例
   */
  hideOtherInstances(activeKey: K): void {
    this.instances.forEach((instance, key) => {
      if (key !== activeKey) {
        instance.container.style.display = 'none';
      }
    });
  }

  /**
   * 更新实例样式
   */
  updateInstanceStyle(key: K, styles: CSSProperties): void {
    const instance = this.instances.get(key);
    if (instance) {
      applyStylesToElement(instance.container, styles);
    }
  }

  /**
   * 删除实例
   */
  deleteInstance(key: K): boolean {
    const instance = this.instances.get(key);
    if (!instance) {
      return false;
    }

    const performCleanup = () => {
      try {
        instance.root.unmount();
      } catch (error) {
        // Silent cleanup
      } finally {
        safeRemoveElement(instance.container);
      }
    };

    deferredCleanup(performCleanup);
    return this.instances.delete(key);
  }

  /**
   * 清理所有实例
   */
  clearInstances(): void {
    this.instances.forEach((instance) => {
      try {
        instance.root.unmount();
      } catch (error) {
        // Silent cleanup
      }
      safeRemoveElement(instance.container);
    });
    this.instances.clear();
  }

  /**
   * 清理全局容器和所有实例
   */
  cleanup(): void {
    this.clearInstances();

    if (this.globalContainer) {
      safeRemoveElement(this.globalContainer);
      this.globalContainer = null;
    }
  }

  /**
   * 获取所有实例
   */
  getAllInstances(): Map<K, ExternalComponentInstance> {
    return new Map(this.instances);
  }

  /**
   * 获取实例数量
   */
  get size(): number {
    return this.instances.size;
  }
}

/**
 * 创建外部组件渲染器
 */
export function createExternalComponentRenderer<K = string>(
  config: GlobalContainerConfig
): ExternalComponentRenderer<K> {
  return new ExternalComponentRenderer<K>(config);
}

/**
 * 生成全局容器配置
 */
export function createGlobalContainerConfig(prefix: string, zIndex: number = 10000): GlobalContainerConfig {
  return {
    id: generateUniqueId(prefix),
    className: `${prefix}-global-container`,
    zIndex,
  };
}
