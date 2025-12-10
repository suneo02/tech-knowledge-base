import { Editor } from '@tinymce/tinymce-react';
import { useDebounceFn } from 'ahooks';
import classNames from 'classnames';
import { GELService, generatePrefixUrl } from 'gel-util/link';
import path from 'path-browserify';
import { FC, useEffect, useMemo, useRef } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { getTinymceInitConfig } from './config';
import styles from './index.module.less';
import { htmlToMarkdown, markdownToHtml } from './utils';
import { isDev } from '@/utils';

export interface FreeOutlineEditorProps {
  /**
   * 初始值
   */
  initialValue?: string;
  /**
   * 不推荐用这个值来控制，因为每次编辑都会触发 做数据转换，会导致状态不一致
   * 当前值
   */
  value?: string;
  onChange: (value: string) => void;
  debounce?: number;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FreeOutlineEditor: FC<FreeOutlineEditorProps> = ({
  initialValue,
  value,
  onChange,
  debounce = 300,
  readOnly = false,
  className,
  style,
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const { run: debouncedOnChange } = useDebounceFn(onChange, { wait: debounce });

  const valueMD = useMemo(() => {
    if (!value) {
      return '';
    }
    return markdownToHtml(value);
  }, [value]);

  useEffect(() => {
    if (!valueMD) {
      return;
    }

    const editor = editorRef.current;
    if (editor) {
      editor.setContent(valueMD);
    }
  }, [valueMD]);

  return (
    <div className={classNames(styles['free-outline-editor'], className)} style={style}>
      <Editor
        tinymceScriptSrc={path.join(
          '/',
          generatePrefixUrl({
            service: GELService.ReportAI,
            isDev,
          }),
          'tinymce/tinymce.min.js'
        )}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          editor.setContent(markdownToHtml(initialValue));
        }}
        initialValue={markdownToHtml(initialValue)}
        disabled={readOnly}
        onEditorChange={(content) => {
          const markdown = htmlToMarkdown(content);
          debouncedOnChange(markdown);
        }}
        init={getTinymceInitConfig()}
      />
    </div>
  );
};
