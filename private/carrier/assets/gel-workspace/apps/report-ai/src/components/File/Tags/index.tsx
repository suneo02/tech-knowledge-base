import React from 'react';
import { Tag } from 'antd';
import { FileTextO, TableO, FileO, PictureO, FileZipO } from '@wind/icons';
import styles from './index.module.less';

/**
 * 文件类型映射
 */
const FILE_TYPE_ICONS = {
  // 文档类型
  doc: <FileO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  docx: <FileO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  pdf: <FileO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  txt: <FileTextO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,

  // 表格类型
  xls: <TableO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  xlsx: <TableO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  csv: <TableO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,

  // 图片类型
  jpg: <PictureO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  jpeg: <PictureO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  png: <PictureO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  gif: <PictureO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,

  // 压缩文件
  zip: <FileZipO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  rar: <FileZipO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  '7z': <FileZipO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,

  // 默认
  default: <FileO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
};

/**
 * 标签颜色配置
 */
const TAG_COLORS = [
  'blue',
  'green',
  'orange',
  'purple',
  'cyan',
  'magenta',
  'volcano',
  'geekblue',
];

/**
 * 通用文件标签组件
 *
 * @description 显示文件关联的标签列表，支持多种文件类型图标
 * @param tags - 标签数组
 * @param maxCount - 最大显示数量，超出显示省略
 * @param className - 自定义样式类名
 */
export interface FileTagsProps {
  tags: string[];
  maxCount?: number;
  className?: string;
}

export const FileTags: React.FC<FileTagsProps> = ({ tags, maxCount = 3, className }) => {
  if (!tags || tags.length === 0) {
    return <span className={`${styles.emptyTags} ${className || ''}`}>-</span>;
  }

  const displayTags = tags.slice(0, maxCount);
  const remainingCount = tags.length - maxCount;

  return (
    <div className={`${styles.fileTags} ${className || ''}`}>
      {displayTags.map((tag, index) => {
        const icon = FILE_TYPE_ICONS[tag.toLowerCase() as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
        const color = TAG_COLORS[index % TAG_COLORS.length];

        return (
          <Tag
            key={tag}
            color={color}
            icon={icon}
            className={styles.tag}
          >
            {tag}
          </Tag>
        );
      })}

      {remainingCount > 0 && (
        <Tag className={styles.moreTag}>+{remainingCount}</Tag>
      )}
    </div>
  );
};