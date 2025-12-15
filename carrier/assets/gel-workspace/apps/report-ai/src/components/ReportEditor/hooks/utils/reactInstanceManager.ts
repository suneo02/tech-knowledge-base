/**
 * React 实例管理工具
 *
 * @description 管理多个 React Root 实例的创建、更新和清理
 */

import { createRoot, Root } from 'react-dom/client';

/**
 * React 实例信息
 */
export interface ReactInstance {
  /** 容器元素 */
  container: HTMLElement;
  /** React Root */
  root: Root;
}

/**
 * React 实例管理器
 *
 * @description 提供统一的 React 实例管理接口
 */
export class ReactInstanceManager<K = string> {
  private instances = new Map<K, ReactInstance>();

  /**
   * 获取或创建实例
   *
   * @param key 实例唯一标识
   * @param createContainer 创建容器的函数
   * @param parentContainer 父容器（可选）
   * @returns React 实例
   */
  getOrCreate(key: K, createContainer: () => HTMLElement, parentContainer?: HTMLElement): ReactInstance | null {
    const existing = this.instances.get(key);
    if (existing) {
      // 确保容器在父容器中
      if (parentContainer && !parentContainer.contains(existing.container)) {
        parentContainer.appendChild(existing.container);
      }
      return existing;
    }

    const container = createContainer();
    if (parentContainer) {
      parentContainer.appendChild(container);
    }

    const root = createRoot(container);
    const instance: ReactInstance = { container, root };

    this.instances.set(key, instance);
    return instance;
  }

  /**
   * 获取实例
   */
  get(key: K): ReactInstance | undefined {
    return this.instances.get(key);
  }

  /**
   * 检查实例是否存在
   */
  has(key: K): boolean {
    return this.instances.has(key);
  }

  /**
   * 删除实例
   */
  delete(key: K): boolean {
    const instance = this.instances.get(key);
    if (instance) {
      instance.root.unmount();
      instance.container.remove();
      return this.instances.delete(key);
    }
    return false;
  }

  /**
   * 清理所有实例
   */
  clear(): void {
    this.instances.forEach(({ root, container }) => {
      root.unmount();
      container.remove();
    });
    this.instances.clear();
  }

  /**
   * 获取所有实例
   */
  getAll(): Map<K, ReactInstance> {
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
 * 创建 React 实例管理器
 */
export const createReactInstanceManager = <K = string>(): ReactInstanceManager<K> => {
  return new ReactInstanceManager<K>();
};
