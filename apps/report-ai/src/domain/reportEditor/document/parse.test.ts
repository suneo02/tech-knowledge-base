import { getChapterKey } from '@/domain/chapter';
import { describe, expect, it } from 'vitest';
import { parseDocumentChapterTree } from './parse';

const BASIC_HTML = `
  <h1 data-chapter-id="1">市场概述</h1>
  <p>这是市场概述的内容</p>
`;

describe('parseDocumentChapterTree', () => {
  it('解析包含标题和内容的基本章节结构', () => {
    const result = parseDocumentChapterTree(BASIC_HTML);

    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].chapterId).toBe('1');
    expect(result.chapters[0].title).toBe('市场概述');
    expect(result.chapters[0].content).toContain('这是市场概述的内容');
    expect(result.chapters[0].isTemporary).toBe(false);
    expect(result.chapters[0].tempId).toBeUndefined();
  });

  it('解析嵌套的章节结构', () => {
    const html = `
      <h1 data-chapter-id="1">市场概述</h1>
      <h2 data-chapter-id="11">市场规模</h2>
      <p>市场规模内容</p>
      <h2 data-chapter-id="12">市场趋势</h2>
      <p>市场趋势内容</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].children).toHaveLength(2);
    expect(result.chapters[0].children?.[0].chapterId).toBe('11');
    expect(result.chapters[0].children?.[1].chapterId).toBe('12');
  });

  it('忽略报告标题节点', () => {
    const html = `
      <div data-report-title="true" data-mce-noneditable="true" aria-level="1">2024年市场分析报告</div>
      <h1 data-chapter-id="1">市场概述</h1>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].title).toBe('市场概述');
  });

  it('保留章节内容中的表格与装饰节点', () => {
    const html = `
      <h2 data-chapter-id="21">主要竞争对手</h2>
      <div class="table-wrapper">
        <div class="pre">
          <span class="pre-index">图表<span class="pre-index-text">1</span>：</span>
          <span contenteditable="false" class="pre-title">工商信息</span>
        </div>
        <table class="mce-item-table">
          <tbody>
            <tr><th>项目</th><th>数据</th></tr>
            <tr><td>企业名称</td><td>小米科技有限责任公司</td></tr>
            <tr><td>法定代表人</td><td>雷军</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(1);
    const chapter = result.chapters[0];
    expect(chapter.content).toContain('小米科技有限责任公司');
    expect(chapter.content).toContain('雷军');
    expect(chapter.content).toContain('图表');
  });

  it('在缺少章节 ID 时标记临时章节', () => {
    const html = `
      <h1 data-chapter-id="1">现有章节</h1>
      <h1>新增章节</h1>
      <p>新增章节内容</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(2);
    const newChapter = result.chapters[1];
    expect(newChapter.isTemporary).toBe(true);
    expect(newChapter.tempId).toBeDefined();
    expect(newChapter.tempId).toMatch(/^new-chapter-/);
    expect(newChapter.title).toBe('新增章节');
  });

  it('在章节内追加临时子章节时标记为临时', () => {
    const html = `
      <h1 data-chapter-id="1">现有章节</h1>
      <h2>新增子章节</h2>
      <p>新增子章节内容</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters[0].children).toBeDefined();
    const childChapter = result.chapters[0].children?.[0];
    expect(childChapter?.isTemporary).toBe(true);
    expect(childChapter?.tempId).toBeDefined();
    expect(childChapter?.title).toBe('新增子章节');
  });

  it('无效的 HTML 输入会抛出错误', () => {
    expect(() => parseDocumentChapterTree('')).toThrow(/Invalid HTML input/);
  });

  it('支持解析章节完整 HTML', () => {
    const html = `
      <h1 data-chapter-id="1">章节</h1>
      <p>正文</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters[0].fullHtml).toContain('data-chapter-id="1"');
    expect(result.chapters[0].fullHtml).toContain('<p>正文</p>');
  });

  it('支持遍历章节树构建标题内容映射', () => {
    const html = `
<div data-report-title="true" data-mce-noneditable="true" aria-level="1">2024年市场分析报告</div>
<h1 data-chapter-id="1">市场概述</h1>
<h2 data-chapter-id="11" class="loading receiving">市场规模</h2>
<p>华为技术有限公司是一家全球领先的ICT（信息与通信）基础设施和智能终端提供商</p>
<h2 data-chapter-id="12">市场趋势</h2>
<ul>
  <li><p>小米科技有限责任公司成立于2010年</p></li>
</ul>
<h1 data-chapter-id="2">竞争分析</h1>
<p>本章将深入分析主要竞争对手的情况...</p>
<h2 data-chapter-id="21">主要竞争对手</h2>
<table class="mce-item-table">
  <tbody>
    <tr><td>企业名称</td><td>小米科技有限责任公司</td></tr>
    <tr><td>法定代表人</td><td>雷军</td></tr>
  </tbody>
</table>
<h1 data-chapter-id="3">发展建议</h1>
<p>基于以上分析,我们提出以下发展建议...</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(3);

    const reduceChapters = (nodes: typeof result.chapters, map = new Map<string, string>()) => {
      nodes.forEach((node) => {
        map.set(getChapterKey(node), node.title);
        if (node.children) {
          reduceChapters(node.children, map);
        }
      });
      return map;
    };

    const titleMap = reduceChapters(result.chapters);
    expect(titleMap.get('21')).toBe('主要竞争对手');
    expect(titleMap.get('2')).toBe('竞争分析');
    expect(titleMap.get('3')).toBe('发展建议');
  });

  it('父章节的 content 不应包含子章节的内容', () => {
    const html = `
<div data-report-title="true" data-mce-noneditable="true" aria-level="1">2024年市场分析报告</div>
<h1 data-chapter-id="1">市场概述</h1>
<h2 data-chapter-id="11" class="">市场规模</h2>
<p>这是测试内容。</p>
<h2 data-chapter-id="12" class="">市场趋势</h2>
<p>这是测试内容。</p>
<h1 data-chapter-id="2">竞争分析</h1>
<p>本章将深入分析主要竞争对手的情况...</p>
<h2 data-chapter-id="21" class="">主要竞争对手</h2>
<p>这是测试内容。</p>
<h2 data-chapter-id="22" class="">竞争优势分析</h2>
<p>这是测试内容。</p>
<h1 data-chapter-id="3">发展建议</h1>
<p>基于以上分析，我们提出以下发展建议...</p>
<h2 data-chapter-id="31" class="">短期策略</h2>
<p>这是测试内容。</p>
<h2 data-chapter-id="32" class="">长期规划</h2>
<p>这是测试内容。</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(3);

    // 验证第一个章节
    const chapter1 = result.chapters[0];
    expect(chapter1.chapterId).toBe('1');
    expect(chapter1.title).toBe('市场概述');
    // 父章节的 content 应该为空（没有子标题之前的内容）
    expect(chapter1.content).toBe('');
    expect(chapter1.children).toHaveLength(2);
    expect(chapter1.children?.[0].chapterId).toBe('11');
    expect(chapter1.children?.[0].content).toContain('这是测试内容');
    expect(chapter1.children?.[1].chapterId).toBe('12');

    // 验证第二个章节（有前置内容）
    const chapter2 = result.chapters[1];
    expect(chapter2.chapterId).toBe('2');
    expect(chapter2.title).toBe('竞争分析');
    // 父章节的 content 应该只包含到第一个子标题之前的内容
    expect(chapter2.content).toContain('本章将深入分析主要竞争对手的情况');
    expect(chapter2.content).not.toContain('这是测试内容');
    expect(chapter2.content).not.toMatch(/data-chapter-id="2[12]"/);
    expect(chapter2.content).not.toContain('<h2');
    expect(chapter2.children).toHaveLength(2);

    // 验证第三个章节
    const chapter3 = result.chapters[2];
    expect(chapter3.chapterId).toBe('3');
    expect(chapter3.title).toBe('发展建议');
    expect(chapter3.content).toContain('基于以上分析');
    expect(chapter3.content).not.toContain('短期策略');
    expect(chapter3.content).not.toContain('<h2');
    expect(chapter3.children).toHaveLength(2);
  });

  it('父章节 content 在没有子章节时包含完整内容', () => {
    const html = `
<h1 data-chapter-id="1">市场概述</h1>
<p>这是第一段内容。</p>
<p>这是第二段内容。</p>
<h1 data-chapter-id="2">竞争分析</h1>
<p>竞争分析内容。</p>
    `;

    const result = parseDocumentChapterTree(html);

    expect(result.chapters).toHaveLength(2);

    const chapter1 = result.chapters[0];
    expect(chapter1.chapterId).toBe('1');
    expect(chapter1.content).toContain('这是第一段内容');
    expect(chapter1.content).toContain('这是第二段内容');
    expect(chapter1.children).toBeUndefined();

    const chapter2 = result.chapters[1];
    expect(chapter2.chapterId).toBe('2');
    expect(chapter2.content).toContain('竞争分析内容');
    expect(chapter2.children).toBeUndefined();
  });
});
