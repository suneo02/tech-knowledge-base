import { CopyO } from '@wind/icons';
import { message } from '@wind/wind-ui';
import { useEffect, useRef } from 'react';
import styles from './index.module.less';

export const CopyIcon = () => {
  const selectionTextRef = useRef('');

  function onMouseUp() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const text = range.toString().trim();

      if (!range.collapsed && text.length > 0) {
        // 获取选中文本的位置
        const rect = range.getBoundingClientRect();
        const icon = document.getElementById('copy_on_select');

        if (!icon) {
          return;
        }

        let top = rect.top - 30;
        let left = rect.left + rect.width;

        const offsetParent = icon.offsetParent;

        if (offsetParent) {
          const offsetParentRect = offsetParent.getBoundingClientRect();
          top -= offsetParentRect.top;
          top += offsetParent.scrollTop;
          left += offsetParentRect.left;
          left += offsetParent.scrollLeft;
        }

        icon.style.setProperty('top', `${top}px`);
        icon.style.setProperty('left', `${left}px`);
        icon.style.setProperty('opacity', `1`);
        icon.style.setProperty('z-index', `9999`);

        selectionTextRef.current = text;
      }
    }
  }

  function onMouseDown(e: MouseEvent) {
    const icon = document.getElementById('copy_on_select');
    if (icon) {
      const target = e.target as HTMLElement;
      if (!icon.contains(target)) {
        icon.style.setProperty('opacity', `0`);
        icon.style.setProperty('zIndex', `-1`);
        selectionTextRef.current = '';
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function hide() {
    const icon = document.getElementById('copy_on_select');
    if (icon) {
      icon.style.setProperty('opacity', `0`);
      icon.style.setProperty('zIndex', `-1`);
    }
  }

  function onClick() {
    const text = selectionTextRef.current;

    if (!text) {
      message.error('复制失败');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.info('已复制选中内容');
          hide();
        })
        .catch((err) => {
          message.error('复制失败');
          console.error('复制失败:', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.style.setProperty('position', 'fixed');
      textArea.style.setProperty('top', '-100');
      textArea.style.setProperty('opacity', '0');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.info('已复制选中内容');
        hide();
      } catch (err) {
        message.error('复制失败');
        console.error('复制失败:', err);
      }
      document.body.removeChild(textArea);
    }
  }

  return (
    <div
      className={styles.root}
      id="copy_on_select"
      style={{
        zIndex: -1,
        opacity: 0,
      }}
      onClick={onClick}
      title="复制选中"
      data-uc-id="Cg0xOf7gxbx"
      data-uc-ct="div"
    >
      <CopyO
        style={{ fontSize: 18 }}
        data-uc-id="bAgrF6MXst8"
        data-uc-ct="copyo"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    </div>
  );
};
