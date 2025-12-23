export const getTinymceInitConfig = () => ({
  height: '100%',
  menubar: false,
  toolbar: false,
  plugins: ['lists', 'autoresize'],
  content_css: 'default',
  content_style: `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      margin: 8px;
    }
    ol { 
      padding-inline-start: 2em;
      list-style-type: none; /* Hide default browser numbering */
      counter-reset: item;
    }
    li {
      display: block;
    }
    li::before {
      content: counters(item, '.') '. ';
      counter-increment: item;
      margin-right: 0.5em;
    }
  `,
  autoresize_bottom_margin: 0,
  formats: {
    alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'left' },
    aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'center' },
    alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'right' },
    alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'full' },
    bold: { inline: 'strong' },
    italic: { inline: 'em' },
    underline: { inline: 'u' },
    strikethrough: { inline: 'del' },
  },
  paste_preprocess: (_plugin: any, args: { content: string }) => {
    // Converts pasted text (potentially markdown) into a simple, single-level list
    const plainText = args.content.replace(/<[^>]*>/g, ' '); // Basic HTML stripping
    const lines = plainText.split(/\r?\n/).filter((line) => line.trim() !== '');
    const listItems = lines.map((line) => `<li>${line.replace(/^#+\s*/, '')}</li>`);
    args.content = `<ol>${listItems.join('')}</ol>`;
  },
});
