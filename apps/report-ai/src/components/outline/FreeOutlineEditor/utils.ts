export const markdownToHtml = (markdown: string | undefined): string => {
  if (!markdown?.trim()) {
    return '';
  }

  // Helper function to remove common numbering patterns
  const removeNumbering = (text: string): string => {
    // Remove patterns like "1. ", "2. ", "3. " etc.
    let cleaned = text.replace(/^\d+\.\s*/, '');
    // Remove patterns like "一、", "二、", "三、" etc.
    cleaned = cleaned.replace(/^[一二三四五六七八九十]+、\s*/, '');
    // Remove patterns like "1、", "2、", "3、" etc.
    cleaned = cleaned.replace(/^\d+、\s*/, '');
    // Remove patterns like "(1)", "(2)", "(3)" etc.
    cleaned = cleaned.replace(/^\(\d+\)\s*/, '');
    // Remove patterns like "1)", "2)", "3)" etc.
    cleaned = cleaned.replace(/^\d+\)\s*/, '');
    return cleaned.trim();
  };

  const lines = markdown.split('\n');
  let titleHtml = '';
  const contentLines: string[] = [];

  // Separate title lines from content lines
  for (const line of lines) {
    if (line.startsWith('# ') && !line.startsWith('##')) {
      titleHtml += `<h1>${removeNumbering(line.substring(2).trim())}</h1>`;
    } else if (line.trim() !== '') {
      contentLines.push(line);
    }
  }

  const items: { level: number; text: string }[] = contentLines
    .map((line) => {
      const match = line.match(/^(#+)\s+(.*)/);
      if (match) {
        return { level: match[1].length - 1, text: removeNumbering(match[2].trim()) };
      }
      return null;
    })
    .filter((item): item is { level: number; text: string } => item !== null && item.level > 0);

  if (items.length === 0) {
    return titleHtml;
  }

  let listHtml = '';
  let lastLevel = 0;
  for (const item of items) {
    if (item.level > lastLevel) {
      listHtml += '<ol>'.repeat(item.level - lastLevel);
    } else if (item.level < lastLevel) {
      listHtml += '</li></ol>'.repeat(lastLevel - item.level);
      listHtml += '</li>';
    } else {
      listHtml += '</li>';
    }
    listHtml += `<li>${item.text}`;
    lastLevel = item.level;
  }

  listHtml += '</li></ol>'.repeat(lastLevel);

  if (listHtml.startsWith('</li>')) {
    listHtml = listHtml.substring(5);
  }

  return titleHtml + listHtml;
};

export const htmlToMarkdown = (html: string): string => {
  if (!html?.trim()) {
    return '';
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild as HTMLElement;

  if (!root) {
    return '';
  }

  let markdown = '';

  const h1Nodes = root.querySelectorAll('h1');
  const h1Contents = Array.from(h1Nodes)
    .map((h1) => h1.textContent?.trim())
    .filter(Boolean);
  if (h1Contents.length > 0) {
    markdown += `# ${h1Contents.join('\n# ')}\n`;
  }

  const processNode = (node: Element, level: number) => {
    let result = '';
    for (const child of Array.from(node.children)) {
      if (child.tagName.toLowerCase() === 'li') {
        const liClone = child.cloneNode(true) as HTMLLIElement;
        const nestedOl = liClone.querySelector('ol');

        if (nestedOl) {
          liClone.removeChild(nestedOl);
        }
        const text = liClone.textContent?.trim();

        if (text) {
          result += `${'#'.repeat(level + 1)} ${text}\n`;
        }

        const originalNestedOl = child.querySelector('ol');
        if (originalNestedOl) {
          result += processNode(originalNestedOl, level + 1);
        }
      }
    }
    return result;
  };

  const ol = root.querySelector('ol');
  if (ol) {
    markdown += processNode(ol, 1);
  }

  return markdown.trim();
};
