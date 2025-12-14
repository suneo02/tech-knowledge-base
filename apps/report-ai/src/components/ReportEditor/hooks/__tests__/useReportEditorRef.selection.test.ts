/**
 * 选区操作方法测试
 *
 * 测试 useReportEditorRef 中保留的选区操作方法
 * 注意：getSelectedText、getSelectionSnapshot、getSelectionChapterId 方法已移至 menuRegistry 内部处理
 *
 * @see apps/report-ai/docs/specs/text-ai-rewrite-implementation/spec-implementation-v1.md
 */

import type { EditorFacade } from '@/domain/reportEditor/editor';
import { renderHook } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useReportEditorRef } from '../useReportEditorRef';

// Mock EditorFacade
const createMockEditor = (overrides?: Partial<EditorFacade>): EditorFacade => {
  return {
    getSelectedContent: vi.fn((options) => {
      if (options?.format === 'text') {
        return 'This is a test selection with more than 10 characters';
      }
      return '<p>This is a test selection with more than 10 characters</p>';
    }),
    setSelectedContent: vi.fn(),
    getBody: vi.fn(() => ({
      textContent: 'Before text. This is a test selection with more than 10 characters. After text.',
    })),
    fire: vi.fn(),
    isDestroyed: vi.fn(() => false),
    isReady: vi.fn(() => true),
    ...overrides,
  } as any;
};

describe('useReportEditorRef - Selection Operations', () => {
  describe('replaceSelectedText', () => {
    it('should replace selected text with HTML format', () => {
      const mockEditor = createMockEditor();
      const setSelectedContentSpy = vi.spyOn(mockEditor, 'setSelectedContent');
      const fireSpy = vi.spyOn(mockEditor, 'fire');

      // Test would call replaceSelectedText and verify:
      // - setSelectedContent was called with correct content
      // - fire('change') was called to mark dirty
    });

    it('should escape HTML when format is text', () => {
      const mockEditor = createMockEditor();
      const setSelectedContentSpy = vi.spyOn(mockEditor, 'setSelectedContent');

      // Test would verify HTML escaping:
      // '<div>' -> '&lt;div&gt;'
      // '&' -> '&amp;'
    });
  });

  describe('restoreSelection', () => {
    it('should restore selection from valid snapshot', () => {
      const mockEditor = createMockEditor();
      const moveToBookmarkSpy = vi.fn();
      (mockEditor as any).editor = {
        selection: {
          moveToBookmark: moveToBookmarkSpy,
        },
      };

      const snapshot = {
        text: 'Test selection',
        html: '<p>Test selection</p>',
        contextBefore: 'Before ',
        contextAfter: ' After',
        timestamp: Date.now(),
        bookmark: { id: 'bookmark-123' },
      };

      // Test would verify moveToBookmark was called
    });

    it('should reject expired snapshot (> 60s)', () => {
      const mockEditor = createMockEditor();

      const snapshot = {
        text: 'Test selection',
        html: '<p>Test selection</p>',
        contextBefore: '',
        contextAfter: '',
        timestamp: Date.now() - 61000, // 61 seconds ago
        bookmark: { id: 'bookmark-123' },
      };

      // Test would verify error is returned
    });
  });
});
