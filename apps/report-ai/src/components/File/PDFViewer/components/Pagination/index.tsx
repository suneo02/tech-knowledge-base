import { LeftO, RightO } from '@wind/icons';
import { Button, Input, message } from '@wind/wind-ui';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.less';

/**
 * PDF 分页组件属性
 */
interface PDFPaginationProps {
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPage: number;
  /** 上一页回调 */
  onPrevious?(): void;
  /** 下一页回调 */
  onNext?(): void;
  /** 跳转到指定页回调 */
  onJumpPage?(p: number): void;
}

/**
 * 验证页码输入是否合法
 * @param value - 输入值
 * @param totalPage - 总页数
 * @returns 是否合法
 */
const validatePageInput = (value: string, totalPage: number): boolean => {
  if (!value) return true;
  if (!/^[0-9]+$/.test(value)) return false;

  const pageNum = Number(value);
  return pageNum >= 1 && pageNum <= totalPage;
};

/**
 * PDF 分页组件
 * 提供上一页、下一页按钮和页码输入框，支持直接输入页码跳转
 *
 * @example
 * ```tsx
 * <PDFPagination
 *   currentPage={1}
 *   totalPage={10}
 *   onPrevious={handlePrevious}
 *   onNext={handleNext}
 *   onJumpPage={handleJumpPage}
 * />
 * ```
 */
export const PDFPagination: React.FC<PDFPaginationProps> = ({
  currentPage,
  totalPage,
  onPrevious,
  onNext,
  onJumpPage,
}) => {
  // 页码输入框的值
  const [page, setPage] = useState<string>(String(currentPage));

  // 同步外部 currentPage 变化
  useEffect(() => {
    setPage(String(currentPage));
  }, [currentPage]);

  /**
   * 页码输入框变化处理
   * 验证输入的页码是否合法
   * @param e - 输入事件
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value.trim();

    if (!v) {
      setPage(v);
      return;
    }

    if (!validatePageInput(v, totalPage)) {
      if (!/^[0-9]+$/.test(v)) return;
      message.warning(`请输入 1-${totalPage} 的数字`);
      return;
    }

    setPage(v);
  };

  /**
   * 处理回车键跳转
   */
  const handlePressEnter = () => {
    if (!page) {
      message.warning(`请输入 1-${totalPage} 的数字`);
      return;
    }
    onJumpPage?.(Number(page));
  };

  return (
    <div className={styles.pagination}>
      <Button type="text" onClick={onPrevious} data-uc-id="xbrTfUR1qQ" data-uc-ct="button">
        <LeftO
          data-uc-id="wUawfWf31O"
          data-uc-ct="lefto"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Button>
      <Input
        size="small"
        value={page}
        onChange={onInputChange}
        onPressEnter={handlePressEnter}
        style={{ width: 44 }}
        data-uc-id="OXgVxOX2Rw"
        data-uc-ct="input"
      />
      <span className={styles.pagination__divider}>/</span>
      <span className={styles.pagination__total}>{totalPage}</span>
      <Button type="text" onClick={onNext} data-uc-id="8v5VAX-zih" data-uc-ct="button">
        <RightO
          data-uc-id="2I9ymsVUUz"
          data-uc-ct="righto"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Button>
    </div>
  );
};
