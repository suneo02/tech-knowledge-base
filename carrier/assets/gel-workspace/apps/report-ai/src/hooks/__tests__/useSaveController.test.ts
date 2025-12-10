import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useSaveController } from '../useSaveController';

describe('useSaveController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles manual save success and clears unsaved state', async () => {
    const executor = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useSaveController());

    await act(async () => {
      await result.current.requestManualSave(executor);
    });

    expect(executor).toHaveBeenCalledTimes(1);
    expect(result.current.saving).toBe(false);
    expect(result.current.hasUnsaved).toBe(false);
    expect(result.current.lastSavedAt).toBeDefined();
    expect(result.current.lastError).toBeNull();
  });

  it('debounces auto save and collapses multiple triggers', async () => {
    vi.useFakeTimers();
    const executor = vi.fn().mockResolvedValue('auto');
    const { result } = renderHook(() =>
      useSaveController({
        autoSave: {
          debounceMs: 20,
          minIntervalMs: 0,
        },
      })
    );

    let p1: Promise<string>;
    let p2: Promise<string>;

    await act(async () => {
      p1 = result.current.requestAutoSave(executor);
      p2 = result.current.requestAutoSave(executor);
    });

    expect(executor).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(20);
    });

    await expect(p1!).resolves.toBe('auto');
    await expect(p2!).resolves.toBe('auto');

    expect(executor).toHaveBeenCalledTimes(1);
    expect(result.current.hasUnsaved).toBe(false);
  });

  it('queues manual saves while another save is in progress', async () => {
    let resolveFirst: () => void = () => {};
    const firstExecutor = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveFirst = resolve;
        })
    );
    const secondExecutor = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useSaveController());

    await act(async () => {
      result.current.requestManualSave(firstExecutor);
    });

    expect(firstExecutor).toHaveBeenCalledTimes(1);
    expect(result.current.saving).toBe(true);

    let secondPromise: Promise<void> | undefined;
    await act(async () => {
      secondPromise = result.current.requestManualSave(secondExecutor);
    });

    expect(secondExecutor).not.toHaveBeenCalled();

    await act(async () => {
      resolveFirst();
    });

    await act(async () => {
      await secondPromise;
    });

    expect(secondExecutor).toHaveBeenCalledTimes(1);
    expect(result.current.saving).toBe(false);
    expect(result.current.hasUnsaved).toBe(false);
  });

  it('invokes onError callback and keeps unsaved flag on failure', async () => {
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useSaveController({
        onError,
      })
    );

    await act(async () => {
      await expect(result.current.requestManualSave(() => Promise.reject(new Error('boom')))).rejects.toThrow('boom');
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(onError).toHaveBeenCalledWith('boom', 'manual');
    expect(result.current.hasUnsaved).toBe(true);
    expect(result.current.lastError).toBe('boom');
  });
});
/* @vitest-environment jsdom */
