import { RPReferenceType } from '@/domain/chat/ref';
import { EditorFacade } from '@/domain/reportEditor';
import { RP_DATA_ATTRIBUTES, RP_SELECTORS } from '@/domain/reportEditor/foundation';
import type { AIActionData } from '@/types/editor';
import { IProps } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import { getEditorContentCss } from './contentCss';
import {
  QUICK_TOOLBAR_BUTTONS,
  registerAIMenus,
  registerQuickToolbar,
  registerQuickToolbarRuntime,
  registerShortcuts,
} from './menu';

/**
 * TinyMCE 编辑器配置
 *
 * 提供编辑器的静态配置和运行时行为绑定。
 *
 * @see ../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档
 * @see ./contextMenuConfig.md Context Menu 配置说明（已废弃，改用 Quick Toolbar）
 * @see ./menubarConfig.md Menubar 配置说明
 * @see ../../../../docs/rule/code-typescript-style-rule.md TypeScript 规范
 *
 * 编辑器入口配置：
 * - Quick Toolbar：选中文本自动浮现，承载 AI 能力和编辑工具
 * - Context Menu：保留右键菜单基础功能（复制/粘贴/链接）
 * - Menubar：隐藏默认菜单栏，简化界面
 * - Toolbar：禁用顶部工具栏，所有编辑功能通过 Quick Toolbar 提供
 */

export interface StaticEditorConfigOptions {
  docId?: string;
  placeholder?: string;
}

export interface EditorRuntimeOptions {
  onAIAction: (data: AIActionData) => void;
  onContentChange?: (fullHtml: string) => void;
  onReferenceClick?: (referenceInfo: { refId: string; refType: RPReferenceType; pageNumber?: number }) => void;
}

export const createStaticEditorInit = (options: StaticEditorConfigOptions): IProps['init'] => {
  const { docId, placeholder } = options;

  return {
    height: '100%', // 占满视口高度,减去顶部和底部空间
    resize: false, // 禁用用户调整大小
    menubar: false, // 隐藏默认菜单栏
    statusbar: false, // 隐藏状态栏
    branding: false,
    promotion: false,
    placeholder,

    // 禁用顶部工具栏，改为使用 Quick Toolbar 承载所有编辑指令
    toolbar: false,

    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount',
      'save',
      'autosave',
      'fontsize',
      'copy',
      'paste',
      'quickbars', // Quick Toolbar 插件
    ],

    // Quick Toolbar 配置：选中文本时自动显示
    quickbars_selection_toolbar: QUICK_TOOLBAR_BUTTONS,
    quickbars_insert_toolbar: false, // 禁用插入工具栏

    // 保留基础右键菜单（复制/粘贴/链接）
    contextmenu: 'copy paste | link',

    setup: (editor) => {
      // 去除编辑器边框和外边距
      editor.on('init', () => {
        const container = editor.getContainer();
        if (container) {
          container.style.border = 'none';
          container.style.borderRadius = '0';
          container.style.boxShadow = 'none';
        }
      });

      // 监听内容设置完成事件
      editor.on('SetContent', () => {
        // 触发自定义事件，通知外部内容已设置完成
        editor.fire('ContentSet');
      });

      registerQuickToolbar();
    },

    // 内容样式文件 - 只包含我们的自定义样式
    content_css: getEditorContentCss(),

    // 内容样式补充（主要用于AI功能相关的样式）
    content_style: `
      .ai-suggestion {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 8px 12px;
        margin: 8px 0;
        border-radius: 4px;
      }
    `,

    // 表格配置 - 禁用调整功能
    table_resize_bars: false, // 禁用表格边框调整条
    table_column_resizing: false, // 禁用列宽调整
    table_row_resizing: false, // 禁用行高调整
    object_resizing: false, // 禁用对象(包括表格)的整体缩放
    table_sizing_mode: 'fixed', // 设置表格大小调整模式为固定

    // 自动保存配置
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: `report_autosave_${docId || 'default'}`,
    autosave_restore_when_empty: false,

    // 图片上传配置
    images_upload_url: '/api/upload-image',
    images_upload_handler: (blobInfo) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              resolve(result.url);
            } else {
              reject('图片上传失败: ' + result.message);
            }
          })
          .catch((error) => {
            reject('图片上传失败: ' + error.message);
          });
      });
    },

    // 内容过滤
    // 注意：span 需要允许 data-* 属性以支持溯源标记
    valid_elements:
      'p,br,strong,em,u,h1,h2,h3,h4,h5,h6,ul,ol,li,a[href|title],img[src|alt|title|width|height],table,tr,td,th,blockquote,code,pre,span[style|class|data-*|contenteditable],div[style|class|data-*]',

    // 样式配置
    style_formats: [
      { title: '标题 1', format: 'h1' },
      { title: '标题 2', format: 'h2' },
      { title: '标题 3', format: 'h3' },
      { title: '正文', format: 'p' },
      { title: '引用', format: 'blockquote' },
      { title: '代码', format: 'code' },
    ],
  };
};

/**
 * 运行期行为绑定：菜单/快捷键与内容变更监听
 * 仅在 onInit 时调用一次。传入的回调应为"稳定包装函数"，内部使用 ref 读取最新逻辑。
 *
 * @param editor - 原始 TinyMCE Editor 实例（仅用于菜单注册）
 * @param facade - EditorFacade 实例（用于所有编辑器操作）
 * @param options - 运行时回调配置
 */
export const bindEditorRuntime = (
  facade: EditorFacade,
  { onAIAction, onContentChange, onReferenceClick }: EditorRuntimeOptions
) => {
  try {
    // 注册 AI 菜单和快捷键
    registerAIMenus({ onAIAction, facade });
    registerShortcuts({ onAIAction, facade });

    // 注册 Quick Toolbar 按钮
    registerQuickToolbarRuntime(facade);

    // 内容变更监听使用 facade
    if (onContentChange) {
      const handleContentChange = () => {
        const fullHtml = facade.getContent({ format: 'raw' });
        onContentChange(fullHtml);
      };
      facade.on('input', handleContentChange);
      facade.on('change', handleContentChange);
      facade.on('keyup', handleContentChange);
      facade.on('paste', handleContentChange);
    }

    // 绑定引用标记点击事件 - 使用 facade
    if (onReferenceClick) {
      const handleClick = (e: unknown) => {
        const event = e as MouseEvent;
        const target = event.target as HTMLElement;
        if (target.matches(RP_SELECTORS.SOURCE_MARKERS)) {
          event.preventDefault();
          event.stopPropagation();

          const refId = target.getAttribute(RP_DATA_ATTRIBUTES.REF_ID);
          const refType = target.getAttribute(RP_DATA_ATTRIBUTES.REF_TYPE) as RPReferenceType;
          const pageNumberStr = target.getAttribute(RP_DATA_ATTRIBUTES.PAGE_NUMBER);

          // 解析页码（仅用于 file 类型）
          const pageNumber = pageNumberStr ? parseInt(pageNumberStr, 10) : undefined;

          if (refId && refType) {
            onReferenceClick({ refId, refType, pageNumber });
          }
        }
      };

      const handleContextMenu = (e: unknown) => {
        const event = e as MouseEvent;
        const target = event.target as HTMLElement;
        if (target.matches(RP_SELECTORS.SOURCE_MARKERS)) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      facade.on('click', handleClick);
      facade.on('contextmenu', handleContextMenu);
    }
  } catch (e) {
    // 静默防御，避免影响编辑器初始化
    // eslint-disable-next-line no-console
    console.warn('[bindEditorRuntime] failed to bind runtime behaviors', e);
  }
};

