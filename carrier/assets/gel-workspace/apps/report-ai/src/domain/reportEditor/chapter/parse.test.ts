import { describe, expect, it } from 'vitest';
import { parseChapterContent } from './parse';

describe('parseChapterContent', () => {
  it('解析包含标题和内容的基本章节', () => {
    const html = `
      <h1 data-chapter-id="1">市场概述</h1>
      <p>这是市场概述的内容</p>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('市场概述');
    expect(result.content).toContain('这是市场概述的内容');
  });

  it('解析只有标题没有内容的章节', () => {
    const html = `
      <h1 data-chapter-id="1">市场概述</h1>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('市场概述');
    expect(result.content).toBe('');
  });

  it('移除章节序号后提取标题', () => {
    const html = `
      <h1 data-chapter-id="1">
        <span data-gel-external="chapter-number">1. </span>市场概述
      </h1>
      <p>内容</p>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('市场概述');
    expect(result.title).not.toContain('1.');
  });

  it('处理空 HTML 输入', () => {
    const result = parseChapterContent('');

    expect(result.title).toBe('');
    expect(result.content).toBe('');
  });

  it('处理无效 HTML 输入', () => {
    const result = parseChapterContent('<invalid>');

    expect(result.title).toBe('');
    expect(result.content).toBe('');
  });

  it('提取标题后的所有内容直到下一个同级标题', () => {
    const html = `
      <h1 data-chapter-id="1">标题</h1>
      <p>段落1</p>
      <p>段落2</p>
      <h1 data-chapter-id="2">下一章节</h1>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('标题');
    expect(result.content).toContain('段落1');
    expect(result.content).toContain('段落2');
    expect(result.content).not.toContain('下一章节');
  });

  it('保留内容中的 HTML 结构', () => {
    const html = `
      <h2 data-chapter-id="21">主要竞争对手</h2>
      <table>
        <tbody>
          <tr><th>项目</th><th>数据</th></tr>
          <tr><td>企业名称</td><td>小米科技</td></tr>
        </tbody>
      </table>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('主要竞争对手');
    expect(result.content).toContain('<table>');
    expect(result.content).toContain('小米科技');
  });

  it('章节内容在遇到下一个标题时停止', () => {
    const html = `
      <h2 data-chapter-id="11">子章节</h2>
      <p>子章节内容</p>
      <h3>下一个标题</h3>
      <p>下一个标题的内容</p>
    `;

    const result = parseChapterContent(html);

    expect(result.title).toBe('子章节');
    expect(result.content).toContain('子章节内容');
    expect(result.content).not.toContain('下一个标题');
    expect(result.content).not.toContain('下一个标题的内容');
  });
});
