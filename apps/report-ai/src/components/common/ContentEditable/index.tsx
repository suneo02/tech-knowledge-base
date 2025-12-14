/**
 * 可编辑内容组件
 *
 * 使用 rc-textarea (Ant Design 官方使用的组件) 实现纯文本编辑，
 * 替代复杂的 contentEditable 方案
 */

import classNames from 'classnames';
import type { TextAreaRef } from 'rc-textarea';
import RcTextarea from 'rc-textarea';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.less';
import { ContentEditableProps } from './type';

/**
 * 可编辑内容组件
 */
export const ContentEditable = forwardRef<TextAreaRef, ContentEditableProps>(
  (
    {
      content,
      placeholder = '请输入内容...',
      autoFocus = false,
      readonly = false,
      autoSize = { minRows: 1, maxRows: 10 },
      onContentChange,
      onFocus,
      onBlur,
      onKeyDown,
      className,
    },
    ref
  ) => {
    const innerRef = useRef<TextAreaRef>(null);
    const textareaRef = ref || innerRef;

    /**
     * 处理内容变更
     */
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        onContentChange(newContent);
      },
      [onContentChange]
    );

    /**
     * 处理键盘事件
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(event as any); // 类型转换，保持接口兼容
      },
      [onKeyDown]
    );

    /**
     * 自动聚焦处理
     */
    useEffect(() => {
      if (autoFocus && textareaRef && 'current' in textareaRef && textareaRef.current) {
        textareaRef.current.focus();
        // 将光标移动到内容末尾
        const textarea = textareaRef.current.resizableTextArea?.textArea;
        if (textarea) {
          const length = textarea.value.length;
          textarea.setSelectionRange(length, length);
        }
      }
    }, [autoFocus, textareaRef]);

    const textareaClasses = classNames(styles['content-editable'], className);

    return (
      <RcTextarea
        ref={textareaRef}
        className={textareaClasses}
        value={content}
        placeholder={placeholder}
        readOnly={readonly}
        autoFocus={autoFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        // 自适应高度配置 - 这是关键配置
        autoSize={autoSize}
        // 禁用富文本相关功能
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        // 样式控制 - 移除所有可能干扰自动高度的样式
        style={undefined}
        // 可访问性
        role="textbox"
        aria-label={placeholder}
        aria-multiline="true"
        // 确保显示模式正确
        showCount={false}
      />
    );
  }
);

ContentEditable.displayName = 'ContentEditable';
