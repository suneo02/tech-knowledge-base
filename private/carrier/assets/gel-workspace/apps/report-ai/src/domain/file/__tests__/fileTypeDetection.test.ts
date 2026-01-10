import { describe, expect, it } from 'vitest';
import { detectFileType, getFileTypeColor, getFileTypeFromMimeType, getFileTypeFromName } from '../fileTypeDetection';

describe('File Type Detection', () => {
  describe('getFileTypeFromName', () => {
    it('应该正确识别 Word 文件', () => {
      expect(getFileTypeFromName('document.doc')).toBe('word');
      expect(getFileTypeFromName('document.docx')).toBe('word');
      expect(getFileTypeFromName('DOCUMENT.DOC')).toBe('word');
      expect(getFileTypeFromName('DOCUMENT.DOCX')).toBe('word');
    });

    it('应该正确识别 Excel 文件', () => {
      expect(getFileTypeFromName('spreadsheet.xls')).toBe('excel');
      expect(getFileTypeFromName('spreadsheet.xlsx')).toBe('excel');
      expect(getFileTypeFromName('SPREADSHEET.XLS')).toBe('excel');
      expect(getFileTypeFromName('SPREADSHEET.XLSX')).toBe('excel');
    });

    it('应该正确识别 PDF 文件', () => {
      expect(getFileTypeFromName('document.pdf')).toBe('pdf');
      expect(getFileTypeFromName('DOCUMENT.PDF')).toBe('pdf');
    });

    it('应该将未知类型识别为 other', () => {
      expect(getFileTypeFromName('file.txt')).toBe('other');
      expect(getFileTypeFromName('file.jpg')).toBe('other');
      expect(getFileTypeFromName('file.png')).toBe('other');
      expect(getFileTypeFromName('file.unknown')).toBe('other');
      expect(getFileTypeFromName('file')).toBe('other');
      expect(getFileTypeFromName('')).toBe('other');
      expect(getFileTypeFromName(undefined)).toBe('other');
    });
  });

  describe('getFileTypeFromMimeType', () => {
    it('应该正确识别 Word MIME 类型', () => {
      expect(getFileTypeFromMimeType('application/msword')).toBe('word');
      expect(getFileTypeFromMimeType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe(
        'word'
      );
      expect(getFileTypeFromMimeType('APPLICATION/MSWORD')).toBe('word');
    });

    it('应该正确识别 Excel MIME 类型', () => {
      expect(getFileTypeFromMimeType('application/vnd.ms-excel')).toBe('excel');
      expect(getFileTypeFromMimeType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBe(
        'excel'
      );
      expect(getFileTypeFromMimeType('APPLICATION/VND.MS-EXCEL')).toBe('excel');
    });

    it('应该正确识别 PDF MIME 类型', () => {
      expect(getFileTypeFromMimeType('application/pdf')).toBe('pdf');
      expect(getFileTypeFromMimeType('APPLICATION/PDF')).toBe('pdf');
    });

    it('应该将未知 MIME 类型识别为 other', () => {
      expect(getFileTypeFromMimeType('text/plain')).toBe('other');
      expect(getFileTypeFromMimeType('image/jpeg')).toBe('other');
      expect(getFileTypeFromMimeType('application/unknown')).toBe('other');
      expect(getFileTypeFromMimeType('')).toBe('other');
      expect(getFileTypeFromMimeType(undefined)).toBe('other');
    });
  });

  describe('detectFileType', () => {
    it('应该优先使用已知的简化类型', () => {
      expect(detectFileType('word', 'test.pdf')).toBe('word');
      expect(detectFileType('excel', 'test.doc')).toBe('excel');
      expect(detectFileType('pdf', 'test.xlsx')).toBe('pdf');
      expect(detectFileType('other', 'test.docx')).toBe('other');
    });

    it('应该正确解析 MIME 类型', () => {
      expect(detectFileType('application/pdf', 'test.doc')).toBe('pdf');
      expect(detectFileType('application/msword', 'test.pdf')).toBe('word');
      expect(detectFileType('application/vnd.ms-excel', 'test.pdf')).toBe('excel');
    });

    it('应该回退到文件名解析', () => {
      expect(detectFileType('unknown/type', 'test.pdf')).toBe('pdf');
      expect(detectFileType('text/plain', 'test.docx')).toBe('word');
      expect(detectFileType(undefined, 'test.xlsx')).toBe('excel');
      expect(detectFileType('', 'test.doc')).toBe('word');
    });

    it('应该处理复杂的场景', () => {
      // MIME 类型优先于文件名
      expect(detectFileType('application/pdf', 'test.docx')).toBe('pdf');

      // 无效的 MIME 类型回退到文件名
      expect(detectFileType('invalid/mime', 'test.pdf')).toBe('pdf');

      // 都无效时返回 other
      expect(detectFileType('invalid/mime', 'test.unknown')).toBe('other');

      // 空值处理
      expect(detectFileType(undefined, undefined)).toBe('other');
    });
  });

  describe('getFileTypeColor', () => {
    it('应该返回正确的 Word 文件颜色', () => {
      expect(getFileTypeColor('word')).toBe('#2277a2');
    });

    it('应该返回正确的 Excel 文件颜色', () => {
      expect(getFileTypeColor('excel')).toBe('#63a074');
    });

    it('应该返回正确的 PDF 文件颜色', () => {
      expect(getFileTypeColor('pdf')).toBe('#e05d5d');
    });

    it('应该返回正确的其他文件颜色', () => {
      expect(getFileTypeColor('other')).toBe('#9da9b4');
    });
  });

  describe('集成测试', () => {
    it('应该为不同文件名返回正确的颜色', () => {
      // Word 文件
      const wordType = detectFileType(undefined, 'report.docx');
      expect(getFileTypeColor(wordType)).toBe('#2277a2');

      // Excel 文件
      const excelType = detectFileType(undefined, 'data.xlsx');
      expect(getFileTypeColor(excelType)).toBe('#63a074');

      // PDF 文件
      const pdfType = detectFileType(undefined, 'manual.pdf');
      expect(getFileTypeColor(pdfType)).toBe('#e05d5d');

      // 其他文件
      const otherType = detectFileType(undefined, 'config.txt');
      expect(getFileTypeColor(otherType)).toBe('#9da9b4');
    });

    it('应该为 MIME 类型返回正确的颜色', () => {
      // PDF MIME 类型
      const pdfType = detectFileType('application/pdf', 'unknown.txt');
      expect(getFileTypeColor(pdfType)).toBe('#e05d5d');

      // Word MIME 类型
      const wordType = detectFileType('application/msword', 'unknown.txt');
      expect(getFileTypeColor(wordType)).toBe('#2277a2');

      // Excel MIME 类型
      const excelType = detectFileType('application/vnd.ms-excel', 'unknown.txt');
      expect(getFileTypeColor(excelType)).toBe('#63a074');
    });
  });
});
